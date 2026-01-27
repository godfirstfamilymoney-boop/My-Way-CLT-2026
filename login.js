// ===============================
// 🔥 FIREBASE CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026"
};

// Safe Init
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

const msg = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

loginBtn.onclick = async () => {
  msg.innerHTML = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    await auth.signInWithEmailAndPassword(email, password);

    msg.innerHTML = "✅ Logged in! Redirecting...";

    // ✅ Drivers go to driver dashboard
    setTimeout(() => {
      window.location.href = "driver.html";
    }, 800);

  } catch (err) {
    msg.innerHTML = "❌ " + err.message;
  }
};
