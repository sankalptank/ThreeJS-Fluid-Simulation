import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js';
import _VSZero from './vertex.glsl';
import _FSZero from './fragment0.glsl';
import _VSOne from './vertex.glsl';
import _FSOne from './fragment1.glsl';
import _VSTwo from './vertex.glsl';
import _FSTwo from './fragment2.glsl';



//create canvas
const canvas = document.getElementById('canvas');

//create renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas'),
    antialias: false
});
renderer.setSize(canvas.width, canvas.height);
document.body.appendChild(renderer.domElement);

//load test texture
const loader = new THREE.TextureLoader();
const imageTexture = loader.load('thisshit.jpg');


var renderTargets = [];
var scenes = [];
var cameras = []
var meshes = [];
var geometries = [];
var rendertargets = 12;

function createRenderScene(numberOfscenes){

    //create rendertargets
    for(var i = 0; i < numberOfscenes; i++){
        renderTargets.push(new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight));
    }

    //create scenes
    for(var i = 0; i < numberOfscenes; i++){
        scenes.push(new THREE.Scene());
    }

    //create cameras
    for(var i = 0 ; i < numberOfscenes; i++){
        cameras.push(new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1000));
    }

    //create geometries
    for(var i = 0; i < numberOfscenes; i++){
        geometries.push(new THREE.PlaneGeometry(1, 1).translate(0.5,0.5,0));
    }

      //create meshes
      for(var i = 0; i < numberOfscenes; i++){
        meshes.push(new THREE.Mesh());

    }
}

createRenderScene(rendertargets);

//create materials
var materials = [ 
    new THREE.ShaderMaterial({
        uniforms: {
            canvasRes: { value: new THREE.Vector2(canvas.width, canvas.height)},
            mousePos: { value: new THREE.Vector2(0.0, 0.0)},
            mouseVel: { value: new THREE.Vector2(0.0, 0.0)},
        },
        vertexShader: _VSZero,
        fragmentShader: _FSZero
    }),
];

function createMaterial(numberOfmaterial){
    for(var i = 0; i < numberOfmaterial; i++){
        materials.push(    
            new THREE.ShaderMaterial({
            uniforms: {
                width: { value: canvas.width },
                height: { value: canvas.height },
                renderTarget0: { value: renderTargets[i].texture },
                testImage: { value: imageTexture }
            },
            vertexShader: _VSOne,
            fragmentShader: _FSOne
        })
    )
    if (numberOfmaterial-i > 0.5){
        materials.push(    
            new THREE.ShaderMaterial({
            uniforms: {
                width: { value: canvas.width },
                height: { value: canvas.height },
                renderTarget0: { value: renderTargets[i].texture },
                renderTarget1: { value: renderTargets[i+1].texture },
                testImage: { value: imageTexture }
            },
            vertexShader: _VSTwo,
            fragmentShader: _FSTwo
        })
        )
    };
    }
}

createMaterial(((rendertargets-1)/2))

for(var i = 0; i < scenes.length; i++){
    meshes[i].geometry = geometries[i];
    meshes[i].material = materials[i];
    scenes[i].add(meshes[i]);
};


//set defualt values
var mousePos = new THREE.Vector2(0,0);
var mouseVel = new THREE.Vector2(null,null);
var timestamp = null;
var lastMousevel = new THREE.Vector2(null,null);
var mouseMoved = false;

document.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    mousePos.x = event.clientX - rect.left;
    mousePos.y = rect.bottom - event.clientY;
    if (timestamp === null) {
        timestamp = Date.now();
        lastMousevel.set(event.screenX, event.screenY);
        return;
    }

    const now = Date.now();
    const dt = now - timestamp;
    const dx = event.screenX - lastMousevel.x;
    const dy = event.screenY - lastMousevel.y;
    mouseVel.set((dx / dt), -(dy / dt));

    timestamp = now;
    lastMousevel.set(event.screenX, event.screenY);
});

function clearMousevel() {
    mouseVel.set(0.0, 0.0);
}

function updateUniforms() {
    materials[0].uniforms.mouseVel.value.set(mouseVel.x,mouseVel.y);
    materials[0].uniforms.mousePos.value.set(mousePos.x/canvas.width, mousePos.y/canvas.height);
    meshes[0].material.needsUpdate = true;
}



document.onmousemove = function() {
    mouseMoved = true;
};

function renderRendertarget(index){
    renderer.setRenderTarget(renderTargets[index]);
    renderer.render(scenes[index], cameras[index]);
    renderer.setRenderTarget(null);

}

function renderLoop(time) {
    requestAnimationFrame(renderLoop); //animate
    
    updateUniforms();

    for(var i = 0; i <= rendertargets-1; i++){
        renderRendertarget(i);
    }

    if (!mouseMoved) {
        clearMousevel();
    }
    
    mouseMoved = false;
    renderer.render(scenes[rendertargets-1], cameras[rendertargets-1]);
}
requestAnimationFrame(renderLoop);
console.log(materials.length);