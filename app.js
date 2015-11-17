/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , redis = require('redis')


var app = express()
var redisConf = require('./redisConf.js').redisConf;
var redisClient = redis.createClient(6379, '107.170.29.129', redisConf);
var featureFlagsKey = 'featureFlags';
var newTitleFeatureFlag = 'newTitle';

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  redisClient.sismember(featureFlagsKey, newTitleFeatureFlag, function(err, result) {
      if(err) {
        console.log("Error in redis connection: " + err);
        res.render('index', { title : 'Home'});
      }
      if(result) {
        res.render('index', { title : 'New Title'});
      } else {
        res.render('index', { title : 'Home'});
      }
  });
})

app.listen(3000)