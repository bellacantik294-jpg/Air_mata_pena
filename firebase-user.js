// firebase-user.js (module) - lightweight Firebase helpers for comments + admin
import { firebaseConfig } from './firebase-config.js';
const scripts = [
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js'
];
function loadScript(url){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=url;s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
async function init(){ if(window.firebase && window.firebase.apps && window.firebase.apps.length) return; for(const s of scripts) await loadScript(s); firebase.initializeApp(firebaseConfig); window.db = firebase.firestore(); window.auth = firebase.auth(); }
// load comments into selector
export async function loadComments(selector='#comment-list'){ try{ await init(); const el = document.querySelector(selector); if(!el) return; el.innerHTML = '<p style="color:var(--muted)">Memuat komentar...</p>'; const snap = await db.collection('comments').orderBy('createdAt','desc').limit(50).get(); el.innerHTML=''; snap.forEach(d=>{ const data = d.data(); const c = document.createElement('div'); c.className='comment'; c.innerHTML = '<div class="meta"><strong>'+escapeHtml(data.name||'Anon')+'</strong> • '+new Date(data.createdAt).toLocaleString()+'</div><div class="body">'+escapeHtml(data.body)+'</div>'; el.appendChild(c); }); }catch(e){ console.error(e); } }
export async function submitComment(obj){ await init(); const doc = { name: obj.name||'Anon', body: obj.body||'', createdAt: Date.now() }; return db.collection('comments').add(doc); }
// Admin helpers
export async function adminSignIn(email,password){ await init(); return auth.signInWithEmailAndPassword(email,password); }
export async function adminSignOut(){ await init(); return auth.signOut(); }
export async function createCerpen(data){ await init(); return db.collection('cerpen').add({...data, createdAt: Date.now()}); }
export async function listCerpen(limit=50){ await init(); const s = await db.collection('cerpen').orderBy('createdAt','desc').limit(limit).get(); const out=[]; s.forEach(d=>out.push({id:d.id, ...d.data()})); return out; }
export async function deleteCerpen(id){ await init(); return db.collection('cerpen').doc(id).delete(); }
function escapeHtml(s){ return String(s).replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
