document.getElementById("requestRide").onclick = async () => {

  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;

  if (!pickup || !dropoff) {
    alert("Enter pickup + dropoff");
    return;
  }

  await db.collection("rides").add({
    pickup: pickup,
    dropoff: dropoff,
    status: "Requested",
    createdAt: new Date()
  });

  alert("Ride Requested!");

  window.location.href = "status.html";
};
