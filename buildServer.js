var needle = require('needle');
var fs = require('fs')
var ini = require('ini')
var express = require('express');
var redis = require('redis');
var child_process = require('child_process');
var app = express();

//var kue = require('kue')

//queue = kue.createQueue();

var containerName = 'ncsu/canary_server';

config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

/*
var redisClient = redis.createClient(config.redis.redis_port, config.redis.redis_host, {
  auth_pass: config.redis.redis_pass
});
*/

/*
kue.redis.createClient = function() {
    var client = redis.createClient(config.redis.redis_port, config.redis.redis_host);
    client.auth(config.redis.redis_pass);
    return client;
};

var queue = kue.createQueue();
*/

var authToken = config.travis.travis_auth_token

app.get('/build', function(req, res) {
  // verify the auth token
  // Verify the branch to be deployed. We are assuming that only `master` branch is deployed
  if (authToken === req.query.authToken && req.query.branch === "master") {
    // Push the commit to a redis queue.
    // Add the deploy job to a queue
    /*
    var job = queue.create('deployment_queue', {commit_id: req.query.commit});

    job.on('complete', function (){
      console.log('Job', job.id, 'with commit', job.data.commit_id, 'is    done');
    })
    .on('failed', function (){
      console.log('Job', job.id, 'with commit', job.data.commit_id, 'has  failed');
    });

    job.save();
    */

    // redisClient.publish("deploy_queue", req.query.commit);
    console.log(req.query.branch);
    console.log(req.query.commit);
    if(req.query.commit){
      deploy_2(req.query.commit)
    }
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

/*
queue.process('deployment_queue', function(job, done){
  deploy_2(job.data.commit_id, done);
});
*/

var deploy_2 = function(commit_id) {
    console.log(commit_id)
    child_process.execSync("docker stop ncsu/canary_server");
    child_process.execSync("docker rm ncsu/canary_server");
    child_process.execSync("git pull --rebase origin master");
    child_process.execSync("git reset --hard " + commit_id);
    child_process.execSync("docker build -t ncsu/canary_server .");
    child_process.execSync("docker run -p 3005:3000 -d ncsu/canary_server");
    //done()
}
