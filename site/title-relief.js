/* Títulos com extrusão tipográfica suave: deslocamento oposto à fonte luminosa. */
(() => {
 'use strict';
 const body=document.body,titles=[...document.querySelectorAll('.hero h1,.portfolio-text h2,.artist-intro h2,.studio-intro h2,.contact-copy h2')];
 if(!titles.length)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),cache={x:0,y:0,visible:false};
 titles.forEach(el=>el.classList.add('aura-relief-title'));
 function reset(){titles.forEach(el=>el.style.removeProperty('text-shadow'))}
 function render(x,y,visible){
   cache.x=x;cache.y=y;cache.visible=visible;
   if(!body.classList.contains('aura-lux-on')||reduced.matches){reset();return}
   const radius=innerWidth<700?540:900;
   for(const el of titles){
     const b=el.getBoundingClientRect();if(b.bottom < -100||b.top > innerHeight+100)continue;
     const cx=b.left+b.width*.5,cy=b.top+b.height*.5,dist=Math.hypot(cx-x,cy-y);
     const strength=visible?Math.pow(clamp(1-dist/radius,0,1),1.4):0;
     const mag=Math.max(90,dist),dx=(cx-x)/mag,dy=(cy-y)/mag;
     const paper=!!el.closest('.artist-section,.contact-section'),extent=2.8+strength*10.5;
     const sx=dx*extent,sy=dy*extent+1.8,dark=(paper?.29:.32)+strength*(paper?.22:.24),glow=(paper?.54:.42)+strength*.23;
     const sh=[
       (sx*.23).toFixed(2)+'px '+(sy*.23).toFixed(2)+'px 0 rgba(23,29,19,'+(.12+strength*.14).toFixed(3)+')',
       (sx*.58).toFixed(2)+'px '+(sy*.58).toFixed(2)+'px 1px rgba(22,28,17,'+(dark*.67).toFixed(3)+')',
       sx.toFixed(2)+'px '+sy.toFixed(2)+'px '+(3+strength*9).toFixed(1)+'px rgba(10,18,10,'+dark.toFixed(3)+')',
       (-dx*(.8+strength*1.8)).toFixed(2)+'px '+(-dy*(.8+strength*1.8)).toFixed(2)+'px 1px rgba(255,244,208,'+glow.toFixed(3)+')'
     ];
     el.style.textShadow=sh.join(',');
   }
 }
 addEventListener('aura:star-position',e=>{if(e.detail)render(e.detail.x,e.detail.y,e.detail.visible)});
 new MutationObserver(()=>render(cache.x,cache.y,cache.visible)).observe(body,{attributes:true,attributeFilter:['class']});
 reduced.addEventListener('change',()=>render(cache.x,cache.y,cache.visible));
 addEventListener('resize',()=>render(cache.x,cache.y,cache.visible),{passive:true});
 requestAnimationFrame(()=>{const b=document.querySelector('.scroll-star')?.getBoundingClientRect();if(b)render(b.left+b.width/2,b.top+b.height/2,scrollY>26)});
})();