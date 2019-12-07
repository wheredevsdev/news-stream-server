const NewsLib = require("../../library/newsAPI");
const BotLib = require("../../library/bot");
const mongoose = require('mongoose');

module.exports = function (app, ioObject) {

    var controller = require('../controllers/news');

    app.get("/_health", function (req, res) {
        res.status(200).json({ message: "OK" });
    });

    // Get articles where publishedDate is less than a specified date 
    app.get("/news", (req, res) => {
        const loadFrom = !isNaN(Date.parse(req.query.d)) ? new Date(req.query.d) : res.status(400).json({ message: "Incorrect date field" });
        const loadLimit = req.query.l ? parseInt(req.query.l) : 10;

        controller.getArticlesByDateTime(loadFrom, loadLimit)
            .then(function (articles) {
                return res
                    .json(articles);
            })
            .catch(function (err) {
                console.log(err);
                return res
                    .status(500)
                    .json({ message: "Something unexpected occured.", err });
            });
    });


    //Get all the details of an article from its id
    app.get("/news/:id", (req, res) => {
        const articleId = mongoose.Types.ObjectId(req.params.id);

        controller.getArticleDetails(articleId)
            .then(function (article) {
                console.log(article)
                return res
                    .json(article);
            })
            .catch(function (err) {
                console.log(err);
                return res
                    .status(500)
                    .json({ message: "Something unexpected occured.", err });
            });
    });



    if (process.env.NODE_ENV === "development") {
        app.get("/emitEvent", function (req, res) {
            ioObject.sockets.emit('article', {
                article: {
                    "_id": "5dd119f27331a75a5ca1baec",
                    "source": "API",
                    "status": "Accepted",
                    "title": "LALALALALALALALALAALALALALALALALALAALALALALALALALALALALALALAALAL",
                    "author": "The Conversation",
                    "origin": "API",
                    "url": "https://thenextweb.com/syndication/2019/11/17/heres-why-the-internet-will-always-have-enough-space-for-all-our-devices/",
                    "urlToImage": "https://img-cdn.tnwcdn.com/image/tnw?filter_last=1&fit=1280%2C640&url=https%3A%2F%2Fcdn0.tnwcdn.com%2Fwp-content%2Fblogs.dir%2F1%2Ffiles%2F2019%2F11%2FCopy-of-Copy-of-Copy-of-...-1-1.png&signature=be1eee0878cf8e1b794c58d498c0066a",
                    "content": "It seems that every five years, news emerges that the digital sky is falling in. Back in 2010 and 2015, rumors spread that the internet would soon run out of IP addresses. Now, the regulator of Europes internet domains has predicted that the regions 1.91m rem… [+3359 chars]",
                    "createdAt": "2019-11-17T03:29:14.200-06:30",
                    "updatedAt": "2019-11-17T03:29:14.200-06:30",
                    "publishedDate": "2019-12-06T09:23:45.948-06:30"
                }
            });

            res.send("Done")
        });

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