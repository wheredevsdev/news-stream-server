var mongoose = require('mongoose');
var nModel = mongoose.model("PreReview");

exports.get_form_data =  function (req, res) {

    res.render('NewsForm');

};

exports.post_form_data =  function (req, res) {

    var myModel = new nModel(req.body);
    console.log(req.body);

    myModel.save(function (err, nModel) {
        if (err)
            res.send(err);
        res.json(nModel);
    });

};

exports.get_articles = function (req, res) {

    nModel.find({ status:"sentForReview"}, function (err, articles) {
        if (err) {
            console.log(err);
        }
        res.render('NewsDisplay', { articles: articles });
        console.log(articles);
    });

};
