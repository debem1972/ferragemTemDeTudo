const mockProducts = [
  {
    id: 1,
    nome: 'Furadeira de Impacto 750W',
    categoria: 'ferramentas',
    descricao: 'Potencia e precisao para perfuracao em madeira, metal e concreto leve.',
    preco: 329.9,
    badge: 'Ferramenta eletrica',
  },
  {
    id: 2,
    nome: 'Caixa Organizadora Profissional',
    categoria: 'ferragens',
    descricao: 'Estrutura resistente para transporte de ferramentas e acessorios.',
    preco: 189.5,
    badge: 'Organizacao',
  },
  {
    id: 3,
    nome: 'Kit Disjuntores e Trilho DIN',
    categoria: 'eletrica',
    descricao: 'Composicao ideal para quadros eletricos residenciais e comerciais.',
    preco: 214.9,
    badge: 'Eletrica',
  },
  {
    id: 4,
    nome: 'Conjunto de Registros e Conexoes',
    categoria: 'hidraulica',
    descricao: 'Pecas para instalacoes hidraulicas com vedacao segura e acabamento limpo.',
    preco: 142.75,
    badge: 'Hidraulica',
  },
  {
    id: 5,
    nome: 'Painel Solar Monocristalino 550W',
    categoria: 'energia-solar',
    descricao: 'Alta eficiencia energetica para projetos residenciais e comerciais.',
    preco: 1249,
    badge: 'Energia solar',
  },
  {
    id: 6,
    nome: 'Parafusadeira Bateria 20V',
    categoria: 'ferramentas',
    descricao: 'Autonomia, ergonomia e torque para montagens e manutencao diaria.',
    preco: 419.9,
    badge: 'Mais vendida',
  },
];

export async function getProducts() {
  return Promise.resolve(mockProducts);
}
