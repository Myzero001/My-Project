"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParamVisitCustomerSchema = exports.UpdateMasterVisitCustomerSchema = exports.CreateMasterVisitCustomerSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
const BaseSupplierSchema = zod_1.z.object({
    // customer_visit_id: commonValidations.uuid,
    customer_visit_doc: zod_1.z.string().max(14).optional(),
    customer_id: commonValidation_1.commonValidations.uuid.optional(),
    customer_code: zod_1.z.string().max(50).optional(),
    customer_name: zod_1.z.string().max(50).optional(),
    contact_name: zod_1.z.string().max(50).optional(),
    contact_number: zod_1.z.string().max(15).optional(),
    line_id: zod_1.z.string().max(20).optional(),
    addr_map: zod_1.z.string().max(255).optional(),
    addr_number: zod_1.z.string().max(10).optional(),
    addr_alley: zod_1.z.string().max(50).optional(),
    addr_street: zod_1.z.string().max(100).optional(),
    addr_subdistrict: zod_1.z.string().max(50).optional(),
    addr_district: zod_1.z.string().max(50).optional(),
    addr_province: zod_1.z.string().max(50).optional(),
    addr_postcode: zod_1.z.string().max(5).optional(),
    // date_go:  z.date().optional(),
    date_go: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    topic: zod_1.z.string().max(255).optional(),
    next_topic: zod_1.z.string().max(255).optional(),
    // next_date: z.date().optional(),
    next_date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    rating: zod_1.z.number().optional(),
    created_at: zod_1.z.date().optional(),
    created_by: zod_1.z.string().max(20).optional(),
    updated_at: zod_1.z.date().optional(),
    updated_by: zod_1.z.string().max(20).optional()
});
exports.CreateMasterVisitCustomerSchema = zod_1.z.object({
    body: BaseSupplierSchema
});
exports.UpdateMasterVisitCustomerSchema = zod_1.z.object({
    body: BaseSupplierSchema.extend({
        customer_visit_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamVisitCustomerSchema = zod_1.z.object({
    params: zod_1.z.object({
        customer_visit_id: zod_1.z.string().max(50),
    })
});
