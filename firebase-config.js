// ===============================
// Firebase Config - Air Mata Pena
// ===============================

// Import Firebase Modular
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Konfigurasi dari Firebase Project Anda
const firebaseConfig = {
  apiKey: "AIzaSyD2-BRqOnFX6o4WDl-ZmYs3M6uuk7srYaM",
  authDomain: "tintaku-58bcf.firebaseapp.com",
  projectId: "tintaku-58bcf",
  storageBucket: "tintaku-58bcf.firebasestorage.app",
  messagingSenderId: "597580314120",
  appId: "1:597580314120:web:0a3f9ef923d3df22b183bd",
  measurementId: "G-TVFEBKGMD0"
};

// Inisialisasi Firebase App
export const app = initializeApp(firebaseConfig);

// Inisialisasi Auth
export const auth = getAuth(app);

// Inisialisasi Firestore
export const db = getFirestore(app);

console.log("Firebase berhasil di-load");
