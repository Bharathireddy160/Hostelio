// home.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCLn45hIR-S75BEPypx1BFgOV8vA5MaqU0",
  authDomain: "hostelio-89130.firebaseapp.com",
  projectId: "hostelio-89130",
  storageBucket: "hostelio-89130.appspot.com",
  messagingSenderId: "530522106867",
  appId: "1:530522106867:web:227d355ea3fcc63317c086",
  measurementId: "G-CYM1EHN5G5"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userPhoto = document.getElementById('user-photo');
const logoutBtn = document.getElementById('logout-btn');

// Protect page
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userEmail.textContent = user.email;

    // Get extra profile data from Firestore
    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        userName.textContent = data.displayName || "No name";
        userPhoto.src = data.photoURL || "default.png";
      } else {
        userName.textContent = "User";
      }
    } catch (e) {
      console.error("Error loading profile:", e);
    }
  } else {
    window.location.href = "user_login.html";
  }
});

// Sign out
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    window.location.href = "user_login.html";
  } catch (e) {
    alert("Sign out failed: " + e.message);
  }
});
