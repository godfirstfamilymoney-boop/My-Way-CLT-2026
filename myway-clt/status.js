// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026",
  storageBucket: "my-way-clt-2026.firebasestorage.app",
  messagingSenderId: "787144518837",
  appId: "1:787144518837:web:53f10cf593b7296c8622fc"
};

// Initialize Firebase (prevent double init)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// Elements
const rideInfoDiv = document.getElementById("rideInfo");
const dots = document.querySelectorAll(".dot");

// ✅ Update dots based on status
function updateDots(status) {
  dots.forEach(dot => dot.classList.remove("active"));

  if (status === "Requested") {
    dots[0].classList.add("active");
  }

  if (status === "Driver Assigned") {
    dots[2].classList.add("active");
  }

  if (status === "Completed") {
    dots[3].classList.add("active");
  }
}


// 🔥 LIVE Ride Listener (Realtime Updates)
function listenToLatestRide() {
  db.collection("rides")
    .orderBy("createdAt", "desc")
    .limit(1)
    .onSnapshot(snapshot => {

      if (snapshot.empty) {
        rideInfoDiv.innerHTML = "No rides yet 🚫";
        return;
      }

      const ride = snapshot.docs[0].data();

      rideInfoDiv.innerHTML = `
        <strong>Pickup:</strong> ${ride.pickup}<br/>
        <strong>Dropoff:</strong> ${ride.dropoff}<br/>
        <strong>Status:</strong> ${ride.status}
      `;

      updateDots(ride.status);
    });
}

// Run live listener
listenToLatestRide();