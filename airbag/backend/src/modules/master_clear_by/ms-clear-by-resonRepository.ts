import { master_clear_by } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TypePayloadMasterClearBy } from "@modules/master_clear_by/ms-clear-by-reasonModel";

const keys = ["clear_by_id", "clear_by_name", "created_at", "updated_at"];
const prisma = new PrismaClient();

export const clearByRepository = {
  findAll: async (
    companyId: string,
    skip: number,
    take: number,
    searchText: string
  ) => {
    return await prisma.master_clear_by.findMany({
      where: searchText
        ? {
            OR: [
              {
                clear_by_name: {
                  contains: searchText,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {},
      skip,
      take,
      orderBy: { created_at: "asc" },
      //select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
  },
  count: async (companyId: string, searchText?: string) => {
    return await prisma.master_clear_by.count({
      where: {
        company_id: companyId, // เพิ่มเงื่อนไข companyId
        ...(searchText
          ? {
              OR: [
                {
                  clear_by_name: {
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

  findAllNoPagination: async () => {
    return await prisma.master_clear_by.findMany({
      orderBy: { created_at: "asc" },
    });
  },
  select: async  (companyId: string , searchText : string) => {
    const data = await prisma.master_color.findMany({
      where: {
        company_id: companyId,
        ...(searchText && {

              color_name: {
                contains: searchText,
                mode: 'insensitive'
              
            },
        }),
      },
      skip : 0,
      take : 50,
      select: {
        color_id : true,
        color_name: true
      },
      orderBy: { created_at: "asc" }, 
    });
    

    return data;
  },

  findByName: async <Key extends keyof master_clear_by>(
    companyId: string,
    clear_by_name: string,
    selectedKeys = keys as Key[]
  ) => {
    return prisma.master_clear_by.findFirst({
      where: { company_id: companyId, clear_by_name: clear_by_name },
      select: selectedKeys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<master_clear_by, Key> | null>;
  },
  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadMasterClearBy
  ) => {
    const clear_by_name = payload.clear_by_name.trim();
    const setPayload = {
      company_id: companyId,
      clear_by_name,
      created_by: userId,
      updated_by: userId,
    };
    return await prisma.master_clear_by.create({
      data: setPayload,
    });
  },
  findByIdAsync: async (companyId: string, clear_by_id: string) => {
    return await prisma.master_clear_by.findFirst({
      where: { company_id: companyId, clear_by_id },
      select: {
        clear_by_id: true,
        clear_by_name: true,
      },
    });
  },
  update: async (
    companyId: string,
    userId: string,
    clear_by_id: string,
    payload: TypePayloadMasterClearBy
  ) => {
    const setPayload = {
      clear_by_name: payload.clear_by_name.trim(),
      updated_by: userId,
    };
    return await prisma.master_clear_by.update({
      where: { company_id: companyId, clear_by_id },
      data: setPayload,
    });
  },
  delete: async (companyId: string, clear_by_id: string) => {
    return await prisma.master_clear_by.deleteMany({
      where: { company_id: companyId, clear_by_id },
    });
  },
  findById: async (companyId: string, clear_by_id: string) => {
    return await prisma.master_clear_by.findFirst({
      where: {
        company_id: companyId,
        clear_by_id: clear_by_id,
      },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
  },
  findMinimal: async (companyId: string) => {
    return await prisma.master_clear_by.findMany({
      where: { company_id: companyId },
      select: {
        clear_by_id: true,
        clear_by_name: true,
      },
    });
  },
};
