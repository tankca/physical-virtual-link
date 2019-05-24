var scene, camera, renderer;

var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

var SPEED = 0.01;

//init all readings
var posX = 0;
var posY = 0;
var posZ = 0;
var angX = 0;
var angY = 0;
var angZ = 0;

var prevR = 255;
var prevG = 255;
var prevB = 255;

var surface;

// Current viewing angle
var currentAngle = {x: 0, y: 0};
var startMousePosition = {x: 0, y: 0};

var currentModelAngle = {x: 0, y: 0};
var startModelPosition = {x: 0, y: 0};

function init() {
    scene = new THREE.Scene();
    initScene();
    initCamera();
    initLights();
    initRenderer();

    // document.addEventListener("dragstart", onMouseDragStart, false);
    // document.addEventListener('drag', onMouseDrag, false)
    document.body.appendChild(renderer.domElement);
}

function initCamera() {
    // Set some camera attributes.
    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    camera =  new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );
    scene.add(camera);
    // camera.position.set(10, 10, 4);
    // camera.lookAt(scene.position);
}


function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
}

function initLights() {
    // var light = new THREE.AmbientLight(0xffffff);
    // scene.add(light);

    //PointLight( color, intensity, distance, decay )
    const pointLight = new THREE.PointLight(0xFFFFFF, 2, 0, 2);
    // set its position
    pointLight.position.x = 30;
    pointLight.position.y = 100;
    pointLight.position.z = 130;

    // add to the scene
    scene.add(pointLight);
}

var blenderScene = null;

function initScene() {


    var loader = new THREE.ObjectLoader();
    // var loader = new THREE.OBJLoader()
    loader.load('./LexusLfa.json', function(obj) {
        blenderScene = obj

        scene.add(obj)
        scene.background = new THREE.Color("rgb(192, 192, 192)");
        obj.position.x = 0;
        obj.position.y = -5;
        obj.position.z = -20;

        obj.rotation.x=0;
        obj.rotation.y=0;
        obj.rotation.z=0;

        surface = obj.getObjectByName("body");
        surface.material[0].color.r = 0;
        surface.material[0].color.g = 0;
        surface.material[0].color.b = 0;
        console.log('R: ',surface.material[0].color.r);
        console.log('G: ',surface.material[0].color.g);
        console.log('B: ',surface.material[0].color.b);
        var outline = obj.getObjectByName("parts");
        var mask = obj.getObjectByName("glass");

        // Watch the objects properties on console:
        console.log(obj);
        console.log('surface: ',surface);
        console.log('outline: ',outline);
        console.log('mask: ',mask);
    });
}

function rotateScene() {
    if (!blenderScene) {
        return;
    }
    blenderScene.rotation.y -= SPEED;
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

//socketio implementation
var socket = io();

// Whenever the server receives 'new message', update the scene
socket.on('new message', function (data) {
  if(blenderScene == null){
    return;
  }

  console.log("==================");
  console.log("x: ",data.message.alpha);
  console.log("y: ",data.message.beta);
  console.log("z: ",data.message.gamma);
  console.log("scale: ",data.message.scale);
  console.log("R: ",data.message.r);
  console.log("G: ",data.message.g);
  console.log("B: ",data.message.b);

  var scale = data.message.scale

  //pitch
  blenderScene.rotation.x = (data.message.beta)/40;
  // console.log("Pitch: ",data.message.beta/40);//front or back

  //yaw
  blenderScene.rotation.y = (data.message.alpha)/60;
  // console.log("Yaw: ",data.message.alpha/60); //direction

  //roll
  blenderScene.rotation.z = (data.message.gamma * -1)/50; //tilt left or right
  // console.log("Roll: ",(data.message.gamma * -1)/50);

  //scale
  blenderScene.scale.set(scale,scale,scale);

  //colour
  surface.material[0].color.r = data.message.r;
  surface.material[0].color.g = data.message.g;
  surface.material[0].color.b = data.message.b;
});

init();
render();
