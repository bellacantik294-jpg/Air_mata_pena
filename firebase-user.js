<script type="module">
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

// ============ LOGIN ============
export function adminSignIn(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}
export function adminSignOut() {
  return auth.signOut();
}

// ============ UPLOAD COVER ============
export async function uploadCover(file) {
  const filename = "cover_" + Date.now() + "_" + file.name;
  const ref = storage.ref("covers/" + filename);
  await ref.put(file);
  return await ref.getDownloadURL();
}

// ============ SIMPAN CERPEN ============
export async function createCerpen(judul, isi, kategori, coverUrl) {
  const data = {
    judul,
    isi,
    kategori,
    cover: coverUrl || "",
    tanggal: new Date().toISOString(),
    like: 0,
  };
  await db.collection("cerpen").add(data);
}

// ============ LIST CERPEN ============
export async function listCerpen() {
  const snap = await db.collection("cerpen").orderBy("tanggal","desc").get();
  let hasil = [];
  snap.forEach(doc => hasil.push({ id:doc.id, ...doc.data() }));
  return hasil;
}

// ============ HAPUS CERPEN ============
export async function deleteCerpen(id) {
  await db.collection("cerpen").doc(id).delete();
}
</script>


<!-- ================= ADMIN.HTML (FIXED LOGIN + SINKRON) ================= -->
<!-- Tempelkan bagian ini memperbaiki script LOGIN saja -->
<script type="module">
import {
  adminSignIn, adminSignOut,
  createCerpen, listCerpen,
  deleteCerpen, uploadCover
} from "./firebase-user.js";

// ======== FIX LOGIN =========
document.getElementById("btn-login").addEventListener("click", async ()=>{
  const email = document.getElementById("admin-email").value.trim();
  const pass  = document.getElementById("admin-pass").value;

  if(!email || !pass) return alert("Email & password wajib diisi!");

  try {
    await adminSignIn(email, pass);

    document.getElementById("admin-area").style.display = "block";
    document.getElementById("btn-login").style.display = "none";
    document.getElementById("btn-logout").style.display = "inline-block";
    
    loadList();
  } catch(e) {
    let msg = e.message;
    if(msg.includes("wrong-password")) msg = "Password salah!";
    if(msg.includes("user-not-found")) msg = "Akun tidak ditemukan!";
    alert("Login gagal: " + msg);
  }
});

// ======== LOGOUT =========
document.getElementById("btn-logout").addEventListener("click", async ()=>{
  await adminSignOut();
  location.reload();
});
</script>
