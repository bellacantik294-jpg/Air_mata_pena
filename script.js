// script.js : search, likes (local), share, theme toggle, comment actions
document.addEventListener('DOMContentLoaded', ()=>{
  // theme toggle (persist)
  const root = document.documentElement;
  const toggle = document.getElementById('toggle-theme');
  const saved = localStorage.getItem('theme') || 'dark';
  if(saved === 'light') document.body.classList.add('light');
  toggle && toggle.addEventListener('click', ()=>{
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });

  // search
  const search = document.getElementById('search');
  if(search) search.addEventListener('input', ()=>{
    const q = search.value.toLowerCase();
    document.querySelectorAll('.card').forEach(card=>{
      card.style.display = card.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // likes (local)
  document.querySelectorAll('.like').forEach(btn=>{
    const id = btn.dataset.id || 'like-local';
    const span = btn.querySelector('span');
    const stored = localStorage.getItem('like-'+id);
    if(stored) span.innerText = stored;
    btn.addEventListener('click', ()=>{
      let v = parseInt(span.innerText||'0') + 1;
      span.innerText = v;
      localStorage.setItem('like-'+id, v);
    });
  });

  // share (uses navigator.share if available)
  document.querySelectorAll('.share').forEach(a=>{
    a.addEventListener('click', async (e)=>{
      e.preventDefault();
      const title = a.dataset.title || document.title;
      const url = location.href;
      if(navigator.share){
        try{ await navigator.share({title, text: title, url}); }catch(e){ console.warn(e); }
      } else {
        // fallback: copy url
        try{ await navigator.clipboard.writeText(url); alert('Link disalin ke clipboard'); }catch(e){ alert('Salin link: '+url); }
      }
    });
  });

  // comments — firebase-user.js exposes loadComments/submitComment
  if(window.loadComments) window.loadComments('#comment-list');
  const submit = document.getElementById('submit-comment');
  if(submit) submit.addEventListener('click', async ()=>{
    const name = document.getElementById('comment-name').value || 'Anon';
    const body = document.getElementById('comment-body').value;
    if(!body) return alert('Isi komentar dulu');
    if(window.submitComment){
      try{
        await window.submitComment({name, body});
        document.getElementById('comment-body').value = '';
        if(window.loadComments) window.loadComments('#comment-list');
      }catch(e){ console.error(e); alert('Gagal kirim komentar'); }
    } else {
      alert('Komentar belum dikonfigurasi (isi firebase-config.js)');
    }
  });
});
