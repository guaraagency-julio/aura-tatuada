/* O vídeo começa mudo. Som apenas por clique; silencia e pausa ao sair da tela. */
(() => {
 'use strict';
 const hero=document.querySelector('.hero'),video=document.querySelector('#aura-hero-video'),button=document.querySelector('#aura-hero-sound');
 if(!hero||!video||!button)return;
 const label=button.querySelector('.sound-label'),icon=button.querySelector('svg');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let visible=true,userStarted=false,failed=false;
 const mutedIcon='<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 5 6m0-6-5 6"/>';
 const soundIcon='<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 9a5 5 0 0 1 0 6M18 6a9 9 0 0 1 0 12"/>';
 function sync(){const on=!video.muted&&!video.paused;button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-label',on?'Desativar som do vídeo':'Ativar som do vídeo');label.textContent=on?'Desativar som':'Ativar som';icon.innerHTML=on?soundIcon:mutedIcon;button.disabled=failed;}
 function pauseAway(){video.pause();video.muted=true;video.defaultMuted=true;video.classList.remove('is-playing');sync();}
 async function playMuted(){if(failed||!visible||(reduced.matches&&!userStarted))return;video.muted=true;video.defaultMuted=true;try{await video.play()}catch(_){}sync();}
 video.muted=true;video.defaultMuted=true;video.volume=.7;
 video.addEventListener('playing',()=>{video.classList.add('is-playing');sync()});
 video.addEventListener('pause',sync);
 video.addEventListener('error',()=>{failed=true;video.classList.remove('is-playing');sync()});
 button.addEventListener('click',async()=>{
   if(failed)return;
   if(!video.muted&&!video.paused){video.muted=true;video.defaultMuted=true;sync();return;}
   userStarted=true;video.muted=false;video.defaultMuted=false;video.classList.add('is-user-playing');
   try{await video.play()}catch(_){video.muted=true;video.defaultMuted=true;}sync();
 });
 if('IntersectionObserver' in window)new IntersectionObserver(([entry])=>{
   visible=entry.isIntersecting;if(visible)playMuted();else pauseAway();
 },{threshold:.12}).observe(hero);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseAway();else if(visible)playMuted()});
 reduced.addEventListener('change',()=>{if(reduced.matches){pauseAway();userStarted=false;video.classList.remove('is-user-playing')}else if(visible)playMuted()});
 sync();if(!reduced.matches)playMuted();
})();