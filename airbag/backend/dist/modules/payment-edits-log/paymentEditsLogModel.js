"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePayloadPaymentEditsLogSchema = void 0;
const zod_1 = require("zod");
exports.CreatePayloadPaymentEditsLogSchema = zod_1.z.object({
    body: zod_1.z.object({
        payment_edit_id: zod_1.z.string(),
        payment_id: zod_1.z.string(),
        old_data: zod_1.z.string(),
        new_data: zod_1.z.string(),
        edit_status: zod_1.z.string().optional(),
        remark: zod_1.z.string().optional(),
    }),
});
