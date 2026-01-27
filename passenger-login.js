const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const msg = document.getElementById("message");

  try {
    await auth.signInWithEmailAndPassword(email, password);

    msg.innerHTML = "✅ Logged in!";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);

  } catch (err) {
    msg.innerHTML = "❌ " + err.message;
  }
};
