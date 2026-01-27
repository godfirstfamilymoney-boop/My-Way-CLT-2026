const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const statusBox = document.getElementById("statusBox");
const rideStatus = document.getElementById("rideStatus");

const dotRequested = document.getElementById("dotRequested");
const dotAssigned = document.getElementById("dotAssigned");
const dotComplete = document.getElementById("dotComplete");

// ✅ Listen to Latest Ride
db.collection("rides")
  .orderBy("createdAt", "desc")
  .limit(1)
  .onSnapshot((snapshot) => {
    if (snapshot.empty) return;

    const ride = snapshot.docs[0].data();

    statusBox.innerHTML = `
      <b>Pickup:</b> ${ride.pickup}<br>
      <b>Dropoff:</b> ${ride.dropoff}
    `;

    rideStatus.innerText = ride.status;

    // Reset dots
    dotRequested.style.background = "gray";
    dotAssigned.style.background = "gray";
    dotComplete.style.background = "gray";

    // Update dots
    if (ride.status === "Pending") {
      dotRequested.style.background = "lime";
    }

    if (ride.status === "Driver Assigned") {
      dotRequested.style.background = "lime";
      dotAssigned.style.background = "lime";
    }

    if (ride.status === "Completed") {
      dotRequested.style.background = "lime";
      dotAssigned.style.background = "lime";
      dotComplete.style.background = "lime";
    }
  });
