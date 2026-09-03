import './css/main.css';
import { initDownloadHint } from './js/download-hint.js';

let downloadHint;

document.addEventListener('DOMContentLoaded', () => {
    downloadHint = initDownloadHint(document.querySelector('.pointer'));
});

document.addEventListener('DOMContentLoaded', renderPricingCards);

async function renderPricingCards() {
    const container = document.getElementById('cards-container');
    if (!container) return;

    try {
        const response = await fetch('https://veryfast.io/t/front_test_api.php');

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }

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
    const card = clone.querySelector('.pricing-card');
    const oldPrice = clone.querySelector('.old-price');
    const cardHeader = clone.querySelector('.card-header');

    // Populate data
    price.textContent = data.amount ? `$${data.amount}` : 'N/A';
    time.textContent = extractTimePeriod(data.license_name);
    description.textContent = data.name_prod;
    condition.textContent = data.license_name;

    // Presentation lives in components.css; JS only sets the state.
    if (data.is_best) {
        card.classList.add('is-best');
        tag.textContent = 'Best Value';
    }

    if (data.price_key === '50%') {
        card.classList.add('has-discount');
        oldPrice.textContent = `$${data.amount * 2}`;
        cardHeader.style.justifyContent = 'end';
    } else {
        oldPrice.style.display = 'none';
    }

    downloadBtn.addEventListener('click', () => {
        if (data.link) {
            downloadHint?.show();
            window.location.href = data.link;
        }
    });

    return clone;
}

function extractTimePeriod(licenseName) {
    return /monthly/i.test(licenseName) ? '/mo' : '/per year';
}