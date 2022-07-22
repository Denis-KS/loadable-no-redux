var express = require('express');
var apiMocker = require('connect-api-mocker');

var app = express();

app.use('/api', apiMocker('mock-api/api'));

app.listen(8080);