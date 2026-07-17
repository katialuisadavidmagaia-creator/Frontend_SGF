import { useState, useMemo } from 'react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig<T> {
  key: keyof T;
  placeholder: string;
  options: FilterOption[];
}

export interface Action<T> {
  icon: React.ReactNode;
  label: string;
  onClick: (row: T) => void;
  className?: string;
}

export interface DataTableProps<T extends { id: number | string }> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  data: T[];
  columns: Column<T>[];
  filters?: FilterConfig<T>[];
  actions?: Action<T>[];
  onNew?: () => void;
  newLabel?: string;
  searchKeys?: (keyof T)[];
}


const IconEye = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEdit = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const IconPlus = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const css = `
  .dt-wrapper {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e8e4dc;
    padding: 28px 28px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* Header */
  .dt-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
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
    display: flex;
    align-items: center;
    gap: 6px;
    background: #003ce0;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 9px 18px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s;
  }
  .dt-btn-new:hover { background: #0d49ec; }

  /* Toolbar */
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
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 7px;
    font-size: 13.5px;
    color: #333;
    outline: none;
    background: #fafafa;
    transition: border-color 0.15s;
  }
  .dt-search:focus { border-color: #e07b00; background: #fff; }
  .dt-select {
    padding: 8px 28px 8px 12px;
    border: 1px solid #ddd;
    border-radius: 7px;
    font-size: 13.5px;
    color: #333;
    background: #fafafa url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M1 1l4 4 4-4'/%3E%3C/svg%3E") no-repeat right 10px center;
    appearance: none;
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s;
  }
  .dt-select:focus { border-color: #e07b00; }
  .dt-btn-clear {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 14px;
    border: 1px solid #ddd;
    border-radius: 7px;
    background: #fff;
    font-size: 13px;
    color: #555;
    cursor: pointer;
    transition: background 0.12s;
  }
  .dt-btn-clear:hover { background: #f5f0e8; }

  /* Table */
  .dt-table-wrap { overflow-x: auto; }
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
  .dt-table tbody tr:last-child td { border-bottom: none; }
  .dt-table tbody tr:hover td { background: #faf8f4; }

  /* Row Actions */
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
  .dt-action-btn:hover { background: #f0ece4; color: #333; }
  .dt-action-btn.danger { color: #cc3333; }
  .dt-action-btn.danger:hover { background: #fdecea; color: #aa2222; }

  /* Empty */
  .dt-empty {
    text-align: center;
    padding: 32px 0;
    color: #aaa;
    font-size: 14px;
  }
`;

export default function DataTable<T extends { id: number | string }>({
  title,
  subtitle,
  icon,
  data = [],
  columns,
  filters = [],
  actions,
  onNew,
  newLabel = 'Novo',
  searchKeys = [],
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((f) => [String(f.key), '']))
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearch('');
    setFilterValues(Object.fromEntries(filters.map((f) => [String(f.key), ''])));
  };

  const filtered = useMemo(() => {
    return data.filter((row) => {
      // 1. Filtro da Barra de Pesquisa Global
      if (search && searchKeys.length > 0) {
        const q = search.toLowerCase();
        const match = searchKeys.some((k) => {
          const value = row[k];
          return value !== undefined && value !== null && String(value).toLowerCase().includes(q);
        });
        if (!match) return false;
      }
      for (const f of filters) {
        const selectedVal = filterValues[String(f.key)];
        if (selectedVal) {
          const rowValue = row[f.key];
          if (rowValue === undefined || rowValue === null || String(rowValue) !== selectedVal) {
            return false;
          }
        }
      }
      return true;
    });
  }, [data, search, filterValues, searchKeys, filters]);

  const getCellValue = (row: T, col: Column<T>): React.ReactNode => {
    if (col.render) return col.render(row);
    const val = row[col.key as keyof T];
    return val !== undefined && val !== null ? String(val) : '—';
  };

  const defaultActions: Action<T>[] = actions ?? [];

  return (
    <>
      <style>{css}</style>
      <div className="dt-wrapper">
        {/* Header */}
        <div className="dt-header">
          <div className="dt-header-left">
            {icon && <span className="dt-header-icon">{icon}</span>}
            <div>
              <h2 className="dt-title">{title}</h2>
              {subtitle && <p className="dt-subtitle">{subtitle}</p>}
            </div>
          </div>
          {onNew && (
            <button className="dt-btn-new" onClick={onNew}>
              <IconPlus />
              {newLabel}
            </button>
          )}
        </div>

        {/* Toolbar */}
        {(searchKeys.length > 0 || filters.length > 0) && (
          <div className="dt-toolbar">
            {searchKeys.length > 0 && (
              <input
                className="dt-search"
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}
            {filters.map((f) => (
              <select
                key={String(f.key)}
                className="dt-select"
                value={filterValues[String(f.key)]}
                onChange={(e) => handleFilterChange(String(f.key), e.target.value)}
              >
                <option value="">{f.placeholder}</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
            <button className="dt-btn-clear" onClick={clearFilters}>
              <IconRefresh />
              Limpar filtros
            </button>
          </div>
        )}

        {/* Table */}
        <div className="dt-table-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={String(col.key)}>{col.label}</th>
                ))}
                {defaultActions.length > 0 && <th>Acções</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={String(col.key)}>{getCellValue(row, col)}</td>
                  ))}
                  {defaultActions.length > 0 && (
                    <td>
                      <div className="dt-actions">
                        {defaultActions.map((action, i) => (
                          <button
                            key={i}
                            className={`dt-action-btn${action.className ? ` ${action.className}` : ''}`}
                            title={action.label}
                            onClick={() => action.onClick(row)}
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
            <p className="dt-empty">Nenhum resultado encontrado.</p>
          )}
        </div>
      </div>
    </>
  );
}

export { IconEye, IconEdit, IconTrash };