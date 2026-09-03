import './css/main.css';
import { initDownloadHint } from './js/download-hint.js';

let downloadHint;

document.addEventListener('DOMContentLoaded', () => {
    downloadHint = initDownloadHint(document.querySelector('.pointer'));
});

document.addEventListener('DOMContentLoaded', renderPricingCards);

async function renderPricingCards() {
    const container = document.getElementById('cards-container');

    try {
        const response = await fetch('https://veryfast.io/t/front_test_api.php');
        const data = await response.json();

        container.innerHTML = '';

        const fragment = document.createDocumentFragment();

        data.result.elements.forEach(cardData => {
            const card = createCardElement(cardData);
            fragment.appendChild(card);
        });

        container.appendChild(fragment);
    } catch (error) {
        console.error('Error fetching data:', error);
        container.innerHTML = '<p>Error loading cards. Please try again later.</p>';
    }
}

// Function to create a single card element from data
function createCardElement(data) {
    const template = document.getElementById('pricing-card-template');
    const clone = template.content.cloneNode(true);

    // Query elements inside the cloned fragment
    const price = clone.querySelector('.price');
    const time = clone.querySelector('.time-period');
    const description = clone.querySelector('.description');
    const condition = clone.querySelector('.condition');
    const downloadBtn = clone.querySelector('.btn-download');
    const tag = clone.querySelector('.tag-info');
    const cardHeader = clone.querySelector('.card-header');
    const priceWrapper = clone.querySelector('.price-wrapper');
    const cardImage = clone.querySelector('.card-image');

    // Populate data
    price.textContent = '$' + data.amount || 'Default Title';
    time.textContent = extractTimePeriod(data.license_name);
    description.textContent = data.name_prod;
    condition.textContent = data.license_name;

    if (data.is_best) {
        tag.textContent = 'Best Value';
        cardHeader.style.justifyContent = 'space-between';
        priceWrapper.style.marginBottom = '26px';
    } else {
        tag.style.display = 'none';
    }

    if (data.price_key !== '50%') {
        cardImage.style.display = 'none';
    }

    downloadBtn.addEventListener('click', () => {
        if (data.link) {
            downloadHint?.show();
            window.location.href = data.link;
        }
    });

    return clone;
}

function extractTimePeriod(timeString) {
    const words = timeString.trim().toLowerCase().split(' ');

    let result = '';

    words.find((word) => {
        if (word === 'monthly' || word === '(monthly)') {
            result = '/per month';
        } else {
            result = '/per year';
        }
    });

    return result;
}