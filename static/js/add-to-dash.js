function toggleHeart(event, element) {
    event.preventDefault();
    event.stopPropagation();

    const heartContainer = element.closest('.heart-icon-container');
    const isSaved = heartContainer.classList.contains('active');
    const img = heartContainer.dataset.img;
    const text = heartContainer.dataset.text;
    const category = heartContainer.dataset.category;

    const itemData = { img, text, category };

    if (isSaved) {
        if (confirm('Are you sure you want to remove this item from your dashboard?')) {
            removeItem(itemData).then(response => {
                if (response.status === 'success') {
                    heartContainer.classList.remove('active');
                    alert('Item removed successfully.');
                } else {
                    alert('Failed to remove the item.');
                }
            });
        }
    } else {
        saveItem(itemData).then(response => {
            if (response.status === 'success') {
                heartContainer.classList.add('active');
                alert('Item added to dashboard.');
            } else {
                alert('Failed to save the item.');
            }
        });
    }
}

function saveItem(itemData) {
    console.log('Saving item:', itemData); 
    return fetch('/add_item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    })
    .then(response => response.json());
}

function removeItem(itemData) {
    console.log('Removing item:', itemData); 
    return fetch('/remove_item', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    })
    .then(response => response.json());
}
