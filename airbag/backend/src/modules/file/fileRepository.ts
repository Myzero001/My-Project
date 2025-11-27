import { PrismaClient } from "@prisma/client";
import { TypePayloadFile } from "./fileModel";

const prisma = new PrismaClient();

export const fileRepository = {
  // ดึงข้อมูลทั้งหมดพร้อม pagination
  findAll: async () => {
    return await prisma.file.findMany({
      orderBy: { created_at: "desc" }, // เรียงตามวันที่สร้างล่าสุด
    });
  },

  getFilesByUrl: async (file_url: string) => {
    return await prisma.file.findMany({
      where: {
        file_url,
      },
    });
  },

  // นับจำนวนข้อมูลทั้งหมด
  count: async () => {
    return await prisma.file.count();
  },
  create: async (payload: TypePayloadFile) => {
    return await prisma.file.create({
      data: {
        file_name: payload.file_name,
        file_type: payload.file_type,
        file_size: payload.file_size,
        file_url: payload.file_url,
      },
    });
  },

  // อัปเดตข้อมูล
  update: async (id: string, payload: Partial<TypePayloadFile>) => {
    return await prisma.file.update({
      where: { id },
      data: {
        file_name: payload.file_name,
        file_type: payload.file_type,
        file_size: payload.file_size,
        file_url: payload.file_url,
      },
    });
  },

  // ลบข้อมูล
  delete: async (file_url: string) => {
    return await prisma.file.delete({
      where: { file_url },
    });
  },
};
