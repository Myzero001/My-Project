"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParamRepairReceiptListRepairSchema = exports.DeleteRepairReceiptListRepairBarcodeSchema = exports.UpdateRepairReceiptListRepairStatusIsActiveSchema = exports.UpdateRepairReceiptListRepairBarcodeSchema = exports.UpdateRepairReceiptListRepairsendingSchema = exports.UpdateRepairReceiptListRepairStatusSchema = exports.UpdateRepairReceiptListRepairSchema = exports.CreateRepairReceiptListRepairSchema = exports.REPAIR_RECEIPT_LIST_REPAIR_STATUS = void 0;
const zod_1 = require("zod");
var REPAIR_RECEIPT_LIST_REPAIR_STATUS;
(function (REPAIR_RECEIPT_LIST_REPAIR_STATUS) {
    REPAIR_RECEIPT_LIST_REPAIR_STATUS["PENDING"] = "pending";
    REPAIR_RECEIPT_LIST_REPAIR_STATUS["SUCCESS"] = "success";
})(REPAIR_RECEIPT_LIST_REPAIR_STATUS || (exports.REPAIR_RECEIPT_LIST_REPAIR_STATUS = REPAIR_RECEIPT_LIST_REPAIR_STATUS = {}));
exports.CreateRepairReceiptListRepairSchema = zod_1.z.object({
    body: zod_1.z.object({
        quotation_id: zod_1.z.string(),
        master_repair_id: zod_1.z.string(),
        master_repair_receipt_id: zod_1.z.string(),
        price: zod_1.z.number().min(0),
        status: zod_1.z.string(),
    }),
});
exports.UpdateRepairReceiptListRepairSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        quotation_id: zod_1.z.string(),
        master_repair_id: zod_1.z.string(),
        master_repair_receipt_id: zod_1.z.string(),
        price: zod_1.z.number().min(0),
    }),
});
exports.UpdateRepairReceiptListRepairStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        status: zod_1.z.string(),
    }),
});
exports.UpdateRepairReceiptListRepairsendingSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        sending_status: zod_1.z.string(),
    }),
});
exports.UpdateRepairReceiptListRepairBarcodeSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        barcode: zod_1.z.string(),
    }),
});
exports.UpdateRepairReceiptListRepairStatusIsActiveSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        is_active: zod_1.z.boolean(),
    }),
});
exports.DeleteRepairReceiptListRepairBarcodeSchema = zod_1.z.object({
    body: zod_1.z.object({
        ids: zod_1.z.string(),
    }),
});
exports.GetParamRepairReceiptListRepairSchema = zod_1.z.object({
    params: zod_1.z.object({
        quotation_doc: zod_1.z
            .string()
            .max(14, "Quotation Doc should not exceed 14 characters"),
    }),
});
