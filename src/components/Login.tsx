import React, { useState } from 'react';

const SENHA_CORRETA = 'Manos-2024'; // Troque pela senha desejada

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (senha === SENHA_CORRETA) {
      setErro('');
      onLogin();
    } else {
      setErro('Senha incorreta.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xs mx-auto mt-16 bg-white shadow p-8 rounded">
      <h2 className="text-xl font-bold mb-4">Área restrita</h2>
      <input
        type="password"
        placeholder="Digite a senha"
        className="border rounded p-2 w-full mb-2"
        value={senha}
        onChange={e => setSenha(e.target.value)}
      />
      {erro && <div className="text-red-600 mb-2">{erro}</div>}
      <button className="bg-purple-600 text-white px-4 py-2 rounded w-full">Entrar</button>
    </form>
  );
}
