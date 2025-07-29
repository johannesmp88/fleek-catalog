import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between">
        <img
          src="/logofleek.png"
          alt="Fleek Logo"
          className="h-12 w-auto mb-2 md:mb-0"
          style={{ maxHeight: 48 }}
        />
        <nav className="flex gap-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded ${location.pathname === '/' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Produtos
          </Link>
          <Link
            to="/cadastrar"
            className={`px-4 py-2 rounded ${location.pathname === '/cadastrar' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Cadastrar Produto
          </Link>
          <Link
            to="/carrinho"
            className={`px-4 py-2 rounded ${location.pathname === '/carrinho' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Carrinho
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
