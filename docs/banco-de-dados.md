# Banco de Dados

## Objetivo

Este documento registra a modelagem inicial prevista para o e-commerce.

## Entidades Principais

### usuarios

- `id`
- `nome`
- `email`
- `senha_hash`
- `role`
- `created_at`
- `updated_at`

### categorias

- `id`
- `nome`
- `slug`
- `descricao`

### produtos

- `id`
- `categoria_id`
- `nome`
- `slug`
- `descricao_curta`
- `descricao_completa`
- `preco`
- `estoque`
- `ativo`
- `created_at`
- `updated_at`

### produto_imagens

- `id`
- `produto_id`
- `caminho_arquivo`
- `alt_text`
- `ordem`

### pedidos

- `id`
- `usuario_id`
- `status`
- `valor_total`
- `created_at`

### pedido_itens

- `id`
- `pedido_id`
- `produto_id`
- `quantidade`
- `preco_unitario`

## Regras Iniciais

- usuarios administradores poderao acessar o painel admin
- produtos pertencerao a uma categoria
- cada produto podera ter uma ou mais imagens
- pedidos armazenarao um espelho do preco praticado no momento da compra
