

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 600 / 700, 0.1, 1000);
let baseURL = "../";
if (location.hostname === "lewis-vo.github.io") baseURL = "https://lewis-vo.github.io/portfolio/";
camera.position.set(0, 0.22, 0.9);
camera.rotation.z = Math.PI * 0.06;

const pointLight = new THREE.PointLight(0xffffff, 1, 0);
pointLight.position.set(0.3, 0.2, -0.5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xfffce3, 0.2, -0.01);
pointLight2.position.set(-0.23, 0.3, 0.1);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffffff, 0.009, 0);
pointLight3.position.set(0, 0.2, 0.3);
scene.add(pointLight3);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(900, 1000);

document.body.appendChild(renderer.domElement);

// Load Enviromental Map
const rgbeLoader = new THREE.RGBELoader();
rgbeLoader.load(
  baseURL + "assets/3d/textures/environment.hdr",
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    scene.environment.intensity = 0.9;
  }
);

// Use async to avoid null, undefined 3d model variable
async function loadModel(path) {
  const loader = new THREE.GLTFLoader();
  const gltf = await loader.loadAsync(path);
  return gltf;
}

// Load Tamagotchi
async function mainHome() {
  let mouseX, mouseY;
  document.body.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  //https://lewis-vo.github.io/portfolio/assets/3d/tamagotchi.glb
  //https://lewis-vo.github.io/portfolio/assets/3d/tamagotchi2.glb
  const tamagotchiGLTF = await loadModel(
    baseURL + "assets/3d/tamagotchi2.glb"
  );
  const tamagotchi = tamagotchiGLTF.scene;

  const animations = tamagotchiGLTF.animations;
  const mixer = new THREE.AnimationMixer(tamagotchi);

  const clock = new THREE.Clock();

  // Loop through all available animations found in the file and play it
  animations.forEach((anim) => {
    const action = mixer.clipAction(anim);
    // Adjust the speed of the anim
    action.timeScale = 0.8;
    action.play();
  });

  scene.add(tamagotchi);

  // Use sine wave to animate the element moving up and down
  let time = 0;
  const amplitude = 0.02; // Height of the bob
  const frequency = 1;

  function animate() {
    let delta = clock.getDelta(); // Use the clock to get framerate independant result;
    time += delta;
    requestAnimationFrame(animate);

    mixer.update(delta);

    tamagotchi.rotation.x = -0.2;
    tamagotchi.rotation.z = -0.1;
    tamagotchi.rotation.y = -0.65;

    // The sine wave is cyclical so it loops perfectly
    tamagotchi.position.y = amplitude * Math.sin(time * frequency);

    renderer.render(scene, camera);
  }
  animate();
}

mainHome();
