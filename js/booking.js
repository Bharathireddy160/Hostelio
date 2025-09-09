import { db, auth } from "./firebase.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export function setupBooking() {
  const form = document.getElementById("bookingForm");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first!");
      return;
    }
    const bookingData = {
      userId: user.uid,
      hostelName: document.getElementById("hostelName").textContent,
      roomType: document.getElementById("roomType").value,
      date: new Date().toISOString(),
    };
    await addDoc(collection(db, "bookings"), bookingData);
    alert("✅ Booking Successful!");
    window.location.href = "my_bookings.html";
  });
}
