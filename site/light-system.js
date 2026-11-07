/* Aura / Luz nivel 2. Backup: backup/antes-luz-nivel-2-2026-11-07. */
(function installAuraLightSystem() {
  'use strict';
  const body=document.body;
  const star=document.querySelector('.scroll-star');
  if(!star)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=window.matchMedia('(max-width: 700px)');
  const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
  const prefKey='aura:luz-nivel2';
  let enabled=true;
  try{enabled=sessionStorage.getItem(prefKey)!=='off';}catch(_){}

  const zones=[
    {selector:'.hero',paper:false},
    {selector:'.portfolio-section',paper:false},
    {selector:'.artist-section',paper:true},
    {selector:'.studio-section',paper:false},
    {selector:'.contact-section',paper:true},
    {selector:'.footer',paper:false}
  ].map(({selector,paper})=>{
    const el=document.querySelector(selector);
    if(!el)return null;
    el.classList.add('aura-lux-zone');
    if(paper)el.classList.add('is-paper');
    const wash=document.createElement('div');
    wash.className='aura-lux-wash';
    wash.setAttribute('aria-hidden','true');
    el.append(wash);
    return {el,paper};
  }).filter(Boolean);

  const halo=document.createElement('div');
  halo.className='aura-lux-halo';
  halo.setAttribute('aria-hidden','true');
  body.append(halo);

  const photoTargets=['.hero','.window-scene'].map(sel=>{
    const el=document.querySelector(sel);
    if(!el)return null;
    const wash=document.createElement('div');
    wash.className='aura-lux-photowash';
    wash.setAttribute('aria-hidden','true');
    el.append(wash);
    return el;
  }).filter(Boolean);

  const objectSelectors=['.gallery-slide','.artist-image','.contact-photo',
    '.portfolio-small-photo','.foliage-portfolio','.foliage-artist','.foliage-studio'];
  let objects=[];
  const refreshObjects=()=>{
    objects=objectSelectors.flatMap(sel=>[...document.querySelectorAll(sel)]);
    objects.forEach(el=>el.classList.add('aura-lux-object'));
  };
  refreshObjects();

  const light={x:-9999,y:-9999,visible:false};
  const track=document.querySelector('#gallery-track');
  if(track && 'MutationObserver' in window){
    new MutationObserver(()=>{
      refreshObjects();
      render(light.x,light.y,light.visible);
    }).observe(track,{childList:true});
  }

  const toggle=document.createElement('button');
  toggle.className='aura-lux-toggle';
  toggle.type='button';
  toggle.setAttribute('aria-label','Alternar a luz dinâmica da estrela');
  toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg><span class="aura-lux-label"></span>';
  body.append(toggle);
  const label=toggle.querySelector('.aura-lux-label');

  function updateControl(){
    const disabled=reduced.matches;
    toggle.disabled=disabled;
    toggle.setAttribute('aria-pressed',String(enabled && !disabled));
    label.textContent=disabled?'Luz reduzida':enabled?'Luz ligada':'Luz desligada';
    body.classList.toggle('aura-lux-on',enabled && !disabled);
    halo.style.opacity=enabled && !disabled && light.visible?'1':'0';
    if(!enabled || disabled){
      zones.forEach(z=>z.el.style.setProperty('--lux-zone-opacity','0'));
      photoTargets.forEach(el=>el.style.setProperty('--lux-photo-opacity','0'));
      objects.forEach(el=>el.style.setProperty('--lux-object-opacity','0'));
    }
  }

  toggle.addEventListener('click',()=>{
    enabled=!enabled;
    try{sessionStorage.setItem(prefKey,enabled?'on':'off');}catch(_){}
    updateControl();
    if(enabled)render(light.x,light.y,light.visible);
  });

  function render(x,y,visible){
    light.x=x;light.y=y;light.visible=visible;
    if(!enabled || reduced.matches)return;
    const radius=mobile.matches?315:465;
    const diameter=mobile.matches?360:480;
    halo.style.transform=`translate3d(${(x-diameter/2).toFixed(1)}px,${(y-diameter/2).toFixed(1)}px,0)`;
    halo.style.opacity=visible?'1':'0';

    zones.forEach(({el,paper})=>{
      const box=el.getBoundingClientRect();
      if(box.bottom < -90 || box.top > window.innerHeight+90)return;
      const nx=clamp(x,box.left,box.right);
      const ny=clamp(y,box.top,box.bottom);
      const distance=Math.hypot(x-nx,y-ny);
      const amount=visible?Math.pow(clamp(1-distance/(radius*.78),0,1),1.25):0;
      el.style.setProperty('--lux-x',`${(x-box.left).toFixed(1)}px`);
      el.style.setProperty('--lux-y',`${(y-box.top).toFixed(1)}px`);
      el.style.setProperty('--lux-zone-opacity',(amount*(paper?.55:1)).toFixed(3));
    });

    photoTargets.forEach(el=>{
      const box=el.getBoundingClientRect();
      if(box.bottom < -90 || box.top > window.innerHeight+90)return;
      const nx=clamp(x,box.left,box.right);
      const ny=clamp(y,box.top,box.bottom);
      const amount=visible?clamp(1-Math.hypot(x-nx,y-ny)/(radius*.9),0,1):0;
      el.style.setProperty('--lux-photo-x',`${(x-box.left).toFixed(1)}px`);
      el.style.setProperty('--lux-photo-y',`${(y-box.top).toFixed(1)}px`);
      el.style.setProperty('--lux-photo-opacity',amount.toFixed(3));
    });

    objects.forEach(el=>{
      if(el.classList.contains('is-hidden') ||
        (el.classList.contains('gallery-slide') &&
        !el.classList.contains('is-active') &&
        !el.classList.contains('is-next') &&
        !el.classList.contains('is-next2')))return;
      const box=el.getBoundingClientRect();
      if(box.bottom < -70 || box.top > window.innerHeight+70)return;
      const nearestX=clamp(x,box.left,box.right);
      const nearestY=clamp(y,box.top,box.bottom);
      const distance=Math.hypot(x-nearestX,y-nearestY);
      const influence=visible?Math.pow(clamp(1-distance/radius,0,1),1.5):0;
      const dx=box.left+box.width*.5-x;
      const dy=box.top+box.height*.5-y;
      const mag=Math.max(65,Math.hypot(dx,dy));
      const dirX=dx/mag,dirY=dy/mag;
      const sx=dirX*(7+18*influence);
      const sy=dirY*(11+20*influence)+8;
      const blur=17+14*influence;
      const alpha=(.18+.28*influence).toFixed(3);
      el.style.setProperty('--lux-shadow',`${sx.toFixed(1)}px ${sy.toFixed(1)}px ${blur.toFixed(1)}px rgba(9,13,6,${alpha})`);
      el.style.setProperty('--lux-object-x',`${(x-box.left).toFixed(1)}px`);
      el.style.setProperty('--lux-object-y',`${(y-box.top).toFixed(1)}px`);
      el.style.setProperty('--lux-object-opacity',(influence*.86).toFixed(3));
      if(el.classList.contains('foliage')){
        el.style.setProperty('--lux-leaf-x',`${(dirX*(5+16*influence)).toFixed(1)}px`);
        el.style.setProperty('--lux-leaf-y',`${(dirY*(8+19*influence)).toFixed(1)}px`);
        el.style.setProperty('--lux-leaf-blur',`${(8+11*influence).toFixed(1)}px`);
        el.style.setProperty('--lux-plant-brightness',(1+influence*.32).toFixed(2));
      }
    });
  }

  window.addEventListener('aura:star-position',event=>{
    if(event.detail)render(event.detail.x,event.detail.y,event.detail.visible);
  });
  reduced.addEventListener('change',updateControl);
  requestAnimationFrame(()=>{
    const box=star.getBoundingClientRect();
    render(box.left+box.width*.5,box.top+box.height*.5,window.scrollY>=26);
    updateControl();
  });
  updateControl();
})();
