const swiper = new Swiper('.swiper-container', {
    slidesPerView: 3,
    loop: true,
    spaceBetween: 30,
    autoplay: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    }
});