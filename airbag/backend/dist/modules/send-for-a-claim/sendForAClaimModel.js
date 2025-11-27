"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.GetParamSupplierRepairReceiptSchema = exports.GetParamSendForAClaimSchema = exports.UpdateSendForAClaimSchema = exports.CreateSendForAClaimSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
const BaseSendForAClaimSchema = zod_1.z.object({
    send_for_a_claim_doc: zod_1.z.string().max(14).optional(),
    claim_date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    due_date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    supplier_id: zod_1.z.string().optional(),
    addr_number: zod_1.z.string().max(50).optional(),
    addr_alley: zod_1.z.string().max(10).optional(),
    addr_street: zod_1.z.string().max(50).optional(),
    addr_subdistrict: zod_1.z.string().max(50).optional(),
    addr_district: zod_1.z.string().max(50).optional(),
    addr_province: zod_1.z.string().max(50).optional(),
    addr_postcode: zod_1.z.string().max(5).optional(),
    contact_name: zod_1.z.string().max(50).optional(),
    contact_number: zod_1.z.string().max(15).optional(),
    remark: zod_1.z.string().max(255).optional(),
});
exports.CreateSendForAClaimSchema = zod_1.z.object({
    body: BaseSendForAClaimSchema.extend({
        supplier_repair_receipt_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.UpdateSendForAClaimSchema = zod_1.z.object({
    body: BaseSendForAClaimSchema.extend({
        send_for_a_claim_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamSendForAClaimSchema = zod_1.z.object({
    params: zod_1.z.object({
        send_for_a_claim_id: zod_1.z.string().max(50),
    })
});
exports.GetParamSupplierRepairReceiptSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().max(50),
    })
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
