# Busca Preço

Landing page dinâmica que consome a API oficial do Mercado Livre para listar TVs, aparelhos de som e celulares 5G em tempo real, gerando links de afiliado automaticamente.

## Recursos
- Integração direta com `https://api.mercadolibre.com/sites/MLB/search?q=TERMO` com cache em memória para cada aba.
- Resultados organizados por fabricante/modelo, destacando preço, parcelamento, vendedor e tags de frete grátis/Full.
- Painel para definir seu código de afiliado Mercado Livre (salvo em `localStorage`).
- Estados de carregamento/erro amigáveis e botão de retry.
- Layout responsivo em HTML + CSS puro, pronto para abrir localmente.

## Pré-requisitos
- Node.js ≥ 18.
- Access token do Mercado Livre gerado no [Painel de Desenvolvedores](https://developers.mercadolibre.com.br/). Crie uma aplicação, obtenha o `APP_ID`, faça login como vendedor e gere um token `APP_USR-...`.

## Como executar
1. Copie `.env.example` para `.env` e informe `ML_ACCESS_TOKEN=APP_USR-...`.
2. Instale dependências e suba o servidor/proxy que serve o site e assina as requisições:
	```pwsh
	cd d:\Buca_Preco\Busca_preco
	npm install
	npm start
	```
	O servidor ficará disponível em `http://localhost:4173` (ajuste `PORT` no `.env` se necessário).
3. Abra o endereço no navegador, informe o seu código de afiliado no painel e clique em "Aplicar".
4. Cada aba dispara `GET /api/search?term=...` no servidor local, que adiciona o header `Authorization: Bearer ML_ACCESS_TOKEN` antes de chamar `https://api.mercadolibre.com/sites/MLB/search?q=termo`.

> **Dica:** quer personalizar os termos de busca? Ajuste `CATEGORY_SETTINGS` em `assets/js/app.js`. Para filtros adicionais, adapte o endpoint `/api/search` em `server.js`.

## Estrutura
- `index.html`: marcação principal, hero section, painel de afiliado e containers das abas/resultados.
- `assets/css/styles.css`: tema dark, componentes responsivos e estados de carregamento.
- `assets/js/app.js`: chamadas à API do Mercado Livre, agrupamento por fabricante, geração dos links de afiliado e interações (abas/painel).
- `server.js`: servidor Express que serve os arquivos estáticos e atua como proxy autenticado da API oficial.
- `.env.example`: modelo das variáveis necessárias (token e porta).
- `package.json`: dependências do servidor e scripts `npm start`/`npm run dev`.