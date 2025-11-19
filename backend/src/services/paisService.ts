import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPais = async (
  nome: string,
  populacao: number,
  idiomaOficial: string,
  moeda: string,
  continenteId: number,
  url_bandeira?: string | null,
  pib_per_capita?: number | null,
  inflacao?: number | null
) => {
  return await prisma.pais.create({
    data: {
      nome,
      populacao,
      idiomaOficial,
      moeda,
      continenteId,
      url_bandeira: url_bandeira ?? null,
      pib_per_capita: pib_per_capita ?? null,
      inflacao: inflacao ?? null,
    },
  });
};

export const getPaises = async () => {
  return await prisma.pais.findMany({
    include: { continente: true },
  });
};

export const getPaisById = async (id: number) => {
  try {
    const pais = await prisma.pais.findUnique({
      include: { continente: true },
      where: { id },
    });
    return pais;
  } catch (error) {
    throw new Error("Erro ao buscar o país");
  }
};

export const getPaisesPorContinente = async (continenteId: number) => {
  return await prisma.pais.findMany({
    where: { continenteId },
    include: { continente: true },
  });
};

export const updatePais = async (
  id: number,
  nome: string,
  populacao: number,
  idiomaOficial: string,
  moeda: string,
  continenteId: number,
  url_bandeira?: string | null,
  pib_per_capita?: number | null,
  inflacao?: number | null
) => {
  return await prisma.pais.update({
    where: { id },
    data: {
      nome,
      populacao,
      idiomaOficial,
      moeda,
      continenteId,
      url_bandeira: url_bandeira ?? null,
      pib_per_capita: pib_per_capita ?? null,
      inflacao: inflacao ?? null,
    },
  });
};

export const deletePais = async (id: number) => {
  return await prisma.pais.delete({
    where: { id },
  });
};

export const getAllPaises = async (
  page: number = 1,
  limit: number = 10,
  filters?: { continenteId?: number }
) => {
  const skip = (page - 1) * limit;

  const where: any = {};
  if (filters?.continenteId) where.continenteId = filters.continenteId;

  try {
    const [paises, total] = await Promise.all([
      prisma.pais.findMany({
        skip,
        take: limit,
        include: { continente: true },
        orderBy: { id: "asc" },
        where,
      }),
      prisma.pais.count({ where }),
    ]);

    return {
      data: paises,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    throw new Error("Erro ao buscar os países");
  }
};
