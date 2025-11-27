"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRepairReceiptListRepairLogStatusSchema = void 0;
const zod_1 = require("zod");
exports.CreateRepairReceiptListRepairLogStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        repair_receipt_list_repair_id: zod_1.z.string(),
        list_repair_status: zod_1.z.string(),
    }),
});
