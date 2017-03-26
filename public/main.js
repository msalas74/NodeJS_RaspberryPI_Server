// Raspberry PI Frontend Example
var raspberry_pi = function () {
  
  //  instantiate server io server object
  var socket = io();

  //  get gpio status from server
  // socket.on('get_io', function (io_state) {
  //   document.getElementById('io_17').checked = io_state;
  // });

  socket.on('input_2', function (io_state) {
    document.getElementById('io_2').checked = !io_state;
  });

  //  method event to toggle gpio output #
  // var toggle_io = function (io) {
  //   socket.emit('toggle_17', io);
  // };

  // document.addEventListener('keydown', function (e) {
  //   var key_name = e.key;

  //   if (key_name === 'Control') {
  //     toggle_io(17);
  //   }
  // });

  document.getElementById('io_17').addEventListener('click', function (e) {
    //console.log(io_17.checked);
    socket.emit('input_17', io_17.checked);
  });

};

// ready state

if (document.readyState === 'complete' || 
    (document.readyState !== 'loading' && !document.documentElement.doScroll) ) {
  raspberry_pi();
} else {
  document.addEventListener('DOMContentLoaded', raspberry_pi);
}