import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchContinenteById } from "../services/api/continentes";

interface Pais {
  id: number;
  nome: string;
  populacao: number;
  moeda: string;
  idiomaOficial: string;
}

interface ContinenteDetalhes {
  id: number;
  nome: string;
  descricao?: string; 
  paises?: Pais[];
}

const VisualizarContinente: React.FC = () => {
  const { id } = useParams();
  const [continente, setContinente] = useState<ContinenteDetalhes | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadContinente = async () => {
      try {
        if (!id) return;

        const data = await fetchContinenteById(Number(id));
        setContinente(data);
      } catch (error) {
        console.error("Erro carregando continente:", error);
        setErrorMessage("Erro ao carregar detalhes do continente.");
      }
    };

    loadContinente();
  }, [id]);

  if (errorMessage) {
    return <p className="text-center text-red-600 mt-10">{errorMessage}</p>;
  }

  if (!continente) {
    return <p className="text-center text-gray-600 mt-10">Carregando dados...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl text-gray-900">
      <h1 className="text-3xl font-bold text-center mb-4">
        Detalhes do Continente: {continente.nome}
      </h1>

      <div className="space-y-4 text-lg">
        <div>
          <span className="font-semibold">Nome:</span> {continente.nome}
        </div>

        {continente.descricao && (
          <div>
            <span className="font-semibold">Descrição:</span> {continente.descricao}
          </div>
        )}

        {continente.paises && continente.paises.length > 0 && (
          <div>
            <span className="font-semibold">Países:</span>
            <ul className="list-disc ml-6 mt-1">
              {continente.paises.map((pais) => (
                <li key={pais.id}>
                  {pais.nome} - {pais.populacao.toLocaleString("pt-BR")} hab.
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/continentes"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default VisualizarContinente;
