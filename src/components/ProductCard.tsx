import React, { useState } from 'react';
import { Product } from '../types/Product';

interface ProductCardProps {
  produto: Product;
  onAddToCart: (produto: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ produto, onAddToCart }) => {
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center">
      <img
        src={produto.imagemBanner}
        alt={produto.nome}
        className="w-32 h-32 object-contain mb-2 cursor-zoom-in"
        onClick={() => setZoomImg(produto.imagemBanner)}
      />
      <h3 className="font-bold text-lg mb-1">{produto.nome}</h3>
      <p className="text-gray-600 mb-2">{produto.tagline}</p>
      <span className="font-bold text-purple-700 text-xl mb-2">
        R$ {produto.preco.toFixed(2)}
      </span>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded mb-2"
        onClick={() => onAddToCart(produto)}
      >
        Adicionar ao carrinho
      </button>
      {produto.imagemTabelaNutricional && (
        <img
          src={produto.imagemTabelaNutricional}
          alt="Tabela Nutricional"
          className="w-32 h-32 object-contain mt-2 cursor-zoom-in"
          onClick={() => setZoomImg(produto.imagemTabelaNutricional)}
        />
      )}
      <div className="mt-2 text-sm text-gray-700 w-full">
        <strong>Ingredientes:</strong> {produto.ingredientes}<br />
        <strong>Modo de Uso:</strong> {produto.modoUso}<br />
        <strong>Quantidade por embalagem:</strong> {produto.quantidadeCapsulas} cápsulas<br />
        <strong>Descrição:</strong> {produto.descricao}
      </div>
      {zoomImg && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setZoomImg(null)}
        >
          <img src={zoomImg} alt="Zoom" className="max-h-[90vh] max-w-[90vw] rounded shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
