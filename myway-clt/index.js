// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Button Click
document.getElementById("requestRide").onclick = async () => {
  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;

  if (!pickup || !dropoff) {
    alert("Enter pickup + dropoff");
    return;
  }

  // Create Ride in Firestore
  const rideRef = await db.collection("rides").add({
    pickup,
    dropoff,
    status: "Pending",
    createdAt: new Date(),
  });

  // Save rideId
  localStorage.setItem("rideId", rideRef.id);

  // Go to Status Page
  window.location.href = "status.html";
};