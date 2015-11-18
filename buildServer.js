var needle = require('needle');
var fs = require('fs')
var ini = require('ini')
var express = require('express');
var redis = require('redis');
var app = express();

config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

var redisPass = config.auth.redis_pass;

var redisClient = redis.createClient(6379, '107.170.29.129', {
  auth_pass: redisPass
});

var authToken = config.auth.travis_auth_token

app.get('/build', function(req, res) {
  // verify the auth token
  // Verify the branch to be deployed. We are assuming that only `master` branch is deployed
  if (authToken === req.query.authToken && req.query.branch === "master") {
    // Push the commit to a redis queue.
    // There will be a cron job running that will deploy these commits one after the another
    redisClient.rpush('deploy_queue', req.query.commit);
    console.log(req.query.branch);
    console.log(req.query.commit);
    res.send('Task added to deploy queue !!!');
  } else {
    res.send('Something bad happened !!!');
  }
});

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Deployment server listening at http://%s:%s', host, port);
});
