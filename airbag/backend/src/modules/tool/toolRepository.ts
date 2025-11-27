import { PrismaClient } from "@prisma/client";
import { master_tool } from "@prisma/client";

import { TypePayloadtool } from "./toolModel";

const prisma = new PrismaClient();

export const Keys = ["tool_id", "tool"];
export const toolRepository = {
  count: async (companyId: string, searchText?: string) => {
    return await prisma.master_tool.count({
      where: {
        company_id: companyId, // เพิ่มเงื่อนไข companyId
        ...(searchText
          ? {
              OR: [
                {
                  tool: {
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

  findAll: async (
    companyId: string,
    skip: number,
    take: number,
    searchText: string
  ) => {
    return await prisma.master_tool.findMany({
      where: searchText
        ? {
            OR: [
              {
                tool: {
                  contains: searchText,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}, // ถ้าไม่มี searchText ก็ไม่ต้องใช้เงื่อนไขพิเศษ
      skip,
      take,
      orderBy: { created_at: "asc" },
    });
  },

  findAllNoPagination: async (company_id: string) => {
    return await prisma.master_tool.findMany({
      where: { company_id: company_id},
      orderBy: { created_at: "asc" },
    });
  },
  select: async  (companyId: string , searchText : string) => {
      const data = await prisma.master_tool.findMany({
        where: {
          company_id: companyId,
          ...(searchText && {
  
                tool: {
                  contains: searchText,
                  mode: 'insensitive'
                
              },
          }),
        },
        skip : 0,
        take : 50,
        select: {
          tool_id : true,
          tool: true
        },
        orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
      });
      return data;
    },

  findByName: async (companyId: string, tool: string) => {
    return prisma.master_tool.findFirst({
      where: { company_id: companyId, tool: tool },
    });
  },

  findById: async (companyId: string, tool_id: string) => {
    return prisma.master_tool.findFirst({
      where: {
        company_id: companyId,
        tool_id: tool_id,
      },
      select: Keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}), // Use Keys array
    });
  },

  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadtool
  ) => {
    const tool = payload.tool.trim();
    const setPayload: any = {
      company_id: companyId,
      tool: tool,
      created_by: userId,
      updated_by: userId,
    };
    return await prisma.master_tool.create({
      data: setPayload,
    });
  },
  update: async (
    companyId: string,
    userId: string,
    tool_id: string,
    payload: TypePayloadtool
  ) => {
    const tool = payload.tool.trim();
    if (!companyId || !tool_id)
      throw new Error("Company ID and Tool ID are required");
    const setPayload: Partial<master_tool> = {
      tool: tool,
      updated_by: userId,
    };
    return await prisma.master_tool.update({
      where: { company_id: companyId, tool_id: tool_id }, // ตรวจสอบว่าเงื่อนไขถูกต้อง
      data: setPayload,
    });
  },

  delete: async (companyId: string, tool_id: string) => {
    const trimId = tool_id.trim();
    return await prisma.master_tool.deleteMany({
      where: { company_id: companyId, tool_id: trimId }, // แก้ไขจาก conpany_id เป็น company_id
    });
  },

  search: async (query: string) => {
    return prisma.master_tool.findMany({
      where: {
        tool: {
          contains: query, // ใช้ contains สำหรับค้นหาแบบ substring
          mode: "insensitive", // ค้นหาไม่สนใจตัวพิมพ์เล็กใหญ่
        },
      },
      select: {
        tool_id: true,
        tool: true,
      },
      orderBy: { created_at: "asc" },
    });
  },
};
