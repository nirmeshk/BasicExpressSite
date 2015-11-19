var express = require('express')
  , httpProxy = require('http-proxy')
  , http = require('http');

var app = express();

app.post('/canaryBroke', function(req, res) {
  canaryHealthy = false;
  res.status(200).send();
});

app.post('/canaryFixed', function(req, res) {
  canaryHealthy = true;
  res.status(200).send();
});

app.listen(8082);

var serverTarget = 'http://127.0.0.1:3000';
var canaryTarget = 'http://127.0.0.1:3005';
var canaryHealthy = true;
var proxy = httpProxy.createProxyServer({});
var proxyServer = http.createServer(function(req, res)
{
  console.log('CanaryHealthy: ' + canaryHealthy);
  if(Math.random() > .9 && canaryHealthy) {
    TARGET = canaryTarget;
  } else {
    TARGET = serverTarget;
  }
  console.log('Sending request to: ' + TARGET);
  proxy.web( req, res, {target: TARGET } );
});
proxyServer.listen(8081);