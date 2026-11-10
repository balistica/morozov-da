document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const menu=document.querySelector('[data-menu]'); if(menu) menu.addEventListener('click',()=>document.querySelector('.navlinks').classList.toggle('show'));
