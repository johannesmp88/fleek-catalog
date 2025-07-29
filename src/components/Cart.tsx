import React, { useState } from 'react';
import { Product } from '../types/Product';
import emailjs from 'emailjs-com';

interface CartItem {
  produto: Product;
  quantidade: number;
}

interface CartProps {
  carrinho: CartItem[];
  onUpdatePrice: (index: number, novoPreco: number) => void;
  onUpdateQuantidade: (index: number, novaQtd: number) => void;
  onSubmit: () => void;
  autenticado?: boolean;
}

const EMAILJS_SERVICE_ID = 'service_q34gbnh';
const EMAILJS_TEMPLATE_ID = 'template_u09onwu';
const EMAILJS_PUBLIC_KEY = '8j5V_azB6eXLKK95C';

export default function Cart({ carrinho, onUpdatePrice, onUpdateQuantidade, onSubmit }: CartProps) {
  const [freteEstimado, setFreteEstimado] = useState('');
  const [fretePorVendedor, setFretePorVendedor] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const [cliente, setCliente] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: ''
  });

  const totalUnidades = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

  const valorTotalPedido = carrinho.reduce((total, item) => {
    const precoVenda = (item.produto.precoVendaSugerido ?? item.produto.preco);
    return total + precoVenda * item.quantidade;
  }, 0) + (fretePorVendedor ? Number(freteEstimado) || 0 : 0);

  const rentabilidadeMedia = carrinho.length
    ? carrinho.reduce((acc, item) => {
        const p = item.produto;
        const qtd = item.quantidade;
        const precoVenda = (p.precoVendaSugerido ?? p.preco) * qtd;
        const imposto = (p.precoVendaSugerido ?? p.preco) * (p.taxaImposto / 100) * qtd;
        const freteUnitario = fretePorVendedor && Number(freteEstimado) > 0
          ? Number(freteEstimado) * (qtd / totalUnidades)
          : 0;
        const custoTotal = (p.custoUnitario * qtd) + imposto + freteUnitario;
        const rent = ((precoVenda - custoTotal) / custoTotal) * 100;
        return acc + rent;
      }, 0) / carrinho.length
    : 0;

  function gerarRelatorio() {
    return `
RELATÓRIO DO PEDIDO

Comprador:
- Nome completo: ${cliente.nome}
- CNPJ: ${cliente.cnpj}
- Telefone: ${cliente.telefone}
- E-mail: ${cliente.email}

Produtos:
${carrinho.map(item => `
- Produto: ${item.produto.nome}
- Quantidade: ${item.quantidade}
- Quantidade mínima: ${item.produto.quantidadeMinima}
- Preço sugerido: R$ ${(item.produto.precoVendaSugerido ?? item.produto.preco).toFixed(2)}
- Custo unitário: R$ ${item.produto.custoUnitario.toFixed(2)}
`).join('\n')}

Frete estimado: R$ ${freteEstimado}
Frete por conta de: ${fretePorVendedor ? 'Vendedor' : 'Comprador'}
Valor total do pedido: R$ ${valorTotalPedido.toFixed(2)}
Rentabilidade média: ${isNaN(rentabilidadeMedia) ? '0.00' : rentabilidadeMedia.toFixed(2)}%
    `.trim();
  }

  function handleEnviar() {
    if (!cliente.nome || !cliente.cnpj || !cliente.email || !cliente.telefone) {
      alert('Preencha todos os dados do cliente!');
      return;
    }
    setEnviando(true);
    const relatorio = gerarRelatorio();
    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: 'johannes@manoscomercio.net',
        message: relatorio,
      },
      EMAILJS_PUBLIC_KEY
    ).then(
      () => {
        setEnviando(false);
        alert('Pedido enviado com sucesso!');
        onSubmit();
      },
      (error) => {
        setEnviando(false);
        alert('Erro ao enviar pedido: ' + error.text);
      }
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Carrinho</h2>
      {carrinho.length === 0 && <p>Carrinho vazio.</p>}

      {/* Dados do cliente */}
      <div className="bg-white rounded shadow p-4 mb-6 flex flex-col gap-2">
        <label>
          Nome do cliente:
          <input className="border p-2 rounded w-full" value={cliente.nome} onChange={e => setCliente(c => ({ ...c, nome: e.target.value }))} />
        </label>
        <label>
          CNPJ:
          <input className="border p-2 rounded w-full" value={cliente.cnpj} onChange={e => setCliente(c => ({ ...c, cnpj: e.target.value }))} />
        </label>
        <label>
          E-mail:
          <input className="border p-2 rounded w-full" value={cliente.email} onChange={e => setCliente(c => ({ ...c, email: e.target.value }))} />
        </label>
        <label>
          Telefone:
          <input className="border p-2 rounded w-full" value={cliente.telefone} onChange={e => setCliente(c => ({ ...c, telefone: e.target.value }))} />
        </label>
      </div>

      {/* Campo geral para frete e flag */}
      <div className="bg-white rounded shadow p-4 mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <div>
          <label className="block text-sm mb-1 font-semibold">Frete estimado total (R$)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={freteEstimado}
            onChange={e => setFreteEstimado(e.target.value)}
            className="border rounded p-2 w-32"
          />
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <label className="font-semibold">Frete por conta de:</label>
          <button
            type="button"
            className={`px-3 py-1 rounded ${fretePorVendedor ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFretePorVendedor(true)}
          >
            Vendedor
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded ${!fretePorVendedor ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFretePorVendedor(false)}
          >
            Comprador
          </button>
        </div>
      </div>

      {carrinho.map((item, idx) => (
        <div key={idx} className="bg-white rounded shadow p-4 mb-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="font-bold">{item.produto.nome}</div>
            <img
              src={item.produto.imagemBanner}
              alt={item.produto.nome}
              className="w-24 h-24 object-contain cursor-zoom-in"
              onClick={() => setZoomImg(item.produto.imagemBanner)}
            />
            {item.produto.imagemTabelaNutricional && (
              <img
                src={item.produto.imagemTabelaNutricional}
                alt="Tabela Nutricional"
                className="w-24 h-24 object-contain cursor-zoom-in mt-2"
                onClick={() => setZoomImg(item.produto.imagemTabelaNutricional)}
              />
            )}
            <div>Preço original: <span className="text-green-600 font-bold">R$ {item.produto.preco.toFixed(2)}</span></div>
            <div>Custo unitário: R$ {item.produto.custoUnitario.toFixed(2)}</div>
            <div>Quantidade mínima: {item.produto.quantidadeMinima}</div>
          </div>
          <div>
            <label className="block text-sm mb-1">Preço de venda sugerido</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={item.produto.precoVendaSugerido ?? item.produto.preco}
              onChange={e => onUpdatePrice(idx, Number(e.target.value))}
              className="border rounded p-2 w-32 mb-2"
            />
            <label className="block text-sm mb-1">Quantidade</label>
            <input
              type="number"
              min={item.produto.quantidadeMinima}
              value={item.quantidade}
              onChange={e => onUpdateQuantidade(idx, Number(e.target.value))}
              className="border rounded p-2 w-32"
            />
          </div>
        </div>
      ))}

      {zoomImg && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setZoomImg(null)}>
          <img src={zoomImg} alt="Zoom" className="max-h-[90vh] max-w-[90vw] rounded shadow-lg" />
        </div>
      )}

      <div className="text-lg font-bold mt-6">
        Valor total do pedido:{' '}
        <span className="text-blue-700">
          R$ {valorTotalPedido.toFixed(2)}
        </span>
      </div>
      <div className="text-lg font-bold mt-2">
        Rentabilidade média:{' '}
        <span className={rentabilidadeMedia >= 0 ? "text-green-600" : "text-red-600"}>
          {isNaN(rentabilidadeMedia) ? '0.00' : rentabilidadeMedia.toFixed(2)}%
        </span>
      </div>
      <button
        onClick={handleEnviar}
        className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
        disabled={carrinho.length === 0 || enviando}
      >
        {enviando ? 'Enviando...' : 'Enviar pedido para aprovação'}
      </button>
    </div>
  );
}
