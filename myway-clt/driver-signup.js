// ===============================
// 🔥 FIREBASE CONFIG
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026",
};

// Safe Init
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// ===============================
// ✅ SIGNUP BUTTON
// ===============================

document.getElementById("signupBtn").onclick = async () => {

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const year = parseInt(document.getElementById("year").value);
  const make = document.getElementById("make").value;
  const model = document.getElementById("model").value;

  // ✅ Vehicle Year Rule
  if (year < 2015) {
    alert("Vehicle must be 2015 or newer 🚫");
    return;
  }

  try {
    // ✅ Create Driver Account
    const userCred = await auth.createUserWithEmailAndPassword(email, password);

    // ✅ Save Driver Profile in Firestore
    await db.collection("drivers").doc(userCred.user.uid).set({
      name: name,
      email: email,
      vehicle: {
        year: year,
        make: make,
        model: model
      },
      createdAt: new Date()
    });

    alert("Driver Account Created Successfully ✅");

    // ✅ Redirect to Login Page
    window.location.href = "driver-login.html";

  } catch (err) {
    alert("Signup Error: " + err.message);
  }
};
