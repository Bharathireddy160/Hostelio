// Modular Firebase Auth + UI (for modern usage)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, 
         onAuthStateChanged, 
         signInWithEmailAndPassword, 
         signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLn45hIR-S75BEPypx1BFgOV8vA5MaqU0",
  authDomain: "hostelio-89130.firebaseapp.com",
  projectId: "hostelio-89130",
  storageBucket: "hostelio-89130.appspot.com",
  messagingSenderId: "530522106867",
  appId: "1:530522106867:web:227d355ea3fcc63317c086"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Protect page: redirect to login if not authenticated
export function requireAuth() {
  onAuthStateChanged(auth, user => {
    if (!user) window.location.href = "login.html";
  });
}

// Logout
export function setupLogoutButton(selector) {
  const btn = document.querySelector(selector);
  if (btn) {
    btn.addEventListener("click", () => signOut(auth));
  }
}
