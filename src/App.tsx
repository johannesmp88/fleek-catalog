import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import ProductForm from './components/ProductForm';
import CartPreview from './components/CartPreview';
import Cart from './components/Cart';
import Login from './components/Login';
import { Product } from './types/Product';
import { db } from './firebase';
import { collection, getDocs, addDoc } from "firebase/firestore";

interface CartItem {
  produto: Product;
  quantidade: number;
}

// Página de produtos (home)
function ProdutosPage({
  produtos,
  carrinho,
  adicionarAoCarrinho,
  atualizarQuantidade,
  removerItem,
  limparCarrinho,
}: {
  produtos: Product[];
  carrinho: CartItem[];
  adicionarAoCarrinho: (produto: Product) => void;
  atualizarQuantidade: (idx: number, qtd: number) => void;
  removerItem: (idx: number) => void;
  limparCarrinho: () => void;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">Produtos cadastrados</h2>
      <ProductGrid produtos={produtos} onAddToCart={adicionarAoCarrinho} />
      <CartPreview
        carrinho={carrinho}
        onUpdateQuantidade={atualizarQuantidade}
        onRemoveItem={removerItem}
        onClear={limparCarrinho}
      />
    </>
  );
}

// Página protegida de cadastro
function CadastroProtegido({ onAdd, produtos, onRefresh, autenticado, autenticar }: 
  { onAdd: (produto: Product) => void, produtos: Product[], onRefresh: () => void, autenticado: boolean, autenticar: () => void }) {
  const navigate = useNavigate();
  function handleAdd(produto: Product) {
    onAdd(produto);
    onRefresh();
    navigate('/');
  }
  if (!autenticado) return <Login onLogin={autenticar} />;
  return <ProductForm onAdd={handleAdd} produtos={produtos} onRefresh={onRefresh} />;
}

// Página protegida do carrinho (mantém igual ao seu fluxo)
function CarrinhoProtegido({ carrinho, onUpdatePrice, onUpdateQuantidade, onSubmit, autenticado, autenticar }: any) {
  if (!autenticado) return <Login onLogin={autenticar} />;
  return (
    <Cart
      carrinho={carrinho}
      onUpdatePrice={onUpdatePrice}
      onUpdateQuantidade={onUpdateQuantidade}
      onSubmit={onSubmit}
    />
  );
}

export default function App() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [autenticadoCadastro, setAutenticadoCadastro] = useState(false);
  const [autenticadoCarrinho, setAutenticadoCarrinho] = useState(false);

  // Função para carregar produtos do Firestore
  async function carregarProdutos() {
    const snap = await getDocs(collection(db, "produtos"));
    setProdutos(snap.docs.map(d => ({ ...d.data(), id: d.id } as Product)));
  }

  // Carrega produtos ao iniciar
  useEffect(() => {
    carregarProdutos();
  }, []);

  // Adiciona produto no Firestore e recarrega lista
  async function adicionarProduto(novo: Product) {
    await addDoc(collection(db, "produtos"), novo);
    carregarProdutos();
  }

  function adicionarAoCarrinho(produto: Product) {
    setCarrinho(prev => {
      const idx = prev.findIndex(item => item.produto.nome === produto.nome);
      if (idx !== -1) {
        return prev.map((item, i) =>
          i === idx
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { produto, quantidade: 1 }];
    });
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
          ? { ...item, quantidade: Math.max(1, novaQtd) }
          : item
      )
    );
  }

  function removerItem(idx: number) {
    setCarrinho(prev => prev.filter((_, i) => i !== idx));
  }

  function limparCarrinho() {
    setCarrinho([]);
  }

  return (
    <BrowserRouter>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <ProdutosPage
                produtos={produtos}
                carrinho={carrinho}
                adicionarAoCarrinho={adicionarAoCarrinho}
                atualizarQuantidade={atualizarQuantidade}
                removerItem={removerItem}
                limparCarrinho={limparCarrinho}
              />
            }
          />
          <Route
            path="/cadastrar"
            element={
              <CadastroProtegido
                onAdd={adicionarProduto}
                produtos={produtos}
                onRefresh={carregarProdutos}
                autenticado={autenticadoCadastro}
                autenticar={() => setAutenticadoCadastro(true)}
              />
            }
          />
          <Route
            path="/carrinho"
            element={
              <CarrinhoProtegido
                carrinho={carrinho}
                onUpdatePrice={atualizarPrecoCarrinho}
                onUpdateQuantidade={atualizarQuantidade}
                onSubmit={limparCarrinho}
                autenticado={autenticadoCarrinho}
                autenticar={() => setAutenticadoCarrinho(true)}
              />
            }
          />
        </Routes>
      </main>
      <footer className="bg-white border-t p-4 text-center text-gray-600">
        © 2025 Fleek Catálogo. Todos os direitos reservados.
      </footer>
    </BrowserRouter>
  );
}
