const PRODUCTS = {
    tvs: {
        label: 'TVs 4K e QLED',
        manufacturers: [
            {
                name: 'Samsung',
                highlight: 'Neo QLED e Crystal UHD',
                models: [
                    {
                        name: 'Neo QLED 65" QN90C',
                        specs: 'Mini LED, 144 Hz, Dolby Atmos',
                        price: 'R$ 7.499',
                        offers: [
                            { store: 'Amazon', url: 'https://www.amazon.com/dp/B0C1ZNP9VH?tag=buscapreco-20' },
                            { store: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/samsung-qn90c-65?matt_tool=87156351' }
                        ]
                    },
                    {
                        name: 'Crystal UHD 55" CU8000',
                        specs: 'Processador Crystal 4K, Alexa integrada',
                        price: 'R$ 2.999',
                        offers: [
                            { store: 'Amazon', url: 'https://www.amazon.com/dp/B0C2XG4Q1W?tag=buscapreco-20' },
                            { store: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/samsung-cu8000-55' }
                        ]
                    }
                ]
            },
            {
                name: 'LG',
                highlight: 'OLED evo e NanoCell',
                models: [
                    {
                        name: 'OLED C3 55"',
                        specs: 'Pixel autoiluminado, HDMI 2.1',
                        price: 'R$ 6.799',
                        offers: [
                            { store: 'Amazon', url: 'https://www.amazon.com/dp/B0BZR252K7?tag=buscapreco-20' },
                            { store: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/lg-oled55c3' }
                        ]
                    },
                    {
                        name: 'NanoCell 65" NANO77',
                        specs: 'Filmmaker Mode, WebOS 23',
                        price: 'R$ 4.199',
                        offers: [
                            { store: 'Amazon', url: 'https://www.amazon.com/dp/B0C6YHR3K3?tag=buscapreco-20' },
                            { store: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/lg-nano77-65' }
                        ]
                    }
                ]
            }
        ]
    },
    som: {
        label: 'Aparelhos de Som',
        manufacturers: [
            {
                name: 'Sony',
                highlight: 'Soundbars Dolby Atmos',
                models: [
                    {
                        name: 'HT-A5000',
                        specs: '5.1.2 canais, Wi-Fi e Bluetooth',
                        price: 'R$ 4.599',
                        offers: [
                            { store: 'Amazon', url: 'https://www.amazon.com/dp/B09KQLZQGJ?tag=buscapreco-20' },
                            { store: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/soundbar-sony-ht-a5000' }
                        ]
                    },
                    {
                        name: 'HT-S400',
                        specs: '2.1 canais, Subwoofer sem fio',
                        price: 'R$ 1.899',
                        offers: [
                            { store: 'Amazon', url: 'https://www.amazon.com/dp/B09QK7S64L?tag=buscapreco-20' },
                            { store: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/soundbar-sony-ht-s400' }
                        ]
                    }
                ]
            },
            {
                name: 'JBL',
                highlight: 'Caixas portáteis e festas',
                models: [
                    {
                        name: 'PartyBox 110',
                        specs: '160 W RMS, luzes RGB',
                        price: 'R$ 2.299',
                        offers: [
                            { store: 'Amazon', url: 'https://www.amazon.com/dp/B09B1L1WFZ?tag=buscapreco-20' },
                            { store: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/jbl-partybox-110' }
                        ]
                    },
                    {
                        name: 'Flip 6',
                        specs: 'À prova d\'água IP67, 12h de bateria',
                        price: 'R$ 699',
                        offers: [
                            { store: 'Amazon', url: 'https://www.amazon.com/dp/B09TKSSB1B?tag=buscapreco-20' },
                            { store: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/jbl-flip-6' }
                        ]
                    }
                ]
            }
        ]
    },
    celulares: {
        label: 'Celulares 5G',
        manufacturers: [
            {
                name: 'Apple',
                highlight: 'Linha iPhone 15',
                models: [
                    {
                        name: 'iPhone 15 Pro',
                        specs: 'Chip A17 Pro, câmera 48 MP',
                        price: 'R$ 8.499',
                        offers: [
                            { store: 'Amazon', url: 'https://www.amazon.com/dp/B0CHX81VT8?tag=buscapreco-20' },
                            { store: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/iphone-15-pro' }
                        ]
                    },
                    {
                        name: 'iPhone 15',
                        specs: 'Dynamic Island, câmera dupla',
                        price: 'R$ 6.199',
                        offers: [
                            { store: 'Amazon', url: 'https://www.amazon.com/dp/B0CHX8THCD?tag=buscapreco-20' },
                            { store: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/iphone-15' }
                        ]
                    }
                ]
            },
            {
                name: 'Samsung',
                highlight: 'Linha Galaxy S e A',
                models: [
                    {
                        name: 'Galaxy S23 Ultra',
                        specs: '200 MP, S Pen, Snapdragon 8 Gen 2',
                        price: 'R$ 6.599',
                        offers: [
                            { store: 'Amazon', url: 'https://www.amazon.com/dp/B0BLP13YRF?tag=buscapreco-20' },
                            { store: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/galaxy-s23-ultra' }
                        ]
                    },
                    {
                        name: 'Galaxy A54 5G',
                        specs: 'Tela AMOLED 120 Hz, 256 GB',
                        price: 'R$ 2.299',
                        offers: [
                            { store: 'Amazon', url: 'https://www.amazon.com/dp/B0BXS4VW6S?tag=buscapreco-20' },
                            { store: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/galaxy-a54' }
                        ]
                    }
                ]
            }
        ]
    }
};

const categoryContent = document.getElementById('category-content');
const tabButtons = document.querySelectorAll('.tab-button');

function buildCard(model) {
    const offers = model.offers.map(offer => `
        <a href="${offer.url}" target="_blank" rel="noopener noreferrer">${offer.store}</a>
    `).join('');

    return `
        <div class="card">
            <div class="card__info">
                <h4>${model.name}</h4>
                <p>${model.specs}</p>
            </div>
            <div class="card__cta">
                <span class="price-tag">A partir de ${model.price}</span>
                <div class="offer-links">
                    ${offers}
                </div>
            </div>
        </div>
    `;
}

function buildManufacturer(manufacturer) {
    const models = manufacturer.models.map(buildCard).join('');
    return `
        <article class="manufacturer">
            <div class="manufacturer__header">
                <h3>${manufacturer.name}</h3>
                <small>${manufacturer.highlight}</small>
            </div>
            <div class="manufacturer__models">
                ${models}
            </div>
        </article>
    `;
}

function renderCategory(slug) {
    const data = PRODUCTS[slug];
    if (!data) {
        categoryContent.innerHTML = '<p>Nenhuma oferta encontrada.</p>';
        return;
    }
    const html = data.manufacturers.map(buildManufacturer).join('');
    categoryContent.innerHTML = html;
}

function handleTabClick(event) {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    const category = event.currentTarget.dataset.category;
    renderCategory(category);
}

tabButtons.forEach(button => {
    button.addEventListener('click', handleTabClick);
});

const scrollTriggers = document.querySelectorAll('[data-scroll]');
scrollTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const targetSelector = trigger.dataset.scroll;
        const target = document.querySelector(targetSelector);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

renderCategory('tvs');
