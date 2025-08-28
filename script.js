let lockedStrike = null;
let lockedDip = null;
let joints = [];

function getCoordinates() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            document.getElementById('latitude').value = position.coords.latitude.toFixed(6);
            document.getElementById('longitude').value = position.coords.longitude.toFixed(6);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function startStrikeMeasurement() {
    window.addEventListener('deviceorientationabsolute', handleStrike, true);
}

function handleStrike(event) {
    const alpha = event.alpha;
    if (alpha !== null) {
        const compassDir = formatCompassDirection(alpha);
        document.getElementById('strike').value = compassDir;
    }
}

function lockStrike() {
    lockedStrike = document.getElementById('strike').value;
    window.removeEventListener('deviceorientationabsolute', handleStrike, true);
}

function startDipMeasurement() {
    window.addEventListener('deviceorientation', handleDip, true);
}

function handleDip(event) {
    const beta = event.beta;
    const dipAngle = Math.abs(beta);
    const compassDir = formatCompassDirection(event.alpha);
    document.getElementById('dip').value = Math.round(dipAngle) + compassDir;
}

function lockDip() {
    lockedDip = document.getElementById('dip').value;
    window.removeEventListener('deviceorientation', handleDip, true);
}

function addJoint() {
    const jointStrike = prompt("Enter joint strike (e.g., N45E):");
    const jointDip = prompt("Enter joint dip (e.g., 34SW):");
    if (jointStrike && jointDip) {
        joints.push({ strike: jointStrike, dip: jointDip });
        const container = document.getElementById('jointsContainer');
        const entry = document.createElement('div');
        entry.textContent = `Strike: ${jointStrike}, Dip: ${jointDip}`;
        container.appendChild(entry);
    }
}

function formatCompassDirection(angle) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                        "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(angle / 22.5) % 16;
    return directions[index];
}

function saveMeasurement() {
    const data = {
        latitude: document.getElementById('latitude').value,
        longitude: document.getElementById('longitude').value,
        strike: lockedStrike,
        dip: lockedDip,
        joints: joints,
        rockType: document.getElementById('rockType').value,
        remarks: document.getElementById('remarks').value
    data);
    alert("Measurement saved successfully!");
}

function plotOnMap() {
    alert("Map plotting feature coming soon!");
}
