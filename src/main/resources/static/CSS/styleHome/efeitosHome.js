// ScrollReveal da Home
ScrollReveal().reveal('.reveal1', {
    delay: 1,
    duration: 1000,
    origin: 'top',
    distance: '90px',
    easing: 'ease-in-out',
    reset: false
});
 
ScrollReveal().reveal('.reveal2', {
    delay: 1,
    duration: 1000,
    origin: 'left',
    distance: '90px',
    easing: 'ease-in-out',
    reset: false
});
 
// Menu hamburguer
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('header nav');
const menu = nav.querySelector('.ulHeader');
 
hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
});
 
// Animação da logo ao detectar Scroll
if (window.innerWidth > 768) {
    const header = document.querySelector('header');
    const logo = document.querySelector('.imgLogo');
    const headerItems = Array.from(header.children).filter(el => el !== logo);
    let lastScroll = 0;
 
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
 
        if (currentScroll > lastScroll && currentScroll > 50) {
            header.style.position = 'fixed';
            header.style.top = '0';
            header.style.width = '100%';
            header.style.zIndex = '1000';
            header.style.background = 'white';
            header.style.boxShadow = '0 5px 15px gray';
            header.style.height = '16vh';
 
            headerItems.forEach(item => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '0';
                item.style.pointerEvents = 'none';
            });
 
            logo.style.transition = 'all 0.5s ease';
            logo.style.display = 'block';
            logo.style.paddingRight = '0';
            logo.style.paddingLeft = '43%';
 
        } else if (currentScroll === 0) {
            header.style.position = 'relative';
            header.style.background = '';
            header.style.transition = 'all 1s ease';
            header.style.boxShadow = 'none';
            logo.style.paddingLeft = '10%';
            logo.style.margin = '';
            logo.style.display = '';
 
            headerItems.forEach(item => {
                item.style.opacity = '';
                item.style.pointerEvents = '';
            });
        }
 
        lastScroll = currentScroll;
    });
}