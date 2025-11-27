"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.GetParamMasterSupplierSchema = exports.CreateMasterSupplierSchema = exports.UpdateMasterSupplierSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
const BaseSupplierSchema = zod_1.z.object({
    supplier_code: zod_1.z.string().max(50, { message: "รหัสผู้จัดหาสินค้าต้องไม่เกิน 50 ตัวอักษร" }),
    supplier_name: zod_1.z.string().max(255).default("ยังไม่ได้ระบุ"),
    contact_name: zod_1.z.string().max(50).optional(),
    contact_number: zod_1.z.string().regex(/^\d+$/).max(15, { message: "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น และไม่เกิน 15 ตัว" }).optional(),
    line_id: zod_1.z.string().max(20).optional(),
    addr_number: zod_1.z.string().max(10).optional(),
    addr_alley: zod_1.z.string().max(50).optional(),
    addr_street: zod_1.z.string().max(100).optional(),
    addr_subdistrict: zod_1.z.string().max(50).optional(),
    addr_district: zod_1.z.string().max(50).optional(),
    addr_province: zod_1.z.string().max(50).optional(),
    addr_postcode: zod_1.z.string().max(5).optional(),
    payment_terms: zod_1.z.string().max(10).optional(),
    payment_terms_day: zod_1.z.number().int().nullable().optional(),
    remark: zod_1.z.string().max(255).optional(),
    business_type: zod_1.z.string().max(50).optional(),
    created_at: zod_1.z.date().default(() => new Date()),
    updated_at: zod_1.z.date().optional(),
});
exports.UpdateMasterSupplierSchema = zod_1.z.object({
    body: BaseSupplierSchema.extend({
        supplier_id: commonValidation_1.commonValidations.uuid,
    }),
});
exports.CreateMasterSupplierSchema = zod_1.z.object({
    body: BaseSupplierSchema,
});
exports.GetParamMasterSupplierSchema = zod_1.z.object({
    params: zod_1.z.object({
        supplier_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
