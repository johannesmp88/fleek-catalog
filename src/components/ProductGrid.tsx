import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types/Product';

interface ProductGridProps {
  produtos: Product[];
  onAddToCart: (produto: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ produtos, onAddToCart }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {produtos.map(produto => (
      <ProductCard
        key={produto.nome}
        produto={produto}
        onAddToCart={onAddToCart}
      />
    ))}
  </div>
);

export default ProductGrid;
