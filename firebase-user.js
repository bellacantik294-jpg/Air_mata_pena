// =========================
// Firebase Auth + Firestore
// =========================

// gunakan import firebase dari CDN (sudah ada di admin.html)
// firebase-config.js sudah menginisialisasi firebase

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// =========================
// LOGIN ADMIN
// =========================

export function adminSignIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

export function adminSignOut() {
    return auth.signOut();
}

// =========================
// CEK LOGIN STATUS (optional)
// =========================

export function onAdminStateChange(callback) {
    return auth.onAuthStateChanged(callback);
}


// =========================
// UPLOAD COVER CERITA
// =========================

export async function uploadCover(file) {
    const filename = "cover_" + Date.now() + "_" + file.name;
    const ref = storage.ref("covers/" + filename);

    await ref.put(file);
    const url = await ref.getDownloadURL();

    return url;
}


// =========================
// MENYIMPAN CERPEN BARU
// =========================

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


// =========================
// MENAMPILKAN DAFTAR CERPEN (ADMIN)
// =========================

export async function listCerpen() {
    const snapshot = await db.collection("cerpen")
        .orderBy("tanggal", "desc")
        .get();

    let hasil = [];

    snapshot.forEach(doc => {
        hasil.push({
            id: doc.id,
            ...doc.data()
        });
    });

    return hasil;
}


// =========================
// HAPUS CERPEN
// =========================

export async function deleteCerpen(id) {
    await db.collection("cerpen").doc(id).delete();
}
