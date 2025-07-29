export interface Product {
  id?: string;
  nome: string;
  preco: number;
  tagline: string;
  imagemBanner: string;
  imagemTabelaNutricional: string;
  descricao: string;
  descricaoCompleta: string;
  ingredientes: string;
  modoUso: string;
  quantidadeCapsulas: number;
  quantidadeMinima: number;
  custoUnitario: number;
  taxaImposto: number;
  precoVendaSugerido?: number;
}
