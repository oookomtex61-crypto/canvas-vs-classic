/* Visual layer: each route keeps its existing content and application form. */
const motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
let carouselTimer;
function enhancePage(){
  clearInterval(carouselTimer);
  revealObserver?.disconnect();
  const hero=document.querySelector('.hero'), visual=hero?.querySelector('.visual');
  if(visual){
    const original=visual.innerHTML;
    visual.classList.add('showcase');
    visual.innerHTML=`<div class="showcase-orbit" aria-hidden="true"></div><div class="showcase-stage">${original}</div><div class="showcase-controls" aria-label="Направления услуг"><button class="showcase-prev" aria-label="Предыдущее направление">←</button><div class="showcase-tabs" role="tablist" aria-label="Выбор направления">${services.map((s,i)=>`<button role="tab" id="showcase-tab-${i}" aria-controls="showcase-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-slide="${i}" aria-label="${s.name}"><span>0${i+1}</span></button>`).join('')}</div><button class="showcase-next" aria-label="Следующее направление">→</button></div><a class="showcase-caption" href="#repair"><span>01 / Ремонт оргтехники</span><b>Подробнее ↗</b></a>`;
    const stage=visual.querySelector('.showcase-stage');stage.id='showcase-panel';stage.setAttribute('role','tabpanel');stage.setAttribute('aria-labelledby','showcase-tab-0');
    const play=document.createElement('button');play.type='button';play.className='showcase-play';play.setAttribute('aria-label','Приостановить смену слайдов');play.textContent='Ⅱ';visual.querySelector('.showcase-controls').append(play);
    let playing=!motionQuery.matches,hovered=false,focused=false;
    function syncPlayback(){clearInterval(carouselTimer);play.textContent=playing?'Ⅱ':'▷';play.setAttribute('aria-label',playing?'Приостановить смену слайдов':'Включить смену слайдов');visual.classList.toggle('is-playing',playing&&!hovered&&!focused);if(playing&&!hovered&&!focused)carouselTimer=setInterval(()=>{if(!document.hidden&&visual.isConnected){const rect=visual.getBoundingClientRect();if(rect.bottom>0&&rect.top<window.innerHeight)setSlide(current+1)}},6500)}
    play.addEventListener('click',()=>{playing=!playing;syncPlayback()});
    visual.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hovered=true;syncPlayback()}});visual.addEventListener('pointerleave',()=>{hovered=false;syncPlayback()});
    visual.addEventListener('focusin',()=>{focused=true;syncPlayback()});visual.addEventListener('focusout',e=>{if(!visual.contains(e.relatedTarget)){focused=false;syncPlayback()}});
    let touchStart=null;stage.addEventListener('touchstart',e=>{touchStart=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});stage.addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart[0],dy=e.changedTouches[0].clientY-touchStart[1];touchStart=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){setSlide(current+(dx<0?1:-1));syncPlayback()}},{passive:true});
    let current=0;
    function setSlide(index,focus=false){
      current=(index+services.length)%services.length;const s=services[current];
      stage.innerHTML=current===0?original:`<div class="chip top"><b>●</b> ${current===1?'КАЧЕСТВО КАЖДОЙ СТРАНИЦЫ':'СЕРВИС ДЛЯ ТОРГОВОЙ ТОЧКИ'}</div><div class="device-sculpture device-${current}" role="img" aria-label="${s.short}"><div class="device-halo"></div><div class="device-face">${icon(current)}</div><div class="device-base"></div></div><div class="chip bottom"><b>↗</b> ${s.short.toUpperCase()}</div>`;
      stage.classList.remove('slide-enter');void stage.offsetWidth;stage.classList.add('slide-enter');stage.setAttribute('aria-labelledby',`showcase-tab-${current}`);
      visual.querySelectorAll('[role="tab"]').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===current));b.tabIndex=i===current?0:-1;if(focus&&i===current)b.focus()});
      const caption=visual.querySelector('.showcase-caption');caption.href='#'+s.id;caption.querySelector('span').textContent=`0${current+1} / ${s.name}`;
    }
    visual.querySelector('.showcase-prev').addEventListener('click',()=>setSlide(current-1));visual.querySelector('.showcase-next').addEventListener('click',()=>setSlide(current+1));
    visual.querySelectorAll('[data-slide]').forEach(b=>b.addEventListener('click',()=>setSlide(Number(b.dataset.slide))));
    visual.querySelector('.showcase-tabs').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();setSlide(current+(e.key==='ArrowRight'?1:-1),true)}});
    syncPlayback();
  }
  if(!motionQuery.matches&&'IntersectionObserver' in window){
    revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}})},{threshold:.08});
    document.querySelectorAll('.section-head,.card,.step,.business,.text-block,.cta').forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--reveal-delay',`${i%3*60}ms`);revealObserver.observe(el)});
  }
}
window.addEventListener('hashchange',enhancePage);enhancePage();
