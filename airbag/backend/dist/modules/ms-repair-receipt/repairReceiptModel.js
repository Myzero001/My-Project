"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.deleteRepairReceiptSchema = exports.UpdateStatusRepairReceiptSchema = exports.UpdateRepairReceiptSchema = exports.CreateRepairReceiptSchema = exports.REPAIR_RECEIPT_STATUS = void 0;
const zod_1 = require("zod");
var REPAIR_RECEIPT_STATUS;
(function (REPAIR_RECEIPT_STATUS) {
    REPAIR_RECEIPT_STATUS["PENDING"] = "pending";
    REPAIR_RECEIPT_STATUS["SUCCESS"] = "success";
    REPAIR_RECEIPT_STATUS["CANCEL"] = "cancel";
})(REPAIR_RECEIPT_STATUS || (exports.REPAIR_RECEIPT_STATUS = REPAIR_RECEIPT_STATUS = {}));
exports.CreateRepairReceiptSchema = zod_1.z.object({
    body: zod_1.z.object({
        repair_receipt_status: zod_1.z.string().optional(),
        register: zod_1.z.string().optional(),
        box_number: zod_1.z.string().optional(),
        box_number_detail: zod_1.z.string().optional(),
        repair_receipt_image_url: zod_1.z.string().optional(),
        box_before_file_url: zod_1.z.string().optional(),
        box_after_file_url: zod_1.z.string().optional(),
        chip_type: zod_1.z.string().optional(),
        chip_no: zod_1.z.string().optional(),
        quotation_id: zod_1.z.string(),
        tool_id: zod_1.z.string().optional(),
        issue_reason_id: zod_1.z.string().optional(),
        remark: zod_1.z.string().optional(),
        box_remark: zod_1.z.string().optional(),
        total_price: zod_1.z.string().optional(),
    }),
});
// Schema สำหรับการอัปเดต RepairReceipt
exports.UpdateRepairReceiptSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        repair_receipt_status: zod_1.z.string().optional(),
        register: zod_1.z.string().optional(),
        box_number: zod_1.z.string().optional(),
        box_number_detail: zod_1.z.string().optional(),
        repair_receipt_image_url: zod_1.z.string().optional(),
        box_before_file_url: zod_1.z.string().optional(),
        box_after_file_url: zod_1.z.string().optional(),
        chip_type: zod_1.z.string().optional(),
        chip_no: zod_1.z.string().optional(),
        tool_one_id: zod_1.z.string().optional(),
        tool_two_id: zod_1.z.string().optional(),
        tool_three_id: zod_1.z.string().optional(),
        for_tool_one_id: zod_1.z.string().optional(),
        for_tool_two_id: zod_1.z.string().optional(),
        for_tool_three_id: zod_1.z.string().optional(),
        clear_by_tool_one_id: zod_1.z.string().optional(),
        clear_by_tool_two_id: zod_1.z.string().optional(),
        clear_by_tool_three_id: zod_1.z.string().optional(),
        issue_reason_id: zod_1.z.string().optional(),
        remark: zod_1.z.string().optional(),
        box_remark: zod_1.z.string().optional(),
        total_price: zod_1.z.number().optional(),
        tax: zod_1.z.number().optional(),
    }),
});
exports.UpdateStatusRepairReceiptSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
exports.deleteRepairReceiptSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
