// backend/src/modules/ms_repair/ms-repairRepository.ts
import { master_repair } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TypePayloadMasterRepair } from "@modules/ms_repair/ms-repairModel";
import { keys } from "object-hash";
import { date } from "zod";

const prisma = new PrismaClient();

export const repairRepository = {

    findAll: async (companyId: string, skip: number, take: number, searchText: string) => {
        return await prisma.master_repair.findMany({
            where: {
                company_id: companyId,
                ...(searchText && {
                    OR: [
                        {
                            master_repair_name: {
                                contains: searchText,
                                mode: "insensitive",
                            }
                        },
                        {
                            master_group_repair: {
                                group_repair_name: {
                                    contains: searchText,
                                    mode: "insensitive",
                                }
                            }
                        }
                    ]
                }
                )
            },
            skip,
            take,
            select: {
                master_repair_id: true,
                master_repair_name: true,
                master_group_repair: {
                    select: {
                        master_group_repair_id: true,
                        group_repair_name: true,
                    },
                },
            },
            orderBy: { created_at: "asc" },
        });
    },

    count: async (companyId: string, searchText?: string) => {
        return await prisma.master_repair.count({
            where: {
                company_id: companyId,
                ...(searchText && {
                    OR: [
                        {
                            master_repair_name: {
                                contains: searchText,
                                mode: "insensitive",
                            }
                        },
                        {
                            master_group_repair: {
                                group_repair_name: {
                                    contains: searchText,
                                    mode: "insensitive",
                                }
                            }
                        }
                    ]
                })
            },
        });
    },

    findAllNoPagination: async (companyId: string) => {
        return await prisma.master_repair.findMany({
            where: {
                company_id: companyId,
            },
            select: {
                master_repair_id: true,
                company_id:true,
                master_repair_name: true,
                master_group_repair: {
                    select: {
                        master_group_repair_id: true,
                        group_repair_name: true,
                    },
                },
            },
            orderBy: { created_at: "asc" },
        });
    },

    findByName: async <Key extends keyof master_repair>(
        companyId: string,
        payload: TypePayloadMasterRepair,
        keys: Key[] = ["master_repair_id", "master_repair_name", "master_group_repair_id", "created_at", "updated_at"] as Key[]
    ) => {
        return prisma.master_repair.findFirst({
            where: {
                company_id: companyId,
                master_repair_name: payload.master_repair_name.trim(),
                master_group_repair_id: payload.master_group_repair_id.trim(),
            },
            select: keys.reduce((obj, key) => ({ ...obj, [key]: true }), {}),
        }) as Promise<Pick<master_repair, Key> | null>;
    },


    create: async (
        companyId: string,
        userId: string,
        payload: TypePayloadMasterRepair
    ) => {
        const master_repair_name = payload.master_repair_name.trim();
        const setPayload = {
            company_id: companyId,
            created_by: userId,
            updated_by: userId,
            master_repair_name,
            master_group_repair_id: payload.master_group_repair_id,
            created_at: new Date(),
        }
        return await prisma.master_repair.create({
            data: setPayload,
            select: {
                master_repair_id: true,
                master_repair_name: true,
                master_group_repair: {
                    select: {
                        master_group_repair_id: true,
                        group_repair_name: true,
                    }
                }
            }
        });
    },
    findByIdAsync: async (companyId: string, master_repair_id: string) => {
        const master_repair = await prisma.master_repair.findUnique({
            where: {
                master_repair_id,
                company_id: companyId
            }, select: {
                company_id: true,
                master_repair_id: true,
                master_repair_name: true,
                master_group_repair_id: true,
                created_by: true,
                created_at: true,
                updated_by: true,
                updated_at: true

            }
        })

        if (!master_repair) {
            return null;
        }
        return master_repair

    },

    update: async (
        companyId: string,
        userId: string,
        master_repair_id: string,
        payload: TypePayloadMasterRepair
    ) => {
        const master_repair_name = payload.master_repair_name.trim();
        return await prisma.master_repair.update({
            where: {
                master_repair_id,
                company_id: companyId
            },
            data: {
                master_repair_name,
                master_group_repair_id: payload.master_group_repair_id,
                updated_by: userId
            },
            select: {
                master_repair_id: true,
                master_repair_name: true,
                master_group_repair: {
                    select: {
                        master_group_repair_id: true,
                        group_repair_name: true,
                    }
                }
            }
        });
    },


    delete: async (companyId: string, master_repair_id: string) => {
        const trim_master_repair_id = master_repair_id.trim();
        return await prisma.master_repair.delete({
            where: {
                master_repair_id: trim_master_repair_id,
                company_id: companyId
            },
        });
    },

    findRepairNames: async (companyId: string) => {
        return await prisma.master_repair.findMany({
            where: { company_id: companyId },
            select: {
                master_repair_id: true,
                master_repair_name: true,
            },
            orderBy: { created_at: "asc" },
        });
    },

    checkRepairinQuotation: async (companyId: string, master_repair_id: string) => {
        return await prisma.quotation_repair.findFirst({
            where: {
                // company_id: companyId,
                master_repair_id: master_repair_id,
            },
        });

    },
};
