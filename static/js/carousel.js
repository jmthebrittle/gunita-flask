document.addEventListener('DOMContentLoaded', () => {
    setupCarousel();
});

function setupCarousel() {
    const carousels = document.querySelectorAll(".recommended-carousel .carousel-content");
    const prevButton = document.querySelector(".carousel-prev");
    const nextButton = document.querySelector(".carousel-next");
    let currentIndex = 0;

    function showCarousel(index) {
        carousels.forEach((carousel, i) => {
            if (i === index) {
                carousel.classList.add("active");
                carousel.style.transform = "translateX(0)";
            } else {
                carousel.classList.remove("active");
                carousel.style.transform = `translateX(${i > index ? 100 : -100}%)`;
            }
        });
    }

    function nextCarousel() {
        currentIndex = (currentIndex + 1) % carousels.length;
        showCarousel(currentIndex);
    }

    function prevCarousel() {
        currentIndex = (currentIndex - 1 + carousels.length) % carousels.length;
        showCarousel(currentIndex);
    }

    showCarousel(currentIndex);
    setInterval(nextCarousel, 5000); // Rotate every 5 seconds

    // Event listeners for buttons
    prevButton.addEventListener("click", prevCarousel);
    nextButton.addEventListener("click", nextCarousel);
}

// Call setupCarousel on window load
window.addEventListener('load', setupCarousel);