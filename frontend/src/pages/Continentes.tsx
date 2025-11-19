import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchContinentes,
  deleteContinente,
} from "../services/api/continentes";
import type { Continente } from "../services/api/continentes";
import BackButton from "../components/BackButton";

const Continentes: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [continentes, setContinentes] = useState<Continente[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [nome, setNome] = useState<string>("");

  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  useEffect(() => {
    const loadContinentes = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const { data, totalPages } = await fetchContinentes(
          currentPage,
          10,
          nome
        );

        if (data.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
          return;
        }

        setContinentes(data);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Erro ao carregar continentes:", error);
        setErrorMessage(
          "Erro ao carregar continentes. Verifique a conexão com a API."
        );
        setContinentes([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadContinentes();
  }, [currentPage, nome, reloadTrigger]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este continente?")) {
      try {
        await deleteContinente(id);
        setReloadTrigger((prev) => prev + 1);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Erro ao excluir o continente.");
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">
        Cadastro de Continentes
      </h1>

      {errorMessage && (
        <p className="text-red-500 text-center mt-3">{errorMessage}</p>
      )}

      <BackButton />

      {/* Filtro de nome */}
      <div className="mt-4 text-center">
        <input
          type="text"
          value={nome}
          onChange={handleSearchChange}
          placeholder="Pesquisar por nome"
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>

      {isLoading ? (
        <div className="text-center mt-10 text-xl font-semibold text-gray-600">
          Carregando dados...
        </div>
      ) : (
        <>
          {/* Lista de continentes */}
          <div className="mt-8">
            <ul className="space-y-4">
              {continentes.length === 0 && !errorMessage ? (
                <p className="text-center text-gray-500">
                  Nenhum continente encontrado com o filtro atual.
                </p>
              ) : (
                continentes.map((continente) => (
                  <li
                    key={continente.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span className="text-lg">{continente.nome}</span>
                    <div>
                      <Link
                        to={`/continentes/editar/${continente.id}`}
                        className="text-blue-500 hover:text-blue-700 mr-3"
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
          {totalPages > 1 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="mx-4">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}

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
