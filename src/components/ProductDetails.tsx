import React, { useState } from 'react';
import { Product } from '../types/Product';

export default function ProductDetails({ produtos }: { produtos: Product[] }) {
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  // Exemplo: pega o primeiro produto, troque pela lógica de busca por id
  const produto = produtos[0];

  if (!produto) return <div>Produto não encontrado.</div>;

  return (
    <div>
      <img
        src={produto.imagemBanner}
        alt={produto.nome}
        className="cursor-zoom-in"
        onClick={() => setZoomImg(produto.imagemBanner)}
      />
      <img
        src={produto.imagemTabelaNutricional}
        alt="Tabela Nutricional"
        className="cursor-zoom-in mt-4"
        onClick={() => setZoomImg(produto.imagemTabelaNutricional)}
      />
      {zoomImg && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setZoomImg(null)}>
          <img src={zoomImg} alt="Zoom" className="max-h-[90vh] max-w-[90vw] rounded shadow-lg" />
        </div>
      )}
      {/* ...restante dos detalhes do produto */}
    </div>
  );
}
