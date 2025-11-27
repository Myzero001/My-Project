import { master_brand } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TypePayloadMasterBrand } from "./ms-brandModel";

const keys = ["master_brand_id", "brand_name", "created_at", "updated_at"];
const prisma = new PrismaClient();

export const brandRepository = {
  findAll: async (
    companyId: string,
    skip: number,
    take: number,
    searchText?: string
  ) => {
    return await prisma.master_brand.findMany({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
            OR: [
              {
                brand_name: {
                  contains: searchText,
                  mode: "insensitive", // ค้นหาแบบ case-insensitive
                },
              },
            ],
          }
          : {}),
      },
      skip,
      take,
      orderBy: { created_at: "asc" },
      select: {
        master_brand_id: true,
        company_id: true,
        brand_name: true,
      },
    });
  },
  count: async (companyId: string, searchText?: string) => {
    return await prisma.master_brand.count({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
            OR: [
              {
                brand_name: {
                  contains: searchText,
                  mode: "insensitive",
                },
              },
            ],
          }
          : {}),
      },
    });
  },

  findByName: async <Key extends keyof master_brand>(
    companyId: string,
    brand_name: string,
    selectedKeys = keys as Key[]
  ) => {
    return prisma.master_brand.findFirst({
      where: { company_id: companyId, brand_name },
      select: selectedKeys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<master_brand, Key> | null>;
  },

  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadMasterBrand
  ) => {
    const brand_name = payload.brand_name.trim();
    const setPayload = {
      company_id: companyId,
      brand_name,
      created_by: userId,
      updated_by: userId,
    };
    return await prisma.master_brand.create({
      data: setPayload,
      select: {
        brand_name: true,
      },
    });
  },

  findAllNoPagination: async (companyId: string) => {
    return await prisma.master_brand.findMany({
      where: { company_id: companyId },
      orderBy: { created_at: "asc" },
    });
  },
  select: async  (companyId: string , searchText : string) => {
    const data = await prisma.master_brand.findMany({
      where: {
        company_id: companyId,
        ...(searchText && {
              brand_name: {
                contains: searchText,
                mode: 'insensitive'
            },
        }),
      },
      skip : 0,
      take : 50,
      select: {
        master_brand_id : true,
        brand_name: true
      },
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
    return data;
  },


  findByIdAsync: async <Key extends keyof master_brand>(
    companyId: string,
    master_brand_id: string,
    selectedKeys = keys as Key[]
  ) => {
    return (await prisma.master_brand.findFirst({
      where: { company_id: companyId, master_brand_id },
      select: selectedKeys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    })) as Promise<Pick<master_brand, Key> | null>;
  },

  update: async (
    companyId: string,
    userId: string,
    master_brand_id: string,
    payload: TypePayloadMasterBrand
  ) => {
    const setPayload = {
      brand_name: payload.brand_name.trim(),
      updated_by: userId,
    };
    return await prisma.master_brand.update({
      where: { master_brand_id },
      data: setPayload,
      select: {
        brand_name: true,
      },
    });
  },

  delete: async (companyId: string, master_brand_id: string) => {
    return await prisma.master_brand.deleteMany({
      where: { company_id: companyId, master_brand_id },
    });
  },

  findMinimal: async (companyId: string) => {
    return await prisma.master_brand.findMany({
      where: { company_id: companyId },
      select: {
        master_brand_id: true,
        brand_name: true,
      },
    });
  },
  checkBarndModelInBrand: async (companyId: string, master_brand_id: string) => {
    return await prisma.master_brandmodel.findFirst({
      where: {
        company_id: companyId,
        master_brand_id: master_brand_id
      },
    });
  },
};
