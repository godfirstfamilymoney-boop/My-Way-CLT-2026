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

// Safe init
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// Elements
const completeBox = document.getElementById("completeInfo");
const tipMessage = document.getElementById("tipMessage");

let latestRideId = null;

// ===============================
// 🏁 LOAD COMPLETED RIDE
// ===============================

async function loadRideSummary() {
  const snapshot = await db
    .collection("rides")
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (snapshot.empty) {
    completeBox.innerHTML = "No rides found 🚫";
    return;
  }

  const doc = snapshot.docs[0];
  latestRideId = doc.id;

  const ride = doc.data();

  completeBox.innerHTML = `
    <strong>Pickup:</strong> ${ride.pickup}<br/>
    <strong>Dropoff:</strong> ${ride.dropoff}<br/>
    <strong>Status:</strong> ✅ ${ride.status}
  `;
}

loadRideSummary();

// ===============================
// ⭐ RATING BUTTONS
// ===============================

document.querySelectorAll(".star").forEach(btn => {
  btn.onclick = async () => {
    if (!latestRideId) return;

    const rating = btn.innerText;

    await db.collection("rides").doc(latestRideId).update({
      rating: rating
    });

    alert("Thanks for rating ⭐ " + rating);
  };
});

// ===============================
// 💰 TIP BUTTONS
// ===============================

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
