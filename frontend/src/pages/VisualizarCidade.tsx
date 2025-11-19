import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCidadeById } from "../services/api/cidades";

// Tipagem correta baseada no retorno do backend
interface Continente {
  id: number;
  nome: string;
}

interface Pais {
  id: number;
  nome: string;
  populacao: number;
  moeda: string;
  idiomaOficial: string;
  continente: Continente;
}

interface CidadeDetalhes {
  id: number;
  nome: string;
  pais: Pais;
}

const VisualizarCidade: React.FC = () => {
  const { id } = useParams();
  const [cidade, setCidade] = useState<CidadeDetalhes | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadCidade = async () => {
      try {
        if (!id) return;

        // Conversão correta do ID para número
        const cidadeCarregada = await fetchCidadeById(id!);

        setCidade(cidadeCarregada);
      } catch (error) {
        console.error("Erro carregando cidade:", error);
        setErrorMessage("Erro ao carregar detalhes da cidade.");
      }
    };

    loadCidade();
  }, [id]);

  if (errorMessage) {
    return <p className="text-center text-red-600 mt-10">{errorMessage}</p>;
  }

  if (!cidade) {
    return <p className="text-center text-gray-600 mt-10">Carregando dados...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-4">
        Detalhes de {cidade.nome}
      </h1>

      <div className="space-y-4 text-lg">
        <div>
          <span className="font-semibold">Cidade:</span> {cidade.nome}
        </div>

        <div>
          <span className="font-semibold">País:</span> {cidade.pais.nome}
        </div>

        <div>
          <span className="font-semibold">Continente:</span>{" "}
          {cidade.pais.continente.nome}
        </div>

        <div>
          <span className="font-semibold">População do País:</span>{" "}
          {cidade.pais.populacao.toLocaleString("pt-BR")}
        </div>

        <div>
          <span className="font-semibold">Idioma Oficial:</span>{" "}
          {cidade.pais.idiomaOficial}
        </div>

        <div>
          <span className="font-semibold">Moeda:</span> {cidade.pais.moeda}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/cidades"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default VisualizarCidade;
