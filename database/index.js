
const mongoose = require("mongoose");
const URI = process.env.DB;

mongoose.Promise = global.Promise;

exports.init = function () {

	require("./models/PreReview");
	require("./models/PostReview");

	return mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true })
		.then(function () {
			console.log("Connection to database established succesfully.");
		})
		.catch(function (err) {
			console.log(err);
		});
}

exports.getModel = function (modelName) {
	return mongoose.model(modelName);
}