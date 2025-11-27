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
exports.quotationLogStatusRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.quotationLogStatusRepository = {
    findAll: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_log_status.findMany({
            where: { company_id: company_id },
            orderBy: { created_at: "asc" },
        });
    }),
    count: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_log_status.count({
            where: { company_id: company_id },
        });
    }),
    findByQuotationId: (quotation_id, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.quotation_log_status.findMany({
            where: { quotation_id, company_id: company_id },
            include: {
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
        return yield prisma.quotation_log_status.create({
            data: {
                quotation_id: payload.quotation_id,
                quotation_status: payload.quotation_status,
                remark: payload.remark,
                company_id: payload.company_id,
                created_by: payload.created_by,
            },
        });
    }),
};
