// firebase-user.js
// ===================================================================
// IMPORT FIREBASE MODULES
// ===================================================================
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase-config.js";

// ===================================================================
// 1. LOGIN ADMIN
// ===================================================================
export async function adminSignIn(email, password) {
  const auth = getAuth();
  return await signInWithEmailAndPassword(auth, email, password);
}

// ===================================================================
// 2. LOGOUT ADMIN
// ===================================================================
export async function adminSignOut() {
  const auth = getAuth();
  return await signOut(auth);
}

// ===================================================================
// 3. BUAT CERPEN
// ===================================================================
export async function createCerpen(data) {
  return await addDoc(collection(db, "cerpen"), {
    title: data.title,
    body: data.body,
    created_at: serverTimestamp()
  });
}

// ===================================================================
// 4. LIST CERPEN
// ===================================================================
export async function listCerpen(max = 50) {
  const q = query(
    collection(db, "cerpen"),
    orderBy("created_at", "desc"),
    limit(max)
  );

  const snap = await getDocs(q);

  const hasil = [];
  snap.forEach((docu) => {
    hasil.push({
      id: docu.id,
      ...docu.data()
    });
  });

  return hasil;
}

// ===================================================================
// 5. HAPUS CERPEN
// ===================================================================
export async function deleteCerpen(id) {
  return await deleteDoc(doc(db, "cerpen", id));
}
