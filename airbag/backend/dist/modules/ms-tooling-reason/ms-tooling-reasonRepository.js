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
exports.toolingReasonRepository = void 0;
const client_1 = require("@prisma/client");
const keys = [
    "master_tooling_reason_id",
    "tooling_reason_name",
    "created_at",
    "updated_at",
];
const prisma = new client_1.PrismaClient();
exports.toolingReasonRepository = {
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_tooling_reason.findMany({
            where: Object.assign({ company_id: companyId }, (searchText
                ? {
                    OR: [
                        {
                            tooling_reason_name: {
                                contains: searchText,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {})),
            skip,
            take,
            orderBy: { created_at: "asc" },
            select: {
                master_tooling_reason_id: true,
                company_id: true,
                tooling_reason_name: true,
            },
        });
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_tooling_reason.count({
            where: Object.assign({ company_id: companyId }, (searchText
                ? {
                    OR: [
                        {
                            tooling_reason_name: {
                                contains: searchText,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {})),
        });
    }),
    findAllNoPagination: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_tooling_reason.findMany({
            where: { company_id: company_id },
            orderBy: { created_at: "asc" },
        });
    }),
    select: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield prisma.master_tooling_reason.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                tooling_reason_name: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            })),
            skip: 0,
            take: 50,
            select: {
                master_tooling_reason_id: true,
                tooling_reason_name: true
            },
            orderBy: { created_at: "asc" },
        });
        return data;
    }),
    findByName: (companyId_1, tooling_reason_name_1, ...args_1) => __awaiter(void 0, [companyId_1, tooling_reason_name_1, ...args_1], void 0, function* (companyId, tooling_reason_name, selectedKeys = keys) {
        return prisma.master_tooling_reason.findFirst({
            where: { company_id: companyId, tooling_reason_name },
            select: selectedKeys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const tooling_reason_name = payload.tooling_reason_name.trim();
        const setPayload = {
            company_id: companyId,
            tooling_reason_name,
            created_by: userId,
            updated_by: userId,
        };
        return yield prisma.master_tooling_reason.create({
            data: setPayload,
        });
    }),
    findByIdAsync: (companyId, master_tooling_reason_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_tooling_reason.findFirst({
            where: { company_id: companyId, master_tooling_reason_id },
            select: {
                master_tooling_reason_id: true,
                tooling_reason_name: true,
            },
        });
    }),
    update: (companyId, userId, master_tooling_reason_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const setPayload = {
            tooling_reason_name: payload.tooling_reason_name.trim(),
            updated_by: userId,
        };
        return yield prisma.master_tooling_reason.update({
            where: { company_id: companyId, master_tooling_reason_id },
            data: setPayload,
        });
    }),
    delete: (companyId, master_tooling_reason_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_tooling_reason.deleteMany({
            where: { company_id: companyId, master_tooling_reason_id },
        });
    }),
    findById: (companyId, master_tooling_reason_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_tooling_reason.findFirst({
            where: {
                company_id: companyId,
                master_tooling_reason_id: master_tooling_reason_id,
            },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    findMinimal: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_tooling_reason.findMany({
            where: { company_id: companyId },
            select: {
                master_tooling_reason_id: true,
                tooling_reason_name: true,
            },
        });
    }),
    checkToolingReasonInRepairReceipt: (companyId, master_tooling_reason_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_repair_receipt.findFirst({
            where: {
                company_id: companyId,
                OR: [
                    { for_tool_one_id: master_tooling_reason_id },
                    { for_tool_two_id: master_tooling_reason_id },
                    { for_tool_three_id: master_tooling_reason_id }
                ]
            }
        });
    }),
};
