// 🔥 Firebase Config
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

// Pricing
const baseFare = 3.00;
const perMileRate = 1.75;

// Elements
const receiptBox = document.getElementById("receiptBox");
const tipMessage = document.getElementById("tipMessage");

let latestRideId = null;

// ✅ Load Latest Completed Ride
async function loadReceipt() {

  const snapshot = await db.collection("rides")
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (snapshot.empty) {
    receiptBox.innerHTML = "No rides found 🚫";
    return;
  }

  const doc = snapshot.docs[0];
  latestRideId = doc.id;
  const ride = doc.data();

  // Distance fallback
  let miles = ride.distanceMiles || 0;

  if (ride.distanceMeters) {
    miles = ride.distanceMeters / 1609.344;
  }

  // Total Fare
  const totalFare = baseFare + (miles * perMileRate);

  receiptBox.innerHTML = `
    <strong>Pickup:</strong> ${ride.pickup}<br/>
    <strong>Dropoff:</strong> ${ride.dropoff}<br/>
    <strong>Status:</strong> ✅ ${ride.status}<br/><br/>

    <strong>Total Paid:</strong> 💳 $${totalFare.toFixed(2)}
  `;
}

loadReceipt();


// ⭐ Rating Buttons Save
document.querySelectorAll(".star").forEach(btn => {
  btn.onclick = async () => {
    if (!latestRideId) return;

    const rating = btn.innerText;

    await db.collection("rides").doc(latestRideId).update({
      rating: rating
    });

    alert("Rating Saved ⭐ " + rating);
  };
});


// 💰 Tip Buttons Save
document.querySelectorAll(".tipBtn").forEach(btn => {
  btn.onclick = async () => {
    if (!latestRideId) return;

    const tip = btn.dataset.tip;

    await db.collection("rides").doc(latestRideId).update({
      tip: tip
    });

    tipMessage.innerText = `Thanks for tipping $${tip} 🙌`;
  };
});


