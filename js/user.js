// Import required Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCLn45hIR-S75BEPypx1BFgOV8vA5MaqU0",
  authDomain: "hostelio-89130.firebaseapp.com",
  projectId: "hostelio-89130",
  storageBucket: "hostelio-89130.firebasestorage.app",
  messagingSenderId: "530522106867",
  appId: "1:530522106867:web:227d355ea3fcc63317c086",
  measurementId: "G-CYM1EHN5G5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Handle email/password login
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // Show welcome screen
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';
    document.getElementById('user-email').textContent = email;

    // Redirect to success page after 2 seconds
    setTimeout(() => {
      window.location.href = "success.html";
    }, 2000);

  } catch (error) {
    console.error(error.message);
    alert("Login failed: " + error.message);
  }
});

// Handle Google sign‑in
const googleButton = document.getElementById('google-signin');
googleButton.addEventListener('click', async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;

    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';
    document.getElementById('user-email').textContent = email;

    setTimeout(() => {
      window.location.href = "success.html";
    }, 2000);

  } catch (error) {
    console.error(error.message);
    alert("Google sign-in failed: " + error.message);
  }
});

// Sign‑out
const signOutButton = document.getElementById('sign-out');
signOutButton.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.reload();
  }).catch((error) => {
    console.error(error.message);
    alert("Sign out failed: " + error.message);
  });
});

// Show/hide sign‑out button depending on auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    signOutButton.style.display = 'block';
  } else {
    signOutButton.style.display = 'none';
  }
});
