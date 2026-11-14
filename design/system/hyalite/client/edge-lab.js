// Driver for pages/01-edge-lab: the <script> of hyalite demo/edge-lab.html v0.5.0
// (MIT © 2026 VII-Cae (VII)), unchanged except the localStorage key.
/* ══════════════════════════════════════════════════════════════════════
   驱动
   ══════════════════════════════════════════════════════════════════════ */
const KEYS=['bevel','thickness','slope','shade','rim','edgeW','sat','edge','blur','dispersion','light','smooth'];
const el=id=>document.getElementById(id);
const opts=()=>{ const o={}; KEYS.forEach(k=>o[k]=+el(k).value); return o; };

const SAVE='ui-design.hyalite.edge-lab';
function saveOpts(){ try{ const o={}; KEYS.forEach(k=>o[k]=el(k).value); localStorage.setItem(SAVE, JSON.stringify(o)); }catch(e){} }
function loadOpts(){
  try{ const raw=localStorage.getItem(SAVE); if(!raw) return false;
       const o=JSON.parse(raw); KEYS.forEach(k=>{ if(o[k]!=null) el(k).value=o[k]; }); return true; }catch(e){ return false; }
}
function copyOpts(){
  const o={}; KEYS.forEach(k=>o[k]=+el(k).value);
  const t=JSON.stringify(o);
  navigator.clipboard?.writeText(t).then(()=>{ el('note').textContent='参数已复制到剪贴板'; }, ()=>{ el('note').textContent=t; });
}

/* 三块矩形 + 三个圆：同一组参数，三种倒角剖面并排。示波器画最后建的那块（lip 的圆）。 */
const SHAPES=['circle','squircle','lip'];
function render(){
  const o=opts();
  KEYS.forEach(k=>{const t=el('v_'+k); if(t) t.textContent=el(k).value;});
  if(!(window.Hyalite && Hyalite.supported())) return;
  ['g0','g1','g2','d0','d1','d2'].forEach((id,i)=>{
    Hyalite.detach(el(id));
    Hyalite.attach(el(id), Object.assign({}, o, { shape:SHAPES[i%3], materialize:0, settle:0 },
                                         id==='d2' ? { onBuild: drawScope } : {}));
  });
  saveOpts();
}

/* 示波器：位移、亮度因子、净剖面三条曲线，外加一条把净剖面铺平的灰阶带 —— 肉眼数带用。 */
function drawScope(info){
  if(!info || !info.profile) return;
  const pr=info.profile, N=pr.m.length-1;
  const cv=el('curve'), g=cv.getContext('2d'), W=cv.width, H=cv.height;
  g.fillStyle='#11161d'; g.fillRect(0,0,W,H);
  const X=i=>i/N*(W-2)+1;
  g.strokeStyle='rgba(255,255,255,.13)'; g.lineWidth=1;
  for(let i=0;i<=4;i++){g.beginPath();g.moveTo(1,H*i/4);g.lineTo(W-1,H*i/4);g.stroke();}
  g.strokeStyle='rgba(255,255,255,.3)'; g.setLineDash([3,3]);
  g.beginPath();g.moveTo(1,H/2);g.lineTo(W-1,H/2);g.stroke(); g.setLineDash([]);
  const line=(arr,f,color)=>{ g.strokeStyle=color; g.lineWidth=1.6; g.beginPath();
    for(let i=0;i<=N;i++){const y=H-f(arr[i])*H; i?g.lineTo(X(i),y):g.moveTo(X(i),y);} g.stroke(); };
  const mx=Math.max(...pr.m.map(Math.abs),1e-6);
  line(pr.m,    v=>.5+v/mx*.45,                       '#7fcdcd');
  const gm=Math.max(1,...pr.gain);                    // lip 下 gain 可以 > 1（位移压缩，边缘反而变亮）
  line(pr.gain, v=>v/gm,                              '#ffb4a2');
  line(pr.edge, v=>.5+Math.max(-1,Math.min(1,v))*.45, '#dfc174');
  const sv=el('strip'), sc=sv.getContext('2d'), SW=sv.width;
  for(let x=0;x<SW;x++){
    const i=Math.round(x/(SW-1)*N), e=pr.edge[i], base=.42;
    const lum = e>=0 ? base+(1-base)*Math.min(1,e) : base*Math.max(0.02,1+e);
    const c=Math.round(lum*255);
    sc.fillStyle='rgb('+c+','+c+','+c+')'; sc.fillRect(x,0,1,sv.height);
  }
  el('out').textContent='倒角 '+info.bevel+'px · 最大位移 '+info.maxDisplacement.toFixed(1)+'px · '+
    (info.folds?'折叠（单段）':'不折叠（两段）')+' · 亮度 ×'+Math.min(...pr.gain).toFixed(2)+'–'+Math.max(...pr.gain).toFixed(2);
}

/* ── 底图 ────────────────────────────────────────────────────── */
function testBg(){
  const c=document.createElement('canvas'); c.width=1400; c.height=900;
  const x=c.getContext('2d');
  const gr=x.createLinearGradient(0,0,1400,900);
  gr.addColorStop(0,'#12304f'); gr.addColorStop(.5,'#7b2d5e'); gr.addColorStop(1,'#1d5c4e');
  x.fillStyle=gr; x.fillRect(0,0,1400,900);
  const cols=['#ff4d6d','#ffd166','#06d6a0','#4cc9f0','#ffffff','#0a0a0a'];
  cols.forEach((col,i)=>{x.fillStyle=col; x.fillRect(90+i*210,120,150,300);});   // 硬边色块：看明暗带最灵
  x.fillStyle='rgba(255,255,255,.85)';
  for(let i=0;i<26;i++) x.fillRect(60,470+i*16,1280,2);                           // 细横线：看阶梯和压缩
  x.fillStyle='#fff'; x.font='800 130px system-ui'; x.fillText('THICK',420,830);
  return c.toDataURL('image/png');
}
function stripeBg(){          // 对她第二张截图的条纹床单
  const c=document.createElement('canvas'); c.width=1200; c.height=900;
  const x=c.getContext('2d');
  x.fillStyle='#8f8f8f'; x.fillRect(0,0,1200,900);
  x.save(); x.translate(600,450); x.rotate(-0.22); x.translate(-600,-450);
  x.fillStyle='#303030';
  for(let i=-700;i<1900;i+=24) x.fillRect(i,-400,12,1700);
  x.restore();
  return c.toDataURL('image/png');
}
function gridBg(){
  const c=document.createElement('canvas'); c.width=800; c.height=800;
  const x=c.getContext('2d'); x.fillStyle='#1d2a1f'; x.fillRect(0,0,800,800);
  x.strokeStyle='rgba(255,255,255,.55)'; x.lineWidth=1;
  for(let i=0;i<=800;i+=12){x.beginPath();x.moveTo(i,0);x.lineTo(i,800);x.moveTo(0,i);x.lineTo(800,i);x.stroke();}
  return c.toDataURL('image/png');
}
const stage=el('stage');
const BGBTN=['bg_test','bg_stripe','bg_grid','bg_dark'];
const setBg=(url,which)=>{
  stage.style.backgroundImage=`url("${url}")`;
  stage.style.backgroundSize = which==='grid' ? '800px 800px' : 'cover';
  BGBTN.forEach(id=>el(id).classList.toggle('on',id==='bg_'+which));
};
el('bg_test').onclick=()=>setBg(testBg(),'test');
el('bg_stripe').onclick=()=>setBg(stripeBg(),'stripe');
el('bg_grid').onclick =()=>setBg(gridBg(),'grid');
el('bg_dark').onclick =()=>{stage.style.backgroundImage='none';stage.style.background='#141a22';
                            BGBTN.forEach(id=>el(id).classList.toggle('on',id==='bg_dark'));};
const loadFile=f=>{ if(!f||!/^image\//.test(f.type)) return;
  const r=new FileReader(); r.onload=()=>{setBg(r.result,'file'); el('note').textContent='底图已换成你的图。三块玻璃可以拖动，拖到参考控件旁边比。';}; r.readAsDataURL(f); };
el('pick').onchange=e=>loadFile(e.target.files[0]);
addEventListener('dragover',e=>{e.preventDefault();stage.classList.add('drop');});
addEventListener('dragleave',()=>stage.classList.remove('drop'));
addEventListener('drop',e=>{e.preventDefault();stage.classList.remove('drop');loadFile(e.dataTransfer.files[0]);});

/* ── 拖动 ────────────────────────────────────────────────────── */
document.querySelectorAll('.slot').forEach(s=>{
  let sx,sy,ox,oy;
  s.addEventListener('pointerdown',e=>{
    if(e.target.closest('#hud,#scope')) return;
    s.setPointerCapture(e.pointerId); s.classList.add('dragging');
    sx=e.clientX; sy=e.clientY; ox=s.offsetLeft; oy=s.offsetTop;
  });
  s.addEventListener('pointermove',e=>{
    if(!s.classList.contains('dragging')) return;
    s.style.left=(ox+e.clientX-sx)+'px'; s.style.top=(oy+e.clientY-sy)+'px';
  });
  s.addEventListener('pointerup',e=>{s.classList.remove('dragging');s.releasePointerCapture(e.pointerId);});
});

/* ── 启动 ────────────────────────────────────────────────────── */
const DEF = Hyalite.DEFAULTS;
/* 一个对照档：不折叠。折叠是默认档「液态感」的来源，但它同时关掉了两段抗阶梯 ——
   把斜率压到 1 以下，就能看到干净但没有漩涡的另一种成色。 */
const PRESETS = { nofold: { ...DEF, slope: 0.95, blur: 1.5, dispersion: 0.8 } };
const useP=n=>{const p=n?PRESETS[n]:DEF; KEYS.forEach(k=>{ if(p[k]!=null) el(k).value=p[k]; }); render();};
el('reset').onclick=()=>useP(null);
el('p_nofold').onclick=()=>useP('nofold');
el('p_copy').onclick=copyOpts;
el('fold').onclick=()=>el('hud').classList.toggle('fold');
KEYS.forEach(k=>el(k).addEventListener('input',render));
if(!loadOpts()) useP(null);
setBg(testBg(),'test');
if(!(window.Hyalite&&Hyalite.supported()))
  el('note').innerHTML='<span class="warn">这个浏览器不跑 SVG backdrop filter，只有 Chromium 能看。</span>';
render();
