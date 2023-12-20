// set up scene
const scene = new THREE.Scene()

// set up camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -8
camera.position.y = 10
camera.position.z = 20
camera.lookAt(scene.position)

// set up camera
const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setClearColor(0xEEEEEE, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

const webglContainer = document.getElementById('webgl-container')
webglContainer.appendChild(renderer.domElement)

// camera controls
var camControls = new THREE.OrbitControls(camera, renderer.domElement)
camControls.damping = 0.2
camControls.addEventListener('change', render)

// windows resize handler
window.addEventListener('resize', onWindowResize, false)

// TODO: get out of here
var axes = new THREE.AxesHelper(20)
scene.add(axes)

var grid = new THREE.GridHelper(80, 80);
scene.add(grid);

var color = "#ff0000"

// Add and Initialize GUI
// add GUI control elements
var guiControls = new function () {
  this.showAxes = false;
  this.showGrid = true;
  this.showPlane = true;
  this.animated = true;
}

var gui = new dat.GUI();
var guiContainer = document.getElementById('navigation');
guiContainer.appendChild(gui.domElement);
gui.add(guiControls, 'showAxes').onChange(function (e) {
  showAxes = e;
  if (showAxes) {
    scene.add(axes);
  } else {
    scene.remove(axes);
  }
  render();
});
gui.add(guiControls, 'showGrid').onChange(function (e) {
  showGrid = e;
  if (showGrid) {
    scene.add(grid);
  } else {
    scene.remove(grid);
  }
  render();
});
gui.add(guiControls, 'showPlane').onChange(function (e) {
  showPlane = e;
  if (showPlane) {
    scene.add(plane);
  } else {
    scene.remove(plane);
  }
  render();
});


// add models to szene
const loader = new THREE.GLTFLoader()

loader.load('../models/table/table.glb', function (gltf) {
      const wolfscene = gltf.scene
      console.log(wolfscene.children)
      wolfscene.scale.set(1, 1, 1)
      scene.add(wolfscene)
      control.attach(wolfscene);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    },
    function (error) {
      console.error(error)
    }
)

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(80, 80, 10, 10)
var planeMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff
})
var plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -0.5 * Math.PI
plane.position.x = 0
plane.position.y = -0.05
plane.position.z = 0
scene.add(plane)

// add spotlight
var spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-80, 70, 90)
scene.add(spotLight)

// add headlight
var headLight = new THREE.PointLight(0x888888, 1.0)
headLight.position.set(camera.position.x, camera.position.y, camera.position.z)
scene.add(headLight)

control = new THREE.TransformControls(camera, renderer.domElement);
control.addEventListener('change', render);
scene.add(control);

window.addEventListener('keydown', function (event) {
  switch (event.keyCode) {
    case 87: // W
      control.setSpace(control.space == "local" ? "world" : "local");
      break;
    case 84: // T
      control.setMode("translate");
      break;
    case 82: // R
      control.setMode("rotate");
      break;
    case 83: // S
      control.setMode("scale");
      break;
    case 187:
    case 107: // +,=,num+
      control.setSize(control.size + 0.1);
      break;
    case 189:
    case 10: // -,_,num-
      control.setSize(Math.max(control.size - 0.1, 0.1));
      break;
  }
});

// render animation
if (WebGL.isWebGLAvailable()) {
  initAnim(true)
  animate()
} else {
  const warning = WebGL.getWebGLErrorMessage()
  document.getElementById('container').appendChild(warning)
}

// init and call render function
function render() {
  headLight.position.set(camera.position.x, camera.position.y, camera.position.z)
  control.updateMatrixWorld(); // UPDATE THE CONTROL
  obj = scene.getObjectById(163) // GET THE OBJECT
  if (typeof obj != 'undefined') {
    obj.material.color.r = parseInt(color.substr(1, 2), 16)
    obj.material.color.g = parseInt(color.substr(3, 2), 16)
    obj.material.color.b = parseInt(color.substr(5, 2), 16)
  }

  renderer.render(scene, camera)
}

function loadModelIn(url, onLoad, onProgress, onError) {
  const loader = new GLTFLoader()

  loader.load(url, onLoad, onProgress, onError)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

function initAnim(value) {
  if (value) {
    gui.add(guiControls, 'animated').onChange(function (e) {
      animated = e;
      if (animated) animate();
    });
  }
}

// animate function
function animate() {
  if (guiControls.animated) {
    // DO ANIMATING 3D ELEMENTS

    // request re-rendering
    requestAnimationFrame(animate);
  }
  render();
}


// shadow cast on plane
function initShadow(value) {
  // SET receiveShadow AND castShadow FLAGS OF 3D ELEMENTS WITH SHADOW
  plane.receiveShadow = value;
  spotLight.castShadow = value;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  renderer.shadowMap.enabled = value;
  if (value) {
    gui.add(spotControls, 'withShadow').onChange(function (e) {
      withShadow = e;
      setShadow(withShadow);
    });
  }
}

function setShadow(value) {
  if (value) {
    renderer.shadowMap.autoUpdate = true;
  } else {
    renderer.shadowMap.autoUpdate = false;
    renderer.clearTarget(spotLight.shadow.map);
  }
  render();
}

function changeColor(event) {
  color = event.target.value
  render()
}