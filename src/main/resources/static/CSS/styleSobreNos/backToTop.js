    // Back to top
    const btn = document.getElementById('topBtn');
    btn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
    // show/hide based on scroll
    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 240) btn.style.display = 'flex';
      else btn.style.display = 'none';
    });
    // initially hidden on small pages
    btn.style.display = 'none';