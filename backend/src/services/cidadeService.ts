import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCidades = async (
  page: number = 1,
  limit: number = 10,
  paisId?: number,
  continenteId?: number
) => {
  const skip = (page - 1) * limit;

  try {
    const where: any = {};

    if (paisId) {
      where.paisId = paisId;
    }
    
    if (continenteId) {
      where.pais = { continenteId: continenteId };
    }

    const [cidades, total] = await Promise.all([
      prisma.cidade.findMany({
        skip,
        take: limit,
        include: {
          pais: {
            include: { continente: true },
          },
        },
        where,
        orderBy: { id: "asc" },
      }),

      prisma.cidade.count({ where }),
    ]);

    return {
      data: cidades,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    throw new Error("Erro ao buscar as cidades");
  }
};


export const createCidade = async (
  nome: string,
  populacao: number,
  latitude: number,
  longitude: number,
  paisId: number
) => {
  const pais = await prisma.pais.findUnique({ where: { id: paisId } });
  if (!pais) throw new Error("PAIS_NOT_FOUND");

  return await prisma.cidade.create({
    data: {
      nome,
      populacao,
      latitude,
      longitude,
      paisId,
    },
    include: { pais: true },
  });
};

export const getCidadeById = async (id: number) => {
  try {
    const cidade = await prisma.cidade.findUnique({
      where: {
        id: id,
      },
      include: {
        pais: { include: { continente: true } },
      },
    });
    return cidade;
  } catch (error) {
    throw new Error("Erro ao buscar a cidade");
  }
};

export const updateCidade = async (
  id: number,
  data: {
    nome?: string;
    populacao?: number;
    latitude?: number;
    longitude?: number;
    paisId?: number;
  }
) => {
  if (data.paisId) {
    const pais = await prisma.pais.findUnique({ where: { id: data.paisId } });
    if (!pais) throw new Error("PAIS_NOT_FOUND");
  }

  return await prisma.cidade.update({
    where: { id },
    data,
    include: { pais: { include: { continente: true } } },
  });
};

export const deleteCidade = async (id: number) => {
  return await prisma.cidade.delete({ where: { id } });
};
