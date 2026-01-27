// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById("signupBtn").onclick = async () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const msg = document.getElementById("message");

  try {
    const userCred = await auth.createUserWithEmailAndPassword(email, password);

    // Save passenger profile
    await db.collection("users").doc(userCred.user.uid).set({
      name: name,
      email: email,
      role: "passenger"
    });

    msg.innerHTML = "✅ Passenger account created!";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);

  } catch (err) {
    msg.innerHTML = "❌ " + err.message;
  }
};
