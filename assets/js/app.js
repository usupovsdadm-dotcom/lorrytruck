(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fmt=n=>n.toLocaleString('ru-RU').replace(/\u00a0/g,'\u202f');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const toast=t=>{const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2200)};
// live status (Moscow time)
(()=>{const l=$('#live');if(!l)return;const d=new Date(Date.now()+(new Date().getTimezoneOffset()+180)*6e4),m=d.getHours()*60+d.getMinutes();const open=m>=540&&m<1260;
l.classList.toggle('off',!open);l.lastElementChild.textContent=open?'Открыто до 21:00 · ежедневно':'Откроемся в 09:00 · ежедневно'})();
// header, progress, burger
const hd=$('#hd'),pg=$('.prog');let tk=0;
const onS=()=>{tk=0;const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;hd.classList.toggle('sc',y>40);pg.style.transform=`scaleX(${h>0?y/h:0})`;road();revs()};
addEventListener('scroll',()=>{if(!tk){tk=1;requestAnimationFrame(onS)}},{passive:true});
const bg=$('.burger');bg.addEventListener('click',()=>{const o=document.body.classList.toggle('menu-open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Закрыть меню':'Открыть меню')});
$$('.mnav a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('menu-open');bg.setAttribute('aria-expanded','false')}));
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
$$('.rv').forEach(e=>io.observe(e));
// odometer stats
const st=$('#stats');
if(st&&!RM){new IntersectionObserver((es,o)=>{if(!es[0].isIntersecting)return;o.disconnect();
 $$('b[data-n]',st).forEach(b=>{const s=b.dataset.n;b.innerHTML=`<span class="sr">${s}</span>`+[...s].map(c=>/\d/.test(c)?`<span class="col" aria-hidden="true" data-d="${c}">${'0123456789'.split('').map(x=>`<span>${x}</span>`).join('')}</span>`:`<span aria-hidden="true">${c}</span>`).join('')});
 requestAnimationFrame(()=>requestAnimationFrame(()=>{$$('.col',st).forEach((c,i)=>{c.style.transitionDelay=(i%4)*.12+'s';c.style.transform=`translateY(-${c.dataset.d}em)`})}));
 setTimeout(()=>$$('b[data-n]',st).forEach(b=>b.textContent=b.dataset.n),2800)},{threshold:.4}).observe(st)}
// letter word reveal
const sh=$('#sheet');if(sh){const ws=$$('.wd',sh);ws.forEach((w,i)=>w.style.transitionDelay=(RM?0:i*0.028)+'s');new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){sh.classList.add('in');o.disconnect()}},{threshold:.25}).observe(sh)}
// process road
const rd=$('#road'),done=rd&&$('.done',rd),trk=rd&&$('.truck',rd),stps=rd?$$('.stp',rd):[];
function road(){if(!rd)return;const r=rd.getBoundingClientRect(),vh=innerHeight;let p=(vh*0.6-r.top)/r.height;p=Math.max(0,Math.min(1,p));
 done.style.transform=`scaleY(${p})`;trk.style.transform=`translateY(${p*(r.height-80)}px)`;stps.forEach((s,i)=>s.classList.toggle('on',p>=(i/stps.length)+.02))}
// cases photo switch
$$('.case').forEach(c=>{const ps=$$('.ph picture',c),ds=$$('.dots button',c);let k=0;const go=j=>{k=(j+ps.length)%ps.length;ps.forEach((p,i)=>p.classList.toggle('on',i===k));ds.forEach((d,i)=>d.setAttribute('aria-pressed',i===k))};
 ds.forEach((d,i)=>d.addEventListener('click',e=>{e.stopPropagation();go(i)}));$('.ph',c).addEventListener('click',()=>go(k+1));
 let x0=null;$('.ph',c).addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});$('.ph',c).addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(k+(dx<0?1:-1));x0=null})});
// gallery + lightbox
const gal=$('#gal');$$('[data-g]').forEach(b=>b.addEventListener('click',()=>gal.scrollBy({left:+b.dataset.g*gal.clientWidth*.7,behavior:'smooth'})));
const lb=$('#lb'),li=$('img',lb),lc=$('.cap',lb);let gi=0;const show=i=>{gi=(i+GAL.length)%GAL.length;li.src=GAL[gi].s;li.alt=GAL[gi].a;lc.textContent=`${GAL[gi].a} · ${gi+1}/${GAL.length}`};
let lastF=null;const openLb=i=>{lastF=document.activeElement;show(i);lb.classList.add('on');$('.x',lb).focus()};const closeLb=()=>{lb.classList.remove('on');lastF&&lastF.focus()};
$$('.shot').forEach(f=>{f.addEventListener('click',()=>openLb(+f.dataset.i));f.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLb(+f.dataset.i)}})});
$('.x',lb).onclick=closeLb;$('.pv',lb).onclick=()=>show(gi-1);$('.nx',lb).onclick=()=>show(gi+1);lb.addEventListener('click',e=>{if(e.target===lb)closeLb()});
addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')show(gi-1);if(e.key==='ArrowRight')show(gi+1)});
// reviews
const rt=$('#rtrack'),rb=$('#rbar');function revs(){}
if(rt){const upd=()=>{const m=rt.scrollWidth-rt.clientWidth;rb.style.transform=`scaleX(${Math.max(.08,m>0?(rt.scrollLeft+rt.clientWidth)/rt.scrollWidth:1)})`};rt.addEventListener('scroll',()=>requestAnimationFrame(upd),{passive:true});new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();upd()}}).observe(rt);
 $$('[data-r]').forEach(b=>b.addEventListener('click',()=>{const c=$('.rc',rt);rt.scrollBy({left:+b.dataset.r*(c.offsetWidth+14),behavior:'smooth'})}))}
// map
const mb=$('#mapbtn');const loadMap=()=>{if($('#map iframe'))return;const f=document.createElement('iframe');f.src='https://yandex.ru/map-widget/v1/?ll=37.774387%2C55.444077&z=16&oid=51367159044&ol=biz';f.title='LorryTruck на Яндекс Картах';f.loading='lazy';f.allowFullscreen=true;$('#map').appendChild(f);$('#map .ph').remove()};
mb&&mb.addEventListener('click',loadMap);
// callback form -> mailto
$('#cb').addEventListener('submit',e=>{e.preventDefault();const f=e.target,n=f.n.value.trim(),p=f.p.value.trim(),m=f.m.value.trim();if(!p){f.p.focus();return}
 location.href=`mailto:${MAIL}?subject=${encodeURIComponent('Заявка с сайта: обратный звонок')}&body=${encodeURIComponent(`Имя: ${n}\nТелефон: ${p}\nЗадача: ${m}`)}`;toast('Открываем почту с готовой заявкой')});
// cursor glow + tilt
if(fine&&!RM){const g=$('.glow');let gx=0,gy=0,gr=0;addEventListener('pointermove',e=>{gx=e.clientX;gy=e.clientY;g.classList.add('on');if(!gr){gr=1;requestAnimationFrame(()=>{g.style.transform=`translate(${gx}px,${gy}px)`;gr=0})}},{passive:true});
 $$('[data-tilt]').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(700px) rotateX(${-y*6}deg) rotateY(${x*8}deg) translateY(-6px)`});c.addEventListener('pointerleave',()=>c.style.transform='')});
 $$('.btn-a').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.15}px,${(e.clientY-r.top-r.height/2)*.25}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')})}
// ===== configurator =====
let D=null,B=-1,Sy=-1,Q='',lim=40;const sel=new Map();const L=$('#list'),C=$('#cnt'),M=$('#more');
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));const norm=s=>s.toLowerCase().replace(/ё/g,'е');
const load=()=>{if(D||load.p)return load.p;return load.p=fetch('assets/data/prices.json').then(r=>r.json()).then(d=>{D=d;D.r.forEach(r=>r[5]=norm(r[2]));render()})};
const cio=new IntersectionObserver(es=>{if(es[0].isIntersecting){load();cio.disconnect()}},{rootMargin:'600px'});cio.observe($('#calc'));
function rows(){if(!D)return[];const qs=norm(Q).split(/\s+/).filter(Boolean);return D.r.filter(r=>(B<0||r[0]===B)&&(Sy<0||r[1]===Sy)&&qs.every(q=>r[5].includes(q)))}
function render(){if(!D)return;const R=rows();C.textContent=`Найдено: ${fmt(R.length)}`;
 L.innerHTML=R.slice(0,lim).map(r=>{const id=r[4],on=sel.has(id);return `<label class="it${on?' on':''}"><input type="checkbox" data-id="${id}"${on?' checked':''}><span class="t">${esc(r[2])}<small>${D.b[r[0]]} · ${D.s[r[1]]}</small></span><span class="p">${r[3]?'от '+fmt(r[3])+' ₽':'после диагностики'}</span></label>`}).join('')||'<p class="cnt">Ничего не нашли. Попробуйте другое слово или «Все марки».</p>';
 M.hidden=R.length<=lim;M.textContent=`Показать ещё (${fmt(R.length-lim)})`}
L.addEventListener('change',e=>{const i=e.target.closest('input');if(!i)return;const r=D.r.find(x=>x[4]===i.dataset.id);if(i.checked)sel.set(r[4],r);else sel.delete(r[4]);i.closest('.it').classList.toggle('on',i.checked);est()});
M.addEventListener('click',()=>{lim+=40;render()});
let qt;$('#q').addEventListener('input',e=>{clearTimeout(qt);qt=setTimeout(()=>{Q=e.target.value;lim=40;load().then(render)},120)});
const chip=(box,attr,set)=>$(box).addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;$$('.chip',$(box)).forEach(x=>x.setAttribute('aria-pressed',x===b));set(+b.dataset[attr]);lim=40;load().then(render)});
chip('#bchips','b',v=>B=v);chip('#schips','s',v=>Sy=v);
$$('.sy[data-sys]').forEach(b=>b.addEventListener('click',()=>{const v=+b.dataset.sys;Sy=v;$$('#schips .chip').forEach(x=>x.setAttribute('aria-pressed',+x.dataset.s===v));lim=40;load().then(render);$('#calc').scrollIntoView({behavior:RM?'auto':'smooth'})}));
let cur=0;const sumEl=$('#sum');
function anim(to){if(RM){sumEl.textContent=fmt(to)+' ₽';cur=to;return}const from=cur,t0=performance.now();cur=to;const step=t=>{const k=Math.min(1,(t-t0)/600),v=Math.round(from+(to-from)*(1-Math.pow(1-k,3)));sumEl.textContent=(to?'от ':'')+fmt(v)+' ₽';if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)}
function txt(){return [...sel.values()].map((r,i)=>`${i+1}. ${r[2]} — ${r[3]?'от '+fmt(r[3])+' ₽':'после диагностики'}`).join('\n')}
function est(){const v=[...sel.values()];$('#sel').innerHTML=v.map(r=>`<li><span>${esc(r[2])}</span><span>${r[3]?fmt(r[3])+' ₽':'—'}</span><button type="button" data-x="${r[4]}" aria-label="Убрать: ${esc(r[2])}"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button></li>`).join('');
 $('#empty').hidden=v.length>0;const s=v.reduce((a,r)=>a+r[3],0);anim(s);
 $('#sendmail').href=`mailto:${MAIL}?subject=${encodeURIComponent('Смета с сайта LorryTruck')}&body=${encodeURIComponent('Здравствуйте! Прошу рассчитать работы:\n'+txt()+`\nИтого ориентир: от ${fmt(s)} ₽\n\nМарка/модель:\nТелефон:`)}`}
$('#sel').addEventListener('click',e=>{const b=e.target.closest('[data-x]');if(!b)return;sel.delete(b.dataset.x);est();render()});
$('#copy').addEventListener('click',()=>{if(!sel.size){toast('Сначала отметьте работы');return}const t=txt()+`\nИтого: от ${fmt([...sel.values()].reduce((a,r)=>a+r[3],0))} ₽`;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Смета скопирована'),()=>toast('Не удалось скопировать'))});
const hr=$('#hrs');const hu=()=>{const h=+hr.value;$('#hv').textContent=h+' ч';$('#hout').textContent=`${fmt(h*1250)} – ${fmt(h*3000)} ₽`};hr.addEventListener('input',hu);hu();
est();requestAnimationFrame(onS);
})();
