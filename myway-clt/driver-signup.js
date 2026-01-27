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

// Safe Init
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();


// ===============================
// 🎛 ELEMENTS
// ===============================

const driverName = document.getElementById("driverName");

const vehicleYear = document.getElementById("vehicleYear");
const vehicleMake = document.getElementById("vehicleMake");
const vehicleModel = document.getElementById("vehicleModel");

const email = document.getElementById("email");
const password = document.getElementById("password");

const signupBtn = document.getElementById("signupBtn");
const message = document.getElementById("message");


// ===============================
// ✅ DRIVER SIGNUP BUTTON
// ===============================

signupBtn.onclick = async () => {
  message.innerHTML = "";

  // -----------------------------
  // ✅ Validation Checks
  // -----------------------------

  if (!driverName.value) {
    message.innerHTML = "⚠️ Please enter your full name.";
    return;
  }

  if (!vehicleYear.value || !vehicleMake.value || !vehicleModel.value) {
    message.innerHTML = "⚠️ Please enter complete vehicle details.";
    return;
  }

  // 🚗 Vehicle Year Rule (2015+ ONLY)
  if (Number(vehicleYear.value) < 2015) {
    message.innerHTML =
      "❌ Vehicle must be 2015 or newer to drive with MyWay CLT.";
    return;
  }

  if (!email.value || !password.value) {
    message.innerHTML = "⚠️ Please enter email and password.";
    return;
  }

  // -----------------------------
  // ✅ Create Driver Account
  // -----------------------------

  try {
    // 1. Create Firebase Auth Account
    const userCredential = await auth.createUserWithEmailAndPassword(
      email.value,
      password.value
    );

    const user = userCredential.user;

    // 2. Save Driver Profile in Firestore
    await db.collection("drivers").doc(user.uid).set({
      name: driverName.value,

      vehicleYear: Number(vehicleYear.value),
      vehicleMake: vehicleMake.value,
      vehicleModel: vehicleModel.value,

      email: email.value,

      role: "driver",
      approved: true,

      createdAt: new Date()
    });

    message.innerHTML = "✅ Driver Account Created! Redirecting...";

    // 3. Redirect to Driver Dashboard
    setTimeout(() => {
      window.location.href = "driver.html";
    }, 1500);

  } catch (error) {
    message.innerHTML = "❌ " + error.message;
  }
};

