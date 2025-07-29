import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import ProductForm from './components/ProductForm';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import ProductDetails from './components/ProductDetails';
import Login from './components/Login'; // Se quiser área protegida
import { Product } from './types/Product';

interface CartItem {
  produto: Product;
  quantidade: number;
}

export default function App() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [favoritos, setFavoritos] = useState<Product[]>([]);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [autenticado, setAutenticado] = useState(false);

  function adicionarProduto(novo: Product) {
    setProdutos([novo, ...produtos]);
  }

  function adicionarAoCarrinho(produto: Product) {
    setCarrinho(prev => {
      const idx = prev.findIndex(item => item.produto.nome === produto.nome);
      if (idx !== -1) return prev; // já está no carrinho
      return [...prev, { produto, quantidade: produto.quantidadeMinima }];
    });
  }

  function alternarFavorito(produto: Product) {
    if (favoritos.some(fav => fav.nome === produto.nome)) {
      setFavoritos(favoritos.filter(fav => fav.nome !== produto.nome));
    } else {
      setFavoritos([...favoritos, produto]);
    }
  }

  function atualizarPrecoCarrinho(idx: number, novoPreco: number) {
    setCarrinho(prev =>
      prev.map((item, i) =>
        i === idx
          ? { ...item, produto: { ...item.produto, precoVendaSugerido: novoPreco } }
          : item
      )
    );
  }

  function atualizarQuantidade(idx: number, novaQtd: number) {
    setCarrinho(prev =>
      prev.map((item, i) =>
        i === idx
          ? { ...item, quantidade: Math.max(item.produto.quantidadeMinima, novaQtd) }
          : item
      )
    );
  }

  function enviarPedido() {
    setPedidoEnviado(true);
    setCarrinho([]); // Limpa o carrinho após envio
    setTimeout(() => setPedidoEnviado(false), 3000);
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header carrinhoCount={carrinho.length} favoritosCount={favoritos.length} />
        <nav className="max-w-7xl mx-auto px-4 py-2 flex gap-4">
          <Link to="/" className="text-purple-700 hover:underline">Produtos</Link>
          <Link to="/cadastrar" className="text-purple-700 hover:underline">Cadastrar Produto</Link>
          <Link to="/carrinho" className="text-purple-700 hover:underline">Carrinho</Link>
        </nav>
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <>
                <h2 className="text-2xl font-bold mb-4">Produtos cadastrados</h2>
                <ProductGrid
                  produtos={produtos}
                  onAddToCart={adicionarAoCarrinho}
                  onToggleFavorite={alternarFavorito}
                  favoritos={favoritos}
                />
              </>
            } />
            {/* Cadastro protegido por senha */}
            <Route path="/cadastrar" element={
              autenticado
                ? <ProductForm onAdd={adicionarProduto} />
                : <Login onLogin={() => setAutenticado(true)} />
            } />
            {/* Carrinho acessível a todos */}
            <Route path="/carrinho" element={
              pedidoEnviado ? (
                <div className="text-center text-green-700 text-xl font-bold mt-16">Pedido enviado para aprovação!</div>
              ) : (
                <Cart
                  carrinho={carrinho}
                  onUpdatePrice={atualizarPrecoCarrinho}
                  onUpdateQuantidade={atualizarQuantidade}
                  onSubmit={enviarPedido}
                  autenticado={autenticado}
                />
              )
            } />
            <Route path="/produto/:id" element={
              <ProductDetails produtos={produtos} />
            } />
          </Routes>
        </main>
        <footer className="bg-white border-t p-4 text-center text-gray-600">
          © 2025 Fleek Catálogo. Todos os direitos reservados.
        </footer>
      </div>
    </BrowserRouter>
  );
}
