const { getModel: collection } = require("../database");
const NewsAPI = require('newsapi');

const api = new NewsAPI(process.env.NEWSAPITOKEN);

const { COLLECTIONS, SOURCES } = require("../constants");

/**
 * @description Fetches, filters and inserts news articles in 'prereview' collection.
 */
function getNews() {

    function requestNewsAPI() {
        return api.v2
            .topHeadlines({
                sources: SOURCES.join(","),
                language: 'en',
                pageSize: 50
            });
    }

    function insertNews(previewArr) {
        return collection(COLLECTIONS.PRE_REVIEW)
            .insertMany(previewArr)
            .then(() => {
                console.log(previewArr.length + " articles inserted into the preReview collection");
            });
    }

    function validateArticle(article, minDate) {
        return (
            article.author != undefined
            && article.publishedAt
            && !isNaN(Date.parse(article.publishedAt))
            && new Date(article.publishedAt).valueOf() > minDate.valueOf()
            && article.title
            && article.author
            && article.url
            && article.source
            && article.source.name
        );
    }

    const prmGetLatestArticle =
        collection(COLLECTIONS.PRE_REVIEW)
            .findOne({})
            .sort("-publishedDate");

    const prmFetchHeadlines = requestNewsAPI();

    return Promise.all([prmGetLatestArticle, prmFetchHeadlines])
        .then(([latestArticle, response]) => {
            const minDate = new Date(latestArticle.publishedDate);

            if (response.articles && response.articles.length) {
                const previewArrNewsAPI =
                    response
                        .articles
                        .filter(article => validateArticle(article, minDate))
                        .map(article => {
                            return {
                                title: article.title,
                                author: article.author,
                                origin: article.source.name,
                                url: article.url,
                                urlToImage: article.urlToImage,
                                publishedDate: new Date(article.publishedAt),
                                content: article.content
                            }
                        });
                return insertNews(previewArrNewsAPI);
            }
        }).catch(err => {
            console.log(err);
        });
}
exports.getNews = getNews;