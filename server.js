// Raspberry PI NodeJS example
var express = require('express');
var socket_io = require('socket.io');
var http = require('http');
var app = express();
app.use(express.static('public'));
var server = http.Server(app);
var io = socket_io(server);

//  development environment object settings
var dev = {
 production: false
};
var onoff = require('onoff');


// ***** onoff module Raspberry PI GPIO *****
var Gpio = onoff.Gpio;

var led = new Gpio(17, 'out');
var interval;
var array_io = [];

io.on('connection', function (socket) {
  interval = setInterval(function () {
    var value = (led.readSync() + 1) % 2;
    led.write(value, function () {
      console.log('Changed LED state to: ' + value);
      socket.broadcast.emit('get_io', value);
    });
  }, 2000);
});


process.on('SIGNT', function() {
  clearInterval(interval);
  led.writeSync(0);
  led.unexport();
  console.log('Bye!');
  process.exit();
});

console.log('Server listening at http://localhost:8080...Ctrl+C to exit.');
//server.listen(process.env.PORT || process.env.IP);
server.listen(8080);