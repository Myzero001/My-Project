"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.GetParamSupplierDeliveryNoteSchema = exports.UpdateSupplierDeliveryNoteSchema = exports.CreateSupplierDeliveryNoteSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
const BaseSupplierSchema = zod_1.z.object({
    // supplier_delivery_note_id: commonValidations.uuid,
    supplier_delivery_note_doc: zod_1.z.string().max(14).optional(),
    date_of_submission: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    due_date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    amount: zod_1.z.number().optional(),
    status: zod_1.z.string().optional(),
    addr_number: zod_1.z.string().max(50).optional(),
    addr_alley: zod_1.z.string().max(50).optional(),
    addr_street: zod_1.z.string().max(50).optional(),
    addr_subdistrict: zod_1.z.string().max(50).optional(),
    addr_district: zod_1.z.string().max(50).optional(),
    addr_province: zod_1.z.string().max(50).optional(),
    addr_postcode: zod_1.z.string().max(5).optional(),
    contact_name: zod_1.z.string().max(50).optional(),
    contact_number: zod_1.z.string().max(15).optional(),
    payment_terms: zod_1.z.string().max(20).optional(),
    payment_terms_day: zod_1.z.number().optional(),
    remark: zod_1.z.string().max(255).optional(),
    created_at: zod_1.z.date().optional(),
    created_by: zod_1.z.string().max(20).optional(),
    updated_at: zod_1.z.date().optional(),
    updated_by: zod_1.z.string().max(20).optional(),
    supplier_id: zod_1.z.string().optional(),
    company_id: zod_1.z.string().optional(),
});
exports.CreateSupplierDeliveryNoteSchema = zod_1.z.object({
    body: BaseSupplierSchema
});
exports.UpdateSupplierDeliveryNoteSchema = zod_1.z.object({
    body: BaseSupplierSchema.extend({
        supplier_delivery_note_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamSupplierDeliveryNoteSchema = zod_1.z.object({
    params: zod_1.z.object({
        supplier_delivery_note_id: zod_1.z.string().max(50),
    })
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
