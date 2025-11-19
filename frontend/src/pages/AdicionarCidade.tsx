import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchCidadeById, addCidade, updateCidade } from '../services/api/cidades';
import { fetchPaises } from '../services/api/paises';
import type { Cidade } from '../services/api/cidades';
import type { Pais } from '../services/api/paises';
import { fetchContinentes } from '../services/api/continentes';

const AdicionarCidade: React.FC = () => {
  const [nome, setNome] = useState<string>('');
  const [populacao, setPopulacao] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [paisId, setPaisId] = useState<string>('');

  const [paises, setPaises] = useState<Pais[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(fetchPaises())
    console.log(fetchContinentes())
    const loadPaises = async () => {
      try {
        const lista = await fetchPaises();
        setPaises(lista);
      } catch {
        setPaises([]);
      }
    };
    loadPaises();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditing(true);

      const loadCidade = async () => {
        try {
          const cidade: Cidade | null = await fetchCidadeById(id);
          if (cidade) {
            setNome(cidade.nome);
            setPopulacao(cidade.populacao.toString());
            setLatitude(cidade.latitude.toString());
            setLongitude(cidade.longitude.toString());
            setPaisId(cidade.paisId.toString());
          } else {
            setErrorMessage('Cidade não encontrada.');
          }
        } catch (error) {
          setErrorMessage('Erro ao carregar a cidade.');
        }
      };

      loadCidade();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const payload = {
      nome,
      populacao: Number(populacao),
      latitude: Number(latitude),
      longitude: Number(longitude),
      paisId: Number(paisId),
    };

    try {
      if (isEditing) {
        await updateCidade(id!, payload);
      } else {
        await addCidade(payload);
      }
      navigate('/cidades');
    } catch (error) {
      setErrorMessage('Erro ao salvar a cidade. Tente novamente.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">
        {isEditing ? 'Editar Cidade' : 'Adicionar Cidade'}
      </h1>

      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

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
          <label className="block text-lg font-semibold">Latitude</label>
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Longitude</label>
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">País</label>
          <select
            value={paisId}
            onChange={(e) => setPaisId(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Selecione o País</option>

            {paises.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {isEditing ? 'Salvar Alterações' : 'Adicionar Cidade'}
        </button>
      </form>
    </div>
  );
};

export default AdicionarCidade;
