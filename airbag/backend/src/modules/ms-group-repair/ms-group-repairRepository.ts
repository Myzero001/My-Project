import { master_group_repair } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TypePayloadMasterGroupRepair } from "./ms-group-repairModel";

const keys = ["master_group_repair_id", "group_repair_name", "created_at", "updated_at"];
const prisma = new PrismaClient();

export const groupRepairRepository = {
    findAll: async (companyId: string, skip: number, take: number, searchText?: string) => {
        return await prisma.master_group_repair.findMany({
            where: {
                company_id: companyId,
                ...(searchText
                    ? {
                        OR: [
                            {
                                group_repair_name: {
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
                master_group_repair_id: true,
                company_id: true,
                group_repair_name: true,
            },
        });
    },

    count: async (companyId: string, searchText?: string) => {
        return await prisma.master_group_repair.count({
            where: {
                company_id: companyId,
                ...(searchText
                    ? {
                        OR: [
                            {
                                group_repair_name: {
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

    findByName: async <Key extends keyof master_group_repair>(
        companyId: string,
        group_repair_name: string,
        selectedKeys = keys as Key[]
    ) => {
        return prisma.master_group_repair.findFirst({
            where: { company_id: companyId, group_repair_name },
            select: selectedKeys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        }) as Promise<Pick<master_group_repair, Key> | null>;
    },

    create: async (companyId: string, userId: string, payload: TypePayloadMasterGroupRepair) => {
        const group_repair_name = payload.group_repair_name.trim();
        const setPayload = {
            company_id: companyId,
            group_repair_name,
            created_by: userId,
            updated_by: userId,
        };
        return await prisma.master_group_repair.create({
            data: setPayload,
        });
    },

    findByIdAsync: async <Key extends keyof master_group_repair>(
        companyId: string,
        master_group_repair_id: string,
        selectedKeys = keys as Key[]
    ) => {
        return await prisma.master_group_repair.findFirst({
            where: { company_id: companyId, master_group_repair_id },
            select: selectedKeys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        }) as Promise<Pick<master_group_repair, Key> | null>;
    },

    update: async (
        companyId: string,
        userId: string,
        master_group_repair_id: string,
        payload: TypePayloadMasterGroupRepair
    ) => {
        const setPayload = {
            group_repair_name: payload.group_repair_name.trim(),
            updated_by: userId,
        };
        return await prisma.master_group_repair.update({
            where: { company_id: companyId, master_group_repair_id },
            data: setPayload,
        });
    },

    delete: async (companyId: string, master_group_repair_id: string) => {
        return await prisma.master_group_repair.deleteMany({
            where: { company_id: companyId, master_group_repair_id },
        });
    },
    findById: async (companyId: string, master_group_repair_id: string) => {
        return await prisma.master_group_repair.findFirst({
            where: {
                company_id: companyId,
                master_group_repair_id: master_group_repair_id,
            },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        });
    },
    findMinimal: async (companyId: string) => {
        return await prisma.master_group_repair.findMany({
            where: { company_id: companyId },
            select: {
                master_group_repair_id: true,
                group_repair_name: true,
            },
        });
    },

    checkGroupRepairHaveRepair: async (companyId: string, master_group_repair_id: string) => {
        return await prisma.master_repair.findFirst({
            where: {
                company_id: companyId,
                master_group_repair_id: master_group_repair_id,
            }
        });
    },

};