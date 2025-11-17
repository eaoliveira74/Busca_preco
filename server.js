const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4173;
const ML_API = 'https://api.mercadolibre.com/sites/MLB/search';
const DEFAULT_LIMIT = 36;
const DEFAULT_ACCESS_TOKEN = 'HGCVUAs4ufS0HotAvrKEpLfnH5o3HLxs';
const runningOnRender = Boolean(process.env.RENDER || process.env.RENDER_SERVICE_ID);

app.use(cors());
app.use(express.static(__dirname));

app.get('/api/search', async (req, res) => {
    const term = req.query.term;
    const limit = Number(req.query.limit) || DEFAULT_LIMIT;
    if (!term) {
        return res.status(400).json({ error: 'Parâmetro "term" é obrigatório.' });
    }

    const accessToken = process.env.ML_ACCESS_TOKEN || (runningOnRender ? DEFAULT_ACCESS_TOKEN : '');
    if (!accessToken) {
        return res.status(500).json({
            error: 'Configure a variável ML_ACCESS_TOKEN no arquivo .env para consultar o Mercado Livre.'
        });
    }

    try {
        const url = `${ML_API}?q=${encodeURIComponent(term)}&limit=${limit}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const payload = await safeJson(response);
            const message = payload && payload.message ? payload.message : 'Erro ao consultar a API do Mercado Livre.';
            return res.status(response.status).json({ error: message });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(502).json({ error: 'Falha ao acessar a API do Mercado Livre.', details: error.message });
    }
});

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
