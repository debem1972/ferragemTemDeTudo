# temDeTudo Ferragem

Projeto de e-commerce fullstack voltado ao segmento de ferragens, materiais eletricos, hidraulicos e energia solar.

## Estrutura

```text
.
├── docs/
├── frontend/
│   └── src/
│       └── assets/
│           └── images/
├── backend/
├── database/
├── .gitignore
├── LICENSE
└── README.md
```

## Stack

- Frontend com `HTML`, `CSS` e `JavaScript`
- Backend com `Node.js + Express`
- Banco de dados `MySQL`
- Autenticacao com `JWT`
- Padrao de modulos `ES Modules`

## Documentacao

- PRD em `docs/PRD.md`
- arquitetura tecnica em `docs/arquitetura.md`
- modelagem inicial em `docs/banco-de-dados.md`
- planejamento em `docs/roadmap.md`

## API Inicial

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/admin/me`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
