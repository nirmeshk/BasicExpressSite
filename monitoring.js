var sio = require('socket.io')
  , http = require('http')
  , request = require('request')
  , os = require('os')
  , ini = require('ini')
  , fs = require('fs')
  , nodemailer = require('nodemailer')
  ;
/*
config = ini.parse(fs.readFileSync('./config.ini','UTF-8'))
var sendgrid = require('sendgrid')(config.auth.sendgrid_api_key)
var email = new sendgrid.Email();

email.addTo("xjprimus@ncsu.edu");
email.setFrom("yelling@you.com");
email.setSubject("Latency Issue");
email.setHtml("Latency too dang high");
*/

var app = http.createServer(function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end();
    })
  , io = sio.listen(app);

app.startTime = getAppStartTime();

function memoryLoad()
{
    // console.log( os.totalmem(), os.freemem() );
    return 0;
}


function measureLatency()
{   
    var latency = 0;
    var startTime = Date.now();
    var options = 
    {
       // url: 'http://localhost' + ":" + server.address().port,
       url: 'http://192.168.33.10'+ ":" + 3000,
    };
    request(options, function (error, res, body) 
    {
	if(error){
	    console.log("error in request to home site");
	}
        latency = Date.now() - startTime;
        app.latency = latency;
    });
    console.log("latency: " + app.latency);
    return app.latency;
}
//get average requests per minute
function requestsPerMinute()
{
     var options =
    {
       // url: 'http://localhost' + ":" + server.address().port,
       url: 'http://192.168.33.10' + ":" + 3000 + "/requests",
    };
    request(options, function (error, res, body)
    {
        if(error){
            console.log("error in request to home site");
        }
	else{
	    app.requests = parseInt(body);
	}
    });
    console.log("requests: " + app.requests);
    //get the elapsed time since server creation in minutes
    var elapsedTime = (Date.now() - app.startTime)/60000;
    console.log("time: " + elapsedTime);
    console.log("rpm : " + app.requests/elapsedTime);
    return app.requests/elapsedTime;
}

function getAppStartTime(){
var options =
    {
       // url: 'http://localhost' + ":" + server.address().port,
       url: 'http://192.168.33.10' + ":" + 3000 + "/startTime",
    };
    request(options, function (error, res, body)
    {
        if(error){
            console.log("error in request to home site");
        }
        else{
            app.startTime = parseInt(body);
        }
    });
}
///////////////
//// Broadcast heartbeat over websockets
//////////////
setInterval( function () 
{
    console.log("Heartbeat: " + Date.now());
    var latencyResult = measureLatency();
    var rpmResult = requestsPerMinute();
    if(latencyResult > 78){
	sendEmail();
    }
    io.sockets.emit('heartbeat', 
    { 
        name: "Your Computer", latency: latencyResult, requests: rpmResult,
   });

}, 4000);

app.listen(3001);

function createServer(port, fn)
{
    // Response to http requests.
    var server = http.createServer(function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/html' });

      fn();

      res.end();
   }).listen(port);
    //global params that are set within low scope request functions
    //set with <servername>.<attribute> = <value> i.e. app.latency = 10
    server.latency = undefined;
    server.requests = undefined;
}


var mailOptions = {
    from: 'Angry Server <yelling@you.com>', // sender address
    to: 'xjprimus@ncsu.edu', // list of receivers
    subject: 'Issue', // Subject line
    text: 'You have and issue with your server, go check it.', // plaintext body
    html: '<b>You have and issue with your server, go check it.</b>' // html body
};

var transporter = nodemailer.createTransport();

function sendEmail(){
  // send mail with defined transport object
	/*
  sendgrid.send(email, function(err, json) {
    if (err) { return console.error("Error :" + err); }
      console.log(json);
  });
*/
transporter.sendMail({
    from: 'xavierprimus@gmail.com',
    to: 'xjprimus@ncsu.edu',
    subject: 'TEST, I REPEAT, TEST',
    text: 'hello world!'
});  
}
