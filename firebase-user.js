import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  increment
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase-config.js";

// =====================
// KOMENTAR
// =====================
const commentList = document.getElementById("comment-list");
const submitBtn = document.getElementById("submit-comment");

async function loadComments() {
  const q = query(collection(db, "comments"), orderBy("time", "desc"));
  const snapshot = await getDocs(q);

  commentList.innerHTML = "";
  snapshot.forEach(doc => {
    const c = doc.data();
    const div = document.createElement("div");
    div.className = "comment-item";
    div.innerHTML = `
      <p><strong>${c.name || "Anonim"}</strong></p>
      <p>${c.text}</p>
      <small>${new Date(c.time?.seconds * 1000).toLocaleString()}</small>
    `;
    commentList.appendChild(div);
  });
}

submitBtn.addEventListener("click", async () => {
  const name = document.getElementById("comment-name").value;
  const text = document.getElementById("comment-body").value;

  if (!text.trim()) return alert("Komentar tidak boleh kosong.");

  await addDoc(collection(db, "comments"), {
    name: name || "Anonim",
    text,
    time: serverTimestamp()
  });

  document.getElementById("comment-body").value = "";
  loadComments();
});

loadComments();


// =====================
// LIKE BUTTON
// =====================
document.querySelectorAll(".like").forEach(btn => {
  btn.addEventListener("click", async () => {
    const id = btn.dataset.id;

    const ref = doc(db, "likes", id);

    await updateDoc(ref, { count: increment(1) }).catch(async () => {
      // Jika belum ada, buat baru
      await setDoc(ref, { count: 1 });
    });

    // Update tampilan
    const span = btn.querySelector("span");
    span.textContent = Number(span.textContent) + 1;
  });
});


// =====================
// SHARE BUTTON
// =====================
document.querySelectorAll(".share").forEach(link => {
  link.addEventListener("click", () => {
    const title = link.dataset.title;
    navigator.share
      ? navigator.share({ title, text: title, url: location.href })
      : alert("Browser ini tidak mendukung share otomatis.");
  });
});
