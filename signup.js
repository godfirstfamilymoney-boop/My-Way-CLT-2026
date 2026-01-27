// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD88ZxhCOxPs1IFzITYAGO0gpIyp4tLzr8",
  authDomain: "my-way-clt-2026.firebaseapp.com",
  projectId: "my-way-clt-2026",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Button
document.getElementById("signupBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Create Account
    const userCred = await auth.createUserWithEmailAndPassword(email, password);

    // Save Role in Firestore
    await db.collection("users").doc(userCred.user.uid).set({
      email: email,
      role: "passenger",
      createdAt: new Date()
    });

    alert("Passenger account created!");

    // Redirect Passenger
    window.location.href = "index.html";

  } catch (err) {
    alert("Error: " + err.message);
  }
};
