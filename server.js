const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4173;
const ML_API = 'https://api.mercadolibre.com/sites/MLB/search';
const DEFAULT_LIMIT = 36;
const DEFAULT_ACCESS_TOKEN = 'APP_USR-5925715452482228-111713-df17622d9557fdece9b79805626e7ef2-72587089';
const DEFAULT_REFRESH_TOKEN = 'TG-691b62139f33220001e720c2-72587089';
const DEFAULT_CLIENT_ID = '5925715452482228';
const DEFAULT_CLIENT_SECRET = 'VdCIXFXgxywrjRqtWrt4v6WMoUaoYAIF';
const DEFAULT_REDIRECT_URI = 'https://busca-preco.onrender.com/';
const runningOnRender = Boolean(process.env.RENDER || process.env.RENDER_SERVICE_ID);
let accessToken = process.env.ML_ACCESS_TOKEN || (runningOnRender ? DEFAULT_ACCESS_TOKEN : '');
const refreshConfig = {
    refreshToken: process.env.ML_REFRESH_TOKEN || (runningOnRender ? DEFAULT_REFRESH_TOKEN : ''),
    clientId: process.env.ML_CLIENT_ID || DEFAULT_CLIENT_ID,
    clientSecret: process.env.ML_CLIENT_SECRET || DEFAULT_CLIENT_SECRET,
    redirectUri: process.env.ML_REDIRECT_URI || DEFAULT_REDIRECT_URI
};
let refreshInFlight = null;

app.use(cors());
app.use(express.static(__dirname));

app.get('/api/search', async (req, res) => {
    const term = req.query.term;
    const limit = Number(req.query.limit) || DEFAULT_LIMIT;
    if (!term) {
        return res.status(400).json({ error: 'Parâmetro "term" é obrigatório.' });
    }

    if (!accessToken) {
        return res.status(500).json({
            error: 'Configure a variável ML_ACCESS_TOKEN no arquivo .env para consultar o Mercado Livre.'
        });
    }

    try {
        const data = await fetchFromMercadoLivre(term, limit);
        res.json(data);
    } catch (error) {
        if (error instanceof ErrorWithStatus && error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(502).json({ error: 'Falha ao acessar a API do Mercado Livre.', details: error.message });
    }
});

async function fetchFromMercadoLivre(term, limit, allowRetry = true) {
    const url = `${ML_API}?q=${encodeURIComponent(term)}&limit=${limit}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 401 || response.status === 403) {
        const refreshed = allowRetry ? await refreshAccessToken() : false;
        if (refreshed) {
            return fetchFromMercadoLivre(term, limit, false);
        }
    }

    if (!response.ok) {
        const payload = await safeJson(response);
        const message = payload && payload.message ? payload.message : 'Erro ao consultar a API do Mercado Livre.';
        throw new ErrorWithStatus(message, response.status);
    }

    return response.json();
}

async function refreshAccessToken() {
    if (!refreshConfig.refreshToken || !refreshConfig.clientId || !refreshConfig.clientSecret) {
        return false;
    }

    if (refreshInFlight) {
        return refreshInFlight;
    }

    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: refreshConfig.clientId,
        client_secret: refreshConfig.clientSecret,
        refresh_token: refreshConfig.refreshToken
    });

    if (refreshConfig.redirectUri) {
        body.append('redirect_uri', refreshConfig.redirectUri);
    }

    refreshInFlight = fetch('https://api.mercadolibre.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    })
        .then(async response => {
            const payload = await safeJson(response);
            if (!response.ok || !payload || !payload.access_token) {
                throw new Error(payload && payload.error_description ? payload.error_description : 'Falha ao renovar token');
            }
            accessToken = payload.access_token;
            process.env.ML_ACCESS_TOKEN = accessToken;
            if (payload.refresh_token) {
                refreshConfig.refreshToken = payload.refresh_token;
                process.env.ML_REFRESH_TOKEN = payload.refresh_token;
            }
            console.info('[Busca Preço] Token do Mercado Livre renovado automaticamente.');
            return true;
        })
        .catch(error => {
            console.error('[Busca Preço] Falha ao renovar token do Mercado Livre:', error.message);
            return false;
        })
        .finally(() => {
            refreshInFlight = null;
        });

    return refreshInFlight;
}

class ErrorWithStatus extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

function safeJson(response) {
    return response
        .clone()
        .json()
        .catch(() => null);
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor Busca Preço ouvindo em http://localhost:${PORT}`);
    });
}

module.exports = { app };
