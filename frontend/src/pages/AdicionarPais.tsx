import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchPaisById, addPais, updatePais } from "../services/api/paises";
import { fetchContinentes } from "../services/api/continentes";
import type { Pais } from "../services/api/paises";

const AdicionarPais: React.FC = () => {
  const [nome, setNome] = useState<string>("");
  const [populacao, setPopulacao] = useState<string>("");
  const [idioma, setIdioma] = useState<string>("");
  const [moeda, setMoeda] = useState<string>("");
  const [continenteId, setContinenteId] = useState<string>("");

  const [continentes, setContinentes] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { id } = useParams();
  const navigate = useNavigate();

useEffect(() => {
  const loadContinentes = async () => {
    const lista = await fetchContinentes();
    
    setContinentes(lista.data);
  };
  loadContinentes();
}, []);

  useEffect(() => {
    if (id) {
      setIsEditing(true);

      const loadPais = async () => {
        try {
          const pais: Pais | null = await fetchPaisById(id);
          if (pais) {
            setNome(pais.nome);
            setPopulacao(pais.populacao.toString());
            setIdioma(pais.idiomaOficial);
            setMoeda(pais.moeda);
            setContinenteId(pais.continenteId.toString());
          } else {
            setErrorMessage("País não encontrado.");
          }
        } catch (error) {
          setErrorMessage("Erro ao carregar o país.");
        }
      };

      loadPais();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const payload = {
      nome,
      populacao: Number(populacao),
      idiomaOficial: idioma,
      moeda,
      continenteId: Number(continenteId),
    };

    try {
      if (isEditing) {
        await updatePais(id!, payload);
      } else {
        await addPais(payload);
      }
      navigate("/paises");
    } catch (error) {
      setErrorMessage("Erro ao salvar o país. Tente novamente.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">
        {isEditing ? "Editar País" : "Adicionar País"}
      </h1>

      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">

        <div className="mb-4">
          <label className="block text-lg font-semibold">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">População</label>
          <input
            type="number"
            value={populacao}
            onChange={(e) => setPopulacao(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Idioma Oficial</label>
          <input
            type="text"
            value={idioma}
            onChange={(e) => setIdioma(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Moeda</label>
          <input
            type="text"
            value={moeda}
            onChange={(e) => setMoeda(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Continente</label>
          <select
            value={continenteId}
            onChange={(e) => setContinenteId(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Selecione o Continente</option>

            {continentes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {isEditing ? "Salvar Alterações" : "Adicionar País"}
        </button>
      </form>
    </div>
  );
};

export default AdicionarPais;
