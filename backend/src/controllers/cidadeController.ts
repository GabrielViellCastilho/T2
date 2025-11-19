import { Request, Response } from "express";
import {
  createCidade,
  getCidadeById,
  updateCidade,
  deleteCidade,
  getAllCidades,
} from "../services/cidadeService";

export const createCidadeController = async (req: Request, res: Response) => {
  try {
    const { nome, populacao, latitude, longitude, paisId } = req.body;
    const cidade = await createCidade(
      nome,
      populacao,
      latitude,
      longitude,
      Number(paisId)
    );
    return res.status(201).json(cidade);
  } catch (err: any) {
    if (err.message === "PAIS_NOT_FOUND")
      return res.status(404).json({ error: "País não encontrado" });
    return res.status(500).json({ error: "Erro ao criar cidade" });
  }
};

export const getCidadesController = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", paisId, continenteId } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const paisIdNumber = paisId ? Number(paisId) : undefined;
    const continenteIdNumber = continenteId ? Number(continenteId) : undefined;

    const result = await getAllCidades(
      pageNumber,
      limitNumber,
      paisIdNumber,
      continenteIdNumber
    );

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar cidades" });
  }
};

export const getCidadeController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const cidade = await getCidadeById(idNumber);
    if (!cidade) {
      return res.status(404).json({ message: "Cidade não encontrada" });
    }
    res.status(200).json(cidade);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a cidade" });
  }
};

export const updateCidadeController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const cidade = await updateCidade(Number(id), data);
    return res.status(200).json(cidade);
  } catch (err: any) {
    if (err.message === "PAIS_NOT_FOUND")
      return res.status(404).json({ error: "País não encontrado" });
    return res.status(500).json({ error: "Erro ao atualizar cidade" });
  }
};

export const deleteCidadeController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteCidade(Number(id));
    return res.status(200).json({ message: "Cidade deletada com sucesso" });
  } catch {
    return res.status(500).json({ error: "Erro ao deletar cidade" });
  }
};
