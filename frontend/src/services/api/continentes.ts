import api from "./api";

export interface Continente {
  id: number;
  nome: string;
  descricao: string;
}

export const fetchContinentes = async (
  page: number = 1,
  limit: number = 10,
  nome: string = ""
): Promise<{ data: Continente[]; totalPages: number; totalCount: number }> => {
  try {
    console.log("Parâmetros enviados para a API:", { page, limit, nome });

    const response = await api.get("/continentes", {
      params: {
        page,
        limit,
        nome: nome || "",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("ERRO DETALHADO DA API (fetchContinentes):", error);

    if (error.response) {
      console.error(
        "Dados da Resposta do Servidor (data):",
        error.response.data
      );
      console.error("Status da Resposta:", error.response.status);
    } else if (error.request) {
      console.error(
        "Nenhuma resposta recebida para a requisição:",
        error.request
      );
    } else {
      console.error("Erro ao configurar a requisição:", error.message);
    }

    throw error;
  }
};

export const fetchContinenteById = async (
  id: number
): Promise<Continente | null> => {
  try {
    const response = await api.get(`/continentes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar continente:", error);
    return null;
  }
};

export const addContinente = async (continente: {
  nome: string;
  descricao: string;
}): Promise<Continente | undefined> => {
  try {
    const response = await api.post("/continentes", continente);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar continente:", error);
    return undefined;
  }
};

export const updateContinente = async (
  id: number,
  continente: { nome: string; descricao: string }
): Promise<Continente | undefined> => {
  try {
    const response = await api.put(`/continentes/${id}`, continente);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar continente:", error);
    return undefined;
  }
};

export const deleteContinente = async (
  id: number
): Promise<{ message: string } | undefined> => {
  try {
    const response = await api.delete(`/continentes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir continente:", error);
    return undefined;
  }
};
