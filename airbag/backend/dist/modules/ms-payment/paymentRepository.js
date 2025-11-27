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
exports.paymentRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.paymentRepository = {
    // ดึงข้อมูลทั้งหมดพร้อม pagination
    findAll: (companyId, skip, take, searchText, status) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_payment.findMany({
            where: Object.assign({ company_id: companyId }, (searchText
                ? {
                    OR: [
                        {
                            payment_doc: {
                                contains: searchText,
                                mode: "insensitive",
                            },
                        },
                        {
                            master_delivery_schedule: {
                                master_repair_receipt: {
                                    repair_receipt_doc: {
                                        contains: searchText,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                        {
                            master_delivery_schedule: {
                                delivery_schedule_doc: {
                                    contains: searchText,
                                    mode: "insensitive",
                                },
                            },
                        },
                        {
                            master_delivery_schedule: {
                                master_repair_receipt: {
                                    master_quotation: {
                                        master_customer: {
                                            contact_name: {
                                                contains: searchText,
                                                mode: "insensitive",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    ],
                    AND: Object.assign({}, (status !== "all" ? { option_payment: status } : {})),
                }
                : Object.assign({}, (status !== "all" ? { option_payment: status } : {})))),
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
            skip,
            take,
            orderBy: { created_at: "desc" },
        });
    }),
    // นับจำนวนข้อมูลทั้งหมด
    count: (companyId, searchText, status) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_payment.count({
            where: Object.assign({ company_id: companyId }, (searchText
                ? {
                    OR: [
                        {
                            master_delivery_schedule: {
                                master_repair_receipt: {
                                    repair_receipt_doc: {
                                        contains: searchText,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                        {
                            master_delivery_schedule: {
                                master_repair_receipt: {
                                    master_quotation: {
                                        master_customer: {
                                            contact_name: {
                                                contains: searchText,
                                                mode: "insensitive",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    ],
                    AND: Object.assign({}, (status !== "all" ? { option_payment: status } : {})),
                }
                : Object.assign({}, (status !== "all" ? { option_payment: status } : {})))),
        });
    }),
    findAllNoPagination: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_payment.findMany({
            where: { company_id: company_id },
            orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
    }),
    findByDate: (date) => __awaiter(void 0, void 0, void 0, function* () {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day
        return yield prisma.master_payment.findMany({
            where: {
                created_at: {
                    gte: startOfDay, // Greater than or equal to start of the day
                    lte: endOfDay, // Less than or equal to end of the day
                },
            },
        });
    }),
    findAllById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_payment.findUnique({
            where: { id },
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
                companies: true,
            },
        });
    }),
    findAllByRepairReceiptId: (repairReceiptId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_payment.findMany({
            where: {
                master_delivery_schedule: {
                    master_repair_receipt: {
                        id: repairReceiptId,
                    },
                },
            },
            include: {
                master_delivery_schedule: {
                    include: {
                        master_repair_receipt: true,
                    },
                },
                companies: true,
            },
            orderBy: { created_at: "desc" },
        });
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_payment.findUnique({
            where: { id },
        });
    }),
    // สร้างข้อมูลใหม่
    create: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        return yield prisma.master_payment.create({
            data: {
                payment_doc: payload.payment_doc,
                delivery_schedule_id: payload.delivery_schedule_id,
                option_payment: payload.option_payment,
                type_money: payload.type_money,
                price: payload.price,
                tax: payload.tax,
                tax_rate: payload.tax_rate,
                tax_status: payload.tax_status,
                total_price: payload.total_price,
                payment_image_url: payload.payment_image_url,
                remark: payload.remark,
                check_date: payload.check_date,
                check_number: payload.check_number,
                bank_name: payload.bank_name,
                status: payload.status,
                company_id: payload.company_id,
                created_by: (_a = payload.created_by) !== null && _a !== void 0 ? _a : "",
                updated_by: (_b = payload.updated_by) !== null && _b !== void 0 ? _b : "",
            },
        });
    }),
    // อัปเดตข้อมูล
    update: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_payment.update({
            where: { id },
            data: {
                option_payment: payload.option_payment,
                type_money: payload.type_money,
                price: payload.price,
                tax: payload.tax,
                tax_rate: payload.tax_rate,
                tax_status: payload.tax_status,
                total_price: payload.total_price,
                payment_image_url: payload.payment_image_url,
                remark: payload.remark,
                check_date: payload.check_date,
                check_number: payload.check_number,
                bank_name: payload.bank_name,
                updated_by: payload.updated_by,
            },
        });
    }),
    // ลบข้อมูล
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_payment.delete({
            where: { id },
        });
    }),
};
