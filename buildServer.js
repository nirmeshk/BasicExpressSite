var needle = require('needle');
var fs = require('fs')
var ini = require('ini')

config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

var authToken = config.auth.travis_auth_token
console.log(authToken)

var options = {
  headers: { 'Content-Type':'application/json' }
}

var host = 'https://api.travis-ci.org/repos/nirmeshk/BasicExpressSite/builds/91501273'

needle.get(host, options, function(error, response) {
  if (!error && response.statusCode == 200){
    //console.log(response.body); // JSON decoding magic. :)
  } else {
    //console.log(error)
  }
});
