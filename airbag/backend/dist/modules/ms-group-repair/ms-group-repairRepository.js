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
exports.groupRepairRepository = void 0;
const client_1 = require("@prisma/client");
const keys = ["master_group_repair_id", "group_repair_name", "created_at", "updated_at"];
const prisma = new client_1.PrismaClient();
exports.groupRepairRepository = {
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_group_repair.findMany({
            where: Object.assign({ company_id: companyId }, (searchText
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
                : {})),
            skip,
            take,
            orderBy: { created_at: "asc" },
            select: {
                master_group_repair_id: true,
                company_id: true,
                group_repair_name: true,
            },
        });
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_group_repair.count({
            where: Object.assign({ company_id: companyId }, (searchText
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
                : {})),
        });
    }),
    findByName: (companyId_1, group_repair_name_1, ...args_1) => __awaiter(void 0, [companyId_1, group_repair_name_1, ...args_1], void 0, function* (companyId, group_repair_name, selectedKeys = keys) {
        return prisma.master_group_repair.findFirst({
            where: { company_id: companyId, group_repair_name },
            select: selectedKeys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const group_repair_name = payload.group_repair_name.trim();
        const setPayload = {
            company_id: companyId,
            group_repair_name,
            created_by: userId,
            updated_by: userId,
        };
        return yield prisma.master_group_repair.create({
            data: setPayload,
        });
    }),
    findByIdAsync: (companyId_1, master_group_repair_id_1, ...args_1) => __awaiter(void 0, [companyId_1, master_group_repair_id_1, ...args_1], void 0, function* (companyId, master_group_repair_id, selectedKeys = keys) {
        return yield prisma.master_group_repair.findFirst({
            where: { company_id: companyId, master_group_repair_id },
            select: selectedKeys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    update: (companyId, userId, master_group_repair_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const setPayload = {
            group_repair_name: payload.group_repair_name.trim(),
            updated_by: userId,
        };
        return yield prisma.master_group_repair.update({
            where: { company_id: companyId, master_group_repair_id },
            data: setPayload,
        });
    }),
    delete: (companyId, master_group_repair_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_group_repair.deleteMany({
            where: { company_id: companyId, master_group_repair_id },
        });
    }),
    findById: (companyId, master_group_repair_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_group_repair.findFirst({
            where: {
                company_id: companyId,
                master_group_repair_id: master_group_repair_id,
            },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    findMinimal: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_group_repair.findMany({
            where: { company_id: companyId },
            select: {
                master_group_repair_id: true,
                group_repair_name: true,
            },
        });
    }),
    checkGroupRepairHaveRepair: (companyId, master_group_repair_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_repair.findFirst({
            where: {
                company_id: companyId,
                master_group_repair_id: master_group_repair_id,
            }
        });
    }),
};
