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
exports.supplierRepairReceiptListRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.supplierRepairReceiptListRepository = {
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const searchPrice = parseFloat(searchText);
        return yield prisma.supplier_repair_receipt_list.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    { status: { contains: searchText, mode: "insensitive" } },
                    { price: { equals: isNaN(searchPrice) ? undefined : searchPrice } },
                    { total_price: { equals: isNaN(searchPrice) ? undefined : searchPrice } },
                ],
            })),
            include: {
                supplier_repair_receipt: true,
                master_repair: true,
                master_repair_receipt: true,
                supplier_delivery_note: true,
                supplier_delivery_note_repair_receipt_list: true
            },
            skip,
            take,
            orderBy: { created_at: "desc" },
        });
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const searchPrice = parseFloat(searchText);
        return yield prisma.supplier_repair_receipt_list.count({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    { status: { contains: searchText, mode: "insensitive" } },
                    { price: { equals: isNaN(searchPrice) ? undefined : searchPrice } },
                    { total_price: { equals: isNaN(searchPrice) ? undefined : searchPrice } },
                ],
            })),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        // คำนวณ total_price (ถ้าจำเป็น)
        const calculatedTotalPrice = payload.price && payload.quantity
            ? payload.price * payload.quantity
            : payload.price || 0;
        // สร้างรายการใหม่เสมอ พร้อม include ข้อมูลที่เกี่ยวข้องทั้งหมด
        try {
            const newReceiptList = yield prisma.supplier_repair_receipt_list.create({
                data: {
                    supplier_repair_receipt_id: payload.supplier_repair_receipt_id, // ต้องมีค่านี้ส่งมา
                    supplier_delivery_note_id: payload.supplier_delivery_note_id,
                    repair_receipt_id: payload.repair_receipt_id,
                    master_repair_id: payload.master_repair_id,
                    supplier_delivery_note_repair_receipt_list_id: payload.supplier_delivery_note_repair_receipt_list_id, // Optional
                    price: payload.price || 0,
                    quantity: payload.quantity || 1,
                    total_price: calculatedTotalPrice,
                    status: payload.status || "pending",
                    finish: false,
                    company_id: companyId,
                    created_by: userId,
                    updated_by: userId,
                },
                // **** START: เพิ่ม include ตรงนี้ ****
                include: {
                    supplier_repair_receipt: {
                        include: {
                            master_supplier: true, // ข้อมูล Supplier จาก Header
                            supplier_delivery_note: true, // ข้อมูล Delivery Note จาก Header (อาจซ้ำกับด้านล่าง แต่เพื่อให้ชัวร์)
                            created_by_user: { select: { employee_id: true, first_name: true } }, // คนสร้าง Header
                            updated_by_user: { select: { employee_id: true, first_name: true } } // คนอัปเดต Header
                        }
                    },
                    supplier_delivery_note: {
                        include: {
                            master_supplier: true, // ข้อมูล Supplier จาก Delivery Note
                            supplier_delivery_note_created_by_user: { select: { employee_id: true, first_name: true } }, // คนสร้าง Note
                            supplier_delivery_note_updated_by_user: { select: { employee_id: true, first_name: true } } // คนอัปเดต Note
                        }
                    },
                    supplier_delivery_note_repair_receipt_list: true, // ข้อมูลรายการเดิมในใบส่งของ (ถ้า link ไว้)
                    master_repair_receipt: true, // ข้อมูล Master ใบรับซ่อม
                    master_repair: true, // ข้อมูล Master รายการซ่อม
                    supplier_repair_receipt_list_created_by_user: {
                        select: { employee_id: true, first_name: true } // เลือกเฉพาะ field ที่จำเป็น
                    },
                    supplier_repair_receipt_list_updated_by_user: {
                        select: { employee_id: true, first_name: true } // เลือกเฉพาะ field ที่จำเป็น
                    },
                    // companies: true, // ถ้าต้องการข้อมูลบริษัทด้วย (ปกติไม่จำเป็น)
                }
                // **** END: เพิ่ม include ตรงนี้ ****
            });
            return newReceiptList; // คืนค่า object ที่สร้างใหม่พร้อมข้อมูล include ทั้งหมด
        }
        catch (ex) {
            // จัดการ Error (เช่น Unique constraint) ควร throw เพื่อให้ Service จัดการต่อ
            console.error("Error in repository create:", ex);
            throw ex; // โยน Error กลับไปให้ Service
        }
    }),
    findByIdAsync: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt_list.findFirst({
            where: {
                company_id: companyId,
                id: id,
            },
            include: {
                supplier_repair_receipt: true,
                master_repair: true,
                master_repair_receipt: true,
                supplier_delivery_note: true,
                supplier_delivery_note_repair_receipt_list: true
            },
        });
    }),
    update: (companyId, userId, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const calculatedTotalPrice = payload.price && payload.quantity
            ? payload.price * payload.quantity
            : payload.price || 0;
        return yield prisma.supplier_repair_receipt_list.update({
            where: {
                id: id,
                company_id: companyId,
            },
            data: {
                supplier_repair_receipt_id: payload.supplier_repair_receipt_id,
                supplier_delivery_note_id: payload.supplier_delivery_note_id,
                repair_receipt_id: payload.repair_receipt_id,
                master_repair_id: payload.master_repair_id,
                supplier_delivery_note_repair_receipt_list_id: payload.supplier_delivery_note_repair_receipt_list_id,
                price: payload.price || 0,
                quantity: payload.quantity || 1,
                status: payload.status,
                updated_by: userId,
                updated_at: new Date(),
                total_price: calculatedTotalPrice,
            },
        });
    }),
    delete: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt_list.delete({
            where: {
                id: id,
                company_id: companyId,
            },
        });
    }),
    // NEW FUNCTION: Check if the ID is referenced in send_for_a_claim_list
    checkIfReferencedInSendForClaim: (companyId, supplierRepairReceiptListId) => __awaiter(void 0, void 0, void 0, function* () {
        const count = yield prisma.send_for_a_claim_list.count({
            where: {
                company_id: companyId,
                supplier_repair_receipt_list_id: supplierRepairReceiptListId,
            },
        });
        return count > 0;
    }),
    updateFinishStatus: (companyId, userId, supplierDeliveryNoteRepairReceiptListId, isFinish, finish_by_receipt_doc, supplier_repair_receipt_id // เพิ่มพารามิเตอร์นี้
    ) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt_list.updateMany({
            where: {
                company_id: companyId,
                id: supplierDeliveryNoteRepairReceiptListId,
            },
            data: {
                finish: isFinish,
                finish_by_receipt_doc: finish_by_receipt_doc,
                supplier_repair_receipt_id: supplier_repair_receipt_id, // เพิ่มอัปเดตค่าใหม่
                updated_by: userId,
                updated_at: new Date(),
            },
        }).then(() => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.supplier_repair_receipt_list.findMany({
                where: {
                    company_id: companyId,
                    id: supplierDeliveryNoteRepairReceiptListId,
                },
                include: {
                    master_repair: true,
                    master_repair_receipt: true,
                    supplier_repair_receipt: true,
                },
            });
        }));
    }),
    findPayloadListById: (companyId, supplier_repair_receipt_id, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const receipts = yield prisma.supplier_repair_receipt.findMany({
                where: {
                    company_id: companyId,
                    id: supplier_repair_receipt_id,
                    supplier_delivery_note_id: supplier_delivery_note_id
                },
                select: {
                    id: true,
                    receipt_doc: true,
                    repair_date_supplier_repair_receipt: true,
                    status: true,
                    master_repair_receipt_id: true,
                    supplier_delivery_note_id: true,
                    supplier_delivery_note: {
                        select: {
                            supplier_delivery_note_doc: true,
                            date_of_submission: true,
                            due_date: true,
                            amount: true,
                            status: true,
                            contact_name: true,
                            contact_number: true,
                            payment_terms: true,
                            payment_terms_day: true,
                            remark: true,
                            // ดึงข้อมูล supplier_delivery_note_repair_receipt_list
                            supplier_delivery_note_repair_receipt_list: {
                                select: {
                                    supplier_delivery_note_repair_receipt_list_id: true,
                                    repair_receipt_id: true,
                                    master_repair_id: true,
                                    price: true,
                                    quantity: true,
                                    total_price: true,
                                    status: true,
                                    master_repair: {
                                        select: {
                                            master_repair_name: true,
                                            master_repair_id: true
                                        }
                                    },
                                    master_repair_receipt: {
                                        select: {
                                            id: true,
                                            repair_receipt_doc: true
                                        }
                                    },
                                    // เพิ่มการดึงข้อมูล supplier_repair_receipt_list ที่เกี่ยวข้อง
                                    supplier_repair_receipt_list: {
                                        select: {
                                            id: true,
                                            price: true,
                                            quantity: true,
                                            total_price: true,
                                            finish: true,
                                            finish_by_receipt_doc: true,
                                            supplier_repair_receipt_id: true
                                        }
                                    },
                                }
                            },
                            supplier_repair_receipt_list: {
                                select: {
                                    id: true,
                                    price: true,
                                    quantity: true,
                                    total_price: true,
                                    finish: true,
                                    finish_by_receipt_doc: true,
                                    supplier_delivery_note_repair_receipt_list_id: true,
                                    master_repair: {
                                        select: {
                                            master_repair_name: true,
                                            master_repair_id: true
                                        }
                                    },
                                    master_repair_receipt: {
                                        select: {
                                            id: true,
                                            repair_receipt_doc: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    master_supplier: {
                        select: {
                            supplier_name: true,
                            supplier_code: true,
                        }
                    },
                    supplier_repair_receipt_lists: {
                        select: {
                            id: true,
                            price: true,
                            quantity: true,
                            total_price: true,
                            finish: true,
                            finish_by_receipt_doc: true,
                            supplier_delivery_note_repair_receipt_list_id: true,
                            master_repair: {
                                select: {
                                    master_repair_name: true,
                                    master_repair_id: true
                                }
                            },
                            master_repair_receipt: {
                                select: {
                                    id: true,
                                    repair_receipt_doc: true
                                }
                            }
                        }
                    }
                }
            });
            return receipts.length > 0 ? receipts : null;
        }
        catch (error) {
            console.error('Error in findPayloadListById:', error);
            throw error;
        }
    }),
    updateFinishStatusBySupplierDeliveryNoteRepairReceiptListId: (companyId, userId, supplierDeliveryNoteRepairReceiptListId, masterRepairId, masterRepairReceiptId, isFinish, finish_by_receipt_doc) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt_list.updateMany({
            where: {
                company_id: companyId,
                supplier_delivery_note_repair_receipt_list_id: supplierDeliveryNoteRepairReceiptListId,
                master_repair_id: masterRepairId,
                repair_receipt_id: masterRepairReceiptId,
            },
            data: {
                finish: isFinish,
                finish_by_receipt_doc: finish_by_receipt_doc,
                updated_by: userId,
                updated_at: new Date(),
            },
        }).then(() => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.supplier_repair_receipt_list.findMany({
                where: {
                    company_id: companyId,
                    supplier_delivery_note_repair_receipt_list_id: supplierDeliveryNoteRepairReceiptListId,
                    master_repair_id: masterRepairId,
                    repair_receipt_id: masterRepairReceiptId,
                },
                include: {
                    master_repair: true,
                    master_repair_receipt: true,
                    supplier_repair_receipt: true,
                },
            });
        }));
    }),
    updateSupplierRepairReceiptId: (companyId, userId, id, supplier_repair_receipt_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt_list.update({
            where: {
                id: id,
                company_id: companyId,
            },
            data: {
                supplier_repair_receipt_id: supplier_repair_receipt_id,
                updated_by: userId,
                updated_at: new Date(),
            },
            include: {
                supplier_repair_receipt: true,
                master_repair: true,
                master_repair_receipt: true,
                supplier_delivery_note: true,
                supplier_delivery_note_repair_receipt_list: true
            },
        });
    }),
};
