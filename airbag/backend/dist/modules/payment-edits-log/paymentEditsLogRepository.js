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
exports.paymentEditsLogRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.paymentEditsLogRepository = {
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits_log.findMany({
            orderBy: { created_at: "asc" },
        });
    }),
    count: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits_log.count({});
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits_log.findUnique({
            where: { id },
            include: {
                master_payment: true,
                payment_edits: true,
                created_by_user: {
                    select: {
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });
    }),
    findByPaymentId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits_log.findMany({
            where: {
                payment_id: id,
            },
            include: {
                master_payment: true,
                payment_edits: true,
                created_by_user: {
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
        var _a, _b;
        return yield prisma.payment_edits_log.create({
            data: {
                payment_edit_id: payload.payment_edit_id,
                payment_id: payload.payment_id,
                old_data: payload.old_data,
                new_data: payload.new_data,
                edit_status: payload.edit_status,
                company_id: payload.company_id,
                remark: payload.remark,
                created_by: (_a = payload.created_by) !== null && _a !== void 0 ? _a : "",
                updated_by: (_b = payload.updated_by) !== null && _b !== void 0 ? _b : "",
            },
        });
    }),
};
