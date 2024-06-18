function toggleHeart(event, element) {
    event.preventDefault();
    event.stopPropagation();

    const heartContainer = element.closest('.heart-icon-container');
    heartContainer.classList.toggle('active');
    const isSaved = heartContainer.classList.contains('active');

    const tab = heartContainer.closest('.tab-portrait');
    const itemData = {
        img: tab.querySelector('img').src,
        text: tab.querySelector('.tab-text').innerText,
        link: tab.href,
        category: tab.classList.contains('tab-events') ? 'events' :
                  tab.classList.contains('tab-attraction') ? 'attractions' :
                  tab.classList.contains('tab-activities') ? 'activities' :
                  'food'
    };

    if (isSaved) {
        saveItem(itemData);
    } else {
        removeItem(itemData);
    }
}

function saveItem(itemData) {
    const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    savedItems.push(itemData);
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    updateDashboard(itemData, 'add');
}

function removeItem(itemData) {
    let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    savedItems = savedItems.filter(item => item.img !== itemData.img);
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    updateDashboard(itemData, 'remove');
}

function updateDashboard(itemData, action) {
    const dashboardItems = document.querySelectorAll('.saved-item');
    dashboardItems.forEach(item => {
        if (item.querySelector('img').src === itemData.img) {
            if (action === 'remove') {
                item.remove();
            }
            return;
        }
    });

    if (action === 'add') {
        addDashboardItem(itemData);
    }
}

function addDashboardItem(itemData) {
    const overviewContainer = document.querySelector('#mySavedItems');
    const categoryContainer = document.querySelector(`#${itemData.category}`);

    const newItem = `
    <div class="saved-item">
        <a href="${itemData.link}">
            <img src="${itemData.img}" alt="${itemData.text}">
            <p>${itemData.text}</p>
        </a>
    </div>`;

    overviewContainer.innerHTML += newItem;
    categoryContainer.innerHTML += newItem;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    savedItems.forEach(itemData => {
        addDashboardItem(itemData);
    });
});
