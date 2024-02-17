// Create Three.js scene
const canvas = document.querySelector('#c');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a solid sphere
const sphereGeometry = new THREE.SphereGeometry(5, 64, 64); // Increase the sphere size and segments
const sphereMaterial = new THREE.MeshPhongMaterial({ color: "blue", shininess: 50 }); // Phong material for realistic lighting
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Add directional light to simulate sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // White light
directionalLight.position.set(0, 1, 1).normalize(); // Set light direction
scene.add(directionalLight);

// Create a red dot (a small sphere) for the marker
const dotGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const dotMaterial = new THREE.MeshBasicMaterial({ color: "red" });
const dot = new THREE.Mesh(dotGeometry, dotMaterial);
scene.add(dot);

// Function to convert latitude and longitude to spherical coordinates
function latLonToSpherical(lat, lon) {
    const phi = lat * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    return { phi, theta };
}

// Function to position the dot on the sphere based on latitude and longitude
function positionDotOnSphere(lat, lon) {
    const { phi, theta } = latLonToSpherical(lat, lon);
    dot.position.x = 5 * Math.sin(phi) * Math.cos(theta);
    dot.position.y = 5 * Math.sin(phi) * Math.sin(theta);
    dot.position.z = 5 * Math.cos(phi);
}

// Function to fetch ISS position data and update dot position
function updateISSPosition() {
    fetch('/iss_position')
    .then(response => response.json())
    .then(data => {
        const lat = parseFloat(data.iss_position.latitude);
        const lon = parseFloat(data.iss_position.longitude);
        positionDotOnSphere(lat, lon);
    })
    .catch(error => console.error('Error fetching ISS position:', error));
}

// Initial position of the dot (latitude, longitude)
updateISSPosition();

camera.position.z = 10; // Increase camera distance for better visibility

function animate() {
    requestAnimationFrame(animate);
    updateISSPosition(); // Update ISS position every frame
    renderer.render(scene, camera);
} 

animate();
