(()=>{
document.querySelectorAll('.ev').forEach(b=>b.onclick=()=>{document.querySelectorAll('.ev').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false')});b.classList.add('active');b.setAttribute('aria-pressed','true');document.getElementById('evidence-copy').textContent=b.dataset.copy});const scenarios={gradual:['MORE GROUNDED NEAR-TERM SCENARIO','NOW → 3 YEARS','Gradual AI integration','AI becomes a normal layer inside software and work. Many tasks change faster than entire occupations disappear.','Higher','High','82%','70%','Become AI-capable inside a real domain.','Learn where AI improves your work, strengthen judgment and domain knowledge, and verify machine output.'],rapid:['PLAUSIBLE HIGH-IMPACT SCENARIO','1 → 7 YEARS','Rapid workflow automation','Agents become reliable enough to automate larger end-to-end workflows, compressing some teams and changing entry paths.','Medium','Very high','58%','90%','Build leverage, not just task speed.','Own outcomes, learn orchestration and verification, and maintain financial flexibility while workflows reorganize.'],abundance:['LONGER-RANGE SCENARIO','3 → 15+ YEARS','Cheap intelligence','High-quality cognitive assistance becomes dramatically cheaper and widely available.','Lower','Transformative','38%','95%','Invest in judgment, relationships and ownership.','When execution gets cheap, deciding what matters, earning trust and owning useful assets can become more important.'],disruption:['TAIL-RISK SCENARIO','UNCERTAIN TIMELINE','Severe disruption','Capability growth outruns institutions, labor adaptation or safety controls.','Low','Extreme','24%','100%','Keep options open.','Maintain financial resilience, strong communities, adaptable skills and attention to credible warning signals rather than hype.']};const toolkit=document.getElementById('toolkit');if(toolkit&&'IntersectionObserver'in window){toolkit.classList.add('motion-ready');const toolkitObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){toolkit.classList.add('is-visible');toolkitObserver.disconnect()}})},{threshold:.16});toolkitObserver.observe(toolkit)};document.querySelectorAll('.future-btn').forEach(b=>b.onclick=()=>{document.querySelectorAll('.future-btn').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false')});b.classList.add('active');b.setAttribute('aria-pressed','true');let s=scenarios[b.dataset.s],ids=['f-label','f-time','f-title','f-desc','evidence-val','impact-val'];ids.forEach((id,i)=>document.getElementById(id).textContent=s[i]);document.getElementById('evidence-meter').style.width=s[6];document.getElementById('impact-meter').style.width=s[7];document.getElementById('f-prepare').textContent=s[8];document.getElementById('f-action').textContent=s[9];if(innerWidth<=760)b.after(document.getElementById('future-panel'))});
const mobile=matchMedia('(max-width:760px)');
function positionFuturePanel(){
 const panel=document.getElementById('future-panel');
 const active=document.querySelector('.future-btn.active');
 if(mobile.matches)active.after(panel);else document.querySelector('.future-layout').append(panel);
}
mobile.addEventListener('change',positionFuturePanel);
positionFuturePanel();
})();

/* Progressive enhancement: all content remains visible without this script. */
(()=>{
 const header=document.querySelector('.site-header');
 const links=[...header.querySelectorAll('a[href^="#"]')];
 const sections=links.map(link=>({link,section:document.querySelector(link.getAttribute('href'))})).filter(item=>item.section);
 const progress=document.createElement('div');
 progress.className='home-progress';progress.setAttribute('aria-hidden','true');
 const bar=document.createElement('span');progress.append(bar);document.body.append(progress);
 let active=null,compact=false,queued=false;
 const update=()=>{
   const y=scrollY;
   compact=compact?y>30:y>120;
   header.classList.toggle('is-scrolled',compact);
   const boundary=header.getBoundingClientRect().bottom+45;
   let current=sections[0];
   for(const item of sections){if(item.section.getBoundingClientRect().top<=boundary)current=item;}
   if(current&&current!==active){
     for(const item of sections){
       if(item===current)item.link.setAttribute('aria-current','location');
       else item.link.removeAttribute('aria-current');
     }
     active=current;
   }
   const max=document.documentElement.scrollHeight-innerHeight;
   bar.style.transform='scaleX('+(max>0?Math.max(0,Math.min(1,y/max)):0)+')';
   queued=false;
 };
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
 if('ResizeObserver' in window)new ResizeObserver(schedule).observe(document.querySelector('main'));
 update();
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let observer;
 const items=[...document.querySelectorAll('.front-sidebar .side-story,.news-quick-grid>a,#archive .section-heading,.story-entry,.pulse-head,.pulse-card,.toolkit-head,.tk-chart,.tk-categories,.tk-reach,.futures-head,.robust-grid article,.follow-strip')];
 const revealAll=()=>{observer?.disconnect();items.forEach(item=>item.classList.remove('reveal-ready','is-revealed'));};
 const start=()=>{
   if(motion.matches||!('IntersectionObserver' in window)){revealAll();return;}
   observer?.disconnect();
   observer=new IntersectionObserver(entries=>{
     entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}});
   },{threshold:.08,rootMargin:'0px 0px 30px 0px'});
   items.forEach((item,i)=>{
     // Content already in view stays visible, including direct anchor visits.
     const rect=item.getBoundingClientRect();
     if(rect.top<innerHeight&&rect.bottom>0)return;
     item.style.setProperty('--reveal-delay',((i%3)*60)+'ms');
     item.classList.add('reveal-ready');observer.observe(item);
   });
 };
 motion.addEventListener('change',start);start();
})();
