document.addEventListener('DOMContentLoaded', () => {
    setupHeartIcons();
    setupCarousel();
});

function setupHeartIcons() {
    const heartIcons = document.querySelectorAll('.heart-icon-container');
    heartIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            toggleFavorite(event, icon, !icon.classList.contains('active'));
        });
    });
}

function toggleFavorite(event, element, adding) {
    event.preventDefault();
    event.stopPropagation();

    element.classList.toggle('active', adding);
    const isSaved = element.classList.contains('active');

    const tab = element.closest('.tab-item');
    const itemData = {
        img: tab.querySelector('img').src,
        text: tab.querySelector('.tab-text').innerText,
        category: tab.classList.contains('tab-activities') ? 'activities' :
                  tab.classList.contains('tab-attraction') ? 'attractions' :
                  tab.classList.contains('tab-events') ? 'events' :
                  'food'
    };

    if (isSaved) {
        saveItem(itemData);
    } else {
        removeItem(itemData);
    }
}

function saveItem(itemData) {
    fetch('/add_item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            location.reload(); 
        }
    });
}

function removeItem(itemData) {
    fetch('/remove_item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            location.reload(); 
        }
    });
}


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