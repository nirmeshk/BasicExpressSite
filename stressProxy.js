var express = require('express')
  , httpProxy = require('http-proxy')
  , http = require('http');
//var targets = ['http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002'];
var targets = ['http://54.164.23.136:3000', 'http://54.84.21.20:3000', 'http://54.88.179.176:3000'];
var TARGET = targets[0];

var proxy = httpProxy.createProxyServer({});
var proxyServer = http.createServer(function(req, res)
{
  var ind = Math.floor(Math.random() * 3);
  TARGET = targets[ind];
  console.log('Sending request to: ' + TARGET);
  proxy.web( req, res, {target: TARGET } );
});
proxyServer.listen(8080);