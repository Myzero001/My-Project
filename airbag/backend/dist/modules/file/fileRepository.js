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
exports.fileRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.fileRepository = {
    // ดึงข้อมูลทั้งหมดพร้อม pagination
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.file.findMany({
            orderBy: { created_at: "desc" }, // เรียงตามวันที่สร้างล่าสุด
        });
    }),
    getFilesByUrl: (file_url) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.file.findMany({
            where: {
                file_url,
            },
        });
    }),
    // นับจำนวนข้อมูลทั้งหมด
    count: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.file.count();
    }),
    create: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.file.create({
            data: {
                file_name: payload.file_name,
                file_type: payload.file_type,
                file_size: payload.file_size,
                file_url: payload.file_url,
            },
        });
    }),
    // อัปเดตข้อมูล
    update: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.file.update({
            where: { id },
            data: {
                file_name: payload.file_name,
                file_type: payload.file_type,
                file_size: payload.file_size,
                file_url: payload.file_url,
            },
        });
    }),
    // ลบข้อมูล
    delete: (file_url) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.file.delete({
            where: { file_url },
        });
    }),
};
