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


// Miniatura em profundidade sobre a FOTO DA JANELA, sem tapar o cenário.
const gallery = document.querySelector('.window-gallery');
const slides = [...document.querySelectorAll('.gallery-slide')];
const count = document.querySelector('#gallery-count');
const prev = document.querySelector('#gallery-prev');
const next = document.querySelector('#gallery-next');
let current = 0, autoplay = null, galleryVisible = false, userPaused = false, pointer = null;
const pad = n => String(n).padStart(2, '0');
const mod = (n, count) => (n % count + count) % count;
function stopAutoplay(){ if(autoplay!==null){ clearInterval(autoplay); autoplay=null; } }
function showSlide(index, manual = false){
  if(!slides.length) return;
  current=mod(index,slides.length);
  const before=mod(current-1,slides.length);
  const after=mod(current+1,slides.length);
  slides.forEach((slide,i)=>{
    slide.classList.remove('is-active','is-left','is-right','is-back');
    const active=i===current;
    slide.classList.add(active?'is-active':i===before?'is-left':i===after?'is-right':'is-back');
    slide.setAttribute('aria-hidden',String(!active));
    slide.inert=!active;
  });
  if(count) count.innerHTML=`${pad(current+1)} <span>/</span> ${pad(slides.length)}`;
  if(manual){userPaused=true;stopAutoplay();}
}
function startAutoplay(){
  if(reducedMedia.matches||userPaused||!galleryVisible||document.hidden||autoplay!==null||slides.length<2)return;
  autoplay=setInterval(()=>showSlide(current+1),6500);
}
prev?.addEventListener('click',()=>showSlide(current-1,true));
next?.addEventListener('click',()=>showSlide(current+1,true));
gallery?.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'){e.preventDefault();showSlide(current+1,true);}
  if(e.key==='ArrowLeft'){e.preventDefault();showSlide(current-1,true);}
});
gallery?.addEventListener('pointerdown',e=>{
  if(e.target.closest('button,a'))return;
  pointer={id:e.pointerId,x:e.clientX,y:e.clientY};
});
gallery?.addEventListener('pointerup',e=>{
  if(!pointer||pointer.id!==e.pointerId)return;
  const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
  if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy)*1.3)showSlide(current+(dx<0?1:-1),true);
  pointer=null;
});
gallery?.addEventListener('pointercancel',()=>{pointer=null;});
gallery?.addEventListener('mouseenter',stopAutoplay);
gallery?.addEventListener('mouseleave',startAutoplay);
gallery?.addEventListener('focusin',stopAutoplay);
gallery?.addEventListener('focusout',e=>{if(!gallery.contains(e.relatedTarget))startAutoplay();});
document.addEventListener('visibilitychange',()=>document.hidden?stopAutoplay():startAutoplay());
window.addEventListener('blur',()=>{pointer=null;stopAutoplay();});
if('IntersectionObserver' in window&&gallery){
  const io=new IntersectionObserver(entries=>{
    galleryVisible=entries[0].isIntersecting;
    galleryVisible?startAutoplay():stopAutoplay();
  },{threshold:.3});io.observe(gallery);
}
showSlide(0);

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
    { section: '.portfolio-section', factor: .36, x: .14, y: .36, tone: 'dark' },
    { section: '.artist-section', factor: .41, x: .83, y: .56, tone: 'light' },
    { section: '.studio-section', factor: .39, x: .14, y: .38, tone: 'dark' },
    { section: '.contact-section', factor: .33, x: .83, y: .59, tone: 'light' },
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
      star.style.transform = `translate3d(${(x - size / 2).toFixed(1)}px,${(y - size / 2).toFixed(1)}px,0) rotate(${(scroll * .05).toFixed(1)}deg)`;
      star.dataset.tone = t < .5 ? a.tone : b.tone;
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