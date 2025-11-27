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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierDeliveryNoteRRListRepository = void 0;
const client_1 = require("@prisma/client");
const sdnRepairReceiptListModel_1 = require("@modules/sdn-repair-receipt-list/sdnRepairReceiptListModel");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const keys = [
    "supplier_delivery_note_repair_receipt_list_id",
    "supplier_delivery_note_id",
    "repair_receipt_id",
    "master_repair_id",
    "price",
    "quantity",
    "total_price",
    "status",
];
const prisma = new client_1.PrismaClient();
exports.supplierDeliveryNoteRRListRepository = {
    findAll: (companyId, skip, take, searchText, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        const searchAmount = parseFloat(searchText);
        const records = yield prisma.supplier_delivery_note_repair_receipt_list.findMany({
            where: Object.assign({ company_id: companyId, supplier_delivery_note_id: supplier_delivery_note_id }, (searchText && {
                OR: [
                    { status: { contains: searchText, mode: "insensitive" } },
                    { master_repair: { master_repair_name: { contains: searchText, mode: "insensitive" } } }, // แก้ไขที่นี่ให้เข้าถึง master_repair_name ผ่าน master_repair
                    { master_repair_receipt: { repair_receipt_doc: { contains: searchText, mode: "insensitive" } } }, // ค้นหาตาม repair_receipt_doc
                    { price: { equals: searchAmount } },
                    { quantity: { equals: searchAmount } },
                    { total_price: { equals: searchAmount } },
                ],
            })),
            skip,
            take,
            orderBy: { created_at: "asc" },
            select: {
                supplier_delivery_note_repair_receipt_list_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                status: true,
                price: true,
                quantity: true,
                total_price: true,
                master_repair_receipt: {
                    select: {
                        repair_receipt_doc: true,
                    },
                },
                supplier_delivery_note: {
                    select: {
                        supplier_delivery_note_doc: true,
                    },
                },
                master_repair: {
                    select: {
                        master_repair_id: true,
                        master_repair_name: true,
                    },
                },
            },
        });
        // จัดกลุ่มข้อมูลตาม supplier_delivery_note_id และ repair_receipt_id
        const groupedData = records.reduce((acc, record) => {
            var _a, _b, _c;
            // ถ้ายังไม่มีกลุ่มนี้ใน accumulator สำหรับ supplier_delivery_note_id ให้สร้างกลุ่มใหม่
            if (!acc[record.supplier_delivery_note_id]) {
                acc[record.supplier_delivery_note_id] = {};
            }
            // ถ้ายังไม่มีกลุ่มนี้ใน accumulator สำหรับ repair_receipt_id ให้สร้างกลุ่มใหม่
            if (!acc[record.supplier_delivery_note_id][record.repair_receipt_id]) {
                acc[record.supplier_delivery_note_id][record.repair_receipt_id] = {
                    repair_receipts: [],
                    repair_receipt_doc: ((_a = record.master_repair_receipt) === null || _a === void 0 ? void 0 : _a.repair_receipt_doc) || "", // เพิ่ม repair_receipt_doc เมื่อสร้างกลุ่มใหม่
                    supplier_delivery_note_doc: ((_b = record.supplier_delivery_note) === null || _b === void 0 ? void 0 : _b.supplier_delivery_note_doc) || "", // เพิ่ม supplier_delivery_note_doc
                    master_repair_name: ((_c = record.master_repair) === null || _c === void 0 ? void 0 : _c.master_repair_name) || "",
                };
            }
            // เพิ่มรายการ repair_receipt ลงในกลุ่มที่ตรงกับ supplier_delivery_note_id และ repair_receipt_id
            acc[record.supplier_delivery_note_id][record.repair_receipt_id].repair_receipts.push({
                supplier_delivery_note_repair_receipt_list_id: record.supplier_delivery_note_repair_receipt_list_id,
                repair_receipt_id: record.repair_receipt_id,
                master_repair_id: record.master_repair.master_repair_id,
                master_repair_name: record.master_repair.master_repair_name,
                price: record.price,
                quantity: record.quantity,
                total_price: record.total_price,
                status: record.status,
            });
            return acc;
        }, {});
        // เปลี่ยนจาก object เป็น array เพื่อให้ผลลัพธ์เป็น list
        const result = Object.keys(groupedData).map(supplierDeliveryNoteId => ({
            supplier_delivery_note_id: supplierDeliveryNoteId,
            supplier_delivery_note_doc: groupedData[supplierDeliveryNoteId][Object.keys(groupedData[supplierDeliveryNoteId])[0]].supplier_delivery_note_doc, // ใช้ supplier_delivery_note_doc จากรายการแรก
            repair_receipts: Object.keys(groupedData[supplierDeliveryNoteId]).map(repairReceiptId => ({
                repair_receipt_id: repairReceiptId,
                repair_receipt_doc: groupedData[supplierDeliveryNoteId][repairReceiptId].repair_receipt_doc, // เพิ่มข้อมูล repair_receipt_doc
                repair_receipts: groupedData[supplierDeliveryNoteId][repairReceiptId].repair_receipts,
            })),
        }));
        return result;
    }),
    count: (companyId, searchText, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        const searchAmount = parseFloat(searchText);
        return prisma.supplier_delivery_note_repair_receipt_list.count({
            where: Object.assign({ company_id: companyId, supplier_delivery_note_id: supplier_delivery_note_id }, (searchText && {
                OR: [
                    { status: { contains: searchText, mode: "insensitive" } },
                    { master_repair: { master_repair_name: { contains: searchText, mode: "insensitive" } } }, // แก้ไขที่นี่ให้เข้าถึง master_repair_name ผ่าน master_repair
                    { master_repair_receipt: { repair_receipt_doc: { contains: searchText, mode: "insensitive" } } }, // ค้นหาตาม repair_receipt_doc
                    { price: { equals: searchAmount } }, // ค้นหาตาม price
                    { quantity: { equals: searchAmount } }, // ค้นหาตาม quantity
                    { total_price: { equals: searchAmount } }, // ค้นหาตาม total_price
                ],
            })),
            orderBy: { created_at: "asc" },
        });
    }),
    findByName: (companyId, customer_code) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.customer_visit.findFirst({
            where: {
                customer_code,
                company_id: companyId
            },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!payload.supplier_delivery_note_id) {
            throw new Error("supplier_delivery_note_id is required ");
        }
        if (!payload.repair_receipt_id) {
            throw new Error(" repair_receipt_id is required");
        }
        if (!payload.master_repair_id) {
            throw new Error(" master_repair_id is required");
        }
        const supplierDeliveryNoteData = yield prisma.supplier_delivery_note.findUnique({
            where: { supplier_delivery_note_id: payload.supplier_delivery_note_id },
            select: {
                supplier_delivery_note_id: true,
                supplier_delivery_note_doc: true,
                date_of_submission: true,
                due_date: true,
                amount: true,
                status: true,
                supplier_id: true,
            },
        });
        if (!supplierDeliveryNoteData) {
            throw new Error(`Supplier not found for supplier_delivery_note_id or repair_receipt_id or master_repair_id: ${payload.supplier_delivery_note_id}`);
        }
        const setPayload = {
            company_id: companyId,
            supplier_delivery_note_id: payload.supplier_delivery_note_id,
            repair_receipt_id: payload.repair_receipt_id,
            master_repair_id: payload.master_repair_id,
            price: (_a = payload.price) !== null && _a !== void 0 ? _a : 0,
            quantity: (_b = payload.quantity) !== null && _b !== void 0 ? _b : 0,
            total_price: (_c = payload.total_price) !== null && _c !== void 0 ? _c : (((_d = payload.price) !== null && _d !== void 0 ? _d : 0) * ((_e = payload.quantity) !== null && _e !== void 0 ? _e : 0)),
            // status: SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS.PENDING,
            status: (_f = payload.status) !== null && _f !== void 0 ? _f : sdnRepairReceiptListModel_1.SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS.PENDING,
            created_at: (_g = payload.created_at) !== null && _g !== void 0 ? _g : new Date().toISOString(),
            created_by: userId,
            updated_at: payload.updated_at,
            updated_by: userId,
        };
        return yield prisma.supplier_delivery_note_repair_receipt_list.create({
            data: setPayload,
            select: {
                supplier_delivery_note_repair_receipt_list_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                price: true,
                quantity: true,
                total_price: true,
                status: true,
            }
        });
    }),
    findByIdAsync: (companyId, supplier_delivery_note_repair_receipt_list_id) => __awaiter(void 0, void 0, void 0, function* () {
        const SupplierDeliveryNoteRRList = yield prisma.supplier_delivery_note_repair_receipt_list.findFirst({
            where: {
                company_id: companyId,
                supplier_delivery_note_repair_receipt_list_id: supplier_delivery_note_repair_receipt_list_id
            },
            select: {
                supplier_delivery_note_repair_receipt_list_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                price: true,
                quantity: true,
                total_price: true,
                status: true,
            }
        });
        if (!SupplierDeliveryNoteRRList) {
            return null;
        }
        return SupplierDeliveryNoteRRList;
    }),
    update: (companyId, userId, supplier_delivery_note_repair_receipt_list_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const setPayload = Object.assign(Object.assign({}, payload), { updated_at: new Date(), updated_by: userId });
        yield prisma.supplier_delivery_note_repair_receipt_list.update({
            where: {
                company_id: companyId,
                supplier_delivery_note_repair_receipt_list_id: supplier_delivery_note_repair_receipt_list_id,
            },
            data: setPayload,
        });
        // // ตรวจสอบสถานะของ supplier_delivery_note_repair_receipt_list ทั้งหมดที่มี supplier_delivery_note_id เหมือนกัน
        // // ถ้าสถานะของทั้งหมดเป็น SUCCESS ให้เปลี่ยนสถานะของ supplier_delivery_note เป็น SUCCESS
        // const supplierDeliveryNoteId = payload.supplier_delivery_note_id;
        // const repairReceiptList = await prisma.supplier_delivery_note_repair_receipt_list.findMany({
        //     where: {
        //         company_id: companyId,
        //         supplier_delivery_note_id: supplierDeliveryNoteId,
        //     },
        //     select: {
        //         status: true,
        //     },
        // });
        // const allSuccess = repairReceiptList.every((item) => item.status === SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS.SUCCESS);
        // if (allSuccess) {
        //     const setSupplierDeliveryNotePayload = {
        //         status: SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS.SUCCESS,
        //         updated_at: new Date(),
        //         updated_by: userId,
        //     };
        //     await prisma.supplier_delivery_note.update({
        //         where: {
        //             company_id: companyId,
        //             supplier_delivery_note_id: supplierDeliveryNoteId,
        //         },
        //         data: setSupplierDeliveryNotePayload,
        //     });
        // } else {
        //     const setSupplierDeliveryNotePayload = {
        //         status: SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS.PENDING,
        //         updated_at: new Date(),
        //         updated_by: userId,
        //     };
        //         await prisma.supplier_delivery_note.update({
        //         where: {
        //             company_id: companyId,
        //             supplier_delivery_note_id: supplierDeliveryNoteId,
        //         },
        //         data: setSupplierDeliveryNotePayload,
        //     });
        // }
    }),
    delete: (companyId, supplier_delivery_note_repair_receipt_list_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_delivery_note_repair_receipt_list.delete({
            where: {
                company_id: companyId,
                supplier_delivery_note_repair_receipt_list_id: supplier_delivery_note_repair_receipt_list_id
            },
        });
    }),
    findByDate: (date) => __awaiter(void 0, void 0, void 0, function* () {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // เวลาเริ่มต้นของวัน
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // เวลาสิ้นสุดของวัน
        return yield prisma.supplier_delivery_note.findMany({
            where: {
                created_at: {
                    gte: startOfDay, // มากกว่าหรือเท่ากับเวลาเริ่มต้น
                    lt: endOfDay, // น้อยกว่าเวลาเที่ยงคืนของวันถัดไป
                },
            },
        });
    }),
    findByRRIdAsync: (companyId, supplier_delivery_note_id, repair_receipt_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_delivery_note_repair_receipt_list.findMany({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
                repair_receipt_id: repair_receipt_id
            },
            select: {
                supplier_delivery_note_repair_receipt_list_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                price: true,
                quantity: true,
                total_price: true,
                status: true,
                master_repair: {
                    select: {
                        master_repair_id: true,
                        master_repair_name: true,
                    },
                }
            },
        });
    }),
    findByRRIdAsync2: (companyId, repair_receipt_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_delivery_note_repair_receipt_list.findMany({
            where: {
                company_id: companyId,
                // supplier_delivery_note_id: supplier_delivery_note_id,
                repair_receipt_id: repair_receipt_id
            },
            select: {
                supplier_delivery_note_repair_receipt_list_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                price: true,
                quantity: true,
                total_price: true,
                status: true,
                master_repair: {
                    select: {
                        master_repair_id: true,
                        master_repair_name: true,
                    },
                }
            },
        });
    }),
    checkSDNListinSupplierRepairReceipt: (companyId, supplier_delivery_note_repair_receipt_list_id) => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield prisma.supplier_repair_receipt_list.findMany({
            where: {
                company_id: companyId,
                supplier_delivery_note_repair_receipt_list_id: supplier_delivery_note_repair_receipt_list_id,
                finish: true
            }
        });
        return results;
    }),
};
