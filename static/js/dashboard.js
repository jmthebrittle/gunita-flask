document.addEventListener('DOMContentLoaded', () => {
    setupHeartIcons();
    setupModals();
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

function setupModals() {
    const confirmModal = document.getElementById('confirmationModal');
    confirmModal.confirmBtn = document.getElementById('confirmRemove');
    confirmModal.cancelBtn = document.getElementById('cancelRemove');
    confirmModal.closeBtn = document.getElementById('closeConfirmModal');

    confirmModal.closeBtn.onclick = () => {
        confirmModal.style.display = 'none';
    };
    confirmModal.cancelBtn.onclick = () => {
        confirmModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    };
}

function confirmRemoval(event, element) {
    event.preventDefault();
    event.stopPropagation();

    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'block';
    modal.currentItem = element.closest('.tab-item');

    modal.confirmBtn.onclick = () => {
        const itemData = {
            img: modal.currentItem.querySelector('img').src,
            text: modal.currentItem.querySelector('.tab-text').innerText,
            category: modal.currentItem.querySelector('.heart-icon-container').dataset.category
        };

        
        modal.currentItem.remove();
        
        // Send delete request
        removeItem(itemData).then(response => {
            if (response.status === 'success') {
                modal.style.display = 'none';
                alert('Item removed from the dashboard.'); 
            } else {
                alert('Failed to remove the item.'); 
            }
        });
    };
}

function toggleFavorite(event, element, adding) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    element.classList.toggle('active', adding);
    const isSaved = element.classList.contains('active');

    const tab = element.closest('.tab-item');
    const itemData = {
        img: tab.querySelector('img').src,
        text: tab.querySelector('.tab-text').innerText,
        category: tab.closest('a').classList.contains('tab-activities') ? 'activities' :
                  tab.closest('a').classList.contains('tab-attractions') ? 'attractions' :
                  tab.closest('a').classList.contains('tab-events') ? 'events' :
                  'food',
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
        } else {
            alert('Failed to add the item to the dashboard.'); 
        }
    });
}

function removeItem(itemData) {
    return fetch('/remove_item', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            location.reload();  
        } else {
            alert('Failed to remove the item from the dashboard.'); 
        }
    });
}
