<template>
  <div id="container">
    <!-- <img src="../assets/logo.png" alt="hi" /> -->
  </div>
</template>

<script>
import * as THREE from "three";
// import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js";
// import { GUI } from "dat.gui.module.js";
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls";

export default {
  name: "ThreeInterface",
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // const totalNumber = 1000;
      // init scene and camera
      const frustumSize = 50;
      const aspect = window.innerWidth / window.innerHeight;
      const scene = new THREE.Scene();

      const geometry = new THREE.BufferGeometry();

      const indices = [];

      const vertices = [];
      const normals = [];
      const colors = [];

      var mesh;
      var renderer;

      const size = 40;
      const segments = 40;

      const halfSize = size / 2;
      const segmentSize = size / segments;

      // const camera = new THREE.PerspectiveCamera(50, 0.5 * aspect, 1, 10000);
      // camera.position.z = 2500;
      const cameraPerspective = new THREE.PerspectiveCamera(
        50, // fov 75 degree
        (0.5 * window.innerWidth) / window.innerHeight, //aspect (width/height ratio)
        0.1, //near
        1000 // far
      );
      const cameraPerspectiveHelper = new THREE.CameraHelper(cameraPerspective);
      cameraPerspective.position.z = 2;
      scene.add(cameraPerspectiveHelper);
      // init renderer

      const cameraOrtho = new THREE.OrthographicCamera(
        (0.5 * frustumSize * aspect) / -2,
        (0.5 * frustumSize * aspect) / 2,
        frustumSize / 2,
        frustumSize / -2,
        150,
        1000
      );

      const cameraOrthoHelper = new THREE.CameraHelper(cameraOrtho);
      scene.add(cameraOrthoHelper);

      // const renderer = new THREE.WebGLRenderer({ antialias: true });
      // renderer.setSize(window.innerWidth, window.innerHeight);
      // document.body.appendChild(renderer.domElement);

      // generate primitives
      // const geometry = new THREE.BoxGeometry(1, 1, 1); //boxwidth ,boxHeight,box Depth
      // console.log();
      // const texture = new THREE.TextureLoader().load(
      //   require("../assets/rock-texure.jpeg")
      // );
      // const material = new THREE.MeshPhongMaterial({ map: texture });
      // const cube = new THREE.Mesh(geometry, material); // mesh object that contains the shape(geometry) and material
      // scene.add(cube);

      // control

      {
        // generate vertices, normals and color data for a simple grid geometry
        for (let i = 0; i <= segments; i++) {
          const y = i * segmentSize - halfSize;

          for (let j = 0; j <= segments; j++) {
            const x = j * segmentSize - halfSize;

            vertices.push(x, -y, 0);
            normals.push(0, 0, 1);

            const r = x / size + 0.5;
            const g = y / size + 0.5;

            colors.push(r, g, 1);
          }
        }

        // generate indices (data for element array buffer)

        for (let i = 0; i < segments; i++) {
          for (let j = 0; j < segments; j++) {
            const a = i * (segments + 1) + (j + 1);
            const b = i * (segments + 1) + j;
            const c = (i + 1) * (segments + 1) + j;
            const d = (i + 1) * (segments + 1) + (j + 1);

            // generate two faces (triangles) per iteration

            indices.push(a, b, d); // face one
            indices.push(b, c, d); // face two
          }
        }

        geometry.setIndex(indices);
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(vertices, 3)
        );
        geometry.setAttribute(
          "normal",
          new THREE.Float32BufferAttribute(normals, 3)
        );
        geometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(colors, 3)
        );

        const material = new THREE.MeshPhongMaterial({
          side: THREE.DoubleSide,
          vertexColors: true,
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      }

      {
        // const geometryArray = new Float32Array(totalNumber*3)
        // for (let i = 0; i < totalNumber; i++) {
        //   geometryArray[i*3]=Math.random()-0.5;
        //   geometryArray[1+i*3]=Math.random()-0.5;
        //   geometryArray[2+i*3]=0;
        // }
        // // const distanceFieldArray = new Int32Array(TotalNumber*2)
        // const colorArray = new Float32Array(totalNumber*3);
        // for (let i = 0; i < totalNumber; i++) {
        //   colorArray[i*3]=Math.random();
        //   colorArray[1+i*3]=Math.random();
        //   colorArray[2+i*3]=Math.random();
        // }
        // const geometry = new THREE.BufferGeometry();
        // geometry.setAttribute("position", new THREE.BufferAttribute( geometryArray,3));
        // geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
        // geometry.computeBoundingSphere();
        // const materialNew = new THREE.PointsMaterial({
        //   size: 20,
        //   vertexColors: THREE.VertexColors,
        //   // map:sprite,
        //   transparent: true,
        //   opacity: 1,
        //   sizeAttenuation: false,
        // });
        // let mesh = new THREE.Points(geometry, materialNew);
        // // const mesh = new THREE.Mesh(geometry, material);
        // scene.add(mesh);
      }

      // light
      const color = 0xffffff;
      const intensity = 1;
      // const light = new THREE.DirectionalLight(color, intensity);
      // light.position.set(0, 0, -4);
      const light = new THREE.AmbientLight(color,intensity);
      scene.add(light);

      //   const makeInstance = function (geometry, color, x) {
      //     const material = new THREE.MeshPhongMaterial({ color });

      //     const cube = new THREE.Mesh(geometry, material);
      //     scene.add(cube);

      //     cube.position.x = x;

      //     return cube;
      //   };

      const cameraRig = new THREE.Group();

      cameraRig.add(cameraPerspective);
      cameraRig.add(cameraOrtho);

      scene.add(cameraRig);
     
     
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
      console.log(geometry.attributes);

            const controls = new OrbitControls(
        cameraPerspective,
        renderer.domElement
      );
      controls.minDistance = 1;
      controls.maxDistance = 1000;
       controls.update();
       const pixelResult = renderer.getDrawingBufferSize();
      console.log(pixelResult);

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
        // cameraRig.lookAt(mesh.position);
        // renderer.clear();
        // camera.lookAt(mesh.position);
        // controls.update();
        // renderer.setViewport( 0, 0, window.innerWidth / 2, window.innerHeight );
        // renderer.render( scene, cameraOrtho );
        // cube.rotation.x += 0.01;
        // for (let i = 0; i < geometryArray.length / 3; i++) {
        //   geometry.attributes.position.needsUpdate = true;
        //   // geometry.attributes.color.needsUpdate = true;
        //   // geometry.attributes.position.array[i*3]+= 0.01 ;
        //   // geometry.attributes.position.array[1+i*3] += 0.01;
        //   // geometry.attributes.color.array[i*3] += 0.01;
        //   // geometryArray[2+i*3]
        // }
        // cube.rotation.y += 0.01;
        // renderer.setViewport( window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight );
        renderer.render(scene, cameraPerspective);
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
#container {
  height: 400px;
  width: 400px;
  border: 1px solid red;
}
</style>