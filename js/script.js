const scrollContainer = document.querySelector('.accommodations');

function scrollLeft() {
    scrollContainer.scrollBy({
        left: -150,
        behavior: 'smooth'
    });
}

function scrollRight() {
    scrollContainer.scrollBy({
        left: 150,
        behavior: 'smooth'
    });
}
