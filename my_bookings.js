import { db, auth } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export function loadMyBookings() {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const list = document.getElementById("myBookings");
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.innerHTML = `<p>🏠 ${data.hostelName} - ${data.roomType} - ${data.date}</p>`;
        list.appendChild(div);
      });
    } else {
      window.location.href = "login.html";
    }
  });
}
