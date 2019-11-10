const mongoose = require('mongoose');
const nModel = mongoose.model('prereview');
const NewsAPI = require('newsapi');
const newsAPI = new NewsAPI(process.env.NEWSAPITOKEN);

const { getModel: collection } = require("../database");

const { promiseDoWhile } = require("../utils");

const { COLLECTIONS, SOURCES, MAX_ARTICLES_TO_DUMP } = require("../constants");


/**
 * @description Fetches, filters and inserts news articles in 'prereview' collection.
 */
function getNews() {

    function requestNews(iterator) {
        return newsAPI.v2.everything({
            sources: SOURCES.join(","),
            language: 'en',
            page: iterator
        }).catch(function (err) {
            console.log(err);
        })
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

    // Get the published-date of the newest article from the database
    return nModel
        .find({})
        .sort('-publishedDate')
        .then(response => {
            const maxDate = response.publishedDate;
            console.log("Articles published after " + new Date(maxDate) + " are going to be inserted.")

            let articlesCount = 0;

            // Get the response from the API and insert the response into preReview collection.
            promiseDoWhile(
                function () {
                    return requestNews(iterator)
                        .then(response => {
                            const previewArr = [];
                            for (let j = 0; j < 20; j++) {
                                // Accept responses only where the author is not null to minimise repeated articles.
                                if (Object.keys(response.articles[j]).length > 1
                                    && new Date(response.articles[j].publishedAt) > new Date(maxDate)
                                    && response.articles[j].author != undefined) {
                                    previewArr.push({
                                        title: response.articles[j].title,
                                        author: response.articles[j].author,
                                        origin: response.articles[j].source.name,
                                        url: response.articles[j].url,
                                        publishedDate: response.articles[j].publishedAt
                                    });
                                }
                            }

                            articlesCount += previewArr.length;

                            insertNews(previewArr);
                        })
                },
                function () {
                    return articlesCount < MAX_ARTICLES_TO_DUMP;
                }
            ).then(function () {
                console.log("Dumped " + articlesCount + " articles for review");
            });
        }).catch(err => {
            console.log(err);
        });
}
exports.getNews = getNews;