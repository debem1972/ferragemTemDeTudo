USE temdetudo_ferragem;

INSERT INTO categorias (nome, slug, descricao)
VALUES
  ('Ferramentas', 'ferramentas', 'Ferramentas manuais e eletricas'),
  ('Eletrica', 'eletrica', 'Materiais e acessorios eletricos'),
  ('Hidraulica', 'hidraulica', 'Tubos, conexoes e acessorios hidraulicos'),
  ('Ferragens', 'ferragens', 'Itens de ferragem em geral'),
  ('Energia Solar', 'energia-solar', 'Equipamentos on-grid e off-grid')
ON DUPLICATE KEY UPDATE
  descricao = VALUES(descricao);

INSERT INTO usuarios (nome, email, senha_hash, role)
VALUES (
  'Administrador',
  'admin@temdetudo.com',
  SHA2('Admin123!', 256),
  'admin'
)
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome);
