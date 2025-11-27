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
exports.companiesRepository = void 0;
const client_1 = require("@prisma/client");
const keys = [
    "company_id",
    "company_name",
    //"company_address",
    "company_main",
    "company_code",
    "tax_status",
    "tel_number",
    "company_tin",
    "addr_number",
    "addr_alley",
    "addr_street",
    "addr_subdistrict",
    "addr_district",
    "addr_province",
    "addr_postcode",
    "promtpay_id",
];
const prisma = new client_1.PrismaClient();
exports.companiesRepository = {
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.companies.findMany({
            where: searchText
                ? {
                    OR: [
                        {
                            company_name: {
                                contains: searchText,
                                mode: "insensitive",
                            },
                        },
                        {
                            company_code: {
                                contains: searchText,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {}, // ถ้าไม่มี searchText ก็ไม่ต้องใช้เงื่อนไขพิเศษ
            skip,
            take,
            orderBy: { created_at: "asc" },
        });
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.companies.count({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    {
                        company_name: {
                            contains: searchText,
                            mode: "insensitive",
                        },
                    },
                    {
                        company_code: {
                            contains: searchText,
                            mode: "insensitive",
                        },
                    },
                ],
            })),
        });
    }),
    findByName: (companyId, company_name) => __awaiter(void 0, void 0, void 0, function* () {
        if (!companyId) {
            throw new Error("Company ID is required");
        }
        return prisma.companies.findFirst({
            where: { company_id: companyId, company_name: company_name },
        });
    }),
    findById: (conpanyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.companies.findUnique({
            where: { company_id: conpanyId },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    findByIdCompany: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.companies.findUnique({
            where: { company_id: id },
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const setPayload = {
                company_name: payload.company_name.trim(),
                company_code: payload.company_code,
                tax_status: payload.tax_status,
                tel_number: payload.tel_number,
                created_by: userId, // ใช้ userId จาก token
                updated_by: userId, // ใช้ userId จาก token
                company_tin: payload.company_tin,
                addr_number: payload.addr_number,
                addr_alley: payload.addr_alley,
                addr_street: payload.addr_street,
                addr_subdistrict: payload.addr_subdistrict,
                addr_district: payload.addr_district,
                addr_province: payload.addr_province,
                addr_postcode: payload.addr_postcode,
                promtpay_id: payload.promtpay_id
            };
            return yield prisma.companies.create({
                data: setPayload,
            });
        }
        catch (error) {
            console.error(`Error creating company: ${error}`);
            throw error;
        }
    }),
    update: (company_id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const setPayload = {
            company_name: payload.company_name,
            company_code: payload.company_code,
            tax_status: payload.tax_status,
            tel_number: payload.tel_number,
            updated_at: new Date(),
            updated_by: userId, // ใช้ userId จาก token
            company_tin: payload.company_tin,
            addr_number: payload.addr_number,
            addr_alley: payload.addr_alley,
            addr_street: payload.addr_street,
            addr_subdistrict: payload.addr_subdistrict,
            addr_district: payload.addr_district,
            addr_province: payload.addr_province,
            addr_postcode: payload.addr_postcode,
            promtpay_id: payload.promtpay_id
        };
        return yield prisma.companies.update({
            where: { company_id: company_id },
            data: setPayload,
        });
    }),
    delete: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.companies.delete({
            where: { company_id: company_id },
        });
    }),
};
