// var Hammer = require(['hammer.js']);
var myElement = document.getElementById('logoContainer');
var mc = new Hammer(myElement);

$(function() {
  var socket = io();
  var sessionId;
  var connected = false;
  var gesture;
  var scale = 1;
  var prevTiltLR;
  var prevTiltFB;
  var prevDir;
  var prevScale = 1;
  var prevR = 255;
  var prevG = 255;
  var prevB = 255;

  //window onload event
  window.onload = function() {
    sessionId = Math.floor(100000 + Math.random() * 900000);
    console.log(sessionId);
    document.getElementById("message").innerHTML = sessionId;
    document.getElementById("scale").innerHTML = scale;
    //add user to server
    socket.emit('add user', sessionId);
    connected = true;
  };

  mc.get('pinch').set({enable: true});

  // listen to pinchin and pinchout events...
  mc.on("pinchin",function(e) {
    if (scale < 0.5) {
      scale = 0.5;
    }
    else{
      scale -= 0.005;
    }
    prevScale = scale;
    $('#logoContainer img').css('zoom', scale);
    document.getElementById("scale").innerHTML = round(scale,3);
    //send message
    var message = {
                        'sessionId' : sessionId,
                        'alpha': prevDir,
                        'beta': prevTiltFB,
                        'gamma': prevTiltLR,
                        'scale': scale,
                        'r' : prevR,
                        'g' : prevG,
                        'b' : prevB,
                  };

    // if there is a non-empty message and a socket connection
    if (message && connected) {
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  });

  mc.on("pinchout", function(e) {
    if (scale > 2){
      scale = 2
    }
    else{
      scale += 0.005;
    }
      prevScale = scale;
      $('#logoContainer img').css('zoom', scale);
      document.getElementById("scale").innerHTML = round(scale,3);
      //send message
      var message = {
                        'sessionId' : sessionId,
                        'alpha': prevDir,
                        'beta': prevTiltFB,
                        'gamma': prevTiltLR,
                        'scale': scale,
                        'r' : prevR,
                        'g' : prevG,
                        'b' : prevB,
                    };

      // if there is a non-empty message and a socket connection
      if (message && connected) {
        // tell server to execute 'new message' and send along one parameter
        socket.emit('new message', message);
      }
  });

  //device orientation codes
  if ('DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', deviceOrientationHandler, false);
  } else {
    console.log('device not supported');
  };


  // $(document).on('click', '.option', function(){
  $("#whiteBtn").on('click', function(){
        prevR = 255;
        prevG = 255;
        prevB = 255;
        var message = {
                            'sessionId' : sessionId,
                            'alpha': prevDir,
                            'beta': prevTiltFB,
                            'gamma': prevTiltLR,
                            'scale': prevScale,
                            'r' : 255,
                            'g' : 255,
                            'b' : 255,
                    };
        if (message && connected) {
          // tell server to execute 'new message' and send along one parameter
          socket.emit('new message', message);
        }
    });

  $("#redBtn").on('click', function(){
      prevR = 255;
      prevG = 0;
      prevB = 0;
      var message = {
                          'sessionId' : sessionId,
                          'alpha': prevDir,
                          'beta': prevTiltFB,
                          'gamma': prevTiltLR,
                          'scale': prevScale,
                          'r' : 255,
                          'g' : 0,
                          'b' : 0,
                  };
      if (message && connected) {
        // tell server to execute 'new message' and send along one parameter
        socket.emit('new message', message);
      }
    });

  $("#blueBtn").on('click', function(){
      prevB = 0;
      prevR = 0;
      prevG = 0;
      var message = {
                          'sessionId' : sessionId,
                          'alpha': prevDir,
                          'beta': prevTiltFB,
                          'gamma': prevTiltLR,
                          'scale': prevScale,
                          'r' : 0,
                          'g' : 0,
                          'b' : 0,
                  };
      if (message && connected) {
        // tell server to execute 'new message' and send along one parameter
        socket.emit('new message', message);
      }
    });

  function deviceOrientationHandler (eventData) {
    // i++;
    // filterVal = i*0.15;
    var tiltLR = eventData.gamma;
    // var tiltLR = smooth(eventData.gamma, filterVal, tiltLR);
    var tiltFB = eventData.beta;
    // var tiltFB = smooth(eventData.beta, filterVal, tiltFB);
    var dir = eventData.alpha;
    // var dir = smooth(eventData.alpha, filterVal, dir);
    prevTiltLR = tiltLR;
    prevTiltFB = tiltFB;
    prevDir = dir;

    document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
    document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
    document.getElementById("doDirection").innerHTML = Math.round(dir);

    var logo = document.getElementById("imgLogo");
    logo.style.webkitTransform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
    logo.style.MozTransform = "rotate(" + tiltLR + "deg)";
    logo.style.transform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";

    //send message
    var message = {
                      'sessionId' : sessionId,
                      'alpha': eventData.alpha,
                      'beta': eventData.beta,
                      'gamma': eventData.gamma,
                      'scale': scale,
                      'r' : prevR,
                      'g' : prevG,
                      'b' : prevB,
                  };

    // if there is a non-empty message and a socket connection
    if (message && connected) {
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  };

  socket.on('disconnect', function () {
    log('you have been disconnected');
  });

  socket.on('reconnect', function () {
    log('you have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', function () {
    log('attempt to reconnect has failed');
  });

});
