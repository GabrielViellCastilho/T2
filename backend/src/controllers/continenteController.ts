import { Request, Response } from "express";
import {
  createContinente,
  getContinentes,
  getContinenteById,
  updateContinente,
  deleteContinente,
} from "../services/continenteService";

export const createContinenteController = async (
  req: Request,
  res: Response
) => {
  try {
    const { nome, descricao } = req.body;
    const continente = await createContinente(nome, descricao);
    res.status(201).json(continente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar continente" });
  }
};

export const getContinentesController = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", nome } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({ error: "Página inválida" });
    }
    if (isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({ error: "Limite inválido" });
    }

    const { data, totalCount } = await getContinentes(pageNumber, limitNumber, nome as string);

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.json({
      data,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar continentes" });
  }
};


export const getContinenteController = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const continente = await getContinenteById(idNumber);
    if (!continente) {
      return res.status(404).json({ message: "Continente não encontrado" });
    }
    res.status(200).json(continente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o continente" });
  }
};

export const updateContinenteController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const continente = await updateContinente(Number(id), nome, descricao);
    res.status(200).json(continente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar continente" });
  }
};

export const deleteContinenteController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await deleteContinente(Number(id));
    res.status(200).json({ message: "Continente deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar continente" });
  }
};
