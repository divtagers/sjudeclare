var express = require('express');
var bodyParser = require('body-parser');
var swig = require('swig');
var blanky = require('blanky');
var path = require('path');

var content = require('./content.json');
var db = require('./db.js');

var app = express();

//rendering config
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, './tmpl'));
app.set('view engine', 'html');
swig.setDefaults({
	cache: false
});

//static file config
app.use('/s', express.static(path.join(__dirname, './tmpl/s')));

app.use(bodyParser.urlencoded({
	extended: false
}));

//http ops
app.get('/', function (req, res) {

	db.getData(function (err, data) {

		content['data'] = data;
		res.render('index', content);
	});
});

app.post('/api/post', function (req, res) {

	var text = req.body.text;

	if (blanky(text) === true) {
		
		res.sendStatus(500);
	} else {

		db.insertData(text, function (err, r) {

			if (!err) {
				res.sendStatus(200);
			} else {
				res.sendStatus(500);
			}
		});
	}
});

/*
app.post('/api/comment', function (req, res) {
	console.log(req.body.text);
});
*/

app.listen(9999, function () {
	console.log('app is running on 127.0.0.1:9999');
})