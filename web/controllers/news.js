const { getModel } = require("../../database");
const { COLLECTIONS } = require("../../constants");

const UI_ARTICLE_FIELDS = "title author urlToImage url publishedDate content";

exports.getArticlesByDateTime = function (date, limit) {
    return getModel(COLLECTIONS.POST_REVIEW)
        .find({ publishedDate: { $lte: date } })
        .select(UI_ARTICLE_FIELDS)
        .sort({ publishedDate: -1 })
        .limit(limit)
        .exec();
};


exports.getArticleDetails = function (articleId) {
    return getModel(COLLECTIONS.POST_REVIEW)
        .find({ _id: articleId })
        .exec();
}
