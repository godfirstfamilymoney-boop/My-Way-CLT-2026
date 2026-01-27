// ===============================
// 🔥 FIREBASE CONFIG
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026",
};

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

      etaBox.innerHTML = "ETA ready once ride is completed ✅";

      acceptBtn.style.display = "block";
      completeBtn.style.display = "none";
    });
}

listenForRide();


// ===============================
// ✅ ACCEPT RIDE BUTTON
// ===============================

acceptBtn.onclick = async () => {
  if (!latestRideId) return alert("No ride loaded yet!");

  await db.collection("rides").doc(latestRideId).update({
    status: "Driver Assigned"
  });

  alert("Ride Accepted 🚘✅");

  acceptBtn.style.display = "none";
  completeBtn.style.display = "block";
};


// ===============================
// 🏁 COMPLETE RIDE BUTTON (REAL MAPBOX)
// ===============================

completeBtn.onclick = async () => {

  // 1. Get latest ride
  const snap = await db
    .collection("rides")
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (snap.empty) {
    alert("No ride found.");
    return;
  }

  const rideDoc = snap.docs[0];
  const rideId = rideDoc.id;
  const ride = rideDoc.data();

  const pickup = ride.pickup;
  const dropoff = ride.dropoff;


  // ===============================
  // 🌍 MAPBOX TOKEN (PASTE YOUR REAL KEY HERE)
  // ===============================

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoibXl3YXkyMDI2IiwiYSI6ImNta3VwbDFsMTI0OWUzZXE0bGY4NW9uZGQifQ.nCwzxbXrZDsPkxEoEccu6A";


  // ===============================
  // 📍 ADDRESS → COORDINATES
  // ===============================

  async function geocode(address) {
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
      encodeURIComponent(address) +
      `.json?access_token=${MAPBOX_TOKEN}`;

    const res = await fetch(url);
    const data = await res.json();

    return data.features[0].center;
  }

  const pickupCoords = await geocode(pickup);
  const dropoffCoords = await geocode(dropoff);


  // ===============================
  // 🚗 REAL DISTANCE + TIME
  // ===============================

  const directionsUrl =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${pickupCoords[0]},${pickupCoords[1]};` +
    `${dropoffCoords[0]},${dropoffCoords[1]}` +
    `?overview=false&access_token=${MAPBOX_TOKEN}`;

  const dirRes = await fetch(directionsUrl);
  const dirData = await dirRes.json();

  const route = dirData.routes[0];

  // Miles + Minutes
  const miles = (route.distance / 1609.34).toFixed(1);
  const minutes = Math.ceil(route.duration / 60);


  // ===============================
  // 💰 LYFT-STYLE PRICING
  // ===============================

  const baseFare = 3;
  const perMile = 2;
  const perMinute = 0.35;

  const fare =
    baseFare +
    miles * perMile +
    minutes * perMinute;

  const finalFare = fare.toFixed(2);


  // ===============================
  // ✅ SAVE TO FIRESTORE
  // ===============================

  await db.collection("rides").doc(rideId).update({
    status: "Completed",
    miles: miles,
    minutes: minutes,
    fare: finalFare
  });

  alert(`Ride Completed 🏁 Total Fare: $${finalFare}`);

  // Go to receipt
  window.location.href = "receipt.html";
};

