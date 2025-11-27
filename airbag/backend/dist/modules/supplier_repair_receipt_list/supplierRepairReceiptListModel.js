"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSupplierRepairReceiptIdSchema = exports.GetParamPayloadListSchema = exports.UpdateFinishStatusSchema = exports.GetParamSupplierRepairReceiptListSchema = exports.UpdateSupplierRepairReceiptListSchema = exports.CreateSupplierRepairReceiptListSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
const BaseSupplierRepairReceiptListSchema = zod_1.z.object({
    supplier_repair_receipt_id: zod_1.z.string().optional(),
    supplier_delivery_note_id: commonValidation_1.commonValidations.uuid,
    repair_receipt_id: commonValidation_1.commonValidations.uuid,
    master_repair_id: commonValidation_1.commonValidations.uuid,
    supplier_delivery_note_repair_receipt_list_id: commonValidation_1.commonValidations.uuid.optional(),
    price: zod_1.z.number().optional(),
    quantity: zod_1.z.number().optional(),
    total_price: zod_1.z.number().optional(),
    status: zod_1.z.string(),
});
exports.CreateSupplierRepairReceiptListSchema = zod_1.z.object({
    body: BaseSupplierRepairReceiptListSchema
});
exports.UpdateSupplierRepairReceiptListSchema = zod_1.z.object({
    body: BaseSupplierRepairReceiptListSchema.extend({
        supplier_delivery_note_repair_receipt_list_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamSupplierRepairReceiptListSchema = zod_1.z.object({
    params: zod_1.z.object({
        supplier_repair_receipt_list_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.UpdateFinishStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        supplier_delivery_note_repair_receipt_list_id: commonValidation_1.commonValidations.uuid,
    }),
    body: zod_1.z.object({
        finish: zod_1.z.boolean(),
        finish_by_receipt_doc: zod_1.z.string(),
        supplier_repair_receipt_id: commonValidation_1.commonValidations.uuid,
    }),
});
exports.GetParamPayloadListSchema = zod_1.z.object({
    params: zod_1.z.object({
        supplier_repair_receipt_id: commonValidation_1.commonValidations.uuid,
        supplier_delivery_note_id: commonValidation_1.commonValidations.uuid
    })
});
exports.UpdateSupplierRepairReceiptIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        supplier_delivery_note_repair_receipt_list_id: commonValidation_1.commonValidations.uuid,
    }),
    body: zod_1.z.object({
        supplier_repair_receipt_id: commonValidation_1.commonValidations.uuid,
    }),
});
