const { getModel } = require("../../database");
const { COLLECTIONS } = require("../../constants");


exports.getArticlesByDateTime = function (date, limit) {
    return getModel(COLLECTIONS.POST_REVIEW)
        .find({ publishedDate: { $lte: date } })
        .sort({ publishedDate: -1 })
        .limit(limit)
        .exec();
};


exports.getArticleDetails = function (articleId) {
    return getModel(COLLECTIONS.POST_REVIEW)
        .find({ _id: articleId })
        .exec();
}
