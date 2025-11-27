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
exports.repairReceiptListRepairLogRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.repairReceiptListRepairLogRepository = {
    findAll: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair_log_status.findMany({
            where: { company_id: company_id },
            orderBy: { created_at: "asc" },
        });
    }),
    count: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair_log_status.count({
            where: { company_id: company_id },
        });
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair_log_status.findUnique({
            where: { id },
            include: {
                repair_receipt_list_repair: {
                    include: {
                        master_repair_receipt: true,
                        master_repair: true,
                    },
                },
                profile: {
                    select: {
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });
    }),
    findByRepairReceiptId: (repair_receipt_id, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair_log_status.findMany({
            where: {
                company_id: company_id,
                repair_receipt_list_repair: {
                    master_repair_receipt_id: repair_receipt_id,
                },
            },
            include: {
                repair_receipt_list_repair: {
                    include: {
                        master_repair_receipt: true,
                        master_repair: true,
                    },
                },
                profile: {
                    select: {
                        first_name: true,
                        last_name: true,
                    },
                },
            },
            orderBy: { created_at: "desc" },
        });
    }),
    create: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.repair_receipt_list_repair_log_status.create({
            data: {
                repair_receipt_list_repair_id: payload.repair_receipt_list_repair_id,
                list_repair_status: payload.list_repair_status,
                company_id: payload.company_id,
                created_by: payload.created_by,
            },
        });
    }),
};
