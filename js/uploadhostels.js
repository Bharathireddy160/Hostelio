// uploadHostel.js

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Firebase configuration (your values)
const firebaseConfig = {
  apiKey: "AIzaSyCLn45hIR-S75BEPypx1BFgOV8vA5MaqU0",
  authDomain: "hostelio-89130.firebaseapp.com",
  databaseURL: "https://hostelio-89130-default-rtdb.firebaseio.com",
  projectId: "hostelio-89130",
  storageBucket: "hostelio-89130.appspot.com",   // ✅ corrected bucket
  messagingSenderId: "530522106867",
  appId: "1:530522106867:web:227d355ea3fcc63317c086",
  measurementId: "G-CYM1EHN5G5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Form submit handler
document.getElementById("addHostelForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("hostelName").value.trim();
  const location = document.getElementById("location").value.trim();
  const description = document.getElementById("description").value.trim();
  const rooms = parseInt(document.getElementById("rooms").value);
  const price = parseInt(document.getElementById("price").value);
  const images = document.getElementById("hostelImages").files;

  if (!name || !location || !description || !rooms || !price) {
    alert("⚠️ Please fill in all fields.");
    return;
  }

  try {
    // Upload images to Firebase Storage
    let imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      const imageRef = ref(storage, `hostels/${Date.now()}_${images[i].name}`);
      await uploadBytes(imageRef, images[i]);
      const url = await getDownloadURL(imageRef);
      imageUrls.push(url);
    }

    // Save hostel data to Firestore
    await addDoc(collection(db, "hostels"), {
      name,
      location,
      description,
      rooms,
      price,
      images: imageUrls,
      createdAt: serverTimestamp()
    });

    alert("✅ Hostel added successfully!");
    document.getElementById("addHostelForm").reset();
  } catch (err) {
    console.error("Error adding hostel:", err);
    alert("❌ Failed to add hostel. Check console.");
  }
});
