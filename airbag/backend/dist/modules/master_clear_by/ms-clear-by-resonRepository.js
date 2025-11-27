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
exports.clearByRepository = void 0;
const client_1 = require("@prisma/client");
const keys = ["clear_by_id", "clear_by_name", "created_at", "updated_at"];
const prisma = new client_1.PrismaClient();
exports.clearByRepository = {
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_clear_by.findMany({
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
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_clear_by.count({
            where: Object.assign({ company_id: companyId }, (searchText
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
                : {})),
        });
    }),
    findAllNoPagination: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_clear_by.findMany({
            orderBy: { created_at: "asc" },
        });
    }),
    select: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield prisma.master_color.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                color_name: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            })),
            skip: 0,
            take: 50,
            select: {
                color_id: true,
                color_name: true
            },
            orderBy: { created_at: "asc" },
        });
        return data;
    }),
    findByName: (companyId_1, clear_by_name_1, ...args_1) => __awaiter(void 0, [companyId_1, clear_by_name_1, ...args_1], void 0, function* (companyId, clear_by_name, selectedKeys = keys) {
        return prisma.master_clear_by.findFirst({
            where: { company_id: companyId, clear_by_name: clear_by_name },
            select: selectedKeys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const clear_by_name = payload.clear_by_name.trim();
        const setPayload = {
            company_id: companyId,
            clear_by_name,
            created_by: userId,
            updated_by: userId,
        };
        return yield prisma.master_clear_by.create({
            data: setPayload,
        });
    }),
    findByIdAsync: (companyId, clear_by_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_clear_by.findFirst({
            where: { company_id: companyId, clear_by_id },
            select: {
                clear_by_id: true,
                clear_by_name: true,
            },
        });
    }),
    update: (companyId, userId, clear_by_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const setPayload = {
            clear_by_name: payload.clear_by_name.trim(),
            updated_by: userId,
        };
        return yield prisma.master_clear_by.update({
            where: { company_id: companyId, clear_by_id },
            data: setPayload,
        });
    }),
    delete: (companyId, clear_by_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_clear_by.deleteMany({
            where: { company_id: companyId, clear_by_id },
        });
    }),
    findById: (companyId, clear_by_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_clear_by.findFirst({
            where: {
                company_id: companyId,
                clear_by_id: clear_by_id,
            },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    findMinimal: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_clear_by.findMany({
            where: { company_id: companyId },
            select: {
                clear_by_id: true,
                clear_by_name: true,
            },
        });
    }),
};
