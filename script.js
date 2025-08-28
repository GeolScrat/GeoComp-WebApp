
let lockedStrike = null;
let lockedDip = null;
let joints = [];

function getCoordinates() {
    navigator.geolocation.getCurrentPosition(function(position) {
        document.getElementById('latitude').value = position.coords.latitude.toFixed(6);
        document.getElementById('longitude').value = position.coords.longitude.toFixed(6);
    });
}

function startStrikeMeasurement() {
    window.addEventListener('deviceorientation', function(event) {
        let alpha = event.alpha;
        let compassDir = formatCompassDirection(alpha);
        document.getElementById('strike').value = compassDir;
    }, { once: true });
}

function lockStrike() {
    lockedStrike = document.getElementById('strike').value;
}

function startDipMeasurement() {
    window.addEventListener('deviceorientation', function(event) {
        let beta = event.beta;
        let gamma = event.gamma;
        let dipAngle = Math.abs(beta).toFixed(1);
        let compassDir = formatCompassDirection(event.alpha);
        document.getElementById('dip').value = dipAngle + compassDir;
    }, { once: true });
}

function lockDip() {
    lockedDip = document.getElementById('dip').value;
}

function formatCompassDirection(angle) {
    angle = angle % 360;
    if (angle < 22.5 || angle >= 337.5) return 'N';
    if (angle < 67.5) return 'NE';
    if (angle < 112.5) return 'E';
    if (angle < 157.5) return 'SE';
    if (angle < 202.5) return 'S';
    if (angle < 247.5) return 'SW';
    if (angle < 292.5) return 'W';
    return 'NW';
}

function addJoint() {
    let jointStrike = prompt("Enter Joint Strike:");
    let jointDip = prompt("Enter Joint Dip:");
    joints.push({ strike: jointStrike, dip: jointDip });
    let jointDiv = document.createElement('div');
    jointDiv.textContent = `Strike: ${jointStrike}, Dip: ${jointDip}`;
    document.getElementById('joints').appendChild(jointDiv);
}

function saveMeasurement() {
    let data = {
        latitude: document.getElementById('latitude').value,
        longitude: document.getElementById('longitude').value,
        strike: lockedStrike,
        dip: lockedDip,
        joints: joints,
        rockType: document.getElementById('rockType').value,
        remarks: document.getElementById('remarks').value
    };
    console.log("Saved Measurement:", data);
    alert("Measurement saved!");
}

function plotMap() {
    let lat = parseFloat(document.getElementById('latitude').value);
    let lon = parseFloat(document.getElementById('longitude').value);
    let map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);
    L.marker([lat, lon]).addTo(map).bindPopup("Measurement Location").openPopup();
}
