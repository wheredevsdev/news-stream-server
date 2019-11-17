var newsModel = require('../database/models/PreviewReview');
const { getModel: collection } = require("../database");
const mongoose = require('mongoose');
const nModel = mongoose.model('PreReview');
const NewsAPI = require('newsapi');
const newsAPI = new NewsAPI(process.env.NEWSAPITOKEN);
const fetch = require("node-fetch");


const { COLLECTIONS, SOURCES, MAX_ARTICLES_TO_DUMP,
         HackerNews_Top_Url, HackerNews_Story_Url, GNEWS_TOP_Url } = require("../constants");


/**
 * @description Fetches, filters and inserts news articles in 'prereview' collection.
 */
function getNews() {

    function requestHackerNews(){
        return fetch(HackerNews_Top_Url)
                .catch(err => {
                    console.log(err);
                });
    }

    function requestNewsAPI() {
        return newsAPI.v2.topHeadlines({
            sources: SOURCES.join(","),
            language: 'en',
            pageSize: 40
        })
        .catch(function (err) {
            console.log(err);
        })
    }

    function requestGNews(){
                
        return fetch(GNEWS_TOP_Url)
            .catch(err => {
                console.log(err)
            });

    }

    function insertNews(previewArr) {
        // Insert data into the collection.
        return collection(COLLECTIONS.PRE_REVIEW)
            .insertMany(previewArr)
            .then(function () {
                console.log(previewArr.length + " articles inserted into the preReview collection");
            }).catch(err => {
                console.log(err);
            });
    }

    //Get the published-date of the newest article from the database
    return nModel
        .findOne({})
        .sort("-publishedDate")
        .then(response => {

            console.log(response);
            const maxDate = response.publishedDate;
            console.log("Articles published after " + new Date(maxDate) + " are going to be inserted.")

            let articlesCount = 0;

            //Get the response from NewsAPI and insert the response into preReview collection.
            requestNewsAPI()
            .then(response => {

                //console.log(response);
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
                            urlToImage:response.articles[j].urlToImage,
                            publishedDate: response.articles[j].publishedAt,
                            content: response.articles[j].content
                            // urlToImage: a.image,
                            // content: a.content
                        });
                    }
                }

                articlesCount += previewArrNewsAPI.length;
                insertNews(previewArrNewsAPI);
            })
            .catch(err => {
                console.log(err);
            })

            //Get the response from HackerNews and insert the response into preReview collection.

            const preReviewHackerNews = [];
            requestHackerNews()
            .then(res => res.json())
            .then(data => data.map(id => {
                const url = `${HackerNews_Story_Url}${id}.json`;
                return fetch(url).then(res => res.json());
            }))
            .then(data => Promise.all(data))
            .then(response => {
                for (let j = 0; j < 30; j++) {
                    // Accept responses only where the author is not null to minimise repeated articles.
                    //console.log(new Date(response[j].time * 1000), new Date(maxDate));
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

                articlesCount += preReviewHackerNews.length;
                console.log(preReviewHackerNews.length);
                insertNews(preReviewHackerNews);
            })
            .catch(err => {
                console.log(err);
            });

            //Get data fron GNewsAPI and insert the response into preReview collection.
            const preReviewGNews = [];
            requestGNews()
            .then(res => res.json())
            .then(response => {
                for (let j = 0; j < 10; j++) {
                    // Accept responses only where the author is not null to minimise repeated articles.
                    //console.log(new Date(response[j].time * 1000), new Date(maxDate));
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

                articlesCount += preReviewGNews.length;
                console.log(preReviewGNews.length);
                insertNews(preReviewGNews);
            })
            .catch(err => {
                console.log(err);
            });

        }).catch(err => {
            console.log(err);
        });
}
exports.getNews = getNews;