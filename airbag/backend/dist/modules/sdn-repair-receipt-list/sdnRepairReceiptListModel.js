"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitSupplierDeliveryNoteRRListSchema = exports.GetParamSupplierDeliveryNoteRRListSchema = exports.UpdateSupplierDeliveryNoteRRListSchema = exports.CreateSupplierDeliveryNoteRRListSchema = exports.SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
var SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS;
(function (SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS) {
    SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS["PENDING"] = "pending";
    SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS["SUCCESS"] = "success";
    SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS["CLAIM"] = "claim";
})(SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS || (exports.SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS = SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS = {}));
const BaseSupplierSchema = zod_1.z.object({
    // supplier_delivery_note_repair_receipt_list_id: commonValidations.uuid,
    supplier_delivery_note_id: zod_1.z.string().optional(),
    repair_receipt_id: zod_1.z.string().optional(),
    master_repair_id: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
    quantity: zod_1.z.number().optional(),
    total_price: zod_1.z.number().optional(),
    status: zod_1.z.string().optional(),
});
exports.CreateSupplierDeliveryNoteRRListSchema = zod_1.z.object({
    body: BaseSupplierSchema
});
exports.UpdateSupplierDeliveryNoteRRListSchema = zod_1.z.object({
    body: BaseSupplierSchema.extend({
        supplier_delivery_note_repair_receipt_list_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamSupplierDeliveryNoteRRListSchema = zod_1.z.object({
    params: zod_1.z.object({
        supplier_delivery_note_repair_receipt_list_id: zod_1.z.string().max(50),
    })
});
exports.SubmitSupplierDeliveryNoteRRListSchema = zod_1.z.object({
    body: zod_1.z.object({
        supplier_delivery_note_id: zod_1.z.string(),
        repair_receipt_id: zod_1.z.string(),
        repairList: zod_1.z.array(zod_1.z.object({
            status: zod_1.z.boolean(),
            id_repair_list: zod_1.z.string(),
            price: zod_1.z.number().min(0), // ตรวจสอบว่า price เป็นตัวเลขและไม่ต่ำกว่า 0
            qty: zod_1.z.number().min(0), // ตรวจสอบว่า qty เป็นตัวเลขและไม่ต่ำกว่า 0
            total: zod_1.z.number().min(0), // ตรวจสอบว่า total เป็นตัวเลขและไม่ต่ำกว่า 0
        })),
    })
});
