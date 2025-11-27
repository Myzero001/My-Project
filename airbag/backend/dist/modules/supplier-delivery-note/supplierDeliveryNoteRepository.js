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
exports.supplierDeliveryNoteRepository = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const keys = [
    "supplier_delivery_note_id",
    "supplier_delivery_note_doc",
    "date_of_submission",
    "due_date",
    "amount",
    "status",
    "addr_number",
    "addr_alley",
    "addr_street",
    "addr_subdistrict",
    "addr_district",
    "addr_province",
    "addr_postcode",
    "contact_name",
    "contact_number",
    "payment_terms",
    "payment_terms_day",
    "remark",
];
const prisma = new client_1.PrismaClient();
exports.supplierDeliveryNoteRepository = {
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const searchAmount = parseFloat(searchText);
        return yield prisma.supplier_delivery_note.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    { supplier_delivery_note_doc: { contains: searchText, mode: "insensitive" } },
                    { date_of_submission: { contains: searchText, mode: "insensitive" } },
                    { due_date: { contains: searchText, mode: "insensitive" } },
                    { master_supplier: { supplier_code: { contains: searchText, mode: "insensitive" } } },
                    { amount: { equals: searchAmount } },
                    { status: { contains: searchText, mode: "insensitive" } },
                ],
            })),
            select: {
                supplier_delivery_note_id: true,
                supplier_delivery_note_doc: true,
                date_of_submission: true,
                due_date: true,
                amount: true,
                status: true,
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
                payment_terms: true,
                payment_terms_day: true,
                remark: true,
                master_supplier: {
                    select: {
                        supplier_id: true,
                        supplier_code: true,
                        supplier_name: true,
                    },
                },
            },
            skip,
            take,
            orderBy: { created_at: "asc" },
        });
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const searchAmount = parseFloat(searchText);
        return prisma.supplier_delivery_note.count({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    { supplier_delivery_note_doc: { contains: searchText, mode: "insensitive" } },
                    { date_of_submission: { contains: searchText, mode: "insensitive" } },
                    { due_date: { contains: searchText, mode: "insensitive" } },
                    { master_supplier: { supplier_code: { contains: searchText, mode: "insensitive" } } },
                    { amount: { equals: searchAmount } },
                    { status: { contains: searchText, mode: "insensitive" } },
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
        var _a, _b, _c;
        if (!payload.supplier_id) {
            throw new Error("supplier_id is required");
        }
        const supplierDeliveryNoteData = yield prisma.master_supplier.findUnique({
            where: { supplier_id: payload.supplier_id },
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
                created_at: true,
                updated_at: true,
            },
        });
        if (!supplierDeliveryNoteData) {
            throw new Error(`Supplier not found for supplier_id: ${payload.supplier_id}`);
        }
        const setPayload = {
            company_id: companyId,
            supplier_delivery_note_doc: payload.supplier_delivery_note_doc,
            date_of_submission: (_a = payload.date_of_submission) !== null && _a !== void 0 ? _a : (0, dayjs_1.default)().tz("Asia/Bangkok").format("YYYY-MM-DD"),
            due_date: payload.due_date,
            amount: payload.amount,
            status: (_b = payload.status) !== null && _b !== void 0 ? _b : "pending",
            supplier_id: payload.supplier_id,
            addr_number: supplierDeliveryNoteData.addr_number,
            addr_alley: supplierDeliveryNoteData.addr_alley,
            addr_street: supplierDeliveryNoteData.addr_street,
            addr_subdistrict: supplierDeliveryNoteData.addr_subdistrict,
            addr_district: supplierDeliveryNoteData.addr_district,
            addr_province: supplierDeliveryNoteData.addr_province,
            addr_postcode: supplierDeliveryNoteData.addr_postcode,
            contact_name: supplierDeliveryNoteData.contact_name,
            contact_number: supplierDeliveryNoteData.contact_number,
            payment_terms: supplierDeliveryNoteData.payment_terms,
            payment_terms_day: supplierDeliveryNoteData.payment_terms_day,
            remark: supplierDeliveryNoteData.remark,
            created_at: (_c = payload.created_at) !== null && _c !== void 0 ? _c : new Date().toISOString(),
            created_by: userId,
            updated_at: payload.updated_at,
            updated_by: userId,
            responsible_by: userId,
        };
        return yield prisma.supplier_delivery_note.create({
            data: setPayload,
            select: {
                supplier_delivery_note_id: true,
                supplier_delivery_note_doc: true,
                supplier_id: true,
            }
        });
    }),
    findByIdAsync: (companyId, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        const SupplierDeliveryNote = yield prisma.supplier_delivery_note.findFirst({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
            select: {
                supplier_delivery_note_id: true,
                supplier_delivery_note_doc: true,
                date_of_submission: true,
                due_date: true,
                amount: true,
                status: true,
                supplier_id: true,
                addr_alley: true,
                addr_number: true,
                addr_street: true,
                addr_subdistrict: true,
                addr_district: true,
                addr_province: true,
                addr_postcode: true,
                contact_name: true,
                contact_number: true,
                payment_terms: true,
                payment_terms_day: true,
                remark: true,
                master_supplier: {
                    select: {
                        supplier_id: true,
                        supplier_code: true,
                        supplier_name: true,
                    },
                },
            },
        });
        if (!SupplierDeliveryNote) {
            return null;
        }
        return SupplierDeliveryNote;
    }),
    update: (companyId, userId, supplier_delivery_note_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // คำนวณจำนวนเงินรวม
        const totalAmount = yield prisma.supplier_delivery_note_repair_receipt_list.aggregate({
            _sum: {
                total_price: true,
            },
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
        });
        const setPayload = Object.assign(Object.assign({}, payload), { amount: (_a = totalAmount._sum.total_price) !== null && _a !== void 0 ? _a : 0, updated_at: new Date(), updated_by: userId });
        // อัพเดต supplier_delivery_note ด้วย status ใหม่
        return yield prisma.supplier_delivery_note.update({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
            data: setPayload,
        });
    }),
    delete: (companyId, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_delivery_note.delete({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id
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
    getAllSupplierDeliveryNoteDoc: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        // ดึงข้อมูล docs
        const docs = yield prisma.supplier_delivery_note.findMany({
            where: {
                company_id: companyId,
            },
            select: {
                supplier_delivery_note_doc: true,
                supplier_delivery_note_id: true
            },
            orderBy: {
                supplier_delivery_note_doc: 'desc'
            }
        });
        // นับจำนวนทั้งหมด
        const totalCount = yield prisma.supplier_delivery_note.count({
            where: {
                company_id: companyId,
            }
        });
        return {
            docs,
            totalCount
        };
    }),
    checkSDNListinSDN: (companyId, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_delivery_note_repair_receipt_list.findFirst({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
        });
    }),
    checkSDNinSRR: (companyId, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_repair_receipt.findFirst({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
        });
    }),
    deleteSupplierDeliveryNoteList: (companyId, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_delivery_note_repair_receipt_list.deleteMany({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
        });
    }),
    findOnlyDeliveryNoteDocsByCompanyId: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield prisma.supplier_delivery_note.findMany({
            where: {
                company_id: companyId,
            },
            select: {
                supplier_delivery_note_id: true, // <-- Select Primary Key
                supplier_delivery_note_doc: true,
            },
            orderBy: {
                supplier_delivery_note_doc: 'asc',
            },
        });
        // แปลงผลลัพธ์ให้ตรงกับ Interface (ถ้าชื่อ PK ไม่ตรงกับ 'id' ใน Interface)
        return results.map(item => ({
            id: item.supplier_delivery_note_id, // Map supplier_delivery_note_id ไปที่ 'id'
            supplier_delivery_note_doc: item.supplier_delivery_note_doc,
        }));
    }),
    findOnlyResponsibleUserForDeliveryNote: (companyId, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.supplier_delivery_note.findFirst({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
            select: {
                supplier_delivery_note_id: true,
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
        const data = yield prisma.supplier_delivery_note.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                supplier_delivery_note_doc: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            })),
            skip: 0,
            take: 50,
            select: {
                supplier_delivery_note_id: true,
                supplier_delivery_note_doc: true
            },
            orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
        return data;
    }),
};
