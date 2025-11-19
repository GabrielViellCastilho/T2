import { Request, Response } from "express";
import {
  createPais,
  getPaisById,
  updatePais,
  deletePais,
  getAllPaises,
} from "../services/paisService";

export const createPaisController = async (req: Request, res: Response) => {
  try {
    const {
      nome,
      populacao,
      idiomaOficial,
      moeda,
      continenteId,
      url_bandeira,
    } = req.body;

    const pais = await createPais(
      nome,
      populacao,
      idiomaOficial,
      moeda,
      continenteId,
      url_bandeira
    );

    res.status(201).json(pais);
} catch (error: any) {
  console.error("ERRO AO CRIAR PAÍS:", error);

  return res.status(500).json({
    error: "Erro ao criar país",
    message: error.message,
    meta: error.meta || null
  });
}

};

export const getPaisesController = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", continenteId } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({ error: "Página inválida" });
    }
    if (isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({ error: "Limite inválido" });
    }

    const filters: any = {};

    if (continenteId) {
      const continenteParsed = Number(continenteId);
      if (isNaN(continenteParsed)) {
        return res.status(400).json({ error: "ID do continente inválido" });
      }
      filters.continenteId = continenteParsed;
    }

    const result = await getAllPaises(pageNumber, limitNumber, filters);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar países" });
  }
};

export const getPaisByIdController = async (req: Request, res: Response) => {
  try {
    const idNumber = Number(req.params.id);

    if (isNaN(idNumber)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const pais = await getPaisById(idNumber);

    if (!pais) {
      return res.status(404).json({ message: "País não encontrado" });
    }

    res.status(200).json(pais);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o país" });
  }
};

export const updatePaisController = async (req: Request, res: Response) => {
  try {
    const idNumber = Number(req.params.id);

    if (isNaN(idNumber)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const {
      nome,
      populacao,
      idiomaOficial,
      moeda,
      continenteId,
      url_bandeira,
    } = req.body;

    const pais = await updatePais(
      idNumber,
      nome,
      populacao,
      idiomaOficial,
      moeda,
      continenteId,
      url_bandeira
    );

    res.status(200).json(pais);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar país" });
  }
};

export const deletePaisController = async (req: Request, res: Response) => {
  try {
    const idNumber = Number(req.params.id);

    if (isNaN(idNumber)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    await deletePais(idNumber);

    res.status(200).json({ message: "País deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar país" });
  }
};
