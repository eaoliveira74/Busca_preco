# Busca Preço

Landing page dinâmica que consome a API oficial do Mercado Livre para listar TVs, aparelhos de som e celulares 5G em tempo real, gerando links de afiliado automaticamente.

## Recursos
- Integração direta com `https://api.mercadolibre.com/sites/MLB/search?q=TERMO` com cache em memória para cada aba.
- Resultados organizados por fabricante/modelo, destacando preço, parcelamento, vendedor e tags de frete grátis/Full.
- Links de afiliado usam automaticamente o ID `5925715452482228` (travado no front-end).
- Estados de carregamento/erro amigáveis e botão de retry.
- Layout responsivo em HTML + CSS puro, pronto para abrir localmente.

## Pré-requisitos
- Node.js ≥ 18.
- Access token do Mercado Livre gerado no [Painel de Desenvolvedores](https://developers.mercadolibre.com.br/). Crie uma aplicação, obtenha o `APP_ID`, faça login como vendedor e gere um token `APP_USR-...`.

## Como executar
1. Copie `.env.example` para `.env` e informe `ML_ACCESS_TOKEN=APP_USR-...`.
2. Instale dependências, rode o lint localmente e suba o servidor/proxy que serve o site e assina as requisições:
	```pwsh
	cd d:\Buca_Preco\Busca_preco
	npm install
	npm run lint
	npm start
	```
	O servidor ficará disponível em `http://localhost:4173` (ajuste `PORT` no `.env` se necessário).
3. Abra o endereço no navegador; todos os links já incluem o ID de afiliado fixo `5925715452482228`.
4. Cada aba dispara `GET /api/search?term=...` no servidor local, que adiciona o header `Authorization: Bearer ML_ACCESS_TOKEN` antes de chamar `https://api.mercadolibre.com/sites/MLB/search?q=termo`.

> **Dica:** quer personalizar os termos de busca? Ajuste `CATEGORY_SETTINGS` em `assets/js/app.js`. Para filtros adicionais, adapte o endpoint `/api/search` em `server.js`.

## Estrutura
- `index.html`: marcação principal, hero section e containers das abas/resultados.
- `assets/css/styles.css`: tema dark, componentes responsivos e estados de carregamento.
- `assets/js/app.js`: chamadas à API do Mercado Livre, agrupamento por fabricante e geração dos links de afiliado com ID fixo.
- `server.js`: servidor Express que serve os arquivos estáticos e atua como proxy autenticado da API oficial.
- `.env.example`: modelo das variáveis necessárias (token e porta).
- `package.json`: dependências do servidor e scripts `npm start`/`npm run dev`/`npm run lint`.
- `.github/workflows/deploy.yml`: pipeline que roda lint e dispara deploy no Render.

## Pipeline CI/CD (GitHub Actions + Render)
1. Em **Settings → Secrets and variables → Actions**, adicione:
	- `ML_ACCESS_TOKEN`: mesmo token usado no `.env`, exposto ao job de lint para garantir que o código sempre tenha a variável disponível.
	- `ML_REFRESH_TOKEN`, `ML_CLIENT_ID`, `ML_CLIENT_SECRET`, `ML_REDIRECT_URI`: usados para a renovação automática do token durante o deploy/teste.
	- `RENDER_DEPLOY_HOOK_URL`: URL do deploy hook do serviço Render (crie em *Deploy Hooks* dentro do dashboard do Render).
2. O workflow `CI & Render Deploy` roda em todo push para `main` (ou manualmente via `workflow_dispatch`):
	- Job **lint**: checkout, `npm ci`, `npm run lint`.
	- Job **test**: depende de lint, repete `npm ci` e executa `npm test` (smoke test com Supertest/Node Test Runner).
	- Job **deploy**: só dispara o hook do Render se lint + test passarem.
3. Para testes extras (ex.: e2e), crie novos arquivos dentro de `tests/` e eles rodarão automaticamente via `npm test`.

## Credenciais fornecidas (ambiente atual)
- **Redirect URI autorizado**: `https://eaoliveira74.github.io/Busca_preco/`
- **ID de afiliado**: `5925715452482228`
- **Access token**: `APP_USR-5925715452482228-111713-df17622d9557fdece9b79805626e7ef2-72587089` (defina em `ML_ACCESS_TOKEN` ou use o fallback de `server.js`)
- **Refresh token**: `TG-691b62139f33220001e720c2-72587089` (guarde para renovar o access token sem reautorizar)
- **CODE Mercado Livre**: `TG-691b330240bf2f00016ffcca-72587089`

> Garanta que o `.env`, os *Secrets* do GitHub (`ML_ACCESS_TOKEN`, `RENDER_DEPLOY_HOOK_URL`) e as variáveis de ambiente do Render estejam sempre sincronizados com esses valores para evitar erros de autenticação ao consultar a API oficial.

## Renovação automática do token
- O `server.js` mantém o token atual em memória e, ao receber `401/403` do Mercado Livre, dispara uma chamada de refresh usando `ML_REFRESH_TOKEN`, `ML_CLIENT_ID`, `ML_CLIENT_SECRET` e `ML_REDIRECT_URI`.
- Se o refresh for bem-sucedido, o novo `access_token` passa a ser usado imediatamente e um log aparece no console (`Token do Mercado Livre renovado automaticamente`).
- Informe as mesmas variáveis no `.env`, nos secrets do GitHub e no painel do Render para que o mecanismo funcione em qualquer ambiente. Caso alguma delas esteja ausente, o servidor volta a exigir `ML_ACCESS_TOKEN` manual.
- Para renovar manualmente via CLI, utilize o `refresh_token` listado acima com `grant_type=refresh_token` conforme a [documentação oficial](https://developers.mercadolibre.com.br/pt_br/autenticacao-e-autorizacao).