'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var swig = require('swig');
var blanky = require('blanky');
var path = require('path');

var content = require('./content.json');
var db = require('./db.js');
var ampm = require('./m/ampm.js');

var app = express();

//rendering config
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, './tmpl'));
app.set('view engine', 'html');
app.set('view cache', true);

//static file config
app.use('/s', express.static(path.join(__dirname, './tmpl/s')));

app.use(bodyParser.urlencoded({
	extended: false
}));

//http ops
app.get('/', function (req, res) {

	db.getData(function (err, data) {

		var len = data.length;
		var i = 0;
		var j = 0;

		for (i = 0; i < len; i++) {

			data[i].text = data[i].text.replace(/(?:\r\n|\r|\n)/g, '<br>');
		}

		for (j = 0; j < len; j++) {

			var d = data[j].date;

			var year = d.getFullYear();
			var month = d.getMonth() + 1;
			var day = d.getDate();
			var hour = ampm(d.getHours());
			var minute = d.getMinutes();
			var second = d.getSeconds();

			data[j].easydate = year + '년 ' + month + '월 ' + day + '일 ' + hour +
							' ' + minute + '분 ' + second + '초에 작성되었습니다.';
		}

		content.data = data;
		res.render('index', content);
	});
});

app.post('/api/post', function (req, res) {

	var text = req.body.text;

	if (blanky(text) === true) {
		
		res.sendStatus(500);
	} else {

		db.insertData(text, function (err) {

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
});