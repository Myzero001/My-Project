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
exports.colorRepository = exports.keys = void 0;
const client_1 = require("@prisma/client");
exports.keys = ["color_name", "created_at", "updated_at"];
const prisma = new client_1.PrismaClient();
exports.colorRepository = {
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_color.count({
            where: Object.assign({ company_id: companyId }, (searchText
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
                : {})),
        });
    }),
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_color.findMany({
            where: searchText
                ? {
                    OR: [{
                            color_name: {
                                contains: searchText,
                                mode: 'insensitive'
                            }
                        }]
                }
                : {}, // ถ้าไม่มี searchText ก็ไม่ต้องใช้เงื่อนไขพิเศษ
            skip,
            take,
            orderBy: { created_at: 'asc' }
        });
    }),
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_color.findMany({
            where: { company_id: companyId },
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
            orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
        return data;
    }),
    findByName: (companyId, color_name) => __awaiter(void 0, void 0, void 0, function* () {
        if (!companyId) {
            throw new Error("Company ID is required");
        }
        return prisma.master_color.findFirst({
            where: { company_id: companyId, color_name: color_name }, // ใช้ company_id และ color_name
        });
    }),
    findById: (companyId, color_id) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.master_color.findFirst({
            where: { company_id: companyId, color_id: color_id },
            select: exports.keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const color_name = payload.color_name.trim();
        const setPayload = {
            company_id: companyId,
            color_name: color_name,
            created_by: userId,
            updated_by: userId,
        };
        return yield prisma.master_color.create({
            data: setPayload,
        });
    }),
    update: (companyId, userId, color_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const color_name = payload.color_name.trim();
        if (!companyId || !color_id)
            throw new Error("Company ID and Color ID are required");
        const setPayload = {
            color_name: color_name,
            updated_by: userId,
        };
        return yield prisma.master_color.update({
            where: { company_id: companyId, color_id: color_id }, // ตรวจสอบว่าเงื่อนไขถูกต้อง
            data: setPayload,
        });
    }),
    delete: (companyId, color_id) => __awaiter(void 0, void 0, void 0, function* () {
        if (!color_id) {
            throw new Error("company_id and color_id are required");
        }
        // ตรวจสอบสีที่ต้องการลบ
        const colorToDelete = yield prisma.master_color.findFirst({
            where: { company_id: companyId, color_id: color_id },
        });
        if (!colorToDelete) {
            throw new Error("Color not found");
        }
        // ดำเนินการลบ
        return yield prisma.master_color.delete({
            where: { color_id: color_id },
        });
    }),
    search: (query, companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_color.findMany({
            where: {
                color_name: {
                    contains: query,
                    mode: "insensitive",
                },
                company_id: companyId
            },
            orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
    }),
    checkColorinQuotation: (companyId, color_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_quotation.findFirst({
            where: { company_id: companyId, car_color_id: color_id },
        });
    }),
};
