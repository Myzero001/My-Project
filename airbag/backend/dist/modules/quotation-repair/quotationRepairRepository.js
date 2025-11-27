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
exports.quotationRepairRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.quotationRepairRepository = {
    findAll: (skip, take) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_repair.findMany({
            include: {
                master_quotation: true,
                master_repair: true,
            },
            skip, // จำนวนข้อมูลที่ต้องข้าม
            take, // จำนวนข้อมูลที่ต้องดึง
            orderBy: { created_at: "desc" }, // เรียงตามวันที่สร้างล่าสุด
        });
    }),
    findAllNoPagination: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_repair.findMany({
            orderBy: { created_at: "asc" },
        });
    }),
    // นับจำนวนข้อมูลทั้งหมด
    count: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_repair.count({});
    }),
    findByDate: (date) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_repair.findMany({
            where: {
                created_at: {
                    equals: date,
                },
            },
        });
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_repair.findUnique({
            where: { id },
        });
    }),
    findByQuotationId: (quotationId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_repair.findMany({
            where: { quotation_id: quotationId },
            include: {
                master_repair: true,
            }
        });
    }),
    // สร้างข้อมูลใหม่
    create: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_repair.create({
            data: {
                quotation_id: payload.quotation_id,
                master_repair_id: payload.master_repair_id,
                price: payload.price,
            },
        });
    }),
    // อัปเดตข้อมูล
    update: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_repair.update({
            where: { id },
            data: {
                quotation_id: payload.quotation_id,
                master_repair_id: payload.master_repair_id,
                price: payload.price,
            },
        });
    }),
    // ลบข้อมูล
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_repair.delete({
            where: { id },
        });
    }),
};
