/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , fs = require('fs');


var app = express();


app.requests = 0;
app.startTime = Date.now();
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  app.requests += 1;
  res.render('index', { title : 'Home'});
});

app.get('/mathy', function(req, res) {
  var ans = [];
  for(var i = 0; i < 1000; i++) {
    for(var j = 0; j < 1000; j++) {
      ans.push(i * j);
    }
  }
  res.send(ans);
});

app.get('/fileOps', function(req, res) {
  fs.appendFileSync('gettingBig', 'bettingGig\n');
  res.send('wrote to file!');
});

app.listen(3000);

app.get('/requests', function (req, res) {
        res.write("" + app.requests);
        res.end();
})

app.get('/startTime', function (req, res) {
        res.write("" + app.startTime);
        res.end();
})
console.log("App is running on 3000");
