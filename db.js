var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/declare');

var Post = mongoose.model('posts', { 
									text: String,
									date: { type: Date, default: Date.now }
								});

exports.insertData = function (post, cb) {

	var newPost = new Post({ text: post });

	newPost.save(cb);
}

exports.getData = function (cb) {
	
	Post.find({}).sort({ date: -1 }).exec(cb);
} 