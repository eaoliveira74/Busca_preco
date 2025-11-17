const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

process.env.ML_ACCESS_TOKEN = '';
const { app } = require('../server');

test('GET / responde 200 e entrega HTML', async () => {
    const response = await request(app).get('/').expect(200);
    assert.match(response.header['content-type'], /text\/html/);
});

test('GET /api/search sem token devolve erro guiado', async () => {
    const response = await request(app)
        .get('/api/search')
        .query({ term: 'tv 4k' })
        .expect(500);

    assert.ok(response.body);
    assert.match(response.body.error, /Configure a variável ML_ACCESS_TOKEN/i);
});
