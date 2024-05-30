// TODO:
// - ground plane
// - vertical grids
// - shadows
// - text labels
// - object trails
// - on resize

import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function init_renderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function init_camera() {
  const fov = 45;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 1;
  const far = 500;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(5, 5, 15);
  camera.lookAt(0, 0, 0);
  new OrbitControls(camera, renderer.domElement);
}

function init_scene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
}

function setup_scene() {
  add_cube();
  add_line();
  add_axes();
  add_grid();
  add_arrow();
  add_plane();
}

let cube;
function add_cube() {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube);
}

function add_line() {
  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}

function add_axes() {
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}

function add_grid() {
  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);
}

function add_arrow() {
  const dir = new THREE.Vector3(1, 2, 0);

  //normalize the direction vector (convert to vector of length 1)
  dir.normalize();

  const origin = new THREE.Vector3(0, 0, 0);
  const length = 4;
  const hex = 0xffff00;

  const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
  scene.add(arrowHelper);
}

function add_plane() {
  const plane = new THREE.Plane(new THREE.Vector3(1, 1, 0.2), 3);
  const helper = new THREE.PlaneHelper(plane, 1, 0xffff00);
  scene.add(helper);
}

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

function setup() {
  init_renderer();
  init_camera();
  init_scene();
  setup_scene();
}

function start() {
  if (WebGL.isWebGLAvailable()) {
    setup();
    animate();
  } else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById("container").appendChild(warning);
  }
}

// Globally available variables
let renderer, camera, scene;
start();
