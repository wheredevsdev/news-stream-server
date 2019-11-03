const mongoose = require("mongoose");
const URI = process.env.DB;

mongoose.Promise = global.Promise;

exports.init = function () {

	require("./models/PreviewReview");
	require("./models/PostReview");

	return mongoose.connect(URI, { useNewUrlParser: true })
		.then(function () {
			console.log("Connection to database established succesfully.");
		})
		.catch(function (err) {
			console.log(err);
			process.exit(1);
		});
}

exports.getModel = function (modelName) {
	return mongoose.model(modelName);
}