document.addEventListener('DOMContentLoaded', () => {
    setupHeartIcons();
    setupModals();
    setupResetDashboardButton();
    setupSidebarLinks();
    setupSignOutButton();  
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

        removeItem(itemData).then(response => {
            if (response.status === 'success') {
                modal.currentItem.remove();
                modal.style.display = 'none';
                alert('Item removed from the dashboard.');
            } else {
                alert('Failed to remove the item.');
            }
        });
    };
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
        category: tab.closest('a').classList.contains('tab-activities') ? 'activities' :
                  tab.closest('a').classList.contains('tab-attractions') ? 'attractions' :
                  tab.closest('a').classList.contains('tab-events') ? 'events' :
                  'food',
    };

    if (!isSaved) {
        removeItem(itemData).then(response => {
            if (response.status === 'success') {
                alert('Item removed from the dashboard.');
            } else {
                alert('Failed to remove the item.');
            }
        });
    }
}

function removeItem(itemData) {
    return fetch('/remove_item', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    })
    .then(response => response.json());
}


function setupResetDashboardButton() {
    const resetButton = document.getElementById('resetDashboardBtn');
    const resetModal = document.getElementById('resetConfirmationModal');
    const confirmReset = document.getElementById('confirmReset');
    const cancelReset = document.getElementById('cancelReset');
    const closeResetModal = document.getElementById('closeResetModal');

    resetButton.addEventListener('click', () => {
        resetModal.style.display = 'block';
    });

    closeResetModal.onclick = () => {
        resetModal.style.display = 'none';
    };

    cancelReset.onclick = () => {
        resetModal.style.display = 'none';
    };

    confirmReset.onclick = () => {
        clearDashboard().then(response => {
            if (response.status === 'success') {
                alert('Dashboard cleared.');
                location.reload();
            } else {
                alert('Failed to clear the dashboard.');
            }
            resetModal.style.display = 'none';
        });
    };

    window.onclick = (event) => {
        if (event.target === resetModal) {
            resetModal.style.display = 'none';
        }
    };
}

function clearDashboard() {
    return fetch('/clear_dashboard', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json());
}

function scrollCarousel(category, direction) {
    const carouselWrapper = document.querySelector(`#saved-${category} .carousel-wrapper`);
    const scrollAmount = carouselWrapper.clientWidth / 2; // Adjust as needed
    if (direction === -1) {
        carouselWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        carouselWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

function setupSidebarLinks() {
    const links = document.querySelectorAll('.sidebar ul li a');
    
    links.forEach(link => {
        link.addEventListener('click', function () {
            links.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function setupSignOutButton() {
    const signOutButton = document.querySelector('.signout');
    signOutButton.addEventListener('click', () => {
        window.location.href = '/logout';
    });
}