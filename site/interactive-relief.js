/* Aura / sombras direcionais nos controles, botões, links, mapas e cards.
   Só aplica nas superfícies visíveis próximas à estrela.
   Usa a classe aura-lux-on para seguir o interruptor de luz existente. */
(() => {
 'use strict';
 const root=document.body;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const excluded='a.gallery-slide,button.gallery-slide,.studio-photo-next';
 const selectors='a[href],button, [role="tab"]';
 const surfacesSelector='.studio-location,.studio-photo-stage,.map-embed';
 let pressables=[],surfaces=[],scheduled=false;
 let last={x:-9999,y:-9999,visible:false};
 function collect(){
   pressables=[...document.querySelectorAll(selectors)]
     .filter(el=>!el.matches(excluded));
   surfaces=[...document.querySelectorAll(surfacesSelector)];
   pressables.forEach(el=>el.classList.add('aura-ux-pressable'));
   surfaces.forEach(el=>el.classList.add('aura-ux-surface'));
 }
 function clean(){
   for(const el of pressables){
     el.classList.remove('aura-ux-near');
     el.style.removeProperty('--aura-ux-shadow');
     el.style.removeProperty('--aura-ux-text-shadow');
     if(el.classList.contains('style-filter')){
       for(const key of ['--aura-filter-x','--aura-filter-y','--aura-filter-glint','--aura-filter-light-x','--aura-filter-light-y'])el.style.removeProperty(key);
     }
   }
   for(const el of surfaces)el.style.removeProperty('--aura-ux-panel-shadow');
 }
 function run(){
   scheduled=false;
   if(reduced.matches||!root.classList.contains('aura-lux-on')||!last.visible){
     clean();return;
   }
   const {x,y}=last;
   const radius=innerWidth<=700?420:680;
   const update=(el,surface)=>{
     if(el.closest('[hidden]')||el.hasAttribute('hidden'))return;
     const b=el.getBoundingClientRect();
     if(b.width===0||b.height===0||b.bottom < -50||b.top > innerHeight+50)return;
     const nx=clamp(x,b.left,b.right),ny=clamp(y,b.top,b.bottom);
     const d=Math.hypot(x-nx,y-ny);
     const gain=Math.pow(clamp(1-d/radius,0,1),1.32);
     const cx=b.left+b.width/2,cy=b.top+b.height/2;
     const mag=Math.max(70,Math.hypot(cx-x,cy-y));
     const dx=(cx-x)/mag,dy=(cy-y)/mag;
     const sx=dx*(4+gain*16),sy=dy*(5+gain*18)+3,blur=5+gain*18;
     const alpha=.17+gain*.28;
     if(surface){
       el.style.setProperty('--aura-ux-panel-shadow',
         sx.toFixed(1)+'px '+sy.toFixed(1)+'px '+(blur+12).toFixed(1)+'px rgba(11,18,8,'+(alpha*.9).toFixed(3)+'),'+
         (-dx*(1+gain*2)).toFixed(1)+'px '+(-dy*(1+gain*2)).toFixed(1)+'px 1px rgba(255,243,202,'+(.08+gain*.22).toFixed(3)+')');
     }else{
       el.style.setProperty('--aura-ux-shadow',
         sx.toFixed(1)+'px '+sy.toFixed(1)+'px '+blur.toFixed(1)+'px rgba(11,18,8,'+alpha.toFixed(3)+')');
       el.style.setProperty('--aura-ux-text-shadow',
         (-dx*gain).toFixed(1)+'px '+(-dy*gain).toFixed(1)+'px '+(1+gain*3).toFixed(1)+'px rgba(255,240,195,'+(gain*.3).toFixed(2)+')');
       el.classList.toggle('aura-ux-near',gain>.12);
       if(el.classList.contains('style-filter')){
         const edgeX=1.2+dx*gain*4.2,edgeY=4.8+dy*gain*2.3;
         el.style.setProperty('--aura-filter-x',edgeX.toFixed(2)+'px');
         el.style.setProperty('--aura-filter-y',edgeY.toFixed(2)+'px');
         el.style.setProperty('--aura-filter-glint',(.2+gain*.72).toFixed(3));
         el.style.setProperty('--aura-filter-light-x',(x-b.left).toFixed(1)+'px');
         el.style.setProperty('--aura-filter-light-y',(y-b.top).toFixed(1)+'px');
       }
     }
   };
   surfaces.forEach(el=>update(el,true));
   pressables.forEach(el=>update(el,false));
 }
 function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(run)}}
 addEventListener('aura:star-position',e=>{if(e.detail){last=e.detail;queue();}});
 addEventListener('aura:studio-tab-changed',queue);
 addEventListener('aura:studio-photo-changed',queue);
 addEventListener('aura:portfolio-category-changed',queue);
 addEventListener('resize',queue,{passive:true});
 reduced.addEventListener('change',queue);
 new MutationObserver(queue).observe(root,{attributes:true,attributeFilter:['class']});
 collect();
 requestAnimationFrame(()=>{
   const b=document.querySelector('.scroll-star')?.getBoundingClientRect();
   if(b)last={x:b.left+b.width/2,y:b.top+b.height/2,visible:scrollY>26};
   queue();
 });
})();
