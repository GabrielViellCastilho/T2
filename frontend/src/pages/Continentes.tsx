import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchContinentes, deleteContinente } from "../services/api/continentes";
import type { Continente } from "../services/api/continentes";
import BackButton from "../components/BackButton";

const Continentes: React.FC = () => {
  const [continentes, setContinentes] = useState<Continente[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const limit = 7;
  const [totalPages, setTotalPages] = useState(1);

  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const loadContinentes = async () => {
    setErrorMessage("");
    try {
      const data = await fetchContinentes(page, limit);
      setContinentes(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      setErrorMessage("Erro ao carregar os continentes.");
      setContinentes([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    loadContinentes();
  }, [page, reloadTrigger]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este continente?")) {
      try {
        await deleteContinente(id);
        setReloadTrigger((prev) => prev + 1);
      } catch (error) {
        setErrorMessage("Erro ao excluir o continente.");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">Cadastro de Continentes</h1>

      {errorMessage && (
        <p className="text-red-500 text-center mt-3">{errorMessage}</p>
      )}

      <BackButton />

      <div className="mt-8">
        <ul className="space-y-4">
          {continentes.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum continente cadastrado.</p>
          ) : (
            continentes.map((continente) => (
              <li
                key={continente.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-lg">{continente.nome}</span>

                <div className="flex gap-3">
                  <Link
                    to={`/continentes/visualizar/${continente.id}`}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Visualizar
                  </Link>
                  <Link
                    to={`/continentes/editar/${continente.id}`}
                    className="text-yellow-500 hover:text-blue-yellow mr-3"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(continente.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded disabled:opacity-50 w-full sm:w-auto"
        >
          Anterior
        </button>

        <span className="text-lg font-medium">
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded disabled:opacity-50 w-full sm:w-auto"
        >
          Próxima
        </button>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/continentes/adicionar"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Adicionar Novo Continente
        </Link>
      </div>
    </div>
  );
};

export default Continentes;
