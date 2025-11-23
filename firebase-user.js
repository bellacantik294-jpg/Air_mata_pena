export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

// LOGIN
export function adminSignIn(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

export function adminSignOut() {
  return auth.signOut();
}

// UPLOAD COVER
export async function uploadCover(file) {
  const filename = "cover_" + Date.now() + "_" + file.name;
  const ref = storage.ref("covers/" + filename);
  await ref.put(file);
  return await ref.getDownloadURL();
}

// SIMPAN CERPEN
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

// LIST CERPEN
export async function listCerpen() {
  const snap = await db.collection("cerpen")
    .orderBy("tanggal", "desc")
    .get();

  let hasil = [];
  snap.forEach(doc => hasil.push({ id: doc.id, ...doc.data() }));
  return hasil;
}

// HAPUS CERPEN
export async function deleteCerpen(id) {
  await db.collection("cerpen").doc(id).delete();
}
