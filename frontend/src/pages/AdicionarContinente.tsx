import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchContinenteById,
  addContinente,
  updateContinente,
} from "../services/api/continentes";
import type { Continente } from "../services/api/continentes";

const AdicionarContinente: React.FC = () => {
  const [nome, setNome] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const loadContinente = async () => {
        try {
          const idNumber = parseInt(id, 10);
          if (isNaN(idNumber)) {
            setErrorMessage("ID inválido.");
            return;
          }

          const continente: Continente | null = await fetchContinenteById(
            idNumber
          );
          if (continente) {
            setNome(continente.nome);
            setDescricao(continente.descricao);
          } else {
            setErrorMessage("Continente não encontrado.");
          }
        } catch (error) {
          setErrorMessage("Erro ao carregar o continente.");
        }
      };
      loadContinente();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (isEditing) {
        const idNumber = parseInt(id!, 10);
        if (isNaN(idNumber)) {
          setErrorMessage("ID inválido.");
          return;
        }
        await updateContinente(idNumber, { nome, descricao });
      } else {
        await addContinente({ nome, descricao });
      }
      navigate("/continentes");
    } catch (error) {
      setErrorMessage("Erro ao salvar o continente. Tente novamente.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">
        {isEditing ? "Editar Continente" : "Adicionar Continente"}
      </h1>

      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="nome" className="block text-lg font-semibold">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="descricao" className="block text-lg font-semibold">
            Descrição
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {isEditing ? "Salvar Alterações" : "Adicionar Continente"}
        </button>
      </form>
    </div>
  );
};

export default AdicionarContinente;
