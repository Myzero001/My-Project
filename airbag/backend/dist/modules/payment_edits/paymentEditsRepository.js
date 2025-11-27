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
exports.paymentEditsRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.paymentEditsRepository = {
    // ดึงข้อมูลทั้งหมดพร้อม pagination
    findAll: (companyId, skip, take, searchText, status) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits.findMany({
            where: Object.assign({ company_id: companyId }, (searchText
                ? {
                    OR: [
                        {
                            master_payment: {
                                payment_doc: {
                                    contains: searchText,
                                    mode: "insensitive",
                                },
                            },
                        },
                    ],
                    AND: Object.assign({}, (status !== "all" ? { edit_status: status } : {})),
                }
                : Object.assign({}, (status !== "all" ? { edit_status: status } : {})))),
            include: {
                master_payment: true,
                created_by_user: true,
            },
            skip,
            take,
            orderBy: { created_at: "desc" },
        });
    }),
    // นับจำนวนข้อมูลทั้งหมด
    count: (companyId, searchText, status) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits.count({
            where: Object.assign({ company_id: companyId }, (searchText
                ? {
                    OR: [
                        {
                            master_payment: {
                                payment_doc: {
                                    contains: searchText,
                                    mode: "insensitive",
                                },
                            },
                        },
                    ],
                    AND: Object.assign({}, (status !== "all" ? { edit_status: status } : {})),
                }
                : Object.assign({}, (status !== "all" ? { edit_status: status } : {})))),
        });
    }),
    findAllNoPagination: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits.findMany({
            orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
    }),
    findByDate: (date) => __awaiter(void 0, void 0, void 0, function* () {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day
        return yield prisma.payment_edits.findMany({
            where: {
                created_at: {
                    gte: startOfDay, // Greater than or equal to start of the day
                    lte: endOfDay, // Less than or equal to end of the day
                },
            },
        });
    }),
    findAllById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits.findUnique({
            where: { id },
            include: {
                master_payment: {
                    include: {
                        master_delivery_schedule: {
                            include: {
                                master_repair_receipt: {
                                    include: {
                                        master_quotation: {
                                            include: {
                                                master_brand: true,
                                                master_brandmodel: true,
                                                master_color: true,
                                                master_customer: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                companies: true,
            },
        });
    }),
    findByPaymentId: (payment_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits.findMany({
            where: { payment_id: payment_id },
            include: {
                master_payment: true,
                companies: true,
            },
        });
    }),
    findLogByPaymentId: (payment_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits.findMany({
            where: { payment_id: payment_id },
            include: {
                master_payment: true,
                companies: true,
                payment_edits_log: {
                    include: {
                        created_by_user: true,
                    },
                    orderBy: {
                        created_at: "desc", // หรือ 'asc' สำหรับการจัดเรียงจากน้อยไปมาก
                    },
                },
            },
        });
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits.findUnique({
            where: { id },
        });
    }),
    // สร้างข้อมูลใหม่
    create: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        return yield prisma.payment_edits.create({
            data: {
                payment_id: payload.payment_id,
                old_data: payload.old_data,
                new_data: payload.new_data,
                edit_status: payload.edit_status,
                remark: payload.remark,
                company_id: payload.company_id,
                created_by: (_a = payload.created_by) !== null && _a !== void 0 ? _a : "",
                updated_by: (_b = payload.updated_by) !== null && _b !== void 0 ? _b : "",
            },
        });
    }),
    // อัปเดตข้อมูล
    update: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits.update({
            where: { id },
            data: {
                payment_id: payload.payment_id,
                old_data: payload.old_data,
                new_data: payload.new_data,
                edit_status: payload.edit_status,
                remark: payload.remark,
                updated_by: payload.updated_by,
            },
        });
    }),
    approve: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits.update({
            where: { id },
            data: {
                edit_status: payload.edit_status,
                remark: payload.remark,
                updated_by: payload.updated_by,
            },
        });
    }),
    cancel: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits.update({
            where: { id },
            data: {
                edit_status: payload.edit_status,
                remark: payload.remark,
                updated_by: payload.updated_by,
            },
        });
    }),
    reject: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits.update({
            where: { id },
            data: {
                edit_status: payload.edit_status,
                remark: payload.remark,
                updated_by: payload.updated_by,
            },
        });
    }),
    // ลบข้อมูล
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.payment_edits.delete({
            where: { id },
        });
    }),
};
