$(document).ready( function()
{
    var socket = io.connect('http://127.0.0.1:3001');

    socket.on("heartbeat", function(client) 
    {
        console.log(JSON.stringify(client));
	var latency = document.getElementById("latency");
        var requests = document.getElementById("requests");
	latency.innerHTML = client.latency;
	requests.innerHTML = client.requests;
    });
}); 
