// import { MathUtils } from "https://threejs.org/build/three.js";
// import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as THREE from './dependacy/three.module.js';
// import {test} from './init.js';
var sceneControl = {
    max_width
}
var max_width;
var Sample;
var Radius;
var TotalNumbers = 50;
var region_mesh;

var scene;
var camera, target_camera;
var renderer;
var light;
var frustumSize = 1000

var rtt_target;
var target_width, target_height;
var rtt_pixels;
var px2idx;
var centroids;
var region_pixels;
var cone_geometry





var frames_to_render = 50;
var color;
var material;
var materials;

var PixelSeed;

function init() {
    reset_resolution()
    // test();
    // init scene and camera
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);




    // init target_camera
    target_camera = new THREE.OrthographicCamera(
        target_width / -2, target_width / 2,
        target_height / 2, target_height / -2,
        1, 1000);
    target_camera.position.z = 5;
    target_camera.scale.x = window.innerWidth / target_width;
    target_camera.scale.y = window.innerHeight / target_height;
    target_camera.updateMatrix();

    //init array for pixels reading
    var num_pixels = target_width * target_height;
    rtt_pixels = new Uint8Array(num_pixels * 4);
    centroids = new Float32Array(TotalNumbers * 2);
    px2idx = new Array(num_pixels * 4);
    region_pixels = new Uint16Array(TotalNumbers);
    // init renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    rtt_target = new THREE.WebGLRenderTarget();
    rtt_target.magFilter = THREE.NearestFilter;
    rtt_target.minFilter = THREE.NearestFilter;
    rtt_target.dispose();
    rtt_target.setSize(target_width, target_height);

    document.body.appendChild(renderer.domElement);


    camera.position.z = 5;

    cone_geometry = new THREE.ConeGeometry( 200, 1, 32 );

    region_mesh = new Array(TotalNumbers);
    materials = new Array(TotalNumbers);
    PixelSeed = new Array(window.innerWidth);
    for (let i = 0; i < window.innerWidth; i++) {
        PixelSeed[i] = new Array(window.innerHeight);  
        for(let j = 0; j<window.innerHeight;j++){
            PixelSeed[i][j] =0 ;
        }
    }
    // PixelSeed[0][0] = 1;
    console.log(PixelSeed);
    const PartitionNum = new Int16Array(TotalNumbers);

    var axesHelper = new THREE.AxesHelper(5);
    scene.add( axesHelper );

    // GUI

    // light
    color = 0xffffff;
    var intensity = 1;
    light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    // scene.add(light);

    window.addEventListener('resize', onWindowResize);

}
init();
function reset() {
    if (num_pixels * 4 > rtt_pixels.length) {
        rtt_pixels = null;
        rtt_pixels = new Uint8Array(num_pixels * 4);
    }
    px2idx.length = num_pixels * 4;
}
function reset_resolution() {
    sceneControl.max_width = Math.floor(Math.sqrt(60 * 200));
    var width = window.innerWidth;
    var height = window.innerHeight;
    target_width = sceneControl.max_width;
    target_height = Math.floor(height * (target_width / width));
}
function reset_centroids() {
    for (var i = 0; i < TotalNumbers; ++i) {
      centroids[2*i] = 0;
      centroids[2*i+1] = 0;
      region_pixels[i] = 0;
    //   pixel_weight_sums[i] = 0;
    }
  }

function onWindowResize() {


    console.log(target_height)
    console.log(target_width)
    console.log(window.innerHeight)
    console.log(window.innerWidth)


    // If I want to change let the seeds always keep same ratio

    // var aspect = window.innerWidth / window.innerHeight;

    // camera.left = - window.innerWidth / 2;
    // camera.right = window.innerWidth / 2;
    // camera.top = window.innerHeight / 2;
    // camera.bottom = - window.innerHeight/ 2;
    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // camera.updateProjectionMatrix();

    // renderer.setSize(window.innerWidth, window.innerHeight);

}

var SampleRandomPosition = function (NumSamples) {
    Sample = new Array(NumSamples);
    Radius = new Array(NumSamples);

    for (let i = 0; i < TotalNumbers; ++i) {
        var p1 = new THREE.Vector2(Math.random() * innerWidth, Math.random() * innerHeight);

        var currRadius = Math.random() * 50;
        Sample[i] = p1;
        region_mesh[i].position.x = p1.x;
        region_mesh[i].position.y = p1.y;
        Radius[i] = currRadius;
    }
}
// SampleRandomPosition(TotalNumbers);

// materials to do 
material = new THREE.MeshPhongMaterial({ color: 0xffff00 });

// function paint_regions() {
//     for (var i = 0; i < TotalNumbers; ++i) {
//         materials[i].color.setRGB(255 - Math.random() / 255, 255 - Math.random() / 255, 255 - Math.random() / 255);
//     }
// }
// paint_regions();

function InitGeomerty() {
    for (let i = 0; i < TotalNumbers; ++i) {
        materials[i] = new THREE.MeshBasicMaterial();
        materials[i].color.setRGB(Math.random(), Math.random(), Math.random());
        // console.log(Math.trunc( Math.random()*255));
        // materials[i].wireframe = true;
        // console.log(materials[i]);
    }

    for (let i = 0; i < TotalNumbers; ++i) {
        region_mesh[i] = new THREE.Mesh(cone_geometry, materials[i]);

        var p1 = new THREE.Vector2(innerWidth * (Math.random() - 0.5), innerHeight * (Math.random() - 0.5));
        // console.log(p1);
        // console.log(window.innerWidth)
        // console.log(window.innerHeight)
        region_mesh[i].position.x = p1.x;
        region_mesh[i].position.y = p1.y;
        region_mesh[i].rotation.x = Math.PI / 2;
        // console.log(region_mesh[i]);
        scene.add(region_mesh[i]);
        console.log(region_mesh[i]);
    }

}
InitGeomerty();

function updatePositions() {
    for (let x = 0; x < window.innerWidth; x++) {
        
        for (let y = 0; y < window.innerHeight; y++) {
            var TestPos = new THREE.Vector2(x, y);
            var closIndex = GetClosestSample(TestPos);
            // float CurrD = PVector.dist(TestPos,Sample[closIndex]);
            // CurrD = min(CurrD,MaxD);
            // float fraction = map(CurrD,0,MaxD,0,1);
            // color c = lerpColor(c1,c2,fraction);
            //   color c = PartitionColor[closIndex];
            //   int loc = x + y * width;
            //   pixels[loc]=c;
            PixelSeed[x][y] = closIndex;
            // console.log(PixelSeed);
        }
    }
    // LLoydStep()
    // console.log(PixelSeed);
}
// updatePositions();
function LLoydStep() {

    for (let i = 0; i < TotalNumbers; i++) {
        region_mesh[i].position.x=0;
        region_mesh[i].position.y=0;
        PartitionNum[i] = 0;
    }
    for (let x = 0; x < window.innerWidth; x++) {
        for (let y = 0; y < window.innerHeight; y++) {
            var Index = PixelSeed[x][y];
            console.log(Index)
            region_mesh[Index].position.x += x;
            region_mesh[Index].position.y += y;
            PartitionNum[Index]++;
        }
    }

    for (let i = 0; i < TotalNumbers; ++i) {
        region_mesh[i].position.x /= PartitionNum[i];
        region_mesh[i].position.y /= PartitionNum[i];
        PartitionNum[i] = 0;
    }
    // camera.lookAt(scene.position);

    camera.updateMatrixWorld();
}

function GetClosestSample(TestPos) {
    var ClosestI = -1;
    var MinD = Number.MAX_VALUE;
    for (let i = 0; i < TotalNumbers; i++) {
        var region2D = new THREE.Vector2(region_mesh[i].position.x,region_mesh[i].position.y);
        var Dist = region2D.distanceTo(TestPos);
        console.log(Dist);
        if (Dist < MinD) {
            MinD = Dist;
            ClosestI = i;
        }
        // console.log(MinD);
    }
    //   assert(ClosestI >= 0);
    //   assert(ClosestI <= Sample.length);
        console.log(ClosestI)
        return (ClosestI);

}

function update_geo_position() {
    // reset_centroids();
    for (var i = 0; i < TotalNumbers; ++i) {
        region_mesh[i].position.x = (window.innerWidth / target_width) * (centroids[2 * i] - 0.5 * target_width + 0.5);
        region_mesh[i].position.y = (window.innerHeight / target_height) * (centroids[2 * i + 1] - 0.5 * target_height + 0.5);
    }
    // reset_region_colors();
    reset_centroids();
}

function resetScene() {
    while (document.body.firstChild) { document.body.removeChild(document.body.firstChild); }
    renderer.dispose();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function render_to_target() {
    renderer.render(scene, target_camera, rtt_target, true);

    var gl = renderer.getContext();
    gl.bindFramebuffer(gl.FRAMEBUFFER, rtt_target.__webglFramebuffer);
    gl.readPixels(0, 0, target_width, target_height, gl.RGBA, gl.UNSIGNED_BYTE, rtt_pixels);

    for (var y = 0; y < target_height; ++y) {
        for (var x = 0; x < target_width; ++x) {
            var index = rtt_pixels[2 + 4 * (x + target_width * y)]
                + 256 * rtt_pixels[1 + 4 * (x + target_width * y)]
                + 256 * 256 * rtt_pixels[4 * (x + target_width * y)] - 1;
            console.log(index);
            if (index >= 0) {
                region_pixels[index] += 1;
            }

              px2idx[x + target_width * y] = index;
        }
    }

    for (var y = 0; y < target_height; ++y) {
        for (var x = 0; x < target_width; ++x) {
            var index = px2idx[x + target_width * y];
            
            if (index < 0) continue;
            centroids[2 * index] += x ;
            centroids[2 * index + 1] += y ;
            
        }
        console.log(centroids[2 * index] );
    }
    

    for (var i = 0; i < TotalNumbers; ++i) {

        centroids[2 * i] /= region_pixels[i];
        centroids[2 * i + 1] /= region_pixels[i];

    }
}
// render and loop
var animate = function () {

    // resetScene();
    // render_to_target()
    // InitGeomerty();
    // reset_geometry();
    // var getResultOf = GetClosestSample(new THREE.Vector2(30, 22))
    // 

    // console.log(getResultOf);
    // console.log(Sample)
    setTimeout( function() {

        requestAnimationFrame( animate );

    }, 1000 / 30 );

    // cone_geometry = new THREE.CylinderGeometry( 0, 50, 100, 16, 1, true );

    // var cone = new THREE.Mesh( cone_geometry, material );
    // scene.add( cone );
    // cone.rotation.x += 0.01;
    // cone.rotation.Y += 0.01;
    if (frames_to_render > 0 || frames_to_render === -1) {
            updatePositions();
    LLoydStep();
        // LLoydStep();
        // render_to_target();
        renderer.render(scene, camera);
        // update_geo_position();
        frames_to_render -= 1;
    }
    // requestAnimationFrame(animate); //render loop function
};
animate();

