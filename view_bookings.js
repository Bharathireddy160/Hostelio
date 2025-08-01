import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLn45hIR-S75BEPypx1BFgOV8vA5MaqU0",
  authDomain: "hostelio-89130.firebaseapp.com",
  projectId: "hostelio-89130",
  storageBucket: "hostelio-89130.appspot.com",
  messagingSenderId: "530522106867",
  appId: "1:530522106867:web:227d355ea3fcc63317c086",
  measurementId: "G-CYM1EHN5G5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const table = document.getElementById("bookings-table");

async function loadBookings() {
  const snapshot = await getDocs(collection(db, "bookings"));
  snapshot.forEach((doc) => {
    const data = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.userEmail || "—"}</td>
      <td>${data.hostelName || "—"}</td>
      <td>${data.date || "—"}</td>
    `;
    table.appendChild(row);
  });
}
loadBookings().catch(console.error);
