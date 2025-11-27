"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.GetParamSupplierRepairReceiptSchema = exports.UpdateSupplierRepairReceiptSchema = exports.CreateSupplierRepairReceiptSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
const BaseSupplierRepairReceiptSchema = zod_1.z.object({
    receipt_doc: zod_1.z.string().optional(),
    repair_date_supplier_repair_receipt: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    supplier_delivery_note_id: commonValidation_1.commonValidations.uuid.optional(),
    supplier_id: commonValidation_1.commonValidations.uuid.optional(),
    master_repair_receipt_id: commonValidation_1.commonValidations.uuid.optional(),
    supplier_delivery_note_repair_receipt_list_id: commonValidation_1.commonValidations.uuid.optional(),
    master_repair_id: commonValidation_1.commonValidations.uuid.optional(),
    repair_receipt_list_repair_id: commonValidation_1.commonValidations.uuid.optional(),
    status: zod_1.z.string().optional(),
    remark: zod_1.z.string().max(255).optional(),
});
exports.CreateSupplierRepairReceiptSchema = zod_1.z.object({
    body: BaseSupplierRepairReceiptSchema
});
exports.UpdateSupplierRepairReceiptSchema = zod_1.z.object({
    body: BaseSupplierRepairReceiptSchema.extend({
        id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamSupplierRepairReceiptSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: commonValidation_1.commonValidations.uuid,
    })
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
