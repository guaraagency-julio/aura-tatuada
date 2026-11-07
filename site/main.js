/* AURA — Etapa 2. Motion: scroll relationship / framed portfolio / handmade details.
   No dependencies. Scroll reads and writes are batched inside one requestAnimationFrame. */
(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  const reducedMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Accessible small-screen navigation
  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('#nav-mobile');
  const closeMenu = (returnFocus = false) => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    mobileNav.hidden = true;
    if (returnFocus) menuButton.focus();
  };
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const opening = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(opening));
      menuButton.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
      mobileNav.hidden = !opening;
    });
    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(true); });
    document.addEventListener('pointerdown', e => {
      if (!mobileNav.hidden && !mobileNav.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
    });
    window.matchMedia('(min-width: 821px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  }


// Portfólio segmentado por estilo, com cards em profundidade.
// Apenas fotos fornecidas e identificadas no briefing. O mesmo trabalho pode figurar
// em mais de um estilo quando a técnica representada for compatível.
const gallery = document.querySelector('.window-gallery');
const galleryTrack = document.querySelector('#gallery-track');
const indicatorsContainer = document.querySelector('.gallery-indicators');
const galleryStatus = document.querySelector('#gallery-status');
const filterButtons = [...document.querySelectorAll('.style-filter')];
const collections = {
  botanica: [
    { file:'botanica-01.webp',name:'Lótus e linhas fluidas',alt:'Lótus em traços vermelhos e pretos sobre o braço' },
    { file:'botanica-02.webp',name:'Lírios vermelhos',alt:'Lírios de linhas vermelhas nas costas' },
    { file:'botanica-03.webp',name:'Lírios em blackwork',alt:'Composição de lírios pretos no braço' },
    { file:'botanica-04.webp',name:'Floral em blackwork',alt:'Tatuagem de flor ornamental preta na perna' },
    { file:'botanica-05.webp',name:'Floral orgânico',alt:'Flores e linhas fluidas em blackwork no braço' },
    { file:'botanica-06.webp',name:'Lírios e estrelas',alt:'Lírios pretos com pequenas estrelas no antebraço' },
    { file:'botanica-07.webp',name:'Botânica delicada',alt:'Composição floral delicada em blackwork no ombro' },
    { file:'botanica-08.webp',name:'Lírios com movimento',alt:'Três lírios desenhados em traços pretos no braço' },
    { file:'tatuagem-botanica.webp',name:'Composição botânica',alt:'Tatuagem botânica de grande formato nas costas' }
  ],
  blackwork: [
    { file:'tatuagem-lagarto.webp',name:'Lagarto',alt:'Tatuagem de lagarto em blackwork' },
    { file:'tatuagem-ornamental.webp',name:'Ornamental',alt:'Tatuagem ornamental em blackwork' },
    { file:'tatuagem-libelulas.webp',name:'Libélulas',alt:'Tatuagens de libélulas com traços escuros e detalhes vermelhos' }
  ],
  fineline: [
    { file:'tatuagem-ornamental.webp',name:'Ornamental',alt:'Tatuagem ornamental de linhas finas' },
    { file:'tatuagem-libelulas.webp',name:'Libélulas',alt:'Tatuagens de libélulas com contornos delicados' },
    { file:'tatuagem-botanica.webp',name:'Folhas delicadas',alt:'Tatuagem de folhagem composta por linhas delicadas' }
  ]
};
const categoryLabels={botanica:'Botânica',blackwork:'Blackwork',fineline:'Fineline'};
let category='botanica';
let current=0;
let slides=[];
let indicators=[];
let pointer=null;
let suppressClickUntil=0;
function stopAutoplay(){} // Galeria manual: nenhuma mudança automática de fotos.
function startAutoplay(){}
const mod=(n,m)=>((n%m)+m)%m;
function showSlide(target, userInitiated=false){
  if(!slides.length)return;
  current=mod(target,slides.length);
  slides.forEach((slide,i)=>{
    const distance=mod(i-current,slides.length);
    const state=distance===0?'is-active':distance===1?'is-next':distance===2?'is-next2':distance===3?'is-next3':'is-hidden';
    slide.className='gallery-slide '+state;
    slide.tabIndex=i===current?0:-1;
    slide.setAttribute('aria-hidden', String(distance>3));
    if(i===current) slide.setAttribute('aria-current','true');
    else slide.removeAttribute('aria-current');
  });
  indicators.forEach((dot,i)=>{
    dot.classList.toggle('is-active',i===current);
    dot.setAttribute('aria-pressed',String(i===current));
    if(i===current)dot.setAttribute('aria-current','true');
    else dot.removeAttribute('aria-current');
  });
  if(galleryStatus && (userInitiated || current===0)) galleryStatus.textContent=`${categoryLabels[category]}, ${slides[current].dataset.name}; trabalho ${current+1} de ${slides.length}`;
}
function renderCategory(nextCategory, focus=false){
  if(!collections[nextCategory] || !galleryTrack || !indicatorsContainer)return;
  category=nextCategory;
  current=0;
  const items=collections[category];
  galleryTrack.replaceChildren();
  indicatorsContainer.replaceChildren();
  slides=items.map((item,i)=>{
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='gallery-slide';
    btn.dataset.name=item.name;
    btn.setAttribute('aria-label',`${item.name}, foto ${i+1} de ${items.length}`);
    const img=document.createElement('img');
    img.src=`./assets/${item.file}`;
    img.alt=item.alt;
    img.width=480;img.height=853;
    img.loading=i<3?'eager':'lazy';img.decoding='async';
    const caption=document.createElement('span');
    caption.className='gallery-caption';caption.textContent=item.name.toLocaleUpperCase('pt-BR');
    btn.append(img,caption);
    btn.addEventListener('click',e=>{if(performance.now()<suppressClickUntil){e.preventDefault();return;}showSlide(i===current?current+1:i,true);});
    galleryTrack.appendChild(btn);
    return btn;
  });
  indicators=items.map((item,i)=>{
    const dot=document.createElement('button');
    dot.type='button';dot.className='gallery-dot';dot.dataset.index=String(i);
    dot.setAttribute('aria-label',`Ver ${item.name}, foto ${i+1} de ${items.length}`);
    dot.innerHTML='<span aria-hidden="true"></span>';
    dot.addEventListener('click',()=>showSlide(i,true));
    indicatorsContainer.appendChild(dot);
    return dot;
  });
  filterButtons.forEach(btn=>{
    const selected=btn.dataset.category===category;
    btn.classList.toggle('is-selected',selected);
    btn.setAttribute('aria-pressed',String(selected));
  });
  showSlide(0,true);
  if(focus){gallery?.focus({preventScroll:true});}
}
filterButtons.forEach(btn=>btn.addEventListener('click',()=>renderCategory(btn.dataset.category,false)));
gallery?.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'){e.preventDefault();showSlide(current+1,true);}
  if(e.key==='ArrowLeft'){e.preventDefault();showSlide(current-1,true);}
});
gallery?.addEventListener('pointerdown',e=>{pointer={id:e.pointerId,x:e.clientX,y:e.clientY};});
gallery?.addEventListener('pointerup',e=>{
  if(!pointer || pointer.id!==e.pointerId)return;
  const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
  if(Math.abs(dx)>38 && Math.abs(dx)>Math.abs(dy)*1.4){
    e.preventDefault();suppressClickUntil=performance.now()+400;showSlide(current+(dx<0?1:-1),true);
  }
  pointer=null;
});
gallery?.addEventListener('pointercancel',()=>{pointer=null;});
renderCategory('botanica');

  // Progress-linked four-point mark. Anchors are recomputed at resize/content changes.
  const star = document.querySelector('.scroll-star');
  const brandStar = document.querySelector('.brand-star');
  const starZones = [...document.querySelectorAll('.star-zone')];
  const botanicals = [...document.querySelectorAll('.parallax-botanical')];
  const footer = document.querySelector('.footer');
  let points = [];
  let vw = innerWidth, vh = innerHeight;
  let scheduled = false;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const mix = (a, b, t) => a + (b - a) * t;
  const zoneMap = [
    { section: '.hero', factor: .49, x: .83, y: .62, tone: 'light' },
    { section: '.portfolio-section', factor: .36, x: .14, y: .36, tone: 'light' },
    { section: '.artist-section', factor: .41, x: .83, y: .56, tone: 'dark' },
    { section: '.studio-section', factor: .39, x: .14, y: .38, tone: 'light' },
    { section: '.contact-section', factor: .33, x: .83, y: .59, tone: 'dark' },
    { section: '.footer', factor: .95, x: .87, y: .82, tone: 'light' }
  ];
  function collectPoints() {
    vw = window.innerWidth; vh = window.innerHeight;
    const anchor = brandStar?.getBoundingClientRect();
    const x = anchor ? anchor.left + anchor.width / 2 : Math.min(170, vw * .28);
    const y = anchor ? anchor.top + anchor.height / 2 : 60;
    const border = vw < 560 ? 23 : 36;
    points = [{ scroll: 0, x, y, tone: 'light' }];
    zoneMap.forEach(item => {
      const section = document.querySelector(item.section);
      if (!section) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      points.push({
        scroll: Math.max(1, top + section.offsetHeight * item.factor - vh * .28),
        x: clamp(vw * item.x, border, vw - border),
        y: clamp(vh * item.y, border, vh - border),
        tone: item.tone
      });
    });
    points.sort((a,b) => a.scroll - b.scroll);
  }
  function paintMotion() {
    scheduled = false;
    if (reducedMedia.matches) return;
    const scroll = window.scrollY;
    if (star && points.length > 1) {
      let i = 0;
      while (i < points.length - 2 && scroll > points[i + 1].scroll) i++;
      const a = points[i]; const b = points[i + 1];
      const t = clamp((scroll - a.scroll) / Math.max(1, b.scroll - a.scroll), 0, 1);
      const ease = t * t * (3 - 2 * t);
      const x = mix(a.x, b.x, ease); const y = mix(a.y, b.y, ease);
      const size = vw < 560 ? 22 : 32;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = scroll < 26 ? '0' : '1';
      star.style.transform = `translate3d(${(x - size / 2).toFixed(1)}px,${(y - size / 2).toFixed(1)}px,0) rotate(${(scroll * .05).toFixed(1)}deg)`;
      star.dataset.tone = t < .5 ? a.tone : b.tone;
      window.dispatchEvent(new CustomEvent('aura:star-position', {detail:{x,y,visible:scroll >= 26}}));
    }
    // Only three inexpensive decorative elements. Read all geometry before writing styles.
    const plantStates = botanicals.map(el => {
      const box = el.parentElement.getBoundingClientRect();
      const ratio = clamp((vh * .5 - (box.top + box.height * .5)) / (vh + box.height), -1, 1);
      return { el, shift: ratio * Number(el.dataset.parallax || 15) };
    });
    plantStates.forEach(({ el, shift }) => el.style.setProperty('--shift', `${shift.toFixed(1)}px`));
    if (footer) {
      const box = footer.getBoundingClientRect();
      const progress = clamp((vh - box.top) / Math.max(150, Math.min(vh, box.height)), 0, 1);
      footer.style.setProperty('--lace-progress', progress.toFixed(3));
    }
  }
  function requestPaint() { if (!scheduled) { scheduled = true; requestAnimationFrame(paintMotion); } }
  function resetMotion() {
    stopAutoplay();
    if (reducedMedia.matches) {
      body.classList.remove('motion-ready');
      botanicals.forEach(el => el.style.removeProperty('--shift'));
      if (footer) footer.style.removeProperty('--lace-progress');
      if (star) star.style.opacity = '0';
      return;
    }
    if (star) star.style.removeProperty('opacity');
    collectPoints();
    body.classList.add('motion-ready');
    requestPaint();
    startAutoplay();
  }
  if (star && brandStar && 'requestAnimationFrame' in window) {
    window.addEventListener('scroll', requestPaint, { passive: true });
    window.addEventListener('resize', () => { collectPoints(); requestPaint(); }, { passive: true });
    window.addEventListener('load', () => { collectPoints(); requestPaint(); }, { once: true });
    reducedMedia.addEventListener('change', resetMotion);
    resetMotion();
  }
})();