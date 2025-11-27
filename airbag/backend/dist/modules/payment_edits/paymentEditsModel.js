"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentStatusSchema = exports.UpdatePaymentEditsSchema = exports.CreatePaymentEditsSchema = exports.GetPaymentEditsByIdSchema = exports.PAYMENT_EDITS_STATUS = void 0;
const zod_1 = require("zod");
var PAYMENT_EDITS_STATUS;
(function (PAYMENT_EDITS_STATUS) {
    PAYMENT_EDITS_STATUS["PENDING"] = "pending";
    PAYMENT_EDITS_STATUS["APPROVED"] = "approved";
    PAYMENT_EDITS_STATUS["REJECTED"] = "rejected";
    PAYMENT_EDITS_STATUS["CANCELED"] = "canceled";
})(PAYMENT_EDITS_STATUS || (exports.PAYMENT_EDITS_STATUS = PAYMENT_EDITS_STATUS = {}));
exports.GetPaymentEditsByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
exports.CreatePaymentEditsSchema = zod_1.z.object({
    body: zod_1.z.object({
        payment_id: zod_1.z.string(),
        old_data: zod_1.z.string(),
        new_data: zod_1.z.string(),
        remark: zod_1.z.string(),
    }),
});
exports.UpdatePaymentEditsSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        old_data: zod_1.z.string().optional(),
        new_data: zod_1.z.string().optional(),
        remark: zod_1.z.string().optional(),
        edit_status: zod_1.z.string().optional(),
    }),
});
exports.UpdatePaymentStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        remark: zod_1.z.string(),
    }),
});
