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
exports.brandRepository = void 0;
const client_1 = require("@prisma/client");
const keys = ["master_brand_id", "brand_name", "created_at", "updated_at"];
const prisma = new client_1.PrismaClient();
exports.brandRepository = {
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_brand.findMany({
            where: Object.assign({ company_id: companyId }, (searchText
                ? {
                    OR: [
                        {
                            brand_name: {
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
                master_brand_id: true,
                company_id: true,
                brand_name: true,
            },
        });
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_brand.count({
            where: Object.assign({ company_id: companyId }, (searchText
                ? {
                    OR: [
                        {
                            brand_name: {
                                contains: searchText,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {})),
        });
    }),
    findByName: (companyId_1, brand_name_1, ...args_1) => __awaiter(void 0, [companyId_1, brand_name_1, ...args_1], void 0, function* (companyId, brand_name, selectedKeys = keys) {
        return prisma.master_brand.findFirst({
            where: { company_id: companyId, brand_name },
            select: selectedKeys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const brand_name = payload.brand_name.trim();
        const setPayload = {
            company_id: companyId,
            brand_name,
            created_by: userId,
            updated_by: userId,
        };
        return yield prisma.master_brand.create({
            data: setPayload,
            select: {
                brand_name: true,
            },
        });
    }),
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_brand.findMany({
            where: { company_id: companyId },
            orderBy: { created_at: "asc" },
        });
    }),
    select: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield prisma.master_brand.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                brand_name: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            })),
            skip: 0,
            take: 50,
            select: {
                master_brand_id: true,
                brand_name: true
            },
            orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
        return data;
    }),
    findByIdAsync: (companyId_1, master_brand_id_1, ...args_1) => __awaiter(void 0, [companyId_1, master_brand_id_1, ...args_1], void 0, function* (companyId, master_brand_id, selectedKeys = keys) {
        return (yield prisma.master_brand.findFirst({
            where: { company_id: companyId, master_brand_id },
            select: selectedKeys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        }));
    }),
    update: (companyId, userId, master_brand_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const setPayload = {
            brand_name: payload.brand_name.trim(),
            updated_by: userId,
        };
        return yield prisma.master_brand.update({
            where: { master_brand_id },
            data: setPayload,
            select: {
                brand_name: true,
            },
        });
    }),
    delete: (companyId, master_brand_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_brand.deleteMany({
            where: { company_id: companyId, master_brand_id },
        });
    }),
    findMinimal: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_brand.findMany({
            where: { company_id: companyId },
            select: {
                master_brand_id: true,
                brand_name: true,
            },
        });
    }),
    checkBarndModelInBrand: (companyId, master_brand_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_brandmodel.findFirst({
            where: {
                company_id: companyId,
                master_brand_id: master_brand_id
            },
        });
    }),
};
