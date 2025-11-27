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
exports.msSupplierRepository = void 0;
const client_1 = require("@prisma/client");
const keys = [
    "supplier_id",
    "supplier_code",
    "supplier_name",
    "contact_name",
    "contact_number",
    "line_id",
    "addr_number",
    "addr_alley",
    "addr_street",
    "addr_subdistrict",
    "addr_district",
    "addr_province",
    "addr_postcode",
    "payment_terms",
    "payment_terms_day",
    "remark",
    "business_type",
];
const prisma = new client_1.PrismaClient();
exports.msSupplierRepository = {
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_supplier.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    { supplier_code: { contains: searchText, mode: "insensitive" } },
                    { supplier_name: { contains: searchText, mode: "insensitive" } },
                    { contact_name: { contains: searchText, mode: "insensitive" } },
                    // { contact_number: { contains: searchText, mode: "insensitive" } },
                    { business_type: { contains: searchText, mode: "insensitive" } },
                ],
            })),
            skip,
            take,
            orderBy: { created_at: "asc" },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    // count: async (companyId: string) => {
    //     return prisma.master_supplier.count({
    //         where: {
    //             company_id: companyId,
    //             is_deleted: false
    //         },
    //     })
    // },
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.master_supplier.count({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    { supplier_code: { contains: searchText, mode: "insensitive" } },
                    { supplier_name: { contains: searchText, mode: "insensitive" } },
                    { contact_name: { contains: searchText, mode: "insensitive" } },
                    // { contact_number: { contains: searchText, mode: "insensitive" } },
                    { business_type: { contains: searchText, mode: "insensitive" } },
                ],
            })),
        });
    }),
    findByName: (companyId, supplier_code) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_supplier.findFirst({
            where: {
                supplier_code,
                company_id: companyId
            },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (!payload.supplier_code) {
            throw new Error("supplier_code is required");
        }
        const setPayload = {
            supplier_code: payload.supplier_code,
            supplier_name: payload.supplier_name,
            contact_name: payload.contact_name,
            contact_number: payload.contact_number,
            line_id: payload.line_id,
            addr_number: payload.addr_number,
            addr_alley: payload.addr_alley,
            addr_street: payload.addr_street,
            addr_subdistrict: payload.addr_subdistrict,
            addr_district: payload.addr_district,
            addr_province: payload.addr_province,
            addr_postcode: payload.addr_postcode,
            payment_terms: payload.payment_terms,
            payment_terms_day: payload.payment_terms_day,
            remark: payload.remark,
            business_type: payload.business_type,
            created_at: payload.created_at,
            updated_at: payload.updated_at,
            company_id: companyId,
            created_by: userId,
            updated_by: userId,
        };
        return yield prisma.master_supplier.create({
            data: setPayload,
            select: {
                supplier_id: true,
                supplier_code: true,
                created_at: true
            }
        });
    }),
    findByIdAsync: (companyId, supplier_id) => __awaiter(void 0, void 0, void 0, function* () {
        const supplier = yield prisma.master_supplier.findFirst({
            where: {
                company_id: companyId,
                supplier_id: supplier_id
            },
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
            }
        });
        if (!supplier) {
            return null;
        }
        return supplier;
    }),
    update: (companyId, userId, supplier_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const setPayload = {
            supplier_code: payload.supplier_code,
            supplier_name: payload.supplier_name,
            contact_name: payload.contact_name,
            contact_number: payload.contact_number,
            line_id: payload.line_id,
            addr_number: payload.addr_number,
            addr_alley: payload.addr_alley,
            addr_street: payload.addr_street,
            addr_subdistrict: payload.addr_subdistrict,
            addr_district: payload.addr_district,
            addr_province: payload.addr_province,
            addr_postcode: payload.addr_postcode,
            payment_terms: payload.payment_terms,
            payment_terms_day: payload.payment_terms_day,
            remark: payload.remark,
            business_type: payload.business_type,
            updated_at: payload.updated_at || new Date(),
            updated_by: userId,
        };
        return yield prisma.master_supplier.update({
            where: {
                company_id: companyId,
                supplier_id: supplier_id
            },
            data: setPayload,
        });
    }),
    delete: (companyId, supplier_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_supplier.delete({
            where: {
                company_id: companyId,
                supplier_id: supplier_id
            },
        });
    }),
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_supplier.findMany({
            where: {
                company_id: companyId,
            },
            orderBy: { created_at: "asc" },
            select: {
                supplier_id: true,
                supplier_code: true,
            }
        });
    }),
    select: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield prisma.master_supplier.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                supplier_code: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            })),
            skip: 0,
            take: 50,
            select: {
                supplier_id: true,
                supplier_code: true
            },
            orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
        return data;
    }),
};
