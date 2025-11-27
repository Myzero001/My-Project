import { master_color } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TypePayloadColor } from "./colorModel";

export const keys = ["color_name", "created_at", "updated_at"];

const prisma = new PrismaClient();

export const colorRepository = {
  count: async (companyId: string, searchText?: string) => {
    return await prisma.master_color.count({
      where: {
        company_id: companyId, // เพิ่มเงื่อนไข companyId
        ...(searchText
          ? {
              OR: [
                {
                  color_name: {
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
  findAll: async (companyId: string, skip: number, take: number, searchText: string) => {
          return await prisma.master_color.findMany({
            where: searchText
            ? {
                OR: [{
                          color_name: {
                              contains: searchText,
                              mode: 'insensitive'
                          }
                      }]
                  }
                  : {},  // ถ้าไม่มี searchText ก็ไม่ต้องใช้เงื่อนไขพิเศษ
              skip,
              take,
              orderBy: { created_at: 'asc' }
          });
      },


  findAllNoPagination: async (companyId: string) => {
    return await prisma.master_color.findMany({
      where: { company_id: companyId },
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
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
    return data;
  },

  findByName: async (companyId: string, color_name: string) => {
    if (!companyId) {
      throw new Error("Company ID is required");
    }

    return prisma.master_color.findFirst({
      where: { company_id: companyId, color_name: color_name }, // ใช้ company_id และ color_name
    });
  },
  findById: async (companyId: string, color_id: string) => {
    return prisma.master_color.findFirst({
      where: { company_id: companyId, color_id: color_id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
  },

  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadColor
  ) => {
    const color_name = payload.color_name.trim();

    const setPayload: any = {
      company_id: companyId,
      color_name: color_name,
      created_by: userId,
      updated_by: userId,
    };

    return await prisma.master_color.create({
      data: setPayload,
    });
  },

  update: async (
    companyId: string,
    userId: string,
    color_id: string,
    payload: TypePayloadColor
  ) => {
    const color_name = payload.color_name.trim();
    if (!companyId || !color_id)
      throw new Error("Company ID and Color ID are required");
    const setPayload: Partial<master_color> = {
      color_name: color_name,
      updated_by: userId,
    };
    return await prisma.master_color.update({
      where: { company_id: companyId, color_id: color_id }, // ตรวจสอบว่าเงื่อนไขถูกต้อง
      data: setPayload,
    });
  },

  delete: async (companyId: string, color_id: string) => {
    if (!color_id) {
      throw new Error("company_id and color_id are required");
    }

    // ตรวจสอบสีที่ต้องการลบ
    const colorToDelete = await prisma.master_color.findFirst({
      where: { company_id: companyId, color_id: color_id },
    });
    if (!colorToDelete) {
      throw new Error("Color not found");
    }

    // ดำเนินการลบ
    return await prisma.master_color.delete({
      where: { color_id: color_id },
    });
  },

  search: async (query: string, companyId: string) => {
    return await prisma.master_color.findMany({
      where: {
        color_name: {
          contains: query,
          mode: "insensitive",
        },
        company_id: companyId
      },
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
  },
  checkColorinQuotation: async (companyId: string, color_id: string) => {
    return await prisma.master_quotation.findFirst({
      where: { company_id: companyId, car_color_id: color_id },
    });
  },
};
