
import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type TipoEvento =
  | 'PROJETO'
  | 'TASK'
  | 'RELATORIO'
  | 'REUNIAO'
  | 'EVENTO';

interface Evento {
  id: number;
  titulo: string;
  data: string;
  hora?: string;
  tipo: TipoEvento;
  descricao?: string;
}

interface FormEvento {
  titulo: string;
  data: string;
  hora: string;
  tipo: TipoEvento;
  descricao: string;
}

const FORM_INICIAL: FormEvento = {
  titulo: '',
  data: '',
  hora: '',
  tipo: 'EVENTO',
  descricao: '',
};

export default function Calendario() {
  const { t } = useTranslation();

  const hoje = new Date();

  const [mesAtual, setMesAtual] = useState(
    hoje.getMonth()
  );

  const [anoAtual, setAnoAtual] = useState(
    hoje.getFullYear()
  );

  const [eventos, setEventos] = useState<Evento[]>(() => {
    const guardados =
      localStorage.getItem('vertice_calendario');

    return guardados ? JSON.parse(guardados) : [];
  });

  const [modalAberto, setModalAberto] = useState(false);

  const [filtroTipo, setFiltroTipo] = useState<
    TipoEvento | ''
  >('');

  const [form, setForm] =
    useState<FormEvento>(FORM_INICIAL);

  const meses = [
    t('calendar.months.january'),
    t('calendar.months.february'),
    t('calendar.months.march'),
    t('calendar.months.april'),
    t('calendar.months.may'),
    t('calendar.months.june'),
    t('calendar.months.july'),
    t('calendar.months.august'),
    t('calendar.months.september'),
    t('calendar.months.october'),
    t('calendar.months.november'),
    t('calendar.months.december'),
  ];

  const diasSemana = [
    t('calendar.weekdays.monday'),
    t('calendar.weekdays.tuesday'),
    t('calendar.weekdays.wednesday'),
    t('calendar.weekdays.thursday'),
    t('calendar.weekdays.friday'),
    t('calendar.weekdays.saturday'),
    t('calendar.weekdays.sunday'),
  ];

  const primeiroDia = new Date(
    anoAtual,
    mesAtual,
    1
  ).getDay();

  const totalDias = new Date(
    anoAtual,
    mesAtual + 1,
    0
  ).getDate();

  const dias = useMemo(() => {
    const inicio =
      primeiroDia === 0
        ? 6
        : primeiroDia - 1;

    return [
      ...Array(inicio).fill(null),
      ...Array.from(
        { length: totalDias },
        (_, index) => index + 1
      ),
    ];
  }, [primeiroDia, totalDias]);

  const eventosFiltrados = eventos.filter(
    (evento) =>
      !filtroTipo ||
      evento.tipo === filtroTipo
  );

  const mudarMes = (direcao: number) => {
    let novoMes = mesAtual + direcao;
    let novoAno = anoAtual;

    if (novoMes > 11) {
      novoMes = 0;
      novoAno++;
    }

    if (novoMes < 0) {
      novoMes = 11;
      novoAno--;
    }

    setMesAtual(novoMes);
    setAnoAtual(novoAno);
  };

  const obterData = (dia: number) => {
    const mes = String(mesAtual + 1).padStart(2, '0');
    const diaFormatado = String(dia).padStart(2, '0');

    return `${anoAtual}-${mes}-${diaFormatado}`;
  };

  const guardarEvento = () => {
    if (!form.titulo.trim() || !form.data) {
      return;
    }

    const novoEvento: Evento = {
      id: Date.now(),
      titulo: form.titulo,
      data: form.data,
      hora: form.hora,
      tipo: form.tipo,
      descricao: form.descricao,
    };

    const atualizados = [
      ...eventos,
      novoEvento,
    ];

    setEventos(atualizados);

    localStorage.setItem(
      'vertice_calendario',
      JSON.stringify(atualizados)
    );

    setForm(FORM_INICIAL);
    setModalAberto(false);
  };

  const eliminarEvento = (id: number) => {
    const atualizados = eventos.filter(
      (evento) => evento.id !== id
    );

    setEventos(atualizados);

    localStorage.setItem(
      'vertice_calendario',
      JSON.stringify(atualizados)
    );
  };

  const tipoClasses: Record<TipoEvento, string> = {
    PROJETO:
      'bg-blue-50 text-blue-700 border-blue-100',
    TASK:
      'bg-yellow-50 text-yellow-700 border-yellow-100',
    RELATORIO:
      'bg-orange-50 text-orange-700 border-orange-100',
    REUNIAO:
      'bg-purple-50 text-purple-700 border-purple-100',
    EVENTO:
      'bg-green-50 text-green-700 border-green-100',
  };

  const tipoIcones: Record<TipoEvento, string> = {
    PROJETO: '🔵',
    TASK: '🟡',
    RELATORIO: '🟠',
    REUNIAO: '🟣',
    EVENTO: '🟢',
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-7 w-7 text-indigo-600" />

            <h1 className="text-2xl font-bold text-slate-800">
              {t('calendar.title')}
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {t('calendar.description')}
          </p>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          {t('calendar.newEvent')}
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltroTipo('')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            filtroTipo === ''
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          {t('calendar.filters.all')}
        </button>

        {(
          [
            'PROJETO',
            'TASK',
            'RELATORIO',
            'REUNIAO',
            'EVENTO',
          ] as TipoEvento[]
        ).map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltroTipo(tipo)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              filtroTipo === tipo
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {tipoIcones[tipo]}{' '}
            {t(`calendar.types.${tipo}`)}
          </button>
        ))}
      </div>

      {/* Calendário */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <button
            onClick={() => mudarMes(-1)}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h2 className="text-lg font-semibold text-slate-800">
            {meses[mesAtual]} {anoAtual}
          </h2>

          <button
            onClick={() => mudarMes(1)}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-200">
          {diasSemana.map((dia) => (
            <div
              key={dia}
              className="p-3 text-center text-xs font-semibold text-slate-500"
            >
              {dia}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {dias.map((dia, index) => {
            if (!dia) {
              return (
                <div
                  key={`vazio-${index}`}
                  className="min-h-32 border-b border-r border-slate-100 bg-slate-50/40"
                />
              );
            }

            const data = obterData(dia);

            const eventosDoDia =
              eventosFiltrados.filter(
                (evento) =>
                  evento.data === data
              );

            const ehHoje =
              dia === hoje.getDate() &&
              mesAtual === hoje.getMonth() &&
              anoAtual === hoje.getFullYear();

            return (
              <div
                key={dia}
                className="min-h-32 border-b border-r border-slate-100 p-2"
              >
                <div
                  className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                    ehHoje
                      ? 'bg-indigo-600 font-bold text-white'
                      : 'text-slate-700'
                  }`}
                >
                  {dia}
                </div>

                <div className="space-y-1">
                  {eventosDoDia.map(
                    (evento) => (
                      <div
                        key={evento.id}
                        className={`group rounded-md border px-2 py-1.5 text-xs ${tipoClasses[evento.tipo]}`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="min-w-0">
                            <div className="font-medium">
                              {tipoIcones[evento.tipo]}{' '}
                              {evento.titulo}
                            </div>

                            {evento.hora && (
                              <div className="mt-0.5 opacity-70">
                                {evento.hora}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              eliminarEvento(
                                evento.id
                              )
                            }
                            className="hidden shrink-0 group-hover:block"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal novo evento */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800">
                {t('calendar.newEvent')}
              </h2>

              <button
                onClick={() =>
                  setModalAberto(false)
                }
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t('calendar.fields.title')}
                </label>

                <input
                  value={form.titulo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      titulo: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t('calendar.fields.type')}
                </label>

                <select
                  value={form.tipo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tipo: e.target.value as TipoEvento,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                >
                  {(
                    [
                      'PROJETO',
                      'TASK',
                      'RELATORIO',
                      'REUNIAO',
                      'EVENTO',
                    ] as TipoEvento[]
                  ).map((tipo) => (
                    <option
                      key={tipo}
                      value={tipo}
                    >
                      {t(`calendar.types.${tipo}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t('calendar.fields.date')}
                  </label>

                  <input
                    type="date"
                    value={form.data}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        data: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t('calendar.fields.time')}
                  </label>

                  <input
                    type="time"
                    value={form.hora}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hora: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t('calendar.fields.description')}
                </label>

                <textarea
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descricao: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
              <button
                onClick={() =>
                  setModalAberto(false)
                }
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
              >
                {t('common.cancel')}
              </button>

              <button
                onClick={guardarEvento}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
