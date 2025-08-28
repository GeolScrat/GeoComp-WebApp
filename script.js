let lockedStrike = null;
let lockedDip = null;
let lockedJointStrike = null;
let lockedJointDip = null;
let joints = [];
let measurements = [];

function enableSensors() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    alert("Sensors enabled. You can now measure strike and dip.");
                } else {
                    alert("Permission denied. Cannot access sensors.");
                }
            })
            .catch(console.error);
    } else {
        alert("Sensor permission not required or not supported on this device.");
    }
}

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

function formatCompassDirection(angle) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                        "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(angle / 22.5) % 16;
    return directions[index];
}

function startStrikeMeasurement() {
    window.addEventListener('deviceorientation', handleStrike, true);
}

function handleStrike(event) {
    const alpha = event.alpha;
    if (alpha !== null) {
        const compassDir = formatCompassDirection(alpha);
        document.getElementById('strike').value = compassDir + " (" + Math.round(alpha) + "°)";
    }
}

function lockStrike() {
    lockedStrike = document.getElementById('strike').value;
    window.removeEventListener('deviceorientation', handleStrike, true);
}

deviceorientation', handleDip, true);
}

function handleDip(event) {
    const beta = event.beta;
    const dipAngle = Math.abs(beta);
    const compassDir = formatCompassDirection(event.alpha);
    document.getElementById('dip').value = Math.round(dipAngle) + "° " + compassDir;
}

function lockDip() {
    lockedDip = document.getElementById('dip').value;
    window.removeEventListener('deviceorientation', handleDip, true);
}

function startJointStrikeMeasurement() {
    window.addEventListener('deviceorientation', handleJointStrike, true);
}

function handleJointStrike(event) {
    const alpha = event.alpha;
    if (alpha !== null) {
        const compassDir = formatCompassDirection(alpha);
        document.getElementById('jointStrike').value = compassDir + " (" + Math.round(alpha) + "°)";
    }
}

function lockJointStrike() {
    lockedJointStrike = document.getElementById('jointStrike').value;
    window.removeEventListener('deviceorientation', handleJointStrike, true);
}

function startJointDipMeasurement() {
    window.addEventListener('deviceorientation', handleJointDip, true);
}

function handleJointDip(event) {
    const beta = event.beta;
    const dipAngle = Math.abs(beta);
    const compassDir = formatCompassDirection(event.alpha);
    document.getElementById('jointDip').value = Math.round(dipAngle) + "° " + compassDir;
}

function lockJointDip() {
    lockedJointDip = document.getElementById('jointDip').value;
    if (lockedJointStrike && lockedJointDip) {
        joints.push({ strike: lockedJointStrike, dip: lockedJointDip });
        const container = document.getElementById('jointsContainer');
        const entry = document.createElement('div');
        entry.textContent = `Strike: ${lockedJointStrike}, Dip: ${lockedJointDip}`;
        container.appendChild(entry);
    }
    window.removeEventListener('deviceorientation', handleJointDip, true);
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
    };
    measurements.push(data);
    alert("Measurement saved successfully!");
}

function viewData() {
    const table = document.getElementById('dataTable');
    table.innerHTML = "<tr><th>Latitude</th><th>Longitude</th><th>Strike</th><th>Dip</th><th>Joints</th><th>Rock Type</th><th>Remarks</th></tr>";
    measurements.forEach(m => {
        const jointText = m.joints.map(j => `(${j.strike}, ${j.dip})`).join(", ");
        const row = `<tr><td>${m.latitude}</td><td>${m.longitude}</td><td>${m.strike}</td><td>${m.dip}</td><td>${jointText}</td><td>${m.rockType}</td><td>${m.remarks}</td></tr>`;
        table.innerHTML += row;
    });
}

function plotOnMap() {
    const mapDiv = document.getElementById('map');
    mapDiv.innerHTML = "";
    const map = L.map('map').setView([7.269541, 80.581070], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);
    measurements.forEach(m => {
        if (m.latitude && m.longitude) {
            L.marker([parseFloat(m.latitude), parseFloat(m.longitude)])
                .addTo(map)
                .bindPopup(`Strike: ${m.strike}<br>Dip: ${m.dip}<br>Rock: ${m.rockType}`);
        }
    });
}
