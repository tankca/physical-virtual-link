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

    document.addEventListener("dragstart", onMouseDragStart, false);
    document.addEventListener('drag', onMouseDrag, false)
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
    const pointLight =
    new THREE.PointLight(0xFFFFFF);

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
    loader.load('./LexusLfa.json', function(obj) {
        blenderScene = obj
        scene.add(obj)
        obj.position.x = 0
        obj.position.y = 0
        obj.position.z = -40

        obj.rotation.x=45
        obj.rotation.y=0
        obj.rotation.z=0

        var surface = obj.getObjectByName("body");
        var outline = obj.getObjectByName("parts");
        var mask = obj.getObjectByName("glass");
        // Watch the objects properties on console:
        console.log(obj);
        console.log(surface);
        console.log(outline);
        console.log(mask);
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
    // rotateScene();
    renderer.render(scene, camera);
    console.log("rendering x.....: ", blenderScene.rotation.x);
    console.log("rendering y.....: ", blenderScene.rotation.y);
}

function onMouseDragStart(event) {
    // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    // mouse.y = - ((event.clientY / window.innerHeight) * 2 - 1);
    startMousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
    startMousePosition.y = - ((event.clientY / window.innerHeight) * 2 - 1)
}

function onMouseDrag(event) {
    // Update the mouse variable
    event.preventDefault();
    var currentMousePosition = {x: 0, y: 0}
    currentMousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
    currentMousePosition.y = - ((event.clientY / window.innerHeight) * 2 - 1)
    console.log("client x: ",event.clientX);
    console.log("client y: ",event.clientY);
    currentAngle.x = currentAngle.x + (currentMousePosition.x - startMousePosition.x)/20;
    currentAngle.y = Math.max(0, currentAngle.y + (currentMousePosition.y - startMousePosition.y)/20);
    currentAngle.y = Math.min(currentAngle.y, 1);
    blenderScene.rotation.y = currentAngle.x;
    blenderScene.rotation.x = currentAngle.y
};

//socketio implementation
var socket = io();
// Whenever the server emits 'new message', update the chat body
socket.on('new message', function (data) {
   console.log("==================");
   console.log("x: ",data.message.alpha);
   console.log("y: ",data.message.beta);
   console.log("z: ",data.message.gamma);
});

init();
render();
