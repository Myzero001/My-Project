"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParamQuotationRepairSchema = exports.UpdateQuotationRepairSchema = exports.CreateQuotationRepairSchema = void 0;
const zod_1 = require("zod");
exports.CreateQuotationRepairSchema = zod_1.z.object({
    body: zod_1.z.object({
        quotation_id: zod_1.z.string(),
        master_repair_id: zod_1.z.string(),
        price: zod_1.z.number().min(0),
    }),
});
exports.UpdateQuotationRepairSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        quotation_id: zod_1.z.string(),
        master_repair_id: zod_1.z.string(),
        price: zod_1.z.number().min(0),
    }),
});
// export const UpdateQuotationRepairStatusSchema = z.object({
//   body: z.object({
//     id: z.string(),
//     status: z.string(),
//   }),
// });
// export const UpdateQuotationRepairsendingSchema = z.object({
//   body: z.object({
//     id: z.string(),
//     sending_status: z.string(),
//   }),
// });
// export const UpdateQuotationRepairBarcodeSchema = z.object({
//   body: z.object({
//     id: z.string(),
//     barcode: z.string(),
//   }),
// });
exports.GetParamQuotationRepairSchema = zod_1.z.object({
    params: zod_1.z.object({
        quotation_doc: zod_1.z
            .string()
            .max(14, "Quotation Doc should not exceed 14 characters"),
    }),
});
