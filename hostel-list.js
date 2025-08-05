// Import required Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, increment, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLn45hIR-S75BEPypx1BFgOV8vA5MaqU0",
  authDomain: "hostelio-89130.firebaseapp.com",
  projectId: "hostelio-89130",
  storageBucket: "hostelio-89130.appspot.com",
  messagingSenderId: "530522106867",
  appId: "1:530522106867:web:227d355ea3fcc63317c086",
  measurementId: "G-CYM1EHN5G5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to load hostels from Firestore
async function loadHostels() {
  const hostelList = document.getElementById('hostel-list');
  hostelList.innerHTML = "Loading...";

  try {
    const snapshot = await getDocs(collection(db, "hostels"));
    hostelList.innerHTML = "";

    snapshot.forEach(docSnap => {
      const hostel = docSnap.data();

      const card = document.createElement('div');
      card.className = 'hostel-card';
      card.innerHTML = `
        <img src="${hostel.imageUrl}" alt="${hostel.name}">
        <h3>${hostel.name}</h3>
        <p>Location: ${hostel.location}</p>
        <p>Available Rooms: ${hostel.availableRooms}</p>
        <p>Amenities: ${hostel.amenities.join(", ")}</p>
        <button onclick="bookNow('${docSnap.id}', '${hostel.name}')">Book Now</button>
      `;
      hostelList.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading hostels:", error);
    hostelList.innerHTML = "Failed to load hostels.";
  }
}

// Function to handle booking
window.bookNow = async function(hostelId, hostelName) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first.");
    return;
  }

  try {
    // Save booking data to Firestore
    await addDoc(collection(db, "bookings"), {
      userId: user.uid,
      hostelId,
      hostelName,
      bookingDate: new Date().toISOString()
    });

    // Decrement availableRooms
    const hostelRef = doc(db, "hostels", hostelId);
    await updateDoc(hostelRef, {
      availableRooms: increment(-1)
    });

    alert("Room booked successfully!");
    loadHostels(); // Refresh list

  } catch (e) {
    console.error("Booking failed:", e);
    alert("Booking failed. Please try again.");
  }
}

// Make sure user is logged in before loading hostels
onAuthStateChanged(auth, user => {
  if (user) {
    loadHostels();
  } else {
    alert("Please login to view and book hostels.");
    window.location.href = "login.html";
  }
});
