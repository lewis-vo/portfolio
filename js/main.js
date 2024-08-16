import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import { SAOPass } from 'three/addons/postprocessing/SAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

THREE.ColorManagement.legacyMode = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer(
  { alpha: true,
  antialias: true }
);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const loader = new GLTFLoader();

const rgbeLoader = new RGBELoader();
rgbeLoader.load('../assets/3d/textures/environment.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = texture;

    // Optional: Convert to equirectangular format
});

function zoomToObject(camera, object, desiredDistance) {
  // Calculate object's bounding box
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());   


  // Calculate camera position
  const distance = Math.max(size.x, size.y, size.z) * desiredDistance;
  const direction = new THREE.Vector3().subVectors(camera.position, center).normalize();
  camera.position.copy(center).add(direction.multiplyScalar(distance));

  // Look at the object
  camera.lookAt(center);
}
let tamagotchi;
await loader.load( '../assets/3d/tamagotchi.glb', function ( gltf ) {
  tamagotchi = gltf.scene;
	scene.add( gltf.scene );
  zoomToObject(camera, tamagotchi, 1.5);
}, undefined, function ( error ) {
} );


const composer = new EffectComposer(renderer);

// Add passes
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

composer.addPass(new ShaderPass(GammaCorrectionShader));

function animate() {
  tamagotchi.rotation.x = 1;
  tamagotchi.rotation.z = 1;
  tamagotchi.rotation.y += 0.007;
  composer.render();
}
console.log(GammaCorrectionShader);

renderer.setAnimationLoop( animate );