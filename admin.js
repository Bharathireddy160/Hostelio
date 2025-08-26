// Import Firebase SDKs
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
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCLn45hIR-S75BEPypx1BFgOV8vA5MaqU0",
  authDomain: "hostelio-89130.firebaseapp.com",
  projectId: "hostelio-89130",
  storageBucket: "hostelio-89130.appspot.com",  // ✅ fixed bucket name
  messagingSenderId: "530522106867",
  appId: "1:530522106867:web:227d355ea3fcc63317c086",
  measurementId: "G-CYM1EHN5G5"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

//
// ---------------- AUTH SECTION ----------------
//

// Handle email/password login
const loginForm = document.getElementById("admin-login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      document.getElementById("auth-section").style.display = "none";
      document.getElementById("welcome-screen").style.display = "block";
      document.getElementById("admin-email").textContent = email;

      setTimeout(() => {
        window.location.href = "admin_success.html";
      }, 2000);
    } catch (error) {
      console.error(error.message);
      alert("Login failed: " + error.message);
    }
  });
}

// Handle Google sign-in
const googleButton = document.getElementById("google-signin");
if (googleButton) {
  googleButton.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      document.getElementById("auth-section").style.display = "none";
      document.getElementById("welcome-screen").style.display = "block";
      document.getElementById("admin-email").textContent = email;

      setTimeout(() => {
        window.location.href = "admin_success.html";
      }, 2000);
    } catch (error) {
      console.error(error.message);
      alert("Google sign-in failed: " + error.message);
    }
  });
}

// Sign-out
const signOutButton = document.getElementById("sign-out");
if (signOutButton) {
  signOutButton.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error(error.message);
        alert("Sign out failed: " + error.message);
      });
  });
}

// Show/hide sign-out button depending on auth state
onAuthStateChanged(auth, (user) => {
  if (user && signOutButton) {
    signOutButton.style.display = "block";
  } else if (signOutButton) {
    signOutButton.style.display = "none";
  }
});

//
// ---------------- ADD HOSTEL SECTION ----------------
//

const hostelForm = document.getElementById("addHostelForm");

if (hostelForm) {
  hostelForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;
    const rooms = document.getElementById("rooms").value;
    const price = document.getElementById("price").value;
    const files = document.getElementById("images").files;

    let imageURLs = [];

    try {
      // Upload multiple images
      for (let i = 0; i < files.length; i++) {
        const storageRef = ref(storage, "hostels/" + Date.now() + "-" + files[i].name);
        await uploadBytes(storageRef, files[i]);
        const url = await getDownloadURL(storageRef);
        imageURLs.push(url);
      }

      // Save hostel data in Firestore
      await addDoc(collection(db, "hostels"), {
        name,
        location,
        description,
        rooms: Number(rooms),
        price: Number(price),
        images: imageURLs,
        createdAt: new Date()
      });

      alert("✅ Hostel added successfully!");
      hostelForm.reset();
    } catch (err) {
      console.error("Error adding hostel:", err);
      alert("❌ Failed to add hostel.");
    }
  });
}
