import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { Product } from '../types/Product';

interface PreviewCartProps {
  carrinho: { produto: Product; quantidade: number }[];
  onClear: () => void;
}

const EMAILJS_SERVICE_ID = 'service_q34gbnh';
const EMAILJS_TEMPLATE_ID = 'template_u09onwu';
const EMAILJS_PUBLIC_KEY = '8j5V_azB6eXLKK95C';

const PreviewCart: React.FC<PreviewCartProps> = ({ carrinho, onClear }) => {
  const [cliente, setCliente] = useState({ nome: '', cnpj: '', telefone: '', email: '' });
  const [enviando, setEnviando] = useState(false);

  const total = carrinho.reduce((sum, item) => sum + item.produto.preco * item.quantidade, 0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  }

  function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!cliente.nome || !cliente.cnpj || !cliente.telefone || !cliente.email) {
      alert('Preencha todos os dados do cliente!');
      return;
    }
    setEnviando(true);
    const message = `
ORÇAMENTO SOLICITADO

Cliente:
- Nome: ${cliente.nome}
- CNPJ: ${cliente.cnpj}
- Telefone: ${cliente.telefone}
- E-mail: ${cliente.email}

Produtos:
${carrinho.map(item => `
- ${item.produto.nome} | Qtd: ${item.quantidade} | Preço unitário: R$ ${item.produto.preco.toFixed(2)}
`).join('\n')}

TOTAL: R$ ${total.toFixed(2)}
    `.trim();

    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: 'johannes@manoscomercio.net',
        message,
      },
      EMAILJS_PUBLIC_KEY
    ).then(
      () => {
        setEnviando(false);
        alert('Orçamento enviado com sucesso!');
        onClear();
      },
      (error) => {
        setEnviando(false);
        alert('Erro ao enviar: ' + error.text);
      }
    );
  }

  if (!carrinho.length) return null;

  return (
    <div className="bg-gray-100 rounded shadow p-4 mt-8 max-w-xl mx-auto">
      <h3 className="font-bold mb-2">Pré-visualização do Orçamento</h3>
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="font-semibold">
            <td>Produto</td>
            <td>Preço unitário</td>
            <td>Qtd</td>
          </tr>
        </thead>
        <tbody>
          {carrinho.map((item, idx) => (
            <tr key={idx}>
              <td>{item.produto.nome}</td>
              <td>R$ {item.produto.preco.toFixed(2)}</td>
              <td>{item.quantidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="font-bold mb-2">Total: R$ {total.toFixed(2)}</div>
      <form onSubmit={handleEnviar} className="flex flex-col gap-2">
        <input className="border p-2 rounded" name="nome" placeholder="Nome" value={cliente.nome} onChange={handleChange} />
        <input className="border p-2 rounded" name="cnpj" placeholder="CNPJ" value={cliente.cnpj} onChange={handleChange} />
        <input className="border p-2 rounded" name="telefone" placeholder="Telefone" value={cliente.telefone} onChange={handleChange} />
        <input className="border p-2 rounded" name="email" placeholder="E-mail" value={cliente.email} onChange={handleChange} />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar para orçamento'}
        </button>
      </form>
    </div>
  );
};

export default PreviewCart;
