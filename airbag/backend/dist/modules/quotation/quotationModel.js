"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowCalendarRemovalSchema = exports.DeleteQuotationSchema = exports.RequestEditQuotationSchema = exports.UpdateStatusQuotationSchema = exports.UpdateQuotationSchema = exports.CreateQuotationSchema = exports.QUOTATION_STATUS = void 0;
const zod_1 = require("zod");
var QUOTATION_STATUS;
(function (QUOTATION_STATUS) {
    QUOTATION_STATUS["PENDING"] = "pending";
    QUOTATION_STATUS["WAITING_FOR_APPROVE"] = "waiting_for_approve";
    QUOTATION_STATUS["APPROVED"] = "approved";
    QUOTATION_STATUS["REJECT_APPROVED"] = "reject_approve";
    QUOTATION_STATUS["CLOSE_DEAL"] = "close_deal";
    QUOTATION_STATUS["CANCEL"] = "cancel";
})(QUOTATION_STATUS || (exports.QUOTATION_STATUS = QUOTATION_STATUS = {}));
// Schema สำหรับการสร้าง Quotation
exports.CreateQuotationSchema = zod_1.z.object({
    body: zod_1.z.object({
        quotation_doc: zod_1.z
            .string()
            .max(14, "Quotation Doc should not exceed 14 characters")
            .optional(),
        quotation_date: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
            .optional(),
        customer_id: zod_1.z.string(),
        addr_map: zod_1.z.string().max(100).optional(),
        addr_number: zod_1.z.string().max(50).optional(),
        addr_alley: zod_1.z.string().max(50).optional(),
        addr_street: zod_1.z.string().max(50).optional(),
        addr_subdistrict: zod_1.z.string().max(50).optional(),
        addr_district: zod_1.z.string().max(50).optional(),
        addr_province: zod_1.z.string().max(50).optional(),
        addr_postcode: zod_1.z.string().max(10).optional(),
        customer_name: zod_1.z.string().max(255).optional(),
        position: zod_1.z.string().max(50).optional(),
        contact_number: zod_1.z.string().max(20).optional(),
        line_id: zod_1.z.string().max(50).optional(),
        image_url: zod_1.z.string().optional(),
        brand_id: zod_1.z.string().optional(),
        model_id: zod_1.z.string().optional(),
        car_year: zod_1.z.string().length(4).optional(),
        car_color_id: zod_1.z.string().max(20).optional(),
        total_price: zod_1.z.number().min(0).optional(),
        tax: zod_1.z.number().int().min(0).optional(),
        deadline_day: zod_1.z.number().optional(),
        appointment_date: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
            .optional(),
        remark: zod_1.z.string().optional(),
        insurance: zod_1.z.boolean().optional(),
        insurance_date: zod_1.z.string().optional(),
        lock: zod_1.z.boolean().optional(),
        quotation_status: zod_1.z.string().optional(),
        approval_date: zod_1.z.string().optional(),
        approval_by: zod_1.z.string().optional(),
        approval_notes: zod_1.z.string().optional(),
        // deal_closed_status: z.boolean().optional(),
        deal_closed_date: zod_1.z.string().optional(),
        deal_closed_by: zod_1.z.string().optional(),
    }),
});
// Schema สำหรับการอัปเดต Quotation
exports.UpdateQuotationSchema = zod_1.z.object({
    body: zod_1.z.object({
        customer_id: zod_1.z.string().optional(),
        addr_map: zod_1.z.string().max(100).optional(),
        addr_number: zod_1.z.string().max(50).optional(),
        addr_alley: zod_1.z.string().max(50).optional(),
        addr_street: zod_1.z.string().max(50).optional(),
        addr_subdistrict: zod_1.z.string().max(50).optional(),
        addr_district: zod_1.z.string().max(50).optional(),
        addr_province: zod_1.z.string().max(50).optional(),
        addr_postcode: zod_1.z.string().max(10).optional(),
        customer_name: zod_1.z.string().max(255).optional(),
        position: zod_1.z.string().max(50).optional(),
        contact_number: zod_1.z.string().max(20).optional(),
        line_id: zod_1.z.string().max(50).optional(),
        image_url: zod_1.z.string().optional(),
        brand_id: zod_1.z.string().optional(),
        model_id: zod_1.z.string().optional(),
        car_year: zod_1.z.string().length(4).optional(),
        car_color_id: zod_1.z.string().optional(),
        total_price: zod_1.z.number().min(0).optional(),
        tax: zod_1.z.number().int().min(0).optional(),
        deadline_day: zod_1.z.number().optional(),
        appointment_date: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
            .optional(),
        remark: zod_1.z.string().optional(),
        insurance: zod_1.z.boolean().optional(),
        insurance_date: zod_1.z.string().optional(),
        repair_summary: zod_1.z.string().optional(),
        lock: zod_1.z.boolean().optional(),
        quotation_status: zod_1.z.string().optional(),
        approval_date: zod_1.z.string().optional(),
        approval_by: zod_1.z.string().optional(),
        approval_notes: zod_1.z.string().optional(),
        // deal_closed_status: z.boolean().optional(),
        deal_closed_date: zod_1.z.string().optional(),
        deal_closed_by: zod_1.z.string().optional(),
        responsible_by: zod_1.z.string().optional(),
    }),
});
exports.UpdateStatusQuotationSchema = zod_1.z.object({
    body: zod_1.z.object({
        quotation_id: zod_1.z.string(),
        repair_summary: zod_1.z.string().optional(),
    }),
});
exports.RequestEditQuotationSchema = zod_1.z.object({
    body: zod_1.z.object({
        quotation_id: zod_1.z.string(),
        remark: zod_1.z.string().optional(),
    }),
});
exports.DeleteQuotationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
exports.ShowCalendarRemovalSchema = zod_1.z.object({
    body: zod_1.z.object({
        startDate: zod_1.z.string().min(1).max(20),
        endDate: zod_1.z.string().min(1).max(20),
    })
});
