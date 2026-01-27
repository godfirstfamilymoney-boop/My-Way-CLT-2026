// ===============================
// 🔥 FIREBASE CONFIG
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026",
};

// ✅ Safe Firebase Init
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// ✅ Firebase Auth
const auth = firebase.auth();

// ===============================
// ✅ LOGIN BUTTON CLICK
// ===============================

document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // ✅ Driver Sign In
    await auth.signInWithEmailAndPassword(email, password);

    // ✅ Success Popup
    alert("Login successful!");

    // ✅ Redirect to Driver Dashboard
    window.location.href = "driver.html";

  } catch (err) {
    alert("Login Error: " + err.message);
  }
};
