module.exports = function (app) {

    var controller = require('../controllers/news');

    app.route('/NewsPost')
        .get(controller.get_form_data)
        .post(controller.post_form_data);

    app.route('/NewsDisplay')
        .get(controller.get_articles);

};