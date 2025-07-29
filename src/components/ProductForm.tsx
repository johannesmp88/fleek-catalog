import React, { useState } from 'react';
import { Product } from '../types/Product';
import { db } from '../firebase';
import { collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface ProductFormProps {
  onAdd: (produto: Product) => void;
  produtos: Product[];
  onRefresh: () => void;
}

const campos = [
  { name: 'nome', label: 'Nome do Produto', type: 'text', placeholder: 'Ex: Biotina 10000mcg' },
  { name: 'preco', label: 'Preço', type: 'number', placeholder: 'Ex: 49.90' },
  { name: 'tagline', label: 'Tagline (frase curta)', type: 'text', placeholder: 'Ex: Força e beleza' },
  { name: 'imagemBanner', label: 'URL da Imagem do Produto', type: 'text', placeholder: 'Ex: /BIOTINA - Foto 1.png' },
  { name: 'imagemTabelaNutricional', label: 'URL da Imagem da Tabela Nutricional', type: 'text', placeholder: 'Ex: /BIOTINA - Foto 2.png' },
  { name: 'descricao', label: 'Descrição Resumida', type: 'textarea', placeholder: 'Breve descrição do produto' },
  { name: 'descricaoCompleta', label: 'Descrição Completa', type: 'textarea', placeholder: 'Descrição detalhada, benefícios, diferenciais...' },
  { name: 'ingredientes', label: 'Ingredientes', type: 'text', placeholder: 'Principais ingredientes' },
  { name: 'modoUso', label: 'Modo de Uso', type: 'text', placeholder: 'Ex: 1 cápsula ao dia' },
  { name: 'quantidadeCapsulas', label: 'Quantidade de Cápsulas', type: 'number', placeholder: 'Ex: 60' },
  { name: 'quantidadeMinima', label: 'Quantidade Mínima por Pedido', type: 'number', placeholder: 'Ex: 1' },
  { name: 'custoUnitario', label: 'Custo Unitário', type: 'number', placeholder: 'Custo de aquisição/fabricação' },
  { name: 'taxaImposto', label: 'Taxa de Imposto (%)', type: 'number', placeholder: 'Ex: 10' }
];

const camposNumericos = [
  'preco', 'quantidadeCapsulas', 'quantidadeMinima', 'custoUnitario', 'taxaImposto'
];

const ProductForm: React.FC<ProductFormProps> = ({ onAdd, produtos, onRefresh }) => {
  const [form, setForm] = useState<Product>({
    nome: '',
    preco: 0,
    tagline: '',
    imagemBanner: '',
    imagemTabelaNutricional: '',
    descricao: '',
    descricaoCompleta: '',
    ingredientes: '',
    modoUso: '',
    quantidadeCapsulas: 0,
    quantidadeMinima: 1,
    custoUnitario: 0,
    taxaImposto: 0
  });
  const [editId, setEditId] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: camposNumericos.includes(name) ? Number(value) : value
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      updateDoc(doc(db, "produtos", editId), form).then(onRefresh);
      setEditId(null);
    } else {
      onAdd(form);
    }
    setForm({
      nome: '',
      preco: 0,
      tagline: '',
      imagemBanner: '',
      imagemTabelaNutricional: '',
      descricao: '',
      descricaoCompleta: '',
      ingredientes: '',
      modoUso: '',
      quantidadeCapsulas: 0,
      quantidadeMinima: 1,
      custoUnitario: 0,
      taxaImposto: 0
    });
  }

  function handleEdit(produto: Product) {
    setForm(produto);
    setEditId(produto.id!);
  }

  async function handleDelete(id: string) {
    if (window.confirm("Deseja realmente excluir este produto?")) {
      await deleteDoc(doc(db, "produtos", id));
      onRefresh();
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 max-w-xl mx-auto grid grid-cols-1 gap-4 mb-8">
        <h2 className="text-lg font-bold mb-2">{editId ? "Editar Produto" : "Cadastrar Produto"}</h2>
        {campos.map(campo => (
          <div key={campo.name}>
            <label className="block font-semibold mb-1" htmlFor={campo.name}>{campo.label}</label>
            {campo.type === 'textarea' ? (
              <textarea
                className="border p-2 rounded w-full"
                id={campo.name}
                name={campo.name}
                placeholder={campo.placeholder}
                value={form[campo.name as keyof Product] as string}
                onChange={handleChange}
              />
            ) : (
              <input
                className="border p-2 rounded w-full"
                id={campo.name}
                type={campo.type}
                name={campo.name}
                placeholder={campo.placeholder}
                value={form[campo.name as keyof Product] as any}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
        <button className="bg-purple-600 text-white px-4 py-2 rounded" type="submit">
          {editId ? "Salvar alterações" : "Cadastrar"}
        </button>
        {editId && (
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            type="button"
            onClick={() => { setEditId(null); setForm({
              nome: '',
              preco: 0,
              tagline: '',
              imagemBanner: '',
              imagemTabelaNutricional: '',
              descricao: '',
              descricaoCompleta: '',
              ingredientes: '',
              modoUso: '',
              quantidadeCapsulas: 0,
              quantidadeMinima: 1,
              custoUnitario: 0,
              taxaImposto: 0
            }); }}
          >
            Cancelar edição
          </button>
        )}
      </form>

      <div className="max-w-2xl mx-auto">
        <h3 className="font-bold mb-2">Produtos cadastrados</h3>
        <table className="w-full text-sm mb-4 border">
          <thead>
            <tr className="bg-gray-200">
              <th>Nome</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>R$ {produto.preco.toFixed(2)}</td>
                <td>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEdit(produto)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(produto.id!)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {produtos.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">Nenhum produto cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductForm;
