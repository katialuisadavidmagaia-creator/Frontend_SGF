import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterConfig<T> {
  key: keyof T;
  placeholder: string;
  label: string;
  title: string;
  options: FilterOption[];
  value: string | number;
}

export interface Action<T> {
  icon: React.ReactNode;
  label: string;
  loading?: (item: T) => boolean;
  onClick: (row: T) => void;
  className?: string;
  variant?: 'default' | 'danger' | 'outline' | string;
}

export interface DataTableProps<T extends { id: number | string }> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  data: T[];
  loading?: boolean;
  columns: Column<T>[];
  filters?: FilterConfig<T>[];
  actions?: Action<T>[];
  onNew?: () => void;
  newLabel?: string;
  searchKeys?: (keyof T)[];
  placeholder?: string;
  
}

/* ============================
   ÍCONES
============================ */

const IconEye = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEdit = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconTrash = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const IconRefresh = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ============================
   CSS
============================ */

const css = `
  .dt-wrapper {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e8e4dc;
    padding: 28px 28px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .dt-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 20px;
  }

  .dt-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .dt-header-icon {
    color: #555;
    margin-top: 2px;
    display: flex;
    align-items: center;
  }

  .dt-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 2px;
  }

  .dt-subtitle {
    font-size: 13px;
    color: #888;
    margin: 0;
  }

  .dt-btn-new {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    padding: 11px 22px;
    background: #003ce0;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
  }

  .dt-btn-new:hover {
    background: #0d49ec;
    box-shadow: 0 4px 10px rgba(0, 60, 224, 0.20);
  }

  .dt-btn-new:active {
    transform: translateY(1px);
  }

  .dt-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .dt-search {
    flex: 1;
    min-width: 180px;
    max-width: 340px;
    padding: 9px 12px;
    border: 1px solid #ddd;
    border-radius: 7px;
    font-size: 13.5px;
    color: #333;
    outline: none;
    background: #fafafa;
    transition: border-color 0.15s;
  }

  .dt-search:focus {
    border-color: #4F6EF7;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(79, 110, 247, 0.10);
  }

  .dt-select {
    padding: 9px 28px 9px 12px;
    border: 1px solid #ddd;
    border-radius: 7px;
    font-size: 13.5px;
    color: #333;
    background: #fafafa;
    appearance: none;
    cursor: pointer;
    outline: none;
  }

  .dt-select:focus {
    border-color: #4F6EF7;
  }

  .dt-btn-clear {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 9px 14px;
    border: 1px solid #ddd;
    border-radius: 7px;
    background: #fff;
    font-size: 13px;
    color: #555;
    cursor: pointer;
    transition: background 0.12s;
  }

  .dt-btn-clear:hover {
    background: #f5f0e8;
  }

  .dt-table-wrap {
    overflow-x: auto;
  }

  .dt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .dt-table thead tr {
    border-bottom: 1px solid #e5e0d8;
  }

  .dt-table th {
    text-align: left;
    padding: 10px 12px;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #888;
  }

  .dt-table td {
    padding: 14px 12px;
    color: #2a2a2a;
    border-bottom: 1px solid #f0ece4;
    vertical-align: middle;
  }

  .dt-table tbody tr:last-child td {
    border-bottom: none;
  }

  .dt-table tbody tr:hover td {
    background: #faf8f4;
  }

  .dt-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .dt-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    color: #888;
    transition: background 0.12s, color 0.12s;
  }

  .dt-action-btn:hover {
    background: #f0ece4;
    color: #333;
  }

  .dt-action-btn.danger {
    color: #cc3333;
  }

  .dt-action-btn.danger:hover {
    background: #fdecea;
    color: #aa2222;
  }

  .dt-empty {
    text-align: center;
    padding: 32px 0;
    color: #aaa;
    font-size: 14px;
  }

  @media (max-width: 640px) {
    .dt-wrapper {
      padding: 20px 16px;
    }

    .dt-header {
      flex-direction: column;
      align-items: stretch;
    }

    .dt-btn-new {
      width: 100%;
    }

    .dt-search {
      max-width: none;
      width: 100%;
    }
  }
`;

/* ============================
   COMPONENTE
============================ */

export default function DataTable<T extends { id: number | string }>({
  title,
  subtitle,
  icon,
  data = [],
  columns,
  filters = [],
  actions,
  onNew,
  newLabel,
  searchKeys = [],
  placeholder, // <-- RECEBIDO AQUI
}: DataTableProps<T>) {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((f) => [String(f.key), '']))
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setSearch('');
    setFilterValues(Object.fromEntries(filters.map((f) => [String(f.key), ''])));
  };

  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (search && searchKeys.length > 0) {
        const q = search.toLowerCase();
        const match = searchKeys.some((key) => {
          const value = row[key];
          return (
            value !== undefined &&
            value !== null &&
            String(value).toLowerCase().includes(q)
          );
        });

        if (!match) return false;
      }

      for (const filter of filters) {
        const selectedValue = filterValues[String(filter.key)];
        if (selectedValue) {
          const rowValue = row[filter.key];
          if (
            rowValue === undefined ||
            rowValue === null ||
            String(rowValue) !== selectedValue
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, search, filterValues, searchKeys, filters]);

  const getCellValue = (row: T, column: Column<T>): React.ReactNode => {
    if (column.render) return column.render(row);
    const value = row[column.key as keyof T];
    return value !== undefined && value !== null ? String(value) : '—';
  };

  const defaultActions: Action<T>[] = actions ?? [];

  // Tratamento de textos padrão com Fallbacks legíveis
  const txtNovo = newLabel || (t('dataTable.novo') !== 'dataTable.novo' ? t('dataTable.novo') : 'Novo');
  const txtPesquisar = placeholder || (t('dataTable.pesquisar') !== 'dataTable.pesquisar' ? t('dataTable.pesquisar') : 'Pesquisar...');
  const txtLimparFiltros = t('dataTable.limparFiltros') !== 'dataTable.limparFiltros' ? t('dataTable.limparFiltros') : 'Limpar Filtros';
  const txtAccoes = t('dataTable.accoes') !== 'dataTable.accoes' ? t('dataTable.accoes') : 'Ações';
  const txtSemResultados = t('dataTable.semResultados') !== 'dataTable.semResultados' ? t('dataTable.semResultados') : 'Nenhum registro encontrado';

  return (
    <>
      <style>{css}</style>

      <div className="dt-wrapper">
        {/* HEADER */}
        <div className="dt-header">
          <div className="dt-header-left">
            {icon && <span className="dt-header-icon">{icon}</span>}
            <div>
              <h2 className="dt-title">{title}</h2>
              {subtitle && <p className="dt-subtitle">{subtitle}</p>}
            </div>
          </div>

          {onNew && (
            <button
              type="button"
              className="dt-btn-new"
              onClick={(e) => {
                e.preventDefault();
                onNew();
              }}
            >
              <IconPlus />
              <span>{txtNovo}</span>
            </button>
          )}
        </div>

        {/* TOOLBAR */}
        {(searchKeys.length > 0 || filters.length > 0) && (
          <div className="dt-toolbar">
            {searchKeys.length > 0 && (
              <input
                className="dt-search"
                type="text"
                placeholder={txtPesquisar}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}

            {filters.map((filter) => (
              <select
                key={String(filter.key)}
                className="dt-select"
                value={filterValues[String(filter.key)] ?? ''}
                onChange={(e) => handleFilterChange(String(filter.key), e.target.value)}
              >
                <option value="">{filter.placeholder}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}

            <button
              type="button"
              className="dt-btn-clear"
              onClick={(e) => {
                e.preventDefault();
                clearFilters();
              }}
            >
              <IconRefresh />
              {txtLimparFiltros}
            </button>
          </div>
        )}

        {/* TABELA */}
        <div className="dt-table-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={String(column.key)}>{column.label}</th>
                ))}
                {defaultActions.length > 0 && <th>{txtAccoes}</th>}
              </tr>
            </thead>

            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={String(column.key)}>
                      {getCellValue(row, column)}
                    </td>
                  ))}

                  {defaultActions.length > 0 && (
                    <td>
                      <div className="dt-actions">
                        {defaultActions.map((action, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`dt-action-btn ${
                              action.variant === 'danger' ? 'danger' : ''
                            } ${action.className ?? ''}`}
                            title={action.label}
                            onClick={(e) => {
                              e.preventDefault();
                              action.onClick(row);
                            }}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="dt-empty">{txtSemResultados}</p>
          )}
        </div>
      </div>
    </>
  );
}

export { IconEye, IconEdit, IconTrash, IconRefresh, IconPlus };