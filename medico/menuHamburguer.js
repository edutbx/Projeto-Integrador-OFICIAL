const hamburguer = document.querySelector(".hamburguer");   
const navList = document.querySelector(".nav");

hamburguer.addEventListener("click", () => {
    navList.classList.toggle("active");
});
