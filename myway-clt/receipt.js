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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();


// ===============================
// 💰 PRICING SETTINGS
// ===============================

const baseFare = 3.00;
const perMileRate = 1.75;


// ===============================
// 📌 ELEMENT
// ===============================

const receiptBox = document.getElementById("receiptBox");


// ===============================
// 🧾 LOAD RECEIPT DATA
// ===============================

async function loadReceipt() {

  const snapshot = await db
    .collection("rides")
    .where("status", "==", "Completed")
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (snapshot.empty) {
    receiptBox.innerHTML = "No completed rides found 🚫";
    return;
  }

  const ride = snapshot.docs[0].data();

  // Distance fallback
  let miles = 0;
  if (ride.distanceMeters) {
    miles = ride.distanceMeters / 1609.344;
  }

  // Tip + Rating fallback
  const tip = ride.tip ? Number(ride.tip) : 0;
  const rating = ride.rating ? ride.rating : "Not rated";

  // Fare Calculation
  const tripFare = baseFare + (miles * perMileRate);
  const totalPaid = tripFare + tip;

  // Render Receipt
  receiptBox.innerHTML = `
    <h3>Trip Summary 🚘</h3>

    <strong>Pickup:</strong> ${ride.pickup}<br/><br/>
    <strong>Dropoff:</strong> ${ride.dropoff}<br/><br/>

    <strong>Status:</strong> ✅ ${ride.status}<br/><br/>

    <hr style="opacity:0.2; margin:15px 0;">

    <h3>Fare Breakdown 💳</h3>

    <strong>Base Fare:</strong> $${baseFare.toFixed(2)}<br/>
    <strong>Distance:</strong> ${miles.toFixed(1)} mi<br/>
    <strong>Rate:</strong> $${perMileRate.toFixed(2)} / mile<br/><br/>

    <strong>Trip Fare:</strong> $${tripFare.toFixed(2)}<br/>
    <strong>Tip Added:</strong> $${tip.toFixed(2)}<br/><br/>

    <h2>Total Paid: $${totalPaid.toFixed(2)}</h2>

    <hr style="opacity:0.2; margin:15px 0;">

    <h3>Driver Rating ⭐</h3>
    <p>${rating} / 5 Stars</p>
  `;
}

loadReceipt();
