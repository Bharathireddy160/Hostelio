import { db } from '../firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const tableBody = document.querySelector("#bookingsTable tbody");

async function loadBookings() {
  try {
    const snapshot = await getDocs(collection(db, "bookings"));
    snapshot.forEach(doc => {
      const data = doc.data();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.hostelName}</td>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.roomType}</td>
        <td>${data.date}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading bookings:", error);
  }
}

loadBookings();
