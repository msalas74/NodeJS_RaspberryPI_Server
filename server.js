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

var led = null;
var interval;
var array_io = [];
var io_item = {};
var index_offset = 2;
var button2;

//  build array io

var get_gpio_states = function () {
  for (i = 2; i <= 27; i++) {
    //var led = new Gpio(i, 'out');
    array_io.push(io_item = {
      name: 'io_' + i,
      pin_out: i,
      state: new Gpio(i, 'out')
    });
  }
  button2 = new Gpio(2, 'in', 'both');
};
// initiate gpio states
//get_gpio_states();


io.on('connection', function (socket) {
  get_gpio_states();
  //interval();
  //  blink gpio 17 example =========================
  // io_17_blink = setInterval(function () {
  //   console.log(array_io[17 - index_offset].name);
  //   var value = (array_io[17 - index_offset].state.readSync() + 1) % 2;
  //   array_io[17 - index_offset].state.write(value, function () {
  //     console.log('Changed LED ' + array_io[17 - index_offset].name + ' state to: ' + value);
  //     socket.broadcast.emit('get_io', value);
  //   });
  // }, 2000);
  // =================================================

  socket.on('input_17', function (value) {
    //  check if value is true, set value for onoff
    value = value ? 1 : 0;
    array_io[17 - index_offset].state.write(value, function () {
      //  todo
    });
  });

  // get gpio 2 input
  button2.watch(function (err, value) {
    if (err) {
      // TODO handle errors
      //throw err;
    }
    //console.log(value);
    socket.broadcast.emit('input_2', value);
  });

  socket.on('disconnect', function () {
    //release_gpio();
    console.log('Bye!');
  });
});

var release_gpio = function () {
  for (i = 0; i <= 25; i++) {
    array_io[i].state.writeSync(0);
    array_io[i].state.unexport();
  }
  button2.unwatch();
};

process.on('SIGNT', function() {
  clearInterval(io_17_blink);
  release_gpio();
  console.log('Bye!');
  process.exit();
});

console.log('Server listening at http://localhost:8080...Ctrl+C to exit.');
//server.listen(process.env.PORT || process.env.IP);
server.listen(8080);