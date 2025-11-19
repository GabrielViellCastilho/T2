import api from "./api";

export interface Continente {
  id: number;
  nome: string;
  descricao?: string;
}

export interface Pais {
  id: number;
  nome: string;
  populacao: number;
  moeda: string;
  idiomaOficial: string;
  continenteId: number;
  url_bandeira?: string | null;
  continente: Continente;
}

export interface Cidade {
  id: number;
  nome: string;
  populacao: number;
  latitude: number;
  longitude: number;
  paisId: number;
  pais: Pais;
}

interface FetchCidadesParams {
  paisId?: number;
  continenteId?: number;
  page?: number;
  limit?: number;
}

export const fetchCidades = async (
  params?: FetchCidadesParams
): Promise<{
  data: Cidade[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  try {
    const response = await api.get("/cidades", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
    return {
      data: [],
      total: 0,
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      totalPages: 0,
    };
  }
};

// ⚡ Aqui está a mudança principal: Cidade já inclui "pais"
export const fetchCidadeById = async (id: string): Promise<Cidade | null> => {
  try {
    const response = await api.get(`/cidades/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cidade:", error);
    return null;
  }
};

export const addCidade = async (cidade: {
  nome: string;
  populacao: number;
  latitude: number;
  longitude: number;
  paisId: number;
}): Promise<Cidade | undefined> => {
  try {
    const response = await api.post("/cidades", cidade);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar cidade:", error);
    return undefined;
  }
};

export const updateCidade = async (
  id: string,
  cidade: {
    nome: string;
    populacao: number;
    latitude: number;
    longitude: number;
    paisId: number;
  }
): Promise<Cidade | undefined> => {
  try {
    const response = await api.put(`/cidades/${id}`, cidade);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar cidade:", error);
    return undefined;
  }
};

export const deleteCidade = async (
  id: string
): Promise<{ message: string } | undefined> => {
  try {
    const response = await api.delete(`/cidades/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir cidade:", error);
    return undefined;
  }
};
