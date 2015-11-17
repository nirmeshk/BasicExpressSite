var needle = require('needle');
var fs = require('fs')
var ini = require('ini')
var express = require('express');
var redis = require('redis');
var app = express();



config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

var redisPass = config.auth.redis_pass
var redisClient = redis.createClient(6379, '107.170.29.129', {auth_pass: redisPass});

var authToken = config.auth.travis_auth_token

app.get('/build', function (req, res) {
  // verify the auth token
  console.log(req.params.authToken);
  console.log(req.params.branch);
  console.log(req.params.commit);
  // Verify the branch to be deployed. We are assuming that only `master` branch is deployed
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Deployment server listening at http://%s:%s', host, port);
});
