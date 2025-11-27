"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileSchema = exports.CreateFileSchema = void 0;
const zod_1 = require("zod");
exports.CreateFileSchema = zod_1.z.object({
    body: zod_1.z.object({
        file_url: zod_1.z.string().min(1, { message: "File URL must be a valid URL" }),
        file_name: zod_1.z.string().min(1, { message: "File name is required" }),
        file_type: zod_1.z.string().min(1, { message: "File name is required" }),
        file_size: zod_1.z.number(),
    }),
});
exports.deleteFileSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().optional(),
        file_url: zod_1.z.string().min(1, { message: "File URL must be a valid URL" }),
        file_name: zod_1.z.string().optional(),
        file_type: zod_1.z.string().optional(),
        file_size: zod_1.z.number().optional(),
    }),
});
