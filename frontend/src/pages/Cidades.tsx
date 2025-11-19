import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCidades, deleteCidade } from "../services/api/cidades";
import type { Cidade } from "../services/api/cidades";

import { fetchPaises } from "../services/api/paises";
import { fetchContinentes } from "../services/api/continentes";

import BackButton from "../components/BackButton";

const Cidades: React.FC = () => {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [paisId, setPaisId] = useState("");
  const [continenteId, setContinenteId] = useState("");

  const [paises, setPaises] = useState<any[]>([]);
  const [continentes, setContinentes] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const limit = 7;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const listaPaises = await fetchPaises();
        setPaises(listaPaises);

        const listaContinentes = await fetchContinentes();
        setContinentes(listaContinentes.data || []);
      } catch (err) {
        console.error("Erro carregando listas:", err);
      }
    };

    loadFiltersData();
  }, []);

  const loadCidades = async () => {
    try {
      const params: any = { page, limit };

      if (paisId) params.paisId = Number(paisId);
      if (continenteId) params.continenteId = Number(continenteId);

      const data = await fetchCidades(params);

      setCidades(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      setErrorMessage("Erro ao carregar as cidades.");
    }
  };

  useEffect(() => {
    loadCidades();
  }, [paisId, continenteId, page]);

  const paisesFiltrados = continenteId
    ? paises.filter((p) => p.continenteId === Number(continenteId))
    : paises;

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta cidade?")) {
      try {
        await deleteCidade(id.toString());
        setCidades((prev) => prev.filter((cidade) => cidade.id !== id));
      } catch (error) {
        setErrorMessage("Erro ao excluir a cidade.");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">Cadastro de Cidades</h1>

      {errorMessage && (
        <p className="text-red-500 text-center mt-3">{errorMessage}</p>
      )}

      <BackButton />

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <select
          value={continenteId}
          onChange={(e) => {
            setContinenteId(e.target.value);
            setPaisId("");
            setPage(1);
          }}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="">Filtrar por Continente</option>
          {continentes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <select
          value={paisId}
          onChange={(e) => {
            setPaisId(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="">Filtrar por País</option>
          {paisesFiltrados.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            loadCidades();
            setPage(1);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          Buscar
        </button>

        <button
          onClick={() => {
            setPaisId("");
            setContinenteId("");
            setPage(1);
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full sm:w-auto"
        >
          Limpar
        </button>
      </div>

      <div className="mt-8">
        <ul className="space-y-4">
          {cidades.map((cidade) => (
            <li
              key={cidade.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <span className="text-lg">{cidade.nome}</span>

              <div>
                {/* BOTÃO VISUALIZAR */}
                <Link
                  to={`/cidades/visualizar/${cidade.id}`}
                  className="text-green-600 hover:text-green-800 mr-3"
                >
                  Visualizar
                </Link>

                <Link
                  to={`/cidades/editar/${cidade.id}`}
                  className="text-blue-500 hover:text-blue-700 mr-3"
                >
                  Editar
                </Link>

                <button
                  onClick={() => handleDelete(cidade.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 w-full sm:w-auto"
        >
          Anterior
        </button>

        <span className="text-lg font-medium">
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 w-full sm:w-auto"
        >
          Próxima
        </button>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/cidades/adicionar"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Adicionar Nova Cidade
        </Link>
      </div>
    </div>
  );
};

export default Cidades;
