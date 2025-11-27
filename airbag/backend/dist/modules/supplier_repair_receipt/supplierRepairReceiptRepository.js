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
exports.supplierRepairReceiptRepository = void 0;
const client_1 = require("@prisma/client");
const generateRepairReceiptNumber_1 = require("./generateRepairReceiptNumber");
const prisma = new client_1.PrismaClient();
exports.supplierRepairReceiptRepository = {
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    { receipt_doc: { contains: searchText, mode: "insensitive" } },
                    { supplier_delivery_note: { supplier_delivery_note_doc: { contains: searchText, mode: "insensitive" } } },
                    { status: { contains: searchText, mode: "insensitive" } },
                ],
            })),
            include: {
                supplier_repair_receipt_lists: {
                    include: {
                        master_repair: true,
                        master_repair_receipt: {
                            include: {
                                master_quotation: {
                                    include: {
                                        master_customer: true,
                                        master_brand: true,
                                        master_brandmodel: true,
                                        master_color: true
                                    }
                                }
                            }
                        }
                    }
                },
                master_supplier: {
                    select: {
                        supplier_id: true,
                        supplier_name: true,
                        supplier_code: true,
                        contact_name: true,
                        contact_number: true,
                        payment_terms: true,
                        payment_terms_day: true
                    }
                },
                supplier_delivery_note: {
                    include: {
                        supplier_delivery_note_repair_receipt_list: {
                            include: {
                                master_repair: true,
                                master_repair_receipt: true
                            }
                        }
                    }
                },
                company: true,
                created_by_user: {
                    select: {
                        employee_id: true,
                        username: true
                    }
                },
                updated_by_user: {
                    select: {
                        employee_id: true,
                        username: true
                    }
                }
            },
            skip,
            take,
            orderBy: { created_at: "desc" },
        });
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt.count({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    { receipt_doc: { contains: searchText, mode: "insensitive" } },
                    { supplier_delivery_note: { supplier_delivery_note_doc: { contains: searchText, mode: "insensitive" } } },
                    { status: { contains: searchText, mode: "insensitive" } },
                ],
            })),
        });
    }),
    create: (companyId, userId, supplierDeliveryNoteId, supplierId) => __awaiter(void 0, void 0, void 0, function* () {
        const receiptDoc = yield (0, generateRepairReceiptNumber_1.generateRepairReceiptNumber)(companyId);
        return yield prisma.supplier_repair_receipt.create({
            data: {
                supplier_delivery_note_id: supplierDeliveryNoteId,
                company_id: companyId,
                created_by: userId,
                updated_by: userId,
                supplier_id: supplierId,
                status: "pending",
                receipt_doc: receiptDoc,
                responsible_by: userId,
            },
            include: {
                supplier_delivery_note: true, // Includes all fields from supplier_delivery_note
                master_supplier: true, // Includes master_supplier data if supplier_id is not null
                company: true, // Includes company data
                created_by_user: {
                    select: {
                        employee_id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                },
                updated_by_user: {
                    select: {
                        employee_id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                },
                master_repair_receipt: true,
                supplier_delivery_note_repair_receipt_list: true,
                master_repair: true,
                repair_receipt_list: true,
                supplier_repair_receipt_lists: true,
                send_for_a_claim: true
            }
        });
    }),
    findByIdAsync: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt.findFirst({
            where: {
                company_id: companyId,
                id: id,
            },
            include: {
                supplier_repair_receipt_lists: {
                    include: {
                        master_repair: true,
                        master_repair_receipt: true
                    }
                },
                master_supplier: true,
                supplier_delivery_note: {
                    include: {
                        supplier_delivery_note_repair_receipt_list: true
                    }
                },
                company: true,
                created_by_user: true,
                updated_by_user: true
            }
        });
    }),
    update: (companyId, userId, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt.update({
            where: {
                company_id: companyId,
                id: id,
            },
            data: Object.assign(Object.assign({}, payload), { updated_by: userId, updated_at: new Date() }),
        });
    }),
    delete: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt.delete({
            where: {
                company_id: companyId,
                id: id,
            },
        });
    }),
    findSupplierDeliveryNoteById: (supplierDeliveryNoteId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_delivery_note.findUnique({
            where: { supplier_delivery_note_id: supplierDeliveryNoteId },
            select: { supplier_id: true }
        });
    }),
    findPayloadById: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt.findFirst({
            where: {
                company_id: companyId,
                id: id,
            },
            select: {
                receipt_doc: true,
                repair_date_supplier_repair_receipt: true,
                supplier_delivery_note: {
                    select: {
                        supplier_delivery_note_doc: true,
                        date_of_submission: true,
                        amount: true,
                    }
                },
                master_supplier: {
                    select: {
                        supplier_name: true,
                    }
                }
            }
        });
    }),
    findReceiptDocsByCompanyId: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt.findMany({
            where: {
                company_id: companyId,
            },
            select: {
                id: true,
                receipt_doc: true,
            },
            orderBy: {
                receipt_doc: 'asc',
            },
        });
    }),
    findOnlyResponsibleUserForSupplierRepairReceipt: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt.findFirst({
            where: {
                company_id: companyId,
                id: id,
            },
            select: {
                id: true,
                responsible_by_user: {
                    select: {
                        employee_id: true,
                        username: true,
                    }
                }
            },
        });
    }),
    select: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield prisma.supplier_repair_receipt.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                receipt_doc: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            })),
            skip: 0,
            take: 50,
            select: {
                id: true,
                receipt_doc: true
            },
            orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
        return data;
    }),
};
