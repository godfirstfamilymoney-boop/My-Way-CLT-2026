// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026",
};

// ✅ Safe Init
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// ✅ Login Button Click
document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Sign In Driver
    const userCred = await auth.signInWithEmailAndPassword(email, password);

    // Check Firestore Role
    const uid = userCred.user.uid;
    const doc = await db.collection("users").doc(uid).get();

    if (!doc.exists || doc.data().role !== "driver") {
      alert("❌ Not a driver account!");
      auth.signOut();
      return;
    }

    alert("✅ Driver Login Successful!");

    // Redirect to Driver Dashboard
    window.location.href = "driver.html";

  } catch (err) {
    alert("Error: " + err.message);
  }
};
