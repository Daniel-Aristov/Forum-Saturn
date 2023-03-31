// Переходы по якорным ссылкам
const getId = (link) => link.getAttribute('href').replace('#', '')
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.nav-item-link').forEach((link) => {
                link.classList.toggle(
                    'nav-item-link-active',
                    getId(link) === entry.target.id
                )
            })
        }
    })
}, {
    threshold: 0.7,
})

document.querySelectorAll('.section-scroll').forEach(
    (section) => observer.observe(section),
)

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        let href = this.getAttribute('href').substring(1);
        const scrollTarget = document.getElementById(href);
        const topOffset = 100;
        const elementPosition = scrollTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition - topOffset;

        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});
