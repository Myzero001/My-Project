"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRegisterSchema = void 0;
const zod_1 = require("zod");
exports.searchRegisterSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().optional(),
        pageSize: zod_1.z.coerce.number().int().positive().optional(),
        search: zod_1.z.string().optional()
    })
});
