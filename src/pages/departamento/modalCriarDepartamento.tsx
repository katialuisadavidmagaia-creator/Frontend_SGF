import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { FormEvent } from 'react';

import { useToast } from '../../hooks/useToast';
import { api } from '../../services/api';
import { departamentoService } from '../../services/departamento.service';
import type { CriarDepartamentoPayload } from '../../types/departamento.types';

interface Funcionario {
  id: number;
  name?: string;
  nome?: string;
}

interface Props {
  onFechar: () => void;
  onCriado: () => void;
}

export default function ModalCriarDepartamento({
  onFechar,
  onCriado,
}: Props) {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [responsavelId, setResponsavelId] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [salvando, setSalvando] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      // Chamada direta à API para evitar que o método ausente quebre o componente
      const resposta = await api.get('/funcionarios');
      const dados = resposta.data;

      if (Array.isArray(dados)) {
        setFuncionarios(dados);
      } else if (Array.isArray(dados?.data)) {
        setFuncionarios(dados.data);
      } else if (Array.isArray(dados?.dados)) {
        setFuncionarios(dados.dados);
      }
    } catch (err: any) {
      console.error('Erro ao carregar funcionários:', err);
    }
  };

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (salvando) return;

  const nomeLimpo = nome.trim();
  const codigoLimpo = codigo.trim().toUpperCase();
  const descricaoLimpa = descricao.trim();

  if (!nomeLimpo) {
    toast.erro('Digite o nome do departamento');
    return;
  }

  if (nomeLimpo.length < 2) {
    toast.erro('O nome do departamento deve ter pelo menos 2 caracteres');
    return;
  }

  if (!codigoLimpo) {
    toast.erro('Digite o código do departamento');
    return;
  }

  setSalvando(true);

  try {
    const payload: CriarDepartamentoPayload = {
      nome: nomeLimpo,
      codigo: codigoLimpo,
      descricao: descricaoLimpa || undefined,
      responsavelId: responsavelId ? Number(responsavelId) : undefined,
      ativo,
    };

    let resposta;

    if (typeof (departamentoService as any)?.criarDepartamento === 'function') {
      resposta = await (departamentoService as any).criarDepartamento(payload);
    } else {
      resposta = await api.post('/departamentos', payload);
    }

    const novoDepId = resposta?.data?.id || resposta?.id;

    // Se um responsável foi selecionado e o departamento foi criado,
    // atualiza o funcionário para vincular o novo departamentoId
    if (responsavelId && novoDepId) {
      try {
        await api.patch(`/funcionarios/${responsavelId}`, {
          departamentoId: novoDepId,
        });
      } catch (e) {
        // Ignora caso a rota /funcionarios/:id não exista ou use outra estrutura
        console.warn('Não foi possível associar o departamentoId ao funcionário diretamente:', e);
      }
    }

    toast.sucesso('Departamento criado com sucesso');
    onCriado();
  } catch (err: any) {
    console.error('Erro ao criar departamento:', err);

    toast.erro(
      err?.response?.data?.mensagem ||
        err?.response?.data?.message ||
        'Não foi possível criar o departamento'
    );
  } finally {
    setSalvando(false);
  }
}

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !salvando) {
          onFechar();
        }
      }}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Novo Departamento
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Adicione um novo departamento à empresa
            </p>
          </div>

          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label
                htmlFor="nomeDepartamento"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Nome *
              </label>

              <input
                id="nomeDepartamento"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Recursos Humanos"
                autoFocus
                required
                disabled={salvando}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#4F6EF7] focus:ring-2 focus:ring-[#4F6EF7]/20 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="codigoDepartamento"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Código *
              </label>

              <input
                id="codigoDepartamento"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="Ex.: RH"
                maxLength={10}
                required
                disabled={salvando}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-[#4F6EF7] focus:ring-2 focus:ring-[#4F6EF7]/20 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="descricaoDepartamento"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Descrição
            </label>

            <textarea
              id="descricaoDepartamento"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a função deste departamento"
              rows={4}
              disabled={salvando}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#4F6EF7] focus:ring-2 focus:ring-[#4F6EF7]/20 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="responsavelDepartamento"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Responsável
            </label>

            <select
              id="responsavelDepartamento"
              value={responsavelId}
              onChange={(e) => setResponsavelId(e.target.value)}
              disabled={salvando}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#4F6EF7] focus:ring-2 focus:ring-[#4F6EF7]/20 disabled:bg-gray-100"
            >
              <option value="">Sem responsável</option>
              {funcionarios.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name || f.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Estado</p>
              <p className="text-xs text-gray-500">
                {ativo ? 'Ativo' : 'Inativo'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAtivo(!ativo)}
              disabled={salvando}
              className={`relative h-6 w-11 rounded-full transition ${
                ativo ? 'bg-[#4F6EF7]' : 'bg-gray-300'
              } disabled:cursor-not-allowed`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  ativo ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onFechar}
              disabled={salvando}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={salvando}
              className="rounded-lg bg-[#4F6EF7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#405bd4] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {salvando ? 'A guardar...' : 'Criar Departamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}