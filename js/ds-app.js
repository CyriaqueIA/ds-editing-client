(function(){
'use strict';
document.querySelectorAll('[data-loop]').forEach(function(t){t.innerHTML+=t.innerHTML.replace(/id="([^"]+)"/g,'id="$1-b"');});
var CAL = window.DS_CALENDLY || 'https://calendly.com/';
document.querySelectorAll('.js-book').forEach(function(a){a.href=CAL;if(CAL.charAt(0)!=='#'){a.target='_blank';a.rel='noopener';}});
document.documentElement.classList.add('js');
var nav=document.getElementById('nav'),sticky=document.getElementById('sticky');
function onS(){var y=scrollY;nav.classList.toggle('solid',y>30);sticky.classList.toggle('show',y>innerHeight*.9);}
addEventListener('scroll',onS,{passive:true});onS();
var mm=document.getElementById('mm');
document.getElementById('burger').onclick=function(){mm.classList.add('open')};
mm.querySelectorAll('a,.x').forEach(function(el){el.addEventListener('click',function(){mm.classList.remove('open')})});
/* reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.rv-in').forEach(function(el){io.observe(el)});
/* count */
var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io2.unobserve(e.target);var el=e.target,t=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length,s=null;
function st(ts){if(!s)s=ts;var p=Math.min((ts-s)/1400,1),v=t*(1-Math.pow(1-p,3));el.firstChild.nodeValue=dec?v.toFixed(dec):Math.round(v).toLocaleString('en-US');if(p<1)requestAnimationFrame(st)}requestAnimationFrame(st)})},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(function(el){io2.observe(el)});
/* hover video */
document.querySelectorAll('.ep[data-video]').forEach(function(ep){var v;ep.addEventListener('mouseenter',function(){if(!v){v=document.createElement('video');v.src=ep.dataset.video;v.muted=true;v.loop=true;v.playsInline=true;ep.insertBefore(v,ep.children[1]);}v.play().then(function(){ep.classList.add('playing')}).catch(function(){})});ep.addEventListener('mouseleave',function(){if(v){v.pause();ep.classList.remove('playing')}})});
document.querySelectorAll('.svc .vid video').forEach(function(v){var s=v.closest('.svc');s.addEventListener('mouseenter',function(){v.play().catch(function(){})});s.addEventListener('mouseleave',function(){v.pause()})});
/* pack screens: load + play when visible */
var io3=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){if(!v.src)v.src=v.dataset.src;v.play().catch(function(){})}else{v.pause()}})},{threshold:.3});
document.querySelectorAll('.pscreen video').forEach(function(v){io3.observe(v)});
/* faq */
document.querySelectorAll('.fq button').forEach(function(b){b.onclick=function(){var f=b.parentNode,a=f.querySelector('.a'),o=f.classList.toggle('open');a.style.maxHeight=o?a.scrollHeight+'px':'0'}});
/* clocks */
function clocks(){document.querySelectorAll('[data-tz]').forEach(function(c){var d=new Date(),f=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:c.dataset.tz,hour12:false}).format(d);c.querySelector('.tm2').textContent=f;var h=parseInt(f,10),st=c.querySelector('.st');if(!c.classList.contains('hq'))st.textContent=(h>=22||h<7)?CLK[LANG][0]:CLK[LANG][1];})}
/* lang : en (texte de la balise), fr (data-fr), nl (data-nl), da (data-da) ; à défaut, l'anglais */
var LANGS=['en','fr','nl','da'],LANG='en';
var CLK={en:['You\u2019re asleep','You\u2019re recording'],fr:['Vous dormez','Vous enregistrez'],nl:['Jij slaapt','Jij neemt op'],da:['Du sover','Du optager']};
document.querySelectorAll('[data-fr]').forEach(function(el){el.dataset.en=el.innerHTML});
function setLang(l){if(LANGS.indexOf(l)<0)l='en';LANG=l;document.documentElement.lang=l;document.querySelectorAll('[data-fr]').forEach(function(el){el.innerHTML=el.dataset[l]||el.dataset.en});document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('on',b.dataset.l===l)});clocks();try{localStorage.setItem('ds_lang',l)}catch(e){}}
document.querySelectorAll('.lang button').forEach(function(b){b.onclick=function(){setLang(b.dataset.l)}});
window.dsSetLang=setLang;
try{var sl=localStorage.getItem('ds_lang');if(sl)setLang(sl)}catch(e){}
clocks();setInterval(clocks,20000);
/* réglages de la charte, figés dans window.__DS_TWEAKS__ (index.html) */
var AC={red:{a:'#E3122B',d:'#B00D20',o:'#FFFFFF'},white:{a:'#F5F5F1',d:'#D6D6D0',o:'#0A0A0A'},violet:{a:'#7B3CFF',d:'#5E22E0',o:'#FFFFFF'}};
var state=Object.assign({accent:'red',style:'netflix'},window.__DS_TWEAKS__||{});
(function(){var c=AC[state.accent]||AC.red,r=document.documentElement.style;r.setProperty('--accent',c.a);r.setProperty('--accent-d',c.d);r.setProperty('--on-accent',c.o);document.body.classList.toggle('atv',state.style==='atv'||state.style==='atvl');document.body.classList.toggle('light',state.style==='atvl');document.body.classList.toggle('hbo',state.style==='hbo');document.body.classList.toggle('chrome',state.style==='chrome');document.body.classList.toggle('motion',!!state.motion);document.body.dataset.logo=state.logo||'cut'})();
document.querySelectorAll('.h2,.pk').forEach(function(el){io.observe(el)});
})();

/* segment loops: data-start / data-end (seconds) */
document.querySelectorAll('video[data-end]').forEach(function(v){var a=+v.dataset.start||0,b=+v.dataset.end;v.loop=false;
v.addEventListener('loadedmetadata',function(){if(v.currentTime<a)v.currentTime=a});
v.addEventListener('timeupdate',function(){if(v.currentTime>=b||v.currentTime<a-0.3){v.currentTime=a;v.play().catch(function(){})}});
v.addEventListener('ended',function(){v.currentTime=a;v.play().catch(function(){})});});
