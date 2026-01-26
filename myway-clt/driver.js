// ===============================
// ✅ REAL ETA + DISTANCE (MAPBOX)
// ===============================

// 🔥 Mapbox Token (YOURS)
mapboxgl = {};
const MAPBOX_TOKEN =
  "pk.eyJ1IjoibXl3YXkyMDI2IiwiYSI6ImNta3VwbDFsMTI0OWUzZXE0bGY4NW9uZGQifQ.nCwzxbXrZDsPkxEoEccu6A";


// ===============================
// 🔥 FIREBASE CONFIG
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026",
  storageBucket: "my-way-clt-2026.firebasestorage.app",
  messagingSenderId: "787144518837",
  appId: "1:787144518837:web:53f10cf593b7296c8622fc"
};

// Safe Init
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();


// ===============================
// 🎛 ELEMENTS
// ===============================

const rideBox = document.getElementById("driverRideInfo");
const etaBox = document.getElementById("etaBox");

const acceptBtn = document.getElementById("acceptRide");
const completeBtn = document.getElementById("completeRide");

completeBtn.style.display = "none";

let latestRideId = null;


// ===============================
// 📍 MAPBOX GEOCODE FUNCTION
// ===============================

async function mapboxGeocode(place) {
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
    encodeURIComponent(place) +
    `.json?access_token=${MAPBOX_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.features.length) throw new Error("Geocode failed");

  return data.features[0].center; // [lon, lat]
}


// ===============================
// 🚗 MAPBOX DIRECTIONS FUNCTION
// ===============================

async function mapboxRoute(pickupCoords, dropoffCoords) {
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${pickupCoords[0]},${pickupCoords[1]};${dropoffCoords[0]},${dropoffCoords[1]}` +
    `?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes.length) throw new Error("Route failed");

  return data.routes[0];
}


// ===============================
// 🚘 SHOW REAL ETA + DISTANCE
// ===============================

async function showETA(pickup, dropoff) {
  try {
    etaBox.innerHTML = "Calculating real ETA...";

    // Convert addresses → coordinates
    const pickupCoords = await mapboxGeocode(pickup);
    const dropoffCoords = await mapboxGeocode(dropoff);

    // Get driving route
    const route = await mapboxRoute(pickupCoords, dropoffCoords);

    // Convert meters → miles
    const miles = route.distance / 1609.344;

    // Convert seconds → minutes
    const minutes = Math.max(1, Math.round(route.duration / 60));

    etaBox.innerHTML = `
      ETA: ${minutes} min | Distance: ${miles.toFixed(1)} mi
    `;

  } catch (err) {
    console.error("ETA ERROR:", err);
    etaBox.innerHTML = "ETA unavailable ❌";
  }
}


// ===============================
// 🚘 LISTEN FOR LATEST RIDE
// ===============================

function listenForRide() {
  db.collection("rides")
    .orderBy("createdAt", "desc")
    .limit(1)
    .onSnapshot(snapshot => {

      if (snapshot.empty) {
        rideBox.innerHTML = "No ride requests 🚫";
        acceptBtn.style.display = "none";
        return;
      }

      const doc = snapshot.docs[0];
      latestRideId = doc.id;
      const ride = doc.data();

      rideBox.innerHTML = `
        <strong>Pickup:</strong> ${ride.pickup}<br/>
        <strong>Dropoff:</strong> ${ride.dropoff}<br/>
        <strong>Status:</strong> ${ride.status}
      `;

      // ✅ Real ETA + Distance
      showETA(ride.pickup, ride.dropoff);

      // Reset buttons
      acceptBtn.style.display = "block";
      completeBtn.style.display = "none";
    });
}


// ===============================
// ✅ ACCEPT RIDE BUTTON
// ===============================

acceptBtn.onclick = async () => {
  if (!latestRideId) return;

  await db.collection("rides").doc(latestRideId).update({
    status: "Driver Assigned"
  });

  alert("✅ Ride Accepted!");

  acceptBtn.style.display = "none";
  completeBtn.style.display = "block";
};


// ===============================
// 🏁 COMPLETE RIDE BUTTON
// ===============================

completeBtn.onclick = async () => {
  if (!latestRideId) return;

  await db.collection("rides").doc(latestRideId).update({
    status: "Completed"
  });

  alert("🏁 Ride Completed!");

  // Go to Receipt Page
  window.location.href = "receipt.html";
};


// ===============================
// 🚀 START DRIVER APP
// ===============================

listenForRide();