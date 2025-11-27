"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoleByIdSchema = exports.GetroleSchema = void 0;
const zod_1 = require("zod");
exports.GetroleSchema = zod_1.z.object({
    params: zod_1.z.object({
        role_id: zod_1.z.string().uuid(),
        role_name: zod_1.z.string()
    })
});
exports.GetRoleByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        role_id: zod_1.z.string().uuid(),
    })
});
