/* Valida layout real do portfólio no Chromium (desktop, notebook, tablet e celular). */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const width of [1792,1536,1366,1024,821,820,390,320]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   await page.goto('http://127.0.0.1:8765/#portfolio',{waitUntil:'domcontentloaded'});
   await page.locator('.portfolio-text').waitFor();
   const state=await page.evaluate(()=>{
    const l=document.querySelector('.portfolio-layout');
    const v=document.querySelector('.portfolio-visual');
    const t=document.querySelector('.portfolio-text');
    const get=r=>{const b=r.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height}};
    return {siblings:v.parentElement===l&&t.parentElement===l,display:getComputedStyle(l).display,columns:getComputedStyle(l).gridTemplateColumns,v:get(v),t:get(t)};
   });
   assert(state.siblings,'Elementos devem ser irmãos diretos no grid; viewport '+width);
   assert.equal(state.display,'grid','Display grid esperado em '+width);
   if(width>=821){
    const overlap=Math.min(state.v.bottom,state.t.bottom)-Math.max(state.v.y,state.t.y);
    assert(state.t.x>=state.v.right-2,'Texto fora da coluna direita em '+width+': '+JSON.stringify(state));
    assert(overlap>=Math.min(state.v.height,state.t.height)*.45,'Não aparecem simultaneamente em '+width+': '+JSON.stringify(state));
   }else{
    assert(state.t.y>=state.v.bottom-2,'Mobile deve empilhar verticalmente em '+width+': '+JSON.stringify(state));
   }
   console.log('PASS '+width+'px: '+state.columns+'; galeria em '+Math.round(state.v.x)+', texto em '+Math.round(state.t.x));
   if(width===1366||width===390)await page.locator('#portfolio').screenshot({path:'/tmp/aura-portfolio-'+width+'.png'});
   await page.close();
  }
  const page=await browser.newPage({viewport:{width:1366,height:900}});
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  for(const [category,expected] of [['blackwork',13],['botanica',10],['fineline',3]]){
   await page.locator('.style-filter[data-category="'+category+'"]').click();
   const actual=await page.locator('#gallery-track .gallery-slide').count();
   assert.equal(actual,expected,'Categoria '+category);
   console.log('PASS filtro '+category+': '+actual+' fotografias');
  }
  const thumbnail=page.locator('.portfolio-small-photo img');
  await thumbnail.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{
    const img=document.querySelector('.portfolio-small-photo img');
    return img && img.complete && img.naturalWidth>0;
  });
  assert((await thumbnail.getAttribute('src')).includes('pezinho-bebe.webp'),'Miniatura do pezinho não encontrada');
  console.log('PASS miniatura do pezinho carregada');
  const video=page.locator('#aura-hero-video');
  assert(!(await video.getAttribute('muted')),'Video não deve iniciar com atributo muted');
  assert.equal(await page.locator('#aura-hero-sound').count(),1,'Controle de som indisponível');
  console.log('PASS preferência de áudio ligada; controle de som presente');
  for(const selector of ['.brand-name .brand-u .brand-star','.footer-brand .brand-u .brand-star']){
    const data=await page.locator(selector).evaluate(el=>{
      const u=el.closest('.brand-u').getBoundingClientRect();
      const s=el.getBoundingClientRect();
      return {dx:Math.abs((u.left+u.width/2)-(s.left+s.width/2)),gap:s.bottom-u.top};
    });
    assert(data.dx<3,'Estrela não centrada no U: '+selector+' '+JSON.stringify(data));
    assert(data.gap>=0,'Estrela acima demais do U: '+selector+' '+JSON.stringify(data));
    console.log('PASS estrela alinhada: '+selector+' gap='+data.gap.toFixed(2));
  }
  // Regressão: não pausar vídeo/música ao abandonar visualmente o hero.
  const audioPage=await browser.newPage({viewport:{width:1366,height:900},reducedMotion:'no-preference'});
  await audioPage.addInitScript(()=>{
    const oldPause=HTMLMediaElement.prototype.pause;
    window.__aura_pauses=0;
    HTMLMediaElement.prototype.pause=function(...args){
      if(this.id==='aura-hero-video')window.__aura_pauses++;
      return oldPause.apply(this,args);
    };
  });
  await audioPage.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  await audioPage.waitForTimeout(300);
  const before=await audioPage.evaluate(()=>window.__aura_pauses);
  await audioPage.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  await audioPage.waitForTimeout(650);
  const after=await audioPage.evaluate(()=>window.__aura_pauses);
  assert.equal(after,before,'Rolar a página não deve chamar video.pause()');
  console.log('PASS video nao pausa ao navegar ate o final');
  // Som e luz ficam juntos, fixos e visíveis ao chegar ao rodapé.
  async function assertControlsInViewport(p,width) {
    const result=await p.evaluate(()=>{
      const group=document.querySelector('.aura-floating-controls');
      const sound=document.querySelector('#aura-hero-sound');
      const light=document.querySelector('.aura-lux-toggle');
      if(!group||!sound||!light)return {missing:true};
      const get=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
      return {
        grouped:sound.parentElement===group&&light.parentElement===group,
        fixed:getComputedStyle(group).position==='fixed',
        group:get(group),sound:get(sound),light:get(light),
        soundHidden:getComputedStyle(sound).visibility==='hidden'
      };
    });
    assert(!result.missing&&result.grouped&&result.fixed,'Controles devem ficar agrupados em posição fixa: '+width);
    assert(result.sound.width>=43&&result.light.width>=43&&!result.soundHidden,'Controles não visíveis em '+width);
    assert(result.sound.right<=result.light.left+1,'Som deve ficar à esquerda da luz em '+width);
    assert(result.sound.left>=0&&result.light.right<=width+1,'Controles fora da viewport em '+width);
    assert(result.sound.bottom<=900+1&&result.light.bottom<=900+1,'Controles fora da altura da tela em '+width);
    console.log('PASS controles flutuantes de som e luz em '+width+'px');
  }
  await assertControlsInViewport(audioPage,1366);
  const mobileAudioPage=await browser.newPage({viewport:{width:390,height:900},reducedMotion:'no-preference'});
  await mobileAudioPage.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  await mobileAudioPage.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  await mobileAudioPage.waitForTimeout(200);
  await assertControlsInViewport(mobileAudioPage,390);
  await mobileAudioPage.close();
  await audioPage.close();
  const icon=await page.locator('link[rel="icon"]').getAttribute('href');
  assert(icon&&icon.includes('favicon.svg'),'Favicon da estrela ausente');
  await page.close();
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
