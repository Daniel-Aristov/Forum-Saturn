const speakerSwiper = new Swiper('.swiper-container', {
    slidesPerView: 5,
    slideToClickedSlide: true,
    grabCursor: true,
    centeredSlides: true,
    initialSlide: 4,
    loop: true,

    breakpoints: {
        100: {
            slidesPerView: 3,
            spaceBetween: 5
        },
        576: {
            slidesPerView: 3,
            spaceBetween: 5
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 5
        },
        992: {
            slidesPerView: 4,
            spaceBetween: 10
        },
        1200: {
            slidesPerView: 4,
            spaceBetween: 10
        },
        1400: {
            slidesPerView: 5,
            spaceBetween: 15
        }
    }
});

speakerSwiper.on('slideChange', function () {
  let slides = document.querySelectorAll('.swiper-slide .moreInfo-speaker');
  slides.forEach(function (slide) {
      slide.classList.remove("show");
  })
});

speakerSwiper.on('touchMove', function () {
  let slides = document.querySelectorAll('.swiper-slide .moreInfo-speaker');
  slides.forEach(function (slide) {
      slide.classList.remove("show");
  })
});

// Событие на кнопку получения подробной информации о спикере
let btnsCloseMoreInfoSpeaker = document.querySelectorAll('.close-more-info');
let btnsMoreInfoSpeaker = document.querySelectorAll('.swiper-icon');
btnsMoreInfoSpeaker.forEach(function(btn) {
    btn.addEventListener("click", () => {
        let items = document.querySelectorAll('.swiper-slide.swiper-slide-active .moreInfo-speaker')[0];
        items.classList.add("show");
    })
    btnsCloseMoreInfoSpeaker.forEach(function (btn) {
        btn.addEventListener("click", () => {
            let items = document.querySelectorAll('.swiper-slide.swiper-slide-active .moreInfo-speaker')[0];
            items.classList.remove("show");
        })
    })
})
