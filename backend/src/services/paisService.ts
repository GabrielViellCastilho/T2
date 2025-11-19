import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPais = async (
  nome: string,
  populacao: number,
  idiomaOficial: string,
  moeda: string,
  continenteId: number,
  url_bandeira?: string | null
) => {
  return await prisma.pais.create({
    data: {
      nome,
      populacao,
      idiomaOficial,
      moeda,
      continenteId,
      url_bandeira,
    },
  });
};


export const getPaises = async () => {
  return await prisma.pais.findMany();
};

export const getPaisById = async (id: number) => {
  try {
    const pais = await prisma.pais.findUnique({
      where: {
        id: id,
      },
    });
    return pais;
  } catch (error) {
    throw new Error("Erro ao buscar o país");
  }
};

export const getPaisesPorContinente = async (continenteId: number) => {
  return await prisma.pais.findMany({
    where: {
      continenteId: continenteId,
    },
  });
};

export const updatePais = async (
  id: number,
  nome: string,
  populacao: number,
  idiomaOficial: string,
  moeda: string,
  continenteId: number,
  url_bandeira?: string
) => {
  return await prisma.pais.update({
    where: { id },
    data: {
      nome,
      populacao,
      idiomaOficial,
      moeda,
      continenteId,
      url_bandeira,
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
