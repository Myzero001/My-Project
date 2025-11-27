// ms_positionRepository.ts
import { master_position } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TypePayloadMasterPosition } from "@modules/ms_position/ms_positionModel";

const Positionkeys = ["position_id", "position_name", "created_at", "updated_at"];
const prisma = new PrismaClient();


export const ms_positionRepository = {
    findAll: async (companyId: string, skip: number, take: number, searchText: string) => {
        return await prisma.master_position.findMany({
            where: {
                company_id: companyId,
                ...(searchText && {
                    position_name: {
                        contains: searchText,
                        mode: "insensitive",
                    },
                })
            },
            skip,
            take,
            orderBy: { created_at: "asc" },
            select: {
                position_id: true,
                position_name: true
            }
        });
    },
    count: async (companyId: string, searchText: string) => {
        return await prisma.master_position.count({
            where: {
                company_id: companyId,
                ...(searchText && {
                    position_name: {
                        contains: searchText,
                        mode: "insensitive",
                    },
                })
            },
            
        });
    },
    findByName: async (companyId: string, position_name: string) => {
        return await prisma.master_position.findFirst({
            where: {
                company_id: companyId,
                position_name: position_name
            },
            select: Positionkeys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        }) as Promise<master_position | null>;
    },
    create: async (
        companyId: string,
        userId: string,
        payload: TypePayloadMasterPosition
    ) => {
        const position_name = payload.position_name.trim();
        const setPayload = {
            company_id: companyId,
            created_by: userId,
            updated_by: userId,
            position_name,
            created_at: new Date(),
        };

        return await prisma.master_position.create({
            data: setPayload,
            select: {
                position_id: true,
                position_name: true,
            },
        });
    },


    findByIdAsync: async <Key extends keyof master_position>(
        companyId: string,
        position_id: string,
    ) => {
        return prisma.master_position.findFirst({
            where: {
                company_id: companyId,
                position_id: position_id
            },
            select: {
                position_id: true,
                position_name: true
            }
        }) as Promise<Pick<master_position, Key> | null>;
    },

    update: async (
        companyId: string,
        userId: string,
        position_id: string,
        payload: TypePayloadMasterPosition
    ) => {
        const setPayload = {
            position_name: payload.position_name.trim(),
            updated_by: userId,
        };
        return await prisma.master_position.update({
            where: {
                company_id: companyId,
                position_id
            },
            data: setPayload,
            select: {
                position_id: true,
                position_name: true,
            },
        });
    },

    delete: async (companyId: string, position_id: string) => {
        return await prisma.master_position.delete({
            where: {
                company_id: companyId,
                position_id
            },
        });
    },

    select: async  (companyId: string , searchText : string) => {
        const data = await prisma.master_position.findMany({
          where: {
            company_id: companyId,
            ...(searchText && {
                  position_name: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            }),
          },
          skip : 0,
          take : 50,
          select: {
            position_id : true,
            position_name: true
          },
          orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
        return data;
    },
};

