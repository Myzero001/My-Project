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
exports.sendForAClaimRepository = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const keys = [
    "send_for_a_claim_id",
    "send_for_a_claim_doc",
    "claim_date",
    "due_date",
    "supplier_id",
    "addr_number",
    "addr_alley",
    "addr_street",
    "addr_subdistrict",
    "addr_district",
    "addr_province",
    "addr_postcode",
    "contact_name",
    "contact_number",
    "remark",
];
const prisma = new client_1.PrismaClient();
exports.sendForAClaimRepository = {
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.send_for_a_claim.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    { send_for_a_claim_doc: { contains: searchText, mode: "insensitive" } },
                    { master_supplier: { supplier_code: { contains: searchText, mode: "insensitive" } } },
                    { supplier_repair_receipt: { receipt_doc: { contains: searchText, mode: "insensitive" } } },
                    { supplier_repair_receipt: { supplier_delivery_note: { supplier_delivery_note_doc: { contains: searchText, mode: "insensitive" } } } },
                    { due_date: { contains: searchText, mode: "insensitive" } },
                    { claim_date: { contains: searchText, mode: "insensitive" } },
                ],
            })),
            select: {
                send_for_a_claim_id: true,
                send_for_a_claim_doc: true,
                supplier_repair_receipt_id: true,
                claim_date: true,
                due_date: true,
                supplier_id: true,
                addr_number: true,
                addr_alley: true,
                addr_street: true,
                addr_subdistrict: true,
                addr_district: true,
                addr_province: true,
                addr_postcode: true,
                contact_name: true,
                contact_number: true,
                remark: true,
                master_supplier: {
                    select: {
                        supplier_id: true,
                        supplier_code: true,
                        supplier_name: true,
                    },
                },
                supplier_repair_receipt: {
                    select: {
                        receipt_doc: true,
                        supplier_delivery_note: {
                            select: {
                                supplier_delivery_note_id: true,
                                supplier_delivery_note_doc: true,
                            },
                        },
                    },
                },
            },
            skip,
            take,
            orderBy: [
                { created_at: "asc" },
            ],
        });
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.send_for_a_claim.count({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    { send_for_a_claim_doc: { contains: searchText, mode: "insensitive" } },
                    { master_supplier: { supplier_code: { contains: searchText, mode: "insensitive" } } },
                    { supplier_repair_receipt: { receipt_doc: { contains: searchText, mode: "insensitive" } } },
                    { supplier_repair_receipt: { supplier_delivery_note: { supplier_delivery_note_doc: { contains: searchText, mode: "insensitive" } } } },
                    { due_date: { contains: searchText, mode: "insensitive" } },
                    { claim_date: { contains: searchText, mode: "insensitive" } },
                ],
            })),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (!payload.supplier_repair_receipt_id) {
            throw new Error("supplier_repair_receipt_id is required");
        }
        const supplierRepairReceiptData = yield prisma.supplier_repair_receipt.findUnique({
            where: { id: payload.supplier_repair_receipt_id },
            select: {
                receipt_doc: true,
                supplier_delivery_note: {
                    select: {
                        supplier_delivery_note_id: true,
                        supplier_delivery_note_doc: true
                    }
                },
                master_supplier: {
                    select: {
                        supplier_id: true,
                        supplier_code: true,
                        supplier_name: true,
                        contact_name: true,
                        contact_number: true,
                        line_id: true,
                        addr_number: true,
                        addr_alley: true,
                        addr_street: true,
                        addr_subdistrict: true,
                        addr_district: true,
                        addr_province: true,
                        addr_postcode: true,
                        payment_terms: true,
                        payment_terms_day: true,
                        remark: true,
                        business_type: true,
                    }
                }
            },
        });
        if (!supplierRepairReceiptData) {
            throw new Error(`Supplier not found for supplier_repair_receipt_id: ${payload.supplier_repair_receipt_id}`);
        }
        const setPayload = {
            company_id: companyId,
            send_for_a_claim_doc: payload.send_for_a_claim_doc,
            due_date: payload.due_date,
            supplier_repair_receipt_id: payload.supplier_repair_receipt_id,
            claim_date: (_a = payload.claim_date) !== null && _a !== void 0 ? _a : (0, dayjs_1.default)().tz("Asia/Bangkok").format("YYYY-MM-DD"),
            supplier_id: (_b = supplierRepairReceiptData.master_supplier) === null || _b === void 0 ? void 0 : _b.supplier_id,
            addr_number: (_c = supplierRepairReceiptData.master_supplier) === null || _c === void 0 ? void 0 : _c.addr_number,
            addr_alley: (_d = supplierRepairReceiptData.master_supplier) === null || _d === void 0 ? void 0 : _d.addr_alley,
            addr_street: (_e = supplierRepairReceiptData.master_supplier) === null || _e === void 0 ? void 0 : _e.addr_street,
            addr_subdistrict: (_f = supplierRepairReceiptData.master_supplier) === null || _f === void 0 ? void 0 : _f.addr_subdistrict,
            addr_district: (_g = supplierRepairReceiptData.master_supplier) === null || _g === void 0 ? void 0 : _g.addr_district,
            addr_province: (_h = supplierRepairReceiptData.master_supplier) === null || _h === void 0 ? void 0 : _h.addr_province,
            addr_postcode: (_j = supplierRepairReceiptData.master_supplier) === null || _j === void 0 ? void 0 : _j.addr_postcode,
            contact_name: (_k = supplierRepairReceiptData.master_supplier) === null || _k === void 0 ? void 0 : _k.contact_name,
            contact_number: (_l = supplierRepairReceiptData.master_supplier) === null || _l === void 0 ? void 0 : _l.contact_number,
            remark: payload.remark,
            created_at: (_m = payload.created_at) !== null && _m !== void 0 ? _m : new Date().toISOString(),
            created_by: userId,
            updated_at: payload.updated_at,
            updated_by: userId,
            responsible_by: userId,
        };
        return yield prisma.send_for_a_claim.create({
            data: setPayload,
            select: {
                send_for_a_claim_id: true,
                send_for_a_claim_doc: true,
                supplier_repair_receipt_id: true,
                supplier_id: true,
            }
        });
    }),
    findByIdAsync: (companyId, send_for_a_claim_id) => __awaiter(void 0, void 0, void 0, function* () {
        const claim = yield prisma.send_for_a_claim.findFirst({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
            },
            select: {
                send_for_a_claim_id: true,
                send_for_a_claim_doc: true,
                supplier_repair_receipt_id: true,
                claim_date: true,
                due_date: true,
                supplier_id: true,
                addr_number: true,
                addr_alley: true,
                addr_street: true,
                addr_subdistrict: true,
                addr_district: true,
                addr_province: true,
                addr_postcode: true,
                contact_name: true,
                contact_number: true,
                remark: true,
                master_supplier: {
                    select: {
                        supplier_id: true,
                        supplier_code: true,
                        supplier_name: true,
                        contact_name: true,
                        contact_number: true,
                    }
                },
                supplier_repair_receipt: {
                    select: {
                        id: true,
                        receipt_doc: true,
                        supplier_delivery_note: {
                            select: {
                                supplier_delivery_note_id: true,
                                supplier_delivery_note_doc: true
                            }
                        }
                    }
                }
            }
        });
        if (!claim) {
            return null;
        }
        return claim;
    }),
    update: (companyId, userId, send_for_a_claim_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const setPayload = Object.assign(Object.assign({}, payload), { updated_at: new Date(), updated_by: userId });
        return yield prisma.send_for_a_claim.update({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
            },
            data: setPayload,
        });
    }),
    delete: (companyId, send_for_a_claim_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.send_for_a_claim.delete({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id
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
    getAllSendForAClaimDoc: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt.findMany({
            where: {
                company_id: companyId,
            },
            orderBy: {
                receipt_doc: "desc",
            },
            select: {
                id: true,
                receipt_doc: true,
            },
        });
    }),
    findBySupplierRepairReceiptIdAsync: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt_list.findMany({
            where: {
                company_id: companyId,
                supplier_repair_receipt_id: id,
                finish: true
            },
            select: {
                id: true,
                supplier_repair_receipt_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                supplier_delivery_note_repair_receipt_list_id: true,
                price: true,
                quantity: true,
                total_price: true,
                status: true,
                finish: true,
                repair_date_supplier_repair_receipt_list: true,
                master_repair: {
                    select: {
                        master_repair_id: true,
                        master_repair_name: true,
                    }
                },
                supplier_repair_receipt: {
                    select: {
                        id: true,
                        receipt_doc: true,
                    }
                },
                supplier_delivery_note: {
                    select: {
                        supplier_delivery_note_id: true,
                        supplier_delivery_note_doc: true
                    }
                },
                master_repair_receipt: {
                    select: {
                        id: true,
                        repair_receipt_doc: true,
                    }
                }
            },
            orderBy: [
                { master_repair_receipt: { repair_receipt_doc: "asc" } },
                { master_repair: { master_repair_name: "asc" } }
            ],
        });
    }),
    checkClaimListinClaim: (companyId, send_for_a_claim_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.send_for_a_claim_list.findFirst({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
            },
        });
    }),
    checkClaiminReceiveForAClaim: (companyId, send_for_a_claim_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.receive_for_a_claim.findFirst({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
            },
        });
    }),
    deleteBySendForAClaimId: (companyId, send_for_a_claim_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.send_for_a_claim_list.deleteMany({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
            },
        });
    }),
    findOnlySendClaimDocsByCompanyId: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield prisma.send_for_a_claim.findMany({
            where: {
                company_id: companyId,
            },
            select: {
                send_for_a_claim_id: true,
                send_for_a_claim_doc: true,
            },
            orderBy: {
                send_for_a_claim_doc: 'asc',
            },
        });
        return results.map(item => ({
            id: item.send_for_a_claim_id,
            send_for_a_claim_doc: item.send_for_a_claim_doc,
        }));
    }),
    findOnlyResponsibleUserForSendForAClaim: (companyId, send_for_a_claim_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.send_for_a_claim.findFirst({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
            },
            select: {
                send_for_a_claim_id: true,
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
        const data = yield prisma.send_for_a_claim.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                send_for_a_claim_doc: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            })),
            skip: 0,
            take: 50,
            select: {
                send_for_a_claim_id: true,
                send_for_a_claim_doc: true
            },
            orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
        return data;
    }),
};
