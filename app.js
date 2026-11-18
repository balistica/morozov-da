document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

const menu=document.querySelector('[data-menu]');
const links=document.querySelector('.navlinks');
if(menu&&links)menu.addEventListener('click',()=>links.classList.toggle('show'));

// Preloader
const preloader=document.querySelector('[data-preloader]');
const percent=document.querySelector('[data-loader-percent]');
const bar=document.querySelector('.preloader-bar i');
let p=0;
const timer=setInterval(()=>{
  p=Math.min(100,p+Math.random()*18+6);
  if(percent)percent.textContent=Math.round(p)+'%';
  if(bar)bar.style.width=p+'%';
  if(p>=100){
    clearInterval(timer);
    setTimeout(()=>{preloader&&preloader.classList.add('done');document.body.classList.add('loaded');},350);
  }
},130);

// Split headline into animated words
document.querySelectorAll('[data-split]').forEach(el=>{
  const words=el.innerHTML.split(' ');
  el.innerHTML=words.map((w,i)=>`<span class="word"><i style="animation-delay:${i*0.055}s">${w}</i></span>`).join(' ');
});

// Reveal on scroll
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      setTimeout(()=>entry.target.classList.add('visible'),i*70);
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.14});
document.querySelectorAll('[data-reveal]').forEach(el=>revealObserver.observe(el));

// Custom cursor
const cursor=document.querySelector('[data-cursor]');
const ring=document.querySelector('[data-cursor-ring]');
let cx=innerWidth/2,cy=innerHeight/2,rx=cx,ry=cy;
addEventListener('mousemove',e=>{cx=e.clientX;cy=e.clientY;if(cursor){cursor.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`}});
(function loop(){rx+=(cx-rx)*.14;ry+=(cy-ry)*.14;if(ring)ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(loop)})();
document.querySelectorAll('a,button,[data-tilt]').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring&&ring.classList.add('active'));
  el.addEventListener('mouseleave',()=>ring&&ring.classList.remove('active'));
});

// Magnetic buttons
document.querySelectorAll('[data-magnetic]').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.22;
    const y=(e.clientY-r.top-r.height/2)*.22;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='translate(0,0)');
});

// 3D tilt
document.querySelectorAll('[data-tilt]').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-.5;
    const py=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`perspective(1000px) rotateY(${px*9}deg) rotateX(${-py*9}deg) scale(1.015)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='perspective(1000px) rotateY(0) rotateX(0) scale(1)');
});

// Counters
const counterObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const el=entry.target,target=+el.dataset.count;let current=0;
    const step=()=>{current+=Math.max(1,target/45);if(current>=target){el.textContent=target;return}el.textContent=Math.floor(current);requestAnimationFrame(step)};
    step();counterObserver.unobserve(el);
  });
},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>counterObserver.observe(el));

// Particle constellation
const canvas=document.getElementById('particles');
if(canvas){
  const ctx=canvas.getContext('2d');
  let w,h,particles=[],mouse={x:-999,y:-999};
  const resize=()=>{w=canvas.width=innerWidth;h=canvas.height=innerHeight;const count=Math.min(110,Math.floor(w*h/16000));particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.6+.4}))};
  resize();addEventListener('resize',resize);
  addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY});
  const animate=()=>{
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx*=-1;
      if(p.y<0||p.y>h)p.vy*=-1;
      const dx=mouse.x-p.x,dy=mouse.y-p.y,d=Math.hypot(dx,dy);
      if(d<170){p.x-=dx*.008;p.y-=dy*.008}
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(200,241,105,.55)';ctx.fill();
    });
    for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){
      const a=particles[i],b=particles[j],dist=Math.hypot(a.x-b.x,a.y-b.y);
      if(dist<125){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(200,241,105,${.11*(1-dist/125)})`;ctx.lineWidth=.6;ctx.stroke()}
    }
    requestAnimationFrame(animate);
  };
  animate();
}
