const NewsLib = require("../../library/newsAPI");
const BotLib = require("../../library/bot");
const mongoose = require('mongoose');

module.exports = function (app) {

    var controller = require('../controllers/news');

    // Get articles where publishedDate is less than a specified date 
    app.get("/news", (req, res) => {
        const loadFrom = !isNaN(Date.parse(req.query.d)) ? new Date(req.query.d) : res.status(400).json({ message: "Incorrect date field" });
      
        controller.get_articles_by_datetime(loadFrom)
          .then(function(articles) {
            return res
              .json(articles);
          })
          .catch(function(err) {
            console.log(err);
            return res
              .status(500)
              .json({ message: "Something unexpected occured.", err });
      
          });
      });


      //Get all the details of an article from its id
      app.get("/news/:id", (req, res) => {
        const articleId = mongoose.Types.ObjectId(req.params.id);
      
        controller.get_article_details(articleId)
          .then(function(article) {
            console.log(article)
            return res
              .json(article);
          })
          .catch(function(err) {
            console.log(err);
            return res
              .status(500)
              .json({ message: "Something unexpected occured.", err });
      
          });
      });



    if (process.env.NODE_ENV === "development") {
        app.get("/ping", function(req, res) {
            res.json({ message: "Hello world!" });
        })

        app.get("/getNews", function (req, res) {
            console.log("Seeding news in database.")
            NewsLib.getNews()
                .then(function () {
                    return res.json({ message: "Succesfully seeded some articles in pre-review." });
                })
                .catch(function (err) {
                    return res.json({ message: "Something unexpected occurred!", err })
                });
        });

        app.get("/sendForReview", function (req, res) {
            BotLib.sendForReview(1)
                .then(function () {
                    return res.json({ message: "Succesfully sent an article for review." });
                })
                .catch(function (err) {
                    return res.json({ message: "Something unexpected occurred!", err })
                });
        });
    }
};