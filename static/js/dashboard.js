document.addEventListener('DOMContentLoaded', () => {
    setupHeartIcons();
    setupModal();
});

function setupHeartIcons() {
    const heartIcons = document.querySelectorAll('.heart-icon-container');
    heartIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            const isFavorite = icon.classList.contains('active');
            if (isFavorite) {
                confirmRemoval(event, icon);
            } else {
                toggleFavorite(event, icon, true);
            }
        });
    });
}

function setupModal() {
    const modal = document.getElementById('confirmationModal');
    const span = modal.querySelector('.close');
    const confirmBtn = document.getElementById('confirmRemove');
    const cancelBtn = document.getElementById('cancelRemove');

    span.onclick = function() {
        modal.style.display = 'none';
    }

    cancelBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    confirmBtn.onclick = function() {
        const item = modal.currentItem;
        removeFavorite(item);
        modal.style.display = 'none';
    }
}

function confirmRemoval(event, element) {
    event.preventDefault();
    event.stopPropagation();

    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'block';
    modal.currentItem = element.closest('.tab-content');
}

function removeFavorite(element) {
    toggleFavorite(null, element.querySelector('.heart-icon-container'), false);
    // Remove the item from the UI
    element.closest('.tab-portrait').remove();
}

function toggleFavorite(event, element, adding) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    element.classList.toggle('active', adding);
    const isSaved = element.classList.contains('active');

    const tab = element.closest('.tab-content');
    const itemData = {
        img: tab.querySelector('img').src,
        text: tab.querySelector('.tab-text').innerText,
        category: tab.closest('a').classList.contains('tab-activities') ? 'activities' :
                  tab.closest('a').classList.contains('tab-attraction') ? 'attractions' :
                  tab.closest('a').classList.contains('tab-events') ? 'events' :
                  'food'
    };

    if (isSaved) {
        saveItem(itemData);
    } else {
        // Make sure the item is removed from the backend
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
            location.reload();  // Reload to fetch new data
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
            // No need to reload the page; we already removed the item from the UI
        }
    });
}
