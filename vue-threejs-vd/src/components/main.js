// import { MathUtils } from "https://threejs.org/build/three.js";

var TotalSamples = 10;
var Sample;
var Radius;
var TotalNumbers = 10;
// init scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    90, // fov 75 degree
    window.innerWidth / window.innerHeight, //aspect (width/height ratio)
    0.1, //near
    1000 // far
);

// init renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// generate primitives
//   const geometry = new THREE.BoxGeometry(1, 1, 1); //boxwidth ,boxHeight,box Depth
//   console.log();
//   const texture = new THREE.TextureLoader().load(
//    "../assets/rock-texure.jpeg"
//   );
//   const material = new THREE.MeshPhongMaterial({ map: texture });
//   const cube = new THREE.Mesh(geometry, material); // mesh object that contains the shape(geometry) and material
//   scene.add(cube);

camera.position.z = 10;


// // control
// const controls = new OrbitControls(camera, canvas);
// controls.target.set(0, 5, 0);
// controls.update();


// GUI

// light
const color = 0xffffff;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

//   const makeInstance = function (geometry, color, x) {
//     const material = new THREE.MeshPhongMaterial({ color });

//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);

//     cube.position.x = x;

//     return cube;
//   };
const SampleRandomPosition = function (NumSamples) {
    Sample = new Array(NumSamples);
    Radius = new Array(NumSamples);

    for (let i = 0; i < TotalNumbers; i++) {
        var p1 = new THREE.Vector2(THREE.MathUtils.randInt(-10,10),THREE.MathUtils.randInt(-10, 10));
        // var RandomX = THREE.MathUtils.randInt(0, window.innerWidth);
        // var RandomY = THREE.MathUtils.randInt(0, window.innerHeight);
        var currRadius = THREE.MathUtils.randInt(10, 50);
        Sample[i] = p1;
        // SampleY[i] = RandomY;
        Radius[i] = currRadius;

    }
}
SampleRandomPosition(TotalNumbers);
// render and loop
const animate = function () {
    // scene.time *= 0.001;
    // const cubes = [
    //   makeInstance(geometry, 0x44aa88, 0),
    //   makeInstance(geometry, 0x8844aa, -2),
    //   makeInstance(geometry, 0xaa8844, 2),
    // ];
    // cubes.forEach((cube, ndx) => {
    //   const speed = 1 + ndx * 0.1;
    // const rot = scene.time * speed;
    //   cube.rotation.x = rot;
    //   cube.rotation.y = rot;
    // });
    requestAnimationFrame(animate); //render loop function
    for (let i = 0; i < Sample.length; i++) {
        // const element = SampleX[i];
        // console.log(SampleX[i])
        const curve = new THREE.EllipseCurve(
            Sample[i].x, Sample[i].y,            // ax, aY
            1, 1,           // xRadius, yRadius
            0, 2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        
        // Create the final object to add to the scene
        const ellipse = new THREE.Line(geometry, material);
        
        scene.add(ellipse);
        // console.log('success')
        
        
    }
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};



animate();

