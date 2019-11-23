var mongoose = require('mongoose');
var nModel = mongoose.model("PostReview");

// exports.get_form_data =  function (req, res) {

//     res.render('NewsForm');

// };

// exports.post_form_data =  function (req, res) {

//     var myModel = new nModel(req.body);
//     console.log(req.body);

//     myModel.save(function (err, nModel) {
//         if (err)
//             res.send(err);
//         res.json(nModel);
//     });

// };

// exports.get_articles = function () {

//     nModel.find({ status:"sentForReview"}, function (err, articles) {
//         if (err) {
//             console.log(err);
//         }
//         //res.render(__dirname + '/web/views/NewsDisplay', { articles: articles });
//         console.log(articles);
//     });
// };

exports.get_articles_by_datetime = function(loadFrom){

    return nModel
            .find({ publishedDate: { $lt: loadFrom}})
            .sort("-publishedDate")
            .limit(10)
            .exec(); 
};


exports.get_article_details = function(articleId){

    return nModel
            .find({_id: articleId})
            .exec();
}
