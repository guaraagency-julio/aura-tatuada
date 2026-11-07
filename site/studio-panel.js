/* Aura / Studio: como é (fotos) / onde é (Google Maps). */
(() => {
  'use strict';
  const tabs=[...document.querySelectorAll('[data-studio-tab]')];
  const panelComo=document.querySelector('#studio-panel-como');
  const panelOnde=document.querySelector('#studio-panel-onde');
  const heading=document.querySelector('#studio-view-heading');
  const image=document.querySelector('#studio-photo');
  const stage=document.querySelector('#studio-photo-stage');
  const next=document.querySelector('#studio-photo-next');
  const dotsHolder=document.querySelector('#studio-photo-dots');
  const status=document.querySelector('#studio-photo-status');
  const map=panelOnde?.querySelector('iframe[data-src]');
  if(tabs.length!==2||!panelComo||!panelOnde||!image||!stage||!next||!dotsHolder)return;

  /* Fotos originais da pasta "studio por dentro" no Drive; WebP gerado no deploy. */
  const photos=[
    {n:'09',alt:'Vista geral do Aura Tatuada Studio, com parede verde, mobiliário e luz natural',caption:'O Aura e a luz natural.'},
    {n:'06',alt:'Área de atendimento e tatuagem com janelas amplas e plantas',caption:'Espaço de atendimento.'},
    {n:'05',alt:'Área de espera com plantas, poltronas e detalhes acolhedores',caption:'Um espaço para chegar e ficar à vontade.'},
    {n:'01',alt:'Maca e equipamentos de tatuagem junto ao espelho do estúdio',caption:'Cada detalhe da experiência.'},
    {n:'03',alt:'Tatuadora atendendo uma cliente no ambiente do estúdio',caption:'O processo de tatuar.'},
    {n:'08',alt:'Montagem fotográfica com registros dos ambientes e atendimentos da Aura',caption:'Momentos e ambientes do Aura.'},
    {n:'02',alt:'Quadro artístico com ilustração de gato, exposto no estúdio',caption:'Arte até nas paredes.'},
    {n:'11',alt:'Planta em vaso e objetos sobre a bancada, junto à janela',caption:'Detalhes que fazem parte do espaço.'},
    {n:'04',alt:'Folhagem verde com veios claros em detalhe no estúdio',caption:'A botânica está em todo lugar.'},
    {n:'07',alt:'Detalhe de folha de costela-de-adão em ambiente escuro',caption:'Texturas e formas da natureza.'},
    {n:'10',alt:'Camila em um registro espontâneo dentro do estúdio',caption:'Camila no seu ambiente criativo.'}
  ];
  let current=0,startX=0,startY=0,suppressClickUntil=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const dots=[];
  photos.forEach((p,i)=>{
    const dot=document.createElement('button');
    dot.type='button';
    dot.className='studio-photo-dot';
    dot.setAttribute('aria-label','Ver fotografia '+(i+1)+' de '+photos.length);
    dot.innerHTML='<span aria-hidden="true"></span>';
    dot.addEventListener('click',()=>show(i));
    dotsHolder.append(dot);
    dots.push(dot);
  });

  function show(i){
    current=(i+photos.length)%photos.length;
    const photo=photos[current];
    const src='./assets/studio/studio-'+photo.n+'.webp';
    image.alt=photo.alt;
    image.src=src;
    image.loading=current===0?'eager':'lazy';
    stage.style.setProperty('--studio-backdrop','url("'+src+'")');
    const caption=document.querySelector('#studio-photo-caption');
    if(caption)caption.textContent=photo.caption;
    if(status)status.textContent='Fotografia '+(current+1)+' de '+photos.length+'. '+photo.alt;
    dots.forEach((dot,index)=>{
      const selected=index===current;
      dot.setAttribute('aria-current',selected?'true':'false');
      dot.classList.toggle('is-active',selected);
    });
    /* Pré-carrega apenas a próxima imagem, sem baixar toda a galeria de uma vez. */
    if(!reduced.matches){
      const preload=new Image();
      preload.src='./assets/studio/studio-'+photos[(current+1)%photos.length].n+'.webp';
    }
    window.dispatchEvent(new CustomEvent('aura:studio-photo-changed'));
  }

  function activate(which){
    const isComo=which==='como';
    panelComo.hidden=!isComo;
    panelOnde.hidden=isComo;
    tabs.forEach(tab=>{
      const selected=tab.dataset.studioTab===which;
      tab.classList.toggle('is-active',selected);
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
    });
    if(heading)heading.textContent=isComo?'Por dentro do Aura.':'Onde a arte acontece.';
    if(!isComo&&map&&!map.src)map.src=map.dataset.src;
    window.dispatchEvent(new CustomEvent('aura:studio-tab-changed',{detail:{tab:which}}));
  }

  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>activate(tab.dataset.studioTab));
    tab.addEventListener('keydown',e=>{
      let nextIndex;
      if(e.key==='ArrowRight')nextIndex=(i+1)%tabs.length;
      else if(e.key==='ArrowLeft')nextIndex=(i-1+tabs.length)%tabs.length;
      else if(e.key==='Home')nextIndex=0;
      else if(e.key==='End')nextIndex=tabs.length-1;
      else return;
      e.preventDefault();
      tabs[nextIndex].focus();
      activate(tabs[nextIndex].dataset.studioTab);
    });
  });
  next.addEventListener('click',()=>{
    if(performance.now()<suppressClickUntil)return;
    show(current+1);
  });
  stage.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY;});
  stage.addEventListener('pointerup',e=>{
    const dx=e.clientX-startX,dy=e.clientY-startY;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.35){
      suppressClickUntil=performance.now()+450;
      show(current+(dx<0?1:-1));
    }
  });
  panelComo.addEventListener('keydown',e=>{
    if(e.target.closest('.studio-photo-dot'))return;
    if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}
    if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}
  });
  show(0);
  activate('como');
})();
