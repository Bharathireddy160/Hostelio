// view_users.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Firebase config (replace if yours is different)
const firebaseConfig = {
  apiKey: "AIzaSyCLn45hIR-S75BEPypx1BFgOV8vA5MaqU0",
  authDomain: "hostelio-89130.firebaseapp.com",
  projectId: "hostelio-89130",
  storageBucket: "hostelio-89130.appspot.com",
  messagingSenderId: "530522106867",
  appId: "1:530522106867:web:227d355ea3fcc63317c086",
  measurementId: "G-CYM1EHN5G5"
};

// ✅ Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Load users
const usersTable = document.getElementById("users-table");

async function loadUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  snapshot.forEach((doc) => {
    const user = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.email || "—"}</td>
      <td>${user.displayName || "—"}</td>
      <td>${user.photoURL ? `<img src="${user.photoURL}" style="width:40px;height:40px;border-radius:50%">` : "—"}</td>
    `;
    usersTable.appendChild(row);
  });
}

loadUsers().catch(console.error);
