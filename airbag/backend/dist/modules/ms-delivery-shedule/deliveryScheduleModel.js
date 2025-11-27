"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowCalendarScheduleSchema = exports.SelectSchema = exports.deleteDeliveryScheduleSchema = exports.UpdateDeliveryScheduleStatusSchema = exports.UpdateDeliveryScheduleSchema = exports.CreateDeliveryScheduleSchema = exports.DELIVERY_SCHEDULE_STATUS = void 0;
const zod_1 = require("zod");
var DELIVERY_SCHEDULE_STATUS;
(function (DELIVERY_SCHEDULE_STATUS) {
    DELIVERY_SCHEDULE_STATUS["PENDING"] = "pending";
    DELIVERY_SCHEDULE_STATUS["SUCCESS"] = "success";
})(DELIVERY_SCHEDULE_STATUS || (exports.DELIVERY_SCHEDULE_STATUS = DELIVERY_SCHEDULE_STATUS = {}));
exports.CreateDeliveryScheduleSchema = zod_1.z.object({
    body: zod_1.z.object({
        repair_receipt_id: zod_1.z.string(),
    }),
});
// Schema สำหรับการอัปเดต DeliverySchedule
exports.UpdateDeliveryScheduleSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        delivery_location: zod_1.z.string().optional(),
        delivery_schedule_image_url: zod_1.z.string().optional(),
        remark: zod_1.z.string().optional(),
    }),
});
exports.UpdateDeliveryScheduleStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
exports.deleteDeliveryScheduleSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
exports.ShowCalendarScheduleSchema = zod_1.z.object({
    body: zod_1.z.object({
        startDate: zod_1.z.string().min(1).max(20),
        endDate: zod_1.z.string().min(1).max(20),
    })
});
