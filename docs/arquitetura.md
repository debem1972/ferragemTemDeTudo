# Arquitetura do Projeto

# Modelo de Transação: B2C(Business to Consumer)

O projeto `temDeTudo Ferragem` opera no sistema de venda direta, onde o usuário se cadastra no site e efetua a compra.


# Modelo de Operação: Inventário Próprio (Varejo Online com Estoque Próprio)

O projeto `temDeTudo Ferragem` adotará o modelo de operação de inventário próprio, onde os produtos disponíveis para venda serão mantidos em estoque local. Isso permitirá um controle mais direto sobre a disponibilidade dos produtos, a qualidade do atendimento e a experiência do cliente.


## Visao Geral

O projeto `temDeTudo Ferragem` sera dividido em quatro frentes principais:

- `frontend/`: vitrine da loja, navegacao publica, busca, carrinho e fluxo de checkout simulado
- `backend/`: API REST em `Node.js + Express`, usando `ES Modules`
- `database/`: scripts SQL, schema inicial, seeds e futuras migrations
- `docs/`: documentacao funcional e tecnica

## Stack Definida

- Frontend: `HTML`, `CSS`, `JavaScript`
- Backend: `Node.js`, `Express`
- Banco de dados: `MySQL`
- Autenticacao: `JWT`
- Padrao de modulos no Node.js: `ES Modules`

## Organizacao Tecnica

### Frontend

O frontend sera organizado por responsabilidade:

- `assets/`: imagens, icones e arquivos estaticos da interface
- `css/`: estilos globais e por pagina
- `js/`: scripts principais, integracao com API e estados da interface
- `pages/`: estruturas das telas
- `components/`: partes reutilizaveis da UI
- `services/`: consumo da API REST

### Backend

O backend seguira uma estrutura inspirada em MVC:

- `config/`: conexao com banco, variaveis de ambiente e configuracoes gerais
- `controllers/`: camada de entrada das requisicoes
- `routes/`: definicao das rotas publicas e administrativas
- `models/`: acesso e manipulacao dos dados
- `middlewares/`: autenticacao, autorizacao e tratamento de erros
- `services/`: regras de negocio
- `utils/`: funcoes auxiliares
- `uploads/`: imagens de produtos enviadas pelo admin

## Areas do Sistema

### Loja Publica

- home com destaque de categorias e promocoes
- catalogo de produtos
- pagina de produto
- carrinho
- checkout simulado

### Area Administrativa

Sera uma area restrita com autenticacao e autorizacao para usuarios administradores.

Principais responsabilidades:

- login administrativo
- cadastro de produtos
- edicao de produtos
- exclusao de produtos
- upload e gestao de imagens
- controle de estoque

## Separacao de Rotas

- rotas publicas: acesso livre para vitrine e catalogo
- rotas autenticadas: operacoes do usuario logado
- rotas administrativas: protegidas por middleware de permissao

## Rotas Iniciais da API

As rotas base atualmente previstas no backend sao:

- `GET /api/health`: status da API e da conexao com banco
- `POST /api/auth/login`: autenticacao do administrador
- `GET /api/admin/me`: leitura do perfil autenticado do admin
- `GET /api/products`: listagem publica de produtos ativos
- `GET /api/products/:id`: detalhe publico de produto
- `POST /api/admin/products`: criacao de produto por admin
- `PUT /api/admin/products/:id`: edicao de produto por admin
- `DELETE /api/admin/products/:id`: exclusao de produto por admin

## Estrategia de Autenticacao

- autenticacao baseada em `JWT`
- token enviado via header `Authorization: Bearer <token>`
- acesso administrativo liberado apenas para usuarios com `role = admin`
- segredo e expiracao do token controlados por variaveis de ambiente

## Padrao ES Modules

O backend sera configurado com `type: "module"` no `package.json`.

Exemplo de padrao:

```js
import express from 'express';

export default express;
```

## Proximos Passos Tecnicos

1. Instalar dependencias e validar o backend em execucao
2. Refinar autenticacao com hash seguro e fluxo de sessao admin
3. Implementar upload de imagens de produtos
4. Desenvolver o frontend com base na identidade visual
5. Integrar catalogo, carrinho e checkout simulado
