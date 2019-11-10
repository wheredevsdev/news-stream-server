var newsModel = require('../database/models/PreviewReview');
var mongoose = require('mongoose');
var nModel = mongoose.model('prereview');

const { COLLECTIONS } = require("../constants");
const { getModel: collection } = require("../database");

const NewsAPI = require('newsapi');
const newsAPI = new NewsAPI(process.env.NEWSAPITOKEN);

module.exports.getNews = async function(){

    var maxDate;

    // Get the published-date of the newest article from the database
    return nModel.findOne({}).sort('-publishedDate')
    .then(response => {
        maxDate = response.publishedDate;
        console.log("Articles published after " + new Date(maxDate) + " are going to be inserted.")

        var iterator = 1;

        // Get the response from the API and insert the response into preReview collection.
        doWhile(
            async function(){
                return requestNews(iterator)
                .then(response => {

                    insertNews(response,maxDate);
                    ++iterator;
                })
            },
            function(){
                return iterator <= 5;
            }
        );

    }).catch(err =>{
        console.log(err);
    });
    
};

var doWhile = async function(action, condition)
{
    function loop(){
        if(!condition())
        {
            return;
        }
        return action().then(loop);
    }

    return action().then(loop);
    
}


var requestNews = async function(iterator){

    // Get the response from the API
    var previewArr = [];
    console.log("Get the response from API");
    return newsAPI.v2.everything({
        sources:'the-verge,wired,the-next-web,techradar,techcrunch,recode,engadget,ars-technica',
        language: 'en',
        page: iterator
    });
};


var insertNews = async function(response, maxDate){

    // Create an array for the API response.
    var previewArr = [];
    ////console.log("Executing then");
    for(var j=0; j<20; j++)
    {
        ////console.log(response.articles[j].title);
        ////console.log("Get the data into preReview array");
        ////console.log(response.articles[j].title, i,j);

        // Accept responses only where the author is not null to minimise repeated articles.
        if(new Date(response.articles[j].publishedAt) > new Date(maxDate) && response.articles[j].author != null)
        {
            ////console.log(response.articles[j].publishedAt, maxDate);
            ////console.log("condition met");
            var myModel = new nModel({
                title: response.articles[j].title,
                author: response.articles[j].author,
                origin: response.articles[j].source.name,
                url: response.articles[j].url,
                publishedDate: response.articles[j].publishedAt
            });
            
            
            previewArr[j] = myModel;
            

        }
    }

    // Remove empty objects from the preReview array.
    var newPreReviewArray = previewArr.filter(value => Object.keys(value).length !== 0);

    // Insert data into the collection.
    collection(COLLECTIONS.PRE_REVIEW).insertMany(newPreReviewArray)
    .then(function(){
            console.log(newPreReviewArray.length + " articles inserted into the preReview collection");
            ////console.log(newPreReviewArray);
    }).catch(err => {
            console.log(err);    
    });

}


        