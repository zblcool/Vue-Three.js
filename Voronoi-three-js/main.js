// import { MathUtils } from "https://threejs.org/build/three.js";

var TotalSamples = 100;
var Sample;
var Radius;
var TotalNumbers = 100;
var region_mesh;

var scene;
var camera;
var renderer;
var light;

var color;
var material;
var materials;

function render() {
    // init scene and camera
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);

    // init renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    camera.position.z = 1000;

    cone_geometry = new THREE.CylinderGeometry(1, 200, 100, 16, 1, true);

    region_mesh = new Array(TotalNumbers);
    materials = new Array(TotalNumbers);


    // GUI

    // light
    color = 0xffffff;
    const intensity = 1;
    light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    // scene.add(light);

}
render();

const SampleRandomPosition = function (NumSamples) {
    Sample = new Array(NumSamples);
    Radius = new Array(NumSamples);

    for (let i = 0; i < TotalNumbers; i++) {
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
    for (let i = 0; i < TotalNumbers; i++) {
        materials[i] = new THREE.MeshBasicMaterial();
        materials[i].color.setRGB(Math.random(),Math.random(),Math.random());
        // console.log(Math.trunc( Math.random()*255));
        // console.log(materials[i]);
    }

    for (let i = 0; i < TotalNumbers; i++) {
        region_mesh[i] = new THREE.Mesh(cone_geometry, materials[i]);
   
        var p1 = new THREE.Vector2(Math.random() * innerWidth, Math.random() * innerHeight);
        console.log(p1);
        console.log(window.innerWidth)
        console.log(window.innerHeight)
        region_mesh[i].position.x = p1.x;
        region_mesh[i].position.y = p1.y;
        region_mesh[i].rotation.x = Math.PI / 2;
        console.log(region_mesh[i]);
        scene.add(region_mesh[i]);
    }
}
InitGeomerty();



function reset_geometry() {
    // reset_centroids();
    for (var i = 0; i < TotalNumbers; ++i) {
        region_mesh[i].position.x = window.innerWidth * (Math.random() - 0.5);
        region_mesh[i].position.y = window.innerHeight * (Math.random() - 0.5);
    }
    // reset_region_colors();
}

function resetScene() {
    while (document.body.firstChild) { document.body.removeChild(document.body.firstChild); }
    renderer.dispose
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}
// render and loop
const animate = function () {
    // requestAnimationFrame(animate); //render loop function
    resetScene();
    // InitGeomerty();
    reset_geometry();
    // console.log(Sample)


    // cone_geometry = new THREE.CylinderGeometry( 0, 50, 100, 16, 1, true );

    // const cone = new THREE.Mesh( cone_geometry, material );
    // scene.add( cone );
    // cone.rotation.x += 0.01;
    // cone.rotation.Y += 0.01;



    renderer.render(scene, camera);

};
animate();

