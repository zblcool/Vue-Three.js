<template>
  <div id="container">
    <img src="../assets/logo.png" alt="hi" />
  </div>
</template>

<script>
import * as THREE from "three.js";
// import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js";
// import { GUI } from "dat.gui.module.js";

export default {
  name: "ThreeInterface",
  mounted() {
    this.init();
  },
  methods: {
    init() {
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
      const geometry = new THREE.BoxGeometry(1, 1, 1); //boxwidth ,boxHeight,box Depth
      console.log();
      const texture = new THREE.TextureLoader().load(
        require("../assets/rock-texure.jpeg")
      );
      const material = new THREE.MeshPhongMaterial({ map: texture });
      const cube = new THREE.Mesh(geometry, material); // mesh object that contains the shape(geometry) and material
      scene.add(cube);
      

      camera.position.z = 5;

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

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      animate();
    },
  },
};
</script>

<style>
body {
  margin: 0;
}
</style>