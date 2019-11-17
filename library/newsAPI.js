const { getModel: collection } = require("../database");
const NewsAPI = require('newsapi');
const axios = require("axios");

const newsAPI = new NewsAPI(process.env.NEWSAPITOKEN);

const { COLLECTIONS, SOURCES,
    HACKERNEWS_TOP_URL, HACKERNEWS_STORY_URL, GNEWS_TOP_URL } = require("../constants");


/**
 * @description Fetches, filters and inserts news articles in 'prereview' collection.
 */
function getNews() {

    function requestHackerNews() {
        return axios.get(HACKERNEWS_TOP_URL)
            .then(response => response.data)
            .catch(err => {
                console.log(err);
            });
    }

    function requestNewsAPI() {
        return newsAPI.v2
            .topHeadlines({
                sources: SOURCES.join(","),
                language: 'en',
                pageSize: 40
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    function requestGNews() {
        return axios.get(GNEWS_TOP_URL)
            .then(response => response.data)
            .catch(err => {
                console.log(err)
            });
    }

    function insertNews(previewArr) {
        // Insert data into the collection.
        return collection(COLLECTIONS.PRE_REVIEW)
            .insertMany(previewArr)
            .then(() => {
                console.log(previewArr.length + " articles inserted into the preReview collection");
            }).catch(err => {
                console.log(err);
            });
    }

    // Get the published-date of the newest article from the database
    return collection(COLLECTIONS.PRE_REVIEW)
        .findOne({})
        .sort("-publishedDate")
        .then(response => {

            const maxDate = response.publishedDate;
            console.log("Articles published after " + new Date(maxDate) + " are going to be inserted.")

            // Get the response from NewsAPI and insert the response into preReview collection.
            const prmNewsAPI = requestNewsAPI()
                .then(response => {

                    // console.log(response);
                    const previewArrNewsAPI = [];

                    for (let j = 0; j < 40; j++) {
                        // Accept responses only where the author is not null to minimise repeated articles.
                        if (Object.keys(response.articles[j]).length > 1
                            && new Date(response.articles[j].publishedAt) > new Date(maxDate)
                            && response.articles[j].author != undefined) {
                            previewArrNewsAPI.push({
                                title: response.articles[j].title,
                                author: response.articles[j].author,
                                origin: response.articles[j].source.name,
                                url: response.articles[j].url,
                                urlToImage: response.articles[j].urlToImage,
                                publishedDate: response.articles[j].publishedAt,
                                content: response.articles[j].content
                                // urlToImage: a.image,
                                // content: a.content
                            });
                        }
                    }

                    return insertNews(previewArrNewsAPI);
                })
                .catch(err => {
                    console.log(err);
                })

            // Get the response from HackerNews and insert the response into preReview collection.
            const prmHackerNews = requestHackerNews()
                .then(response => {
                    return Bluebird.map(response.data, id => {
                        const url = `${HACKERNEWS_STORY_URL}${id}.json`;
                        return axios.get(url).then(response => response.data);
                    })
                })
                .then(response => {
                    const preReviewHackerNews = [];
                    for (let j = 0; j < 30; j++) {
                        // Accept responses only where the author is not null to minimise repeated articles.
                        // console.log(new Date(response[j].time * 1000), new Date(maxDate));
                        if (new Date(response[j].time * 1000) > new Date(maxDate)
                            && response[j].by != undefined) {
                            preReviewHackerNews.push({
                                title: response[j].title,
                                author: response[j].by,
                                origin: 'Hacker News',
                                url: response[j].url,
                                publishedDate: new Date(response[j].time * 1000)
                            });
                        }
                    }
                    return insertNews(preReviewHackerNews);
                })
                .catch(err => {
                    console.log(err);
                });

            // Get data fron GNewsAPI and insert the response into preReview collection.
            const prmGNews = requestGNews()
                .then((response) => {
                    const preReviewGNews = [];
                    for (let j = 0; j < 10; j++) {
                        // Accept responses only where the author is not null to minimise repeated articles.
                        // console.log(new Date(response[j].time * 1000), new Date(maxDate));
                        console.log(response.articles[j].source);
                        if (new Date(response.articles[j].publishedAt) > new Date(maxDate)) {
                            preReviewGNews.push({
                                title: response.articles[j].title,
                                author: 'Not Specified',
                                publishedDate: response.articles[j].publishedAt,
                                origin: response.articles[j].source.name,
                                url: response.articles[j].url,
                                urlToImage: response.articles[j].image,
                                content: response.articles[j].content
                            });
                        }
                    }
                    return insertNews(preReviewGNews);
                })
                .catch(err => {
                    console.log(err);
                });

            return Promise.all([prmNewsAPI, prmHackerNews, prmGNews])
        }).catch(err => {
            console.log(err);
        });
}
exports.getNews = getNews;