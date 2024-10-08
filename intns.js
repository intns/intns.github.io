const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

const cubeList = [];

for (let y = -5; y < 5; y++) {
    for (let i = -5; i < 5; i++) {
        for (let x = -10; x < 10; x++) {
            const cube = new THREE.Mesh(geometry, material);
            cube.position.x = x * y;
            cube.position.y = x * i;
            cube.position.z = -25 + (-i * 2);
            cube.castShadow = true;
            cube.receiveShadow = true;
            cubeList.push(cube);
            scene.add(cube);
        }
    }
}

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
pointLight.castShadow = true;
scene.add(pointLight);

camera.position.z = 10;
camera.rotation.x = -0.25;

let timer = 0;
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (!isMobile) {
    document.getElementById('controls').style.display = 'block';
}

const keysPressed = new Set();
let verticalRotation = 0;

function animate() {
    requestAnimationFrame(animate);

    for (let i = 0; i < cubeList.length; i++) {
        cubeList[i].rotation.x = timer * 0.5;
        cubeList[i].rotation.y = timer * 0.5;
    }

    timer += 0.01;

    if (isMobile) {
        camera.position.x = Math.sin(timer * 2) * 10;
        camera.position.y = 10 + Math.sin(timer * 2) * 10;
        camera.lookAt(0, 0, 0);
    } else {
        const speed = 0.1;
        const direction = new THREE.Vector3();

        if (keysPressed.has('w')) {
            direction.z -= speed;
        }
        if (keysPressed.has('s')) {
            direction.z += speed;
        }
        if (keysPressed.has('a')) {
            direction.x -= speed;
        }
        if (keysPressed.has('d')) {
            direction.x += speed;
        }

        direction.applyQuaternion(camera.quaternion);
        camera.position.add(direction);
    }

    pointLight.position.copy(camera.position);

    renderer.render(scene, camera);
}

animate();

document.addEventListener('keydown', (event) => {
    keysPressed.add(event.key.toLowerCase());
});

document.addEventListener('keyup', (event) => {
    keysPressed.delete(event.key.toLowerCase());
});

document.addEventListener('mousemove', (event) => {
    if (!isMobile) {
        const sensitivity = 0.001;
        camera.rotation.y -= event.movementX * sensitivity;
        verticalRotation -= event.movementY * sensitivity;
        verticalRotation = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, verticalRotation));
        camera.rotation.x = verticalRotation;
    }
});