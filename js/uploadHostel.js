import { db, storage } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const form = document.getElementById("addHostelForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("hostelName").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;
  const rooms = +document.getElementById("rooms").value;
  const price = +document.getElementById("price").value;
  const images = document.getElementById("hostelImages").files;

  const imageUrls = [];

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const storageRef = ref(storage, `hostel_images/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    imageUrls.push(downloadURL);
  }

  await addDoc(collection(db, "hostels"), {
    name,
    location,
    description,
    rooms,
    price,
    imageUrls,
    createdAt: serverTimestamp()
  });

  alert("Hostel added successfully!");
  form.reset();
});
