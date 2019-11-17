const NewsLib = require("../../library/newsAPI");
const BotLib = require("../../telegram/bot");

module.exports = function (app) {

    var controller = require('../controllers/news');

    app.route('/NewsPost')
        .get(controller.get_form_data)
        .post(controller.post_form_data);

    app.route('/NewsDisplay')
        .get(controller.get_articles);


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