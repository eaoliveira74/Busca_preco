const API_PROXY = '/api/search';
const DEFAULT_AFFILIATE_CODE = '5925715452482228';
const CATEGORY_SETTINGS = {
    tvs: { label: 'TVs 4K e QLED', term: 'tv 4k 65 polegadas', note: 'Prioridade para painéis 4K, 120 Hz e Mini LED' },
    som: { label: 'Aparelhos de Som', term: 'soundbar dolby atmos bluetooth', note: 'Soundbars e caixas com Bluetooth e graves reforçados' },
    celulares: { label: 'Celulares 5G', term: 'smartphone 5g 256gb', note: 'Modelos com 5G, câmeras premium e muita bateria' }
};

const categoryContent = document.getElementById('category-content');
const tabButtons = document.querySelectorAll('.tab-button');

const cache = new Map();
const state = {
    currentCategory: 'tvs',
    affiliateCode: DEFAULT_AFFILIATE_CODE
};
let lastRequestId = 0;

bindTabEvents();
bindScrollTriggers();
setCurrentYear();
renderCategory('tvs');

function bindTabEvents() {
    tabButtons.forEach(button => {
        button.addEventListener('click', event => {
            const category = event.currentTarget.dataset.category;
            if (category === state.currentCategory) {
                return;
            }
            tabButtons.forEach(btn => btn.classList.remove('active'));
            event.currentTarget.classList.add('active');
            renderCategory(category);
        });
    });
}

function bindScrollTriggers() {
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
}

function setCurrentYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

async function renderCategory(slug) {
    state.currentCategory = slug;
    showLoadingState(slug);
    const requestId = ++lastRequestId;
    try {
        const results = await getCategoryResults(slug);
        if (requestId !== lastRequestId) {
            return;
        }
        renderFromResults(results);
    } catch (error) {
        if (requestId !== lastRequestId) {
            return;
        }
        showErrorState(error.message || 'Não foi possível carregar as ofertas agora.');
    }
}

async function getCategoryResults(slug) {
    if (cache.has(slug)) {
        return cache.get(slug);
    }
    const { term } = CATEGORY_SETTINGS[slug] || { term: slug };
    const query = `${API_PROXY}?term=${encodeURIComponent(term)}&limit=36`;
    const response = await fetch(query);
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error('API exigiu autenticação. Configure o servidor com seu access token do Mercado Livre.');
        }
        const errorPayload = await safeJson(response);
        const message = errorPayload && errorPayload.error ? errorPayload.error : 'Erro ao consultar o proxy da API.';
        throw new Error(message);
    }
    const payload = await response.json();
    const results = Array.isArray(payload.results) ? payload.results : [];
    cache.set(slug, results);
    return results;
}

async function safeJson(response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

function renderFromResults(results) {
    if (!results || results.length === 0) {
        showEmptyState();
        return;
    }
    const groups = buildGroups(results);
    if (!groups.length) {
        showEmptyState();
        return;
    }
    const summary = CATEGORY_SETTINGS[state.currentCategory];
    const summaryCard = summary ? getSummaryCard(summary) : '';
    const sections = groups.map(buildManufacturerSection).join('');
    categoryContent.innerHTML = summaryCard + sections;
}

function buildGroups(results) {
    const grouped = new Map();
    results.slice(0, 36).forEach(item => {
        const brand = getBrand(item);
        if (!grouped.has(brand)) {
            grouped.set(brand, []);
        }
        const models = grouped.get(brand);
        if (models.length < 4) {
            models.push(item);
        }
    });
    return Array.from(grouped.entries())
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 5)
        .map(([brand, models]) => ({
            brand,
            models,
            highlight: `${models.length} ${models.length > 1 ? 'ofertas' : 'oferta'}`
        }));
}

function buildManufacturerSection(group) {
    const modelsHtml = group.models.map(buildCard).join('');
    return `
        <article class="manufacturer">
            <div class="manufacturer__header">
                <h3>${group.brand}</h3>
                <small>${group.highlight}</small>
            </div>
            <div class="manufacturer__models">
                ${modelsHtml}
            </div>
        </article>
    `;
}

function buildCard(item) {
    const model = getModel(item);
    const price = formatPrice(item.price);
    const installments = formatInstallments(item.installments);
    const seller = item.seller && item.seller.nickname ? item.seller.nickname : 'Mercado Livre';
    const condition = item.condition === 'new' ? 'Novo' : 'Usado';
    const shippingTag = item.shipping && item.shipping.free_shipping ? '<span class="tag tag--success">Frete grátis</span>' : '';
    const fulfillmentTag = item.logistic_type === 'fulfillment' ? '<span class="tag">Full</span>' : '';
    return `
        <div class="card">
            <div class="card__info">
                <h4>${sanitizeText(item.title)}</h4>
                <p>${model ? `${sanitizeText(model)} • ` : ''}Vendido por ${sanitizeText(seller)}</p>
                ${installments ? `<p>${installments}</p>` : ''}
                <div class="card__meta">
                    <span class="tag">${condition}</span>
                    ${shippingTag}
                    ${fulfillmentTag}
                    <span class="tag tag--highlight">${sanitizeText(getBrand(item))}</span>
                </div>
            </div>
            <div class="card__cta">
                <span class="price-tag">${price}</span>
                <div class="offer-links">
                    <a href="${buildAffiliateLink(item.permalink)}" target="_blank" rel="noopener noreferrer">Ver oferta</a>
                </div>
            </div>
        </div>
    `;
}

function buildAffiliateLink(permalink) {
    const encodedUrl = encodeURIComponent(permalink);
    const code = encodeURIComponent(state.affiliateCode || DEFAULT_AFFILIATE_CODE);
    return `https://mercadolivre.com/jm/ml.aff?a=${code}&go=${encodedUrl}`;
}

function getBrand(item) {
    if (Array.isArray(item.attributes)) {
        const brandAttribute = item.attributes.find(attr => attr.id === 'BRAND' && attr.value_name);
        if (brandAttribute) {
            return brandAttribute.value_name;
        }
    }
    if (item.attributes) {
        const manufacturer = item.attributes.find(attr => attr.name && attr.name.toLowerCase().includes('fabricante'));
        if (manufacturer && manufacturer.value_name) {
            return manufacturer.value_name;
        }
    }
    if (item.title) {
        return item.title.split(' ')[0];
    }
    return 'Outros';
}

function getModel(item) {
    if (Array.isArray(item.attributes)) {
        const modelAttribute = item.attributes.find(attr => attr.id === 'MODEL' && attr.value_name);
        if (modelAttribute) {
            return modelAttribute.value_name;
        }
    }
    return '';
}

function formatPrice(value) {
    if (typeof value !== 'number') {
        return 'Preço indisponível';
    }
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
}

function formatInstallments(installments) {
    if (!installments || !installments.quantity || !installments.amount) {
        return '';
    }
    const total = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(installments.amount);
    return `${installments.quantity}x de ${total} sem juros`;
}

function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function showLoadingState(slug) {
    const summary = CATEGORY_SETTINGS[slug];
    const note = summary ? summary.note : 'Buscando ofertas fresquinhas';
    categoryContent.innerHTML = `
        <article class="status-card">
            <div class="spinner" aria-hidden="true"></div>
            <h3>Sincronizando com o Mercado Livre…</h3>
            <p>${note}</p>
        </article>
    `;
}

function showErrorState(message) {
    categoryContent.innerHTML = `
        <article class="status-card">
            <h3>Ops, algo deu errado</h3>
            <p>${message}</p>
            <button class="primary" type="button" id="retry-fetch">Tentar novamente</button>
        </article>
    `;
    const retry = document.getElementById('retry-fetch');
    if (retry) {
        retry.addEventListener('click', () => renderCategory(state.currentCategory));
    }
}

function showEmptyState() {
    categoryContent.innerHTML = `
        <article class="status-card">
            <h3>Sem ofertas no momento</h3>
            <p>Tente novamente em instantes ou altere a categoria.</p>
        </article>
    `;
}

function getSummaryCard(summary) {
    return `
        <article class="status-card">
            <h3>${summary.label}</h3>
            <p>${summary.note}</p>
        </article>
    `;
}
