import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Se usares navegação por página

export function FuncionariosList() {
  const [funcionarios, setFuncionarios] = useState([]);
  const navigate = useNavigate();

  const handleEditar = (id: number) => {
    navigate(`/funcionarios/editar/${id}`); 
    
    
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Funcionários</h1>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3">Nome</th>
            <th className="p-3">Email</th>
            <th className="p-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((func: any) => (
            <tr key={func.id} className="border-b">
              <td className="p-3">{func.name}</td>
              <td className="p-3">{func.email}</td>

              {/* ========================================== */}
              {/* É AQUI QUE COLOCAS A CORREÇÃO DOS BOTÕES  */}
              {/* ========================================== */}
              <td className="p-3 text-center space-x-2">
                
                {/* BOTÃO VER */}
                <button
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Coloca aqui a tua função de Ver
                    alert(`A ver funcionário: ${func.name}`);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Ver
                </button>

                {/* BOTÃO EDITAR */}
                <button
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditar(func.id);
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Editar
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}