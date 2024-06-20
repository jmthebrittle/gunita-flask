document.addEventListener('DOMContentLoaded', () => {
    setupHeartIcons();
});

function setupHeartIcons() {
    const heartIcons = document.querySelectorAll('.heart-icon-container');
    heartIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            const isAdding = !icon.classList.contains('active');
            toggleFavorite(event, icon, isAdding);
        });
    });
}

function toggleFavorite(event, element, adding) {
    event.preventDefault();
    event.stopPropagation();

    const tab = element.closest('.tab-content');
    const itemData = {
        img: element.getAttribute('data-img'),
        text: element.getAttribute('data-text'),
        category: element.getAttribute('data-category')
    };

    element.classList.toggle('active', adding);

    if (adding) {
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
        console.log('Item saved:', data);
        // Optionally update UI here
    })
    .catch(error => {
        console.error('Error saving item:', error);
    });
}

function removeItem(itemData) {
    fetch('/remove_item', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Item removed:', data);
        // Optionally update UI here
    })
    .catch(error => {
        console.error('Error removing item:', error);
    });
}
