import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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
const storage = getStorage(app);

const table = document.getElementById("hostels-table");

async function loadHostels() {
  const snapshot = await getDocs(collection(db, "hostels"));
  table.innerHTML = ""; // clear
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td contenteditable="true">${data.name || "—"}</td>
      <td contenteditable="true">${data.location || "—"}</td>
      <td contenteditable="true">${data.price || "—"}</td>
      <td>${data.imageURL ? `<img src="${data.imageURL}" style="width:50px;height:50px;border-radius:6px">` : "—"}
          <input type="file" accept="image/*" style="display:none">
          <button class="upload-btn">Upload</button>
      </td>
      <td>
        <button class="save">Save</button>
        <button class="delete">Delete</button>
      </td>
    `;

    const fileInput = tr.querySelector('input[type="file"]');
    const uploadBtn = tr.querySelector('.upload-btn');
    uploadBtn.onclick = () => fileInput.click();

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const storageRef = ref(storage, `hostels/${docSnap.id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "hostels", docSnap.id), { imageURL: url });
      alert("✅ Image uploaded");
      loadHostels(); // refresh
    };

    tr.querySelector('.save').onclick = async () => {
      const [name, location, price] = tr.querySelectorAll('td');
      await updateDoc(doc(db, "hostels", docSnap.id), {
        name: name.textContent,
        location: location.textContent,
        price: price.textContent
      });
      alert("✅ Hostel updated");
    };

    tr.querySelector('.delete').onclick = async () => {
      if (confirm("Delete this hostel?")) {
        await deleteDoc(doc(db, "hostels", docSnap.id));
        alert("✅ Hostel deleted");
        loadHostels();
      }
    };

    table.appendChild(tr);
  });
}

loadHostels().catch(console.error);
