import React from 'react';
import { Product } from '../types/Product';

interface CartItem {
  produto: Product;
  quantidade: number;
}

interface CartPageProps {
  carrinho: CartItem[];
}

const CartPage: React.FC<CartPageProps> = ({ carrinho }) => {
  if (!carrinho.length) {
    return <div className="text-center text-gray-500 mt-8">Carrinho vazio.</div>;
  }

  const total = carrinho.reduce(
    (sum, item) => sum + item.produto.preco * item.quantidade,
    0
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded shadow p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Resumo do Carrinho</h2>
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="font-semibold">
            <td>Produto</td>
            <td>Qtd</td>
            <td>Custo unitário</td>
            <td>Total</td>
          </tr>
        </thead>
        <tbody>
          {carrinho.map((item, idx) => (
            <tr key={idx}>
              <td>{item.produto.nome}</td>
              <td>{item.quantidade}</td>
              <td>R$ {item.produto.preco.toFixed(2)}</td>
              <td>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="font-bold mb-2">Total do carrinho: R$ {total.toFixed(2)}</div>
    </div>
  );
};

export default CartPage;
