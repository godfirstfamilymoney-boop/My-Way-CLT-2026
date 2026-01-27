// ===============================
// 🔥 FIREBASE CONFIG (FULL SAFE)
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026",
  storageBucket: "my-way-clt-2026.firebasestorage.app",
  messagingSenderId: "787144518837",
  appId: "1:787144518837:web:53f10cf593b7296c8622fc"
};

// ✅ Safe Init
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();


// ===============================
// 📌 ELEMENT
// ===============================

const receiptBox = document.getElementById("receiptBox");


// ===============================
// 🧾 LOAD RECEIPT
// ===============================

async function loadReceipt() {
  receiptBox.innerHTML = "Loading receipt...";

  try {
    const snap = await db
      .collection("rides")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snap.empty) {
      receiptBox.innerHTML = "No rides found 🚫";
      return;
    }

    const ride = snap.docs[0].data();

    receiptBox.innerHTML = `
      <h3>Ride Completed ✅</h3>

      <p><strong>Pickup:</strong> ${ride.pickup}</p>
      <p><strong>Dropoff:</strong> ${ride.dropoff}</p>

      <p><strong>Status:</strong> ${ride.status}</p>

      <p><strong>Miles:</strong> ${ride.miles || "N/A"}</p>
      <p><strong>Minutes:</strong> ${ride.minutes || "N/A"}</p>

      <h3>Total Paid: 💳 $${ride.fare || "12.00"}</h3>

      <p><strong>Rating:</strong> ⭐ ${ride.rating || "Not rated"}</p>
      <p><strong>Tip:</strong> 💰 $${ride.tip || "0"}</p>
    `;
  } catch (err) {
    console.error(err);
    receiptBox.innerHTML = "Receipt Error ❌ " + err.message;
  }
}

loadReceipt();
