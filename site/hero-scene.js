/* Aura — demonstração com áudio preferencialmente ligado.
   Browsers podem bloquear autoplay com som; nesse caso reproduz mudo
   e ativa o áudio na primeira interação válida ou no botão dedicado. */
(() => {
  'use strict';
  const hero=document.querySelector('.hero');
  const video=document.querySelector('#aura-hero-video');
  const button=document.querySelector('#aura-hero-sound');
  if(!hero||!video||!button)return;

  const label=button.querySelector('.sound-label');
  const icon=button.querySelector('svg');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const mutedIcon='<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 5 6m0-6-5 6"/>';
  const soundIcon='<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 9a5 5 0 0 1 0 6M18 6a9 9 0 0 1 0 12"/>';
  let userStarted=false;
  let preferredSound=true;
  let failed=false;
  let sequence=0;

  video.defaultMuted=false;
  video.muted=false;
  video.volume=.72;

  function sync(){
    const audible=!video.muted&&!video.paused&&!failed;
    button.setAttribute('aria-pressed',String(audible));
    button.setAttribute('aria-label',audible?'Desativar som do vídeo':'Ativar som do vídeo');
    if(label)label.textContent=audible?'Desativar som':'Ativar som';
    if(icon)icon.innerHTML=audible?soundIcon:mutedIcon;
    button.disabled=failed;
  }

  function pauseAway(){
    sequence++;
    video.pause();
    video.muted=true;
    video.classList.remove('is-playing');
    sync();
  }

  async function start(){
    if(failed||document.hidden||(reduced.matches&&!userStarted))return;
    const current=++sequence;
    video.muted=!preferredSound;
    try{
      await video.play();
    }catch(_){
      if(current!==sequence)return;
      if(preferredSound){
        // Chrome/Edge/Safari podem impedir áudio sem interação.
        // O vídeo continua, e o botão indica que o som pode ser ligado.
        video.muted=true;
        try{await video.play();}catch(__){}
      }
    }
    if(current!==sequence)return;
    if(!video.paused)video.classList.add('is-playing');
    sync();
  }

  button.addEventListener('click',()=>{
    if(failed)return;
    if(!video.muted&&!video.paused){
      preferredSound=false;
      video.muted=true;
      sync();
    }else{
      preferredSound=true;
      userStarted=true;
      // start() começa de forma síncrona dentro do gesto do usuário.
      start();
    }
  });

  function unlockFromGesture(event){
    if(failed||!preferredSound||document.hidden||!video.muted||reduced.matches)return;
    if(event.target instanceof Element && event.target.closest('#aura-hero-sound'))return;
    userStarted=true;
    start();
  }
  document.addEventListener('pointerdown',unlockFromGesture,{passive:true});
  document.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){unlockFromGesture(e);}
  });

  video.addEventListener('playing',()=>{
    video.classList.add('is-playing');
    sync();
  });
  video.addEventListener('pause',sync);
  video.addEventListener('volumechange',sync);
  video.addEventListener('error',()=>{
    failed=true;
    video.classList.remove('is-playing');
    sync();
  });

  // O vídeo e a música continuam durante todo o scroll.
  // Uma aba oculta continua podendo pausar por economia/expectativa do usuário.
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)pauseAway();
    else start();
  });
  reduced.addEventListener('change',()=>{
    if(reduced.matches){
      pauseAway();
      userStarted=false;
      video.classList.remove('is-user-playing');
    }else start();
  });

  sync();
  if(!reduced.matches)start();
})();