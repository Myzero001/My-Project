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
exports.toolRepository = exports.Keys = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.Keys = ["tool_id", "tool"];
exports.toolRepository = {
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_tool.count({
            where: Object.assign({ company_id: companyId }, (searchText
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
                : {})),
        });
    }),
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_tool.findMany({
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
    }),
    findAllNoPagination: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_tool.findMany({
            where: { company_id: company_id },
            orderBy: { created_at: "asc" },
        });
    }),
    select: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield prisma.master_tool.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                tool: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            })),
            skip: 0,
            take: 50,
            select: {
                tool_id: true,
                tool: true
            },
            orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
        return data;
    }),
    findByName: (companyId, tool) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.master_tool.findFirst({
            where: { company_id: companyId, tool: tool },
        });
    }),
    findById: (companyId, tool_id) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.master_tool.findFirst({
            where: {
                company_id: companyId,
                tool_id: tool_id,
            },
            select: exports.Keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}), // Use Keys array
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const tool = payload.tool.trim();
        const setPayload = {
            company_id: companyId,
            tool: tool,
            created_by: userId,
            updated_by: userId,
        };
        return yield prisma.master_tool.create({
            data: setPayload,
        });
    }),
    update: (companyId, userId, tool_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const tool = payload.tool.trim();
        if (!companyId || !tool_id)
            throw new Error("Company ID and Tool ID are required");
        const setPayload = {
            tool: tool,
            updated_by: userId,
        };
        return yield prisma.master_tool.update({
            where: { company_id: companyId, tool_id: tool_id }, // ตรวจสอบว่าเงื่อนไขถูกต้อง
            data: setPayload,
        });
    }),
    delete: (companyId, tool_id) => __awaiter(void 0, void 0, void 0, function* () {
        const trimId = tool_id.trim();
        return yield prisma.master_tool.deleteMany({
            where: { company_id: companyId, tool_id: trimId }, // แก้ไขจาก conpany_id เป็น company_id
        });
    }),
    search: (query) => __awaiter(void 0, void 0, void 0, function* () {
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
    }),
};
