async function loadStatus() {

  const snap = await db.collection("rides")
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (snap.empty) {
    document.getElementById("statusBox").innerHTML = "No ride found.";
    return;
  }

  const ride = snap.docs[0].data();

  document.getElementById("statusBox").innerHTML = `
    <p><b>Pickup:</b> ${ride.pickup}</p>
    <p><b>Dropoff:</b> ${ride.dropoff}</p>
    <p><b>Status:</b> ${ride.status}</p>
  `;
}

loadStatus();
