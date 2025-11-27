"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParamQuotationSchema = exports.UpdateQuotationSchema = exports.CreateQuotationLogStatusSchema = void 0;
const zod_1 = require("zod");
exports.CreateQuotationLogStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        quotation_id: zod_1.z.string(),
        quotation_status: zod_1.z.string(),
        remark: zod_1.z.string().optional(),
    }),
});
exports.UpdateQuotationSchema = zod_1.z.object({
    body: zod_1.z.object({
        quotation_id: zod_1.z.string(),
        quotation_status: zod_1.z.string(),
        remark: zod_1.z.string().optional(),
    }),
});
exports.GetParamQuotationSchema = zod_1.z.object({
    params: zod_1.z.object({
        quotation_doc: zod_1.z
            .string()
            .max(14, "Quotation Doc should not exceed 14 characters"),
    }),
});
