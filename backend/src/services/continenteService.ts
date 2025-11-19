import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createContinente = async (nome: string, descricao: string) => {
  return await prisma.continente.create({
    data: {
      nome,
      descricao,
    },
  });
};

export const getContinentes = async (page: number, limit: number, nome: string) => {
  try {
    const where = nome ? { nome: { contains: nome, mode: 'insensitive' } } : {};

    const totalCount = await prisma.continente.count({
      where,
    });

    const data = await prisma.continente.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, totalCount };
  } catch (error) {
    throw new Error("Erro ao buscar os continentes");
  }
};

export const getContinenteById = async (id: number) => {
  try {
    const continente = await prisma.continente.findUnique({
      where: {
        id: id,
      },
    });
    return continente;
  } catch (error) {
    throw new Error("Erro ao buscar o continente");
  }
};

export const updateContinente = async (
  id: number,
  nome: string,
  descricao: string
) => {
  return await prisma.continente.update({
    where: { id },
    data: { nome, descricao },
  });
};

export const deleteContinente = async (id: number) => {
  return await prisma.continente.delete({
    where: { id },
  });
};
