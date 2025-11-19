import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPaisById, addPais, updatePais, type Pais } from "../services/api/paises";
import { fetchContinentes } from "../services/api/continentes";
import { getCountryData, type CountryData } from "../services/api/apisExternas";

const AdicionarPais: React.FC = () => {
  const [nome, setNome] = useState<string>("");
  const [populacao, setPopulacao] = useState<string>("");
  const [idioma, setIdioma] = useState<string>("");
  const [moeda, setMoeda] = useState<string>("");
  const [continenteId, setContinenteId] = useState<string>("");
  const [urlBandeira, setUrlBandeira] = useState<string>("");
  const [pibPerCapita, setPibPerCapita] = useState<string>("");
  const [inflacao, setInflacao] = useState<string>("");

  const [continentes, setContinentes] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { id } = useParams();
  const navigate = useNavigate();

  const [pesquisaNome, setPesquisaNome] = useState<string>("");

  // Carregar continentes
  useEffect(() => {
    const loadContinentes = async () => {
      const lista = await fetchContinentes();
      setContinentes(lista.data);
    };
    loadContinentes();
  }, []);

  // Carregar país se estiver editando
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
            setUrlBandeira(pais.url_bandeira ?? "");
            setPibPerCapita(pais.pib_per_capita?.toString() ?? "");
            setInflacao(pais.inflacao?.toString() ?? "");
          } else {
            setErrorMessage("País não encontrado.");
          }
        } catch {
          setErrorMessage("Erro ao carregar o país.");
        }
      };
      loadPais();
    }
  }, [id]);

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const payload = {
      nome,
      populacao: Number(populacao),
      idiomaOficial: idioma,
      moeda,
      continenteId: Number(continenteId),
      url_bandeira: urlBandeira || null,
      pib_per_capita: pibPerCapita ? Number(pibPerCapita) : null,
      inflacao: inflacao ? Number(inflacao) : null,
    };

    try {
      if (isEditing && id) {
        await updatePais(id, payload);
      } else {
        await addPais(payload);
      }
      navigate("/paises");
    } catch {
      setErrorMessage("Erro ao salvar o país. Tente novamente.");
    }
  };

  // Pesquisar país na API externa
  const handlePesquisar = async () => {
    if (!pesquisaNome) {
      setErrorMessage("Informe o nome do país para pesquisar.");
      return;
    }
    setErrorMessage("");
    try {
      const data: CountryData | null = await getCountryData(pesquisaNome);
      if (data) {
        setNome(data.name ?? "");
        setPopulacao(data.population?.toString() ?? "");
        setIdioma(data.language ?? "");
        setMoeda(data.currencySymbol ?? "");
        setUrlBandeira(data.flagUrl ?? "");
        setPibPerCapita(data.gdpPerCapita?.toString() ?? "");
        setInflacao(data.inflation?.toString() ?? "");
      } else {
        setErrorMessage("País não encontrado na API externa.");
      }
    } catch {
      setErrorMessage("Erro ao buscar país na API externa.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">
        {isEditing ? "Editar País" : "Adicionar País"}
      </h1>

      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

      <div className="mt-6 max-w-md mx-auto flex gap-2">
        <input
          type="text"
          value={pesquisaNome}
          onChange={(e) => setPesquisaNome(e.target.value)}
          placeholder="Digite o nome do país"
          className="flex-1 p-2 border rounded-md"
        />
        <button
          type="button"
          onClick={handlePesquisar}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Pesquisar
        </button>
      </div>

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
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">URL da Bandeira</label>
          <input
            type="text"
            value={urlBandeira}
            onChange={(e) => setUrlBandeira(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          {urlBandeira && (
            <img src={urlBandeira} alt="Bandeira" className="mt-2 h-16" />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">PIB per Capita</label>
          <input
            type="number"
            value={pibPerCapita}
            onChange={(e) => setPibPerCapita(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Inflação (%)</label>
          <input
            type="number"
            value={inflacao}
            onChange={(e) => setInflacao(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
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
