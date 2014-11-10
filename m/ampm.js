module.exports = function (hour) {

	if (hour < 12) {
		return '이른 ' + hour + '시';
	} else {
		return '늦은 ' + (hour - 12) + '시';
	}
}