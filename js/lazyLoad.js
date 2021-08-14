// "use strict"

// Lazy Elements img
const lazyImages = document.querySelectorAll('img[data-src], source[data-srcset]');
// Lazy Elements maps
const LoadMapBlock = document.querySelector('._load-map');
// Height all window
const windowHeight = document.documentElement.clientHeight;
// Endless loading
const loadMoreBlock = document.querySelector('._load-more');

// Array with position lazy elements
let lazyImagesPositions = [];

// Сheck for lazy img items
if (lazyImages.length >= 0) {
    lazyImages.forEach(img => {
        // Сheck for links to the img
        if (img.dataset.src || img.dataset.srcset) {
            // Add position every item
            lazyImagesPositions.push(img.getBoundingClientRect().top + pageYOffset);
            // A function that adds lazy loading for img
            lazyScrollCheck();
        }
    });
}
// Add action on scrolling window
window.addEventListener('scroll', lazyScroll);

// Getting lazy elements running
function lazyScroll() {
    // When hasnt lazy elements
    if (lazyImages.length > 0) {
        lazyScrollCheck();
    };
    // Checking the availability of cards
    if(!LoadMapBlock.classList.contains('_loaded')) {
        getMap();
    };
    // Endless loading
    if(!loadMoreBlock.classList.contains('_loading')) {
        loadMore();
    };
}

// Checking scroll to element
function lazyScrollCheck() {
    // Index img in array
    let imgIndex = lazyImagesPositions.findIndex(
        item => pageYOffset > item - windowHeight
    );
    // If we have lazy element
    if (imgIndex >= 0) {
        // if element has a lazy data attribute
        if (lazyImages[imgIndex].dataset.src) {
            // Add new link to img element
            lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src;
            // Delete old attribute
            lazyImages[imgIndex].removeAttribute('data-src');
        } else if (lazyImages[imgIndex].dataset.srcset) {
            // Add new link to img element
            lazyImages[imgIndex].srcset = lazyImages[imgIndex].dataset.srcset;
            // Delete old attribute
            lazyImages[imgIndex].removeAttribute('data-srcset');
        }
        // Remove element from array of lazy elements
        delete lazyImagesPositions[imgIndex];
    }
}

// Lazy map
function getMap() {
    // Position map
    const loadMapBlockPosition = LoadMapBlock.getBoundingClientRect().top + pageYOffset;
    // If we scroll to map
    if (pageYOffset > loadMapBlockPosition - windowHeight) {
        // Get url map
        const loadMapUrl = LoadMapBlock.dataset.map;
        if (loadMapUrl) {
            // Add map
            LoadMapBlock.insertAdjacentHTML(
                'beforeend',
                `<iframe src="${loadMapUrl}" width="100%" height="450" style="border:0;" allowfullscreen="" loading='lazy'></iframe>`,
            );
            LoadMapBlock.classList.add('_loaded');
        }
    }
}

// Endless loading
function loadMore() {
    // Position elem endless loading
    const loadMapBlockPosition = LoadMapBlock.getBoundingClientRect().top + pageYOffset;
    // Height block endless loading
    const loadMoreBlockHeight = loadMoreBlock.offsetHeight;
    if (pageYOffset > (loadMapBlockPosition + loadMoreBlockHeight) - windowHeight) {
        // Get content
        getContent();
    }
}

// Create content (AJAX)
async function getContent() {
    // Infinite loading icon
    if (!document.querySelector('._loading-icon')) {
        loadMoreBlock.insertAdjacentHTML(
            'beforeend',
            "<div class='_loading-icon'></div>",
        );
    }
    // Add class - _loading
    loadMoreBlock.classList.add('_loading'); 
    // Request AJAX 
    let response = await fetch('_more.html', {
        method: 'GET',
    });
    // If the request is successful
    if (response.ok) {
        let result = await response.text();
        loadMoreBlock.insertAdjacentHTML(
            'beforeend',
            result,
        );
          // Remove class - _loading
        loadMoreBlock.classList.remove('_loading'); 
        // Delete infinity icon loading
        if (document.querySelector('._loading-icon')) {
            document.querySelector('._loading-icon').remove();
        }else {
            alert('Error');
        }
    }
}