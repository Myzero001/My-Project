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
exports.repairReceiptListRepairRepository = void 0;
const client_1 = require("@prisma/client");
const repairReceiptListRepairModel_1 = require("./repairReceiptListRepairModel");
const prisma = new client_1.PrismaClient();
exports.repairReceiptListRepairRepository = {
    findAll: (skip, take) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.findMany({
            include: {
                master_quotation: true,
                master_repair: true,
            },
            skip, // จำนวนข้อมูลที่ต้องข้าม
            take, // จำนวนข้อมูลที่ต้องดึง
            orderBy: { created_at: "desc" }, // เรียงตามวันที่สร้างล่าสุด
        });
    }),
    findAllNoPagination: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.findMany({
            where: { company_id: company_id },
            orderBy: { created_at: "asc" },
        });
    }),
    // นับจำนวนข้อมูลทั้งหมด
    count: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.count({});
    }),
    findByDate: (date) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.findMany({
            where: {
                created_at: {
                    equals: date,
                },
            },
        });
    }),
    findByDateStartEnd: (date) => __awaiter(void 0, void 0, void 0, function* () {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day
        return yield prisma.repair_receipt_list_repair.findMany({
            where: {
                created_at: {
                    gte: startOfDay, // Greater than or equal to start of the day
                    lte: endOfDay, // Less than or equal to end of the day
                },
            },
        });
    }),
    findByBarcode: (barcode) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.findFirst({
            where: { barcode: barcode },
        });
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.findUnique({
            where: { id },
        });
    }),
    findByRepairReceiptId: (repairReceiptId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.findMany({
            where: { master_repair_receipt_id: repairReceiptId, company_id: company_id },
            include: {
                master_repair: {
                    select: {
                        master_repair_id: true,
                        master_repair_name: true,
                    },
                },
            },
        });
    }),
    findByRepairReceiptIdActive: (repairReceiptId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.findMany({
            where: { master_repair_receipt_id: repairReceiptId, company_id: company_id, is_active: true },
            include: {
                master_repair: {
                    select: {
                        master_repair_id: true,
                        master_repair_name: true,
                    },
                },
            },
        });
    }),
    // สร้างข้อมูลใหม่
    create: (payload, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.create({
            data: {
                quotation_id: payload.quotation_id,
                master_repair_id: payload.master_repair_id,
                master_repair_receipt_id: payload.master_repair_receipt_id,
                price: payload.price,
                status: payload.status,
                company_id: company_id,
                barcode: payload.barcode,
            },
        });
    }),
    // อัปเดตข้อมูล
    update: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.update({
            where: { id },
            data: {
                quotation_id: payload.quotation_id,
                master_repair_id: payload.master_repair_id,
                price: payload.price,
            },
        });
    }),
    updateStatusIsActive: (id, payload, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.update({
            where: { id },
            data: {
                is_active: payload.is_active,
                company_id: company_id,
            },
        });
    }),
    // ลบข้อมูล
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.delete({
            where: { id },
        });
    }),
    // สถานะการติ้ก
    updateStatusCheckedBox: (id, statusDate, statusBy) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.update({
            where: { id },
            data: {
                status: repairReceiptListRepairModel_1.REPAIR_RECEIPT_LIST_REPAIR_STATUS.SUCCESS,
                status_date: statusDate,
                status_by: statusBy,
            },
        });
    }),
    // สถานะการเอาติ๊กออก
    updateStatusUnCheckedBox: (id, statusBy) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair.update({
            where: { id },
            data: {
                status: repairReceiptListRepairModel_1.REPAIR_RECEIPT_LIST_REPAIR_STATUS.PENDING,
                status_date: null,
                status_by: statusBy,
            },
        });
    }),
};
