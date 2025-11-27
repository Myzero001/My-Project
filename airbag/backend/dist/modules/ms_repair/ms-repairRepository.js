"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repairRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.repairRepository = {
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_repair.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
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
            })),
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
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_repair.count({
            where: Object.assign({ company_id: companyId }, (searchText && {
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
            })),
        });
    }),
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_repair.findMany({
            where: {
                company_id: companyId,
            },
            select: {
                master_repair_id: true,
                company_id: true,
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
    }),
    findByName: (companyId_1, payload_1, ...args_1) => __awaiter(void 0, [companyId_1, payload_1, ...args_1], void 0, function* (companyId, payload, keys = ["master_repair_id", "master_repair_name", "master_group_repair_id", "created_at", "updated_at"]) {
        return prisma.master_repair.findFirst({
            where: {
                company_id: companyId,
                master_repair_name: payload.master_repair_name.trim(),
                master_group_repair_id: payload.master_group_repair_id.trim(),
            },
            select: keys.reduce((obj, key) => (Object.assign(Object.assign({}, obj), { [key]: true })), {}),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const master_repair_name = payload.master_repair_name.trim();
        const setPayload = {
            company_id: companyId,
            created_by: userId,
            updated_by: userId,
            master_repair_name,
            master_group_repair_id: payload.master_group_repair_id,
            created_at: new Date(),
        };
        return yield prisma.master_repair.create({
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
    }),
    findByIdAsync: (companyId, master_repair_id) => __awaiter(void 0, void 0, void 0, function* () {
        const master_repair = yield prisma.master_repair.findUnique({
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
        });
        if (!master_repair) {
            return null;
        }
        return master_repair;
    }),
    update: (companyId, userId, master_repair_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const master_repair_name = payload.master_repair_name.trim();
        return yield prisma.master_repair.update({
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
    }),
    delete: (companyId, master_repair_id) => __awaiter(void 0, void 0, void 0, function* () {
        const trim_master_repair_id = master_repair_id.trim();
        return yield prisma.master_repair.delete({
            where: {
                master_repair_id: trim_master_repair_id,
                company_id: companyId
            },
        });
    }),
    findRepairNames: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_repair.findMany({
            where: { company_id: companyId },
            select: {
                master_repair_id: true,
                master_repair_name: true,
            },
            orderBy: { created_at: "asc" },
        });
    }),
    checkRepairinQuotation: (companyId, master_repair_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_repair.findFirst({
            where: {
                // company_id: companyId,
                master_repair_id: master_repair_id,
            },
        });
    }),
};
