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
exports.ms_positionRepository = void 0;
const client_1 = require("@prisma/client");
const Positionkeys = ["position_id", "position_name", "created_at", "updated_at"];
const prisma = new client_1.PrismaClient();
exports.ms_positionRepository = {
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_position.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                position_name: {
                    contains: searchText,
                    mode: "insensitive",
                },
            })),
            skip,
            take,
            orderBy: { created_at: "asc" },
            select: {
                position_id: true,
                position_name: true
            }
        });
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_position.count({
            where: Object.assign({ company_id: companyId }, (searchText && {
                position_name: {
                    contains: searchText,
                    mode: "insensitive",
                },
            })),
        });
    }),
    findByName: (companyId, position_name) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_position.findFirst({
            where: {
                company_id: companyId,
                position_name: position_name
            },
            select: Positionkeys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const position_name = payload.position_name.trim();
        const setPayload = {
            company_id: companyId,
            created_by: userId,
            updated_by: userId,
            position_name,
            created_at: new Date(),
        };
        return yield prisma.master_position.create({
            data: setPayload,
            select: {
                position_id: true,
                position_name: true,
            },
        });
    }),
    findByIdAsync: (companyId, position_id) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.master_position.findFirst({
            where: {
                company_id: companyId,
                position_id: position_id
            },
            select: {
                position_id: true,
                position_name: true
            }
        });
    }),
    update: (companyId, userId, position_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const setPayload = {
            position_name: payload.position_name.trim(),
            updated_by: userId,
        };
        return yield prisma.master_position.update({
            where: {
                company_id: companyId,
                position_id
            },
            data: setPayload,
            select: {
                position_id: true,
                position_name: true,
            },
        });
    }),
    delete: (companyId, position_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_position.delete({
            where: {
                company_id: companyId,
                position_id
            },
        });
    }),
    select: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield prisma.master_position.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                position_name: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            })),
            skip: 0,
            take: 50,
            select: {
                position_id: true,
                position_name: true
            },
            orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
        return data;
    }),
};
