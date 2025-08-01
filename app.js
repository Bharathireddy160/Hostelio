import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// ✅ DOM elements
const googleSignInBtn = document.getElementById("google-signin");
const signOutBtn = document.getElementById("sign-out");
const uploadBtn = document.getElementById("upload-btn");
const fileInput = document.getElementById("file-input");
const userEmailSpan = document.getElementById("user-email");
const profilePic = document.getElementById("profile-pic");
const userInfoDiv = document.getElementById("user-info");
const authButtonsDiv = document.getElementById("auth-buttons");

// ✅ Sign in with Google only
googleSignInBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) await saveUserToFirestore(result.user);
  } catch (error) {
    console.error("❌ Google sign-in error:", error);
    alert(error.message);
  }
});

// ✅ Sign out
signOutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("❌ Sign-out error:", error);
    alert(error.message);
  }
});

// ✅ Upload / change profile picture
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  const user = auth.currentUser;
  if (file && user) {
    try {
      const storageRef = ref(storage, `profile_pictures/${user.uid}.jpg`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      profilePic.src = url;
      console.log("✅ Profile picture updated!");
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert(error.message);
    }
  } else {
    alert("Please select a file and make sure you're signed in.");
  }
});

// ✅ Save user info
async function saveUserToFirestore(user) {
  try {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      uid: user.uid,
      createdAt: new Date()
    });
    console.log("✅ User saved to Firestore");
  } catch (error) {
    console.error("❌ Firestore save error:", error);
  }
}

// ✅ Listen to auth state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userInfoDiv.style.display = "block";
    authButtonsDiv.style.display = "none";
    userEmailSpan.textContent = user.email || user.displayName;

    try {
      const url = await getDownloadURL(ref(storage, `profile_pictures/${user.uid}.jpg`));
      profilePic.src = url;
    } catch {
      profilePic.src = ""; // fallback if no picture
    }
  } else {
    userInfoDiv.style.display = "none";
    authButtonsDiv.style.display = "block";
  }
});