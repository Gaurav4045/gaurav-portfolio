
// === Animated background stays same ===

// === Animated background (particles + soft waves) ===
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let w, h, particles;
function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; particles = Array.from({length: Math.min(140, Math.floor(w*h/12000))}, () => ({
  x: Math.random()*w, y: Math.random()*h, vx:(Math.random()-0.5)*0.6, vy:(Math.random()-0.5)*0.6, r: Math.random()*2+0.5
}));}
window.addEventListener('resize', resize); resize();
function draw(){
  ctx.clearRect(0,0,w,h);
  // soft gradient backdrop
  const g = ctx.createRadialGradient(w*0.7,h*0.2,80, w*0.5,h*0.5, Math.max(w,h));
  g.addColorStop(0,'rgba(0,255,240,0.12)');
  g.addColorStop(1,'rgba(255,77,240,0.06)');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
  // moving sine waves
  ctx.beginPath();
  for(let x=0;x<w;x++){
    const y = h*0.7 + Math.sin((x+Date.now()/1800)/60)*12;
    if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.strokeStyle = 'rgba(0,255,240,0.15)'; ctx.lineWidth = 2; ctx.stroke();
  // particles
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>w) p.vx*=-1;
    if(p.y<0||p.y>h) p.vy*=-1;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();



// === Overlay panels with smooth switching ===
const overlay = document.getElementById('overlay');
const panels = {
  about: document.getElementById('panel-about'),
  skills: document.getElementById('panel-skills'),
  projects: document.getElementById('panel-projects'),
  experience: document.getElementById('panel-experience'),
  education: document.getElementById('panel-education'),
  contact: document.getElementById('panel-contact'),
};
let currentPanel = null;

function openPanel(key){
  const newPanel = panels[key];
  if(!newPanel) return;
  if(currentPanel === newPanel) return; // already open
  if(currentPanel){
    // Fade out current, then open new
    currentPanel.classList.remove('show');
    setTimeout(()=>{
      currentPanel = newPanel;
      overlay.classList.add('show');
      newPanel.classList.add('show');
      overlay.setAttribute('aria-hidden','false');
      newPanel.focus();
      history.pushState({panel:key}, '', `#${key}`);
    }, 250);
  } else {
    overlay.classList.add('show');
    newPanel.classList.add('show');
    overlay.setAttribute('aria-hidden','false');
    currentPanel = newPanel;
    newPanel.focus();
    history.pushState({panel:key}, '', `#${key}`);
  }
}
function closePanels(){
  if(currentPanel){
    currentPanel.classList.remove('show');
    currentPanel = null;
  }
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden','true');
  history.pushState({}, '', '#');
}
document.querySelectorAll('.nav-btn, .btn.primary').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const key = e.currentTarget.getAttribute('data-target') || 'projects';
    openPanel(key);
  });
});
overlay.addEventListener('click', closePanels);
document.querySelectorAll('.panel .close').forEach(c=>c.addEventListener('click', closePanels));
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closePanels(); });

// Deep-linking via hash
window.addEventListener('load', ()=>{
  const key = location.hash.replace('#','');
  if(key && panels[key]) openPanel(key);
});
window.addEventListener('popstate', ()=>{
  const key = location.hash.replace('#','');
  if(key && panels[key]) { openPanel(key); } else { closePanels(); }
});
