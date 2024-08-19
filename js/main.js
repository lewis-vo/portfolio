import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 80, 600/700, 0.1, 1000 );
camera.position.set(0, 0.24, 0.44);
if (page!=="about") camera.rotation.z = -0.1;

const pointLight = new THREE.PointLight(0xffffff, 1, 0);
pointLight.position.set(0.3, 0.2, -0.5);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.05, 0xff0000);
//scene.add(pointLightHelper);


const pointLight2 = new THREE.PointLight(0xfffce3, 0.2, -0.01);
pointLight2.position.set(-0.23, 0.3, 0.1);
scene.add(pointLight2);

const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 0.05, 0xff0000);
//scene.add(pointLightHelper2);



const pointLight3 = new THREE.PointLight(0xffffff, 0.009, 0);
pointLight3.position.set(0, 0.2, 0.3);
scene.add(pointLight3);

const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 0.05, 0xff0000);
//scene.add(pointLightHelper3);


const renderer = new THREE.WebGLRenderer(
  { alpha: true,
  antialias: true }
);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(600, 700);
if (page==="about") {
  document.querySelector(".head-container").appendChild( renderer.domElement );
} else {
  document.body.appendChild( renderer.domElement );
}
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://lewis-vo.github.io/portfolio/assets/3d/textures/environment.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    scene.environment.intensity = 0.9;

    // Optional: Convert to equirectangular format
});

async function loadModel(path) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(path);
  return gltf.scene;
}

console.log(location.hostname);


async function mainHome() {
  //https://lewis-vo.github.io/portfolio/assets/3d/tamagotchi.glb
  const tamagotchi = await loadModel('https://lewis-vo.github.io/portfolio/assets/3d/tamagotchi.glb');
  scene.add(tamagotchi);
  
  let time = 0;
  const amplitude = 0.02; // Height of the bob
  const frequency = 0.5;

  function animate() {
    requestAnimationFrame(animate);

    tamagotchi.rotation.y += 0.005;
    
    time += 0.01;
    tamagotchi.position.y = amplitude * Math.sin(time * frequency);

    renderer.render(scene, camera);
  }
  animate();
}

async function mainPage() {
  const head = await loadModel('https://lewis-vo.github.io/portfolio/assets/3d/head.glb');
  scene.add(head);
  head.scale.set(0.2, 0.2, 0.2);
  
  let time = 0;
  const amplitude = 0.02; // Height of the bob
  const frequency = 0.5;

  function animate() {
    requestAnimationFrame(animate);

    head.rotation.y += 0.005;
    
    time += 0.01;
    head.position.y = amplitude * Math.sin(time * frequency) + 0.3;

    renderer.render(scene, camera);
  }
  animate();
}

switch (page) {
  case "home": 
    mainHome();
    break
  case "about":
    mainPage();
    break;
  default: break;
}