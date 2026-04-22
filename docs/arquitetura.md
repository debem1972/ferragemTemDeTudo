# Arquitetura do Projeto

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

## Padrao ES Modules

O backend sera configurado com `type: "module"` no `package.json`.

Exemplo de padrao:

```js
import express from 'express';

export default express;
```

## Proximos Passos Tecnicos

1. Definir o schema inicial do banco
2. Criar a base do backend com `Express`
3. Estruturar as rotas da area admin
4. Modelar autenticacao com `JWT`
5. Desenvolver o frontend com base na identidade visual
