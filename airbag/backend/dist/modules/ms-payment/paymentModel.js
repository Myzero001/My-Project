"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentSchema = exports.UpdatePaymentStatusSchema = exports.UpdatePaymentSchema = exports.CreatePaymentSchema = exports.GetPaymentByDeliveryScheduleIdSchema = exports.TYPE_MONEY = exports.OPTION_PAYMENT = exports.PAYMENT_STATUS = void 0;
const zod_1 = require("zod");
var PAYMENT_STATUS;
(function (PAYMENT_STATUS) {
    PAYMENT_STATUS["OVERDUE"] = "overdue";
    PAYMENT_STATUS["PARTIAL_PAYMENT"] = "partial-payment";
    PAYMENT_STATUS["SUCCESS"] = "success";
})(PAYMENT_STATUS || (exports.PAYMENT_STATUS = PAYMENT_STATUS = {}));
var OPTION_PAYMENT;
(function (OPTION_PAYMENT) {
    OPTION_PAYMENT["FULL_PAYMENT"] = "full-payment";
    OPTION_PAYMENT["PARTIAL_PAYMENT"] = "partial-payment";
    OPTION_PAYMENT["NOT_YET_PAID"] = "not-yet-paid";
})(OPTION_PAYMENT || (exports.OPTION_PAYMENT = OPTION_PAYMENT = {}));
var TYPE_MONEY;
(function (TYPE_MONEY) {
    TYPE_MONEY["CASH"] = "cash";
    TYPE_MONEY["TRANSFER_MONEY"] = "transfer-money";
    TYPE_MONEY["CHECK"] = "check";
})(TYPE_MONEY || (exports.TYPE_MONEY = TYPE_MONEY = {}));
exports.GetPaymentByDeliveryScheduleIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
exports.CreatePaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        delivery_schedule_id: zod_1.z.string(),
        option_payment: zod_1.z.string(),
        type_money: zod_1.z.string(),
        price: zod_1.z.number(),
        tax: zod_1.z.number(),
        tax_rate: zod_1.z.number(),
        tax_status: zod_1.z.boolean(),
        total_price: zod_1.z.number(),
        payment_image_url: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
        remark: zod_1.z.string().optional(),
        check_number: zod_1.z.string().optional(),
        check_date: zod_1.z.string().optional(),
        bank_name: zod_1.z.string().optional(),
    }),
});
// Schema สำหรับการอัปเดต Payment
exports.UpdatePaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        option_payment: zod_1.z.string().optional(),
        type_money: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        tax: zod_1.z.number().optional(),
        tax_rate: zod_1.z.number().optional(),
        tax_status: zod_1.z.boolean().optional(),
        total_price: zod_1.z.number().optional(),
        payment_image_url: zod_1.z.string().optional(),
        remark: zod_1.z.string().optional(),
        check_number: zod_1.z.string().optional(),
        check_date: zod_1.z.string().optional(),
        bank_name: zod_1.z.string().optional(),
    }),
});
exports.UpdatePaymentStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
exports.deletePaymentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
