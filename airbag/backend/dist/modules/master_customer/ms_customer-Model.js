"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.UpdateCustomerSchema = exports.CreateCustomerSchema = exports.GetCustomerSchema_id = exports.GetCustomerSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
exports.GetCustomerSchema = zod_1.z.object({
    params: zod_1.z.object({
        customer_code: zod_1.z.string().max(50),
    }),
});
exports.GetCustomerSchema_id = zod_1.z.object({
    params: zod_1.z.object({
        customer_id: zod_1.z.string().uuid(),
    }),
});
exports.CreateCustomerSchema = zod_1.z.object({
    body: zod_1.z.object({
        customer_code: zod_1.z
            .string()
            .max(50, "Customer code must not exceed 50 characters")
            .optional(), // รหัสลูกค้า (จำเป็น)
        customer_prefix: zod_1.z.string().max(20).optional(), // คำนำหน้า (ถ้ามี)
        customer_name: zod_1.z
            .string()
            .max(255, "Customer name must not exceed 255 characters")
            .optional(),
        contact_name: zod_1.z.string().max(50).optional(), // ชื่อผู้ติดต่อ (ถ้ามี)
        customer_position: zod_1.z.string().max(50).optional(), // ตําแหน่ง (ถ้ามี)
        contact_number: zod_1.z
            .string()
            .refine((value) => commonValidation_1.commonValidations.isPhoneNumber(value), {
            message: "Invalid phone number format",
        })
            .optional(), // เบอร์ติดต่อ (ถ้ามี)
        line_id: zod_1.z.string().max(20).optional(), // ไลน์ไอดี (ถ้ามี)
        addr_number: zod_1.z.string().max(10).optional(), // บ้านเลขที่ (ถ้ามี)
        addr_alley: zod_1.z.string().max(50).optional(), // ซอย (ถ้ามี)
        image_url: zod_1.z.array(zod_1.z.any()).optional().default([]),
        addr_street: zod_1.z.string().max(100).optional(), // ถนน (ถ้ามี)
        addr_subdistrict: zod_1.z.string().max(50).optional(), // ตำบล (ถ้ามี)
        addr_district: zod_1.z.string().max(50).optional(), // อำเภอ (ถ้ามี)
        addr_province: zod_1.z.string().max(50).optional(), // จังหวัด (ถ้ามี)
        addr_postcode: zod_1.z.string().max(5).optional(), // รหัสไปรษณีย์ (ถ้ามี)
        payment_terms: zod_1.z.string().max(10).optional(), // ระยะเวลาการชำระ (ถ้ามี)
        payment_terms_day: zod_1.z.number().optional(), // จำนวนวันชำระ (ถ้ามี)
        tax: zod_1.z.number().optional(), // ภาษี (ถ้ามี)
        comment_customer: zod_1.z.string().max(255).optional(), // ความคิดเห็นจากลูกค้า (ถ้ามี)
        comment_sale: zod_1.z.string().max(255).optional(), // ความคิดเห็นจากตัวแทน (ถ้ามี)
        competitor: zod_1.z.string().max(255).optional(), // คู่แข่ง (ถ้ามี)
        created_by: zod_1.z
            .string()
            .max(50, "Created by must not exceed 50 characters")
            .optional(),
        updated_by: zod_1.z
            .string()
            .max(50, "Updated by must not exceed 50 characters")
            .optional(),
        created_at: zod_1.z.date().optional().default(new Date()), // กำหนดวันที่สร้างเป็นปัจจุบัน
        updated_at: zod_1.z.date().optional().default(new Date()), // กำหนดวันที่อัปเดตเป็นปัจจุบัน
        deleted_at: zod_1.z.date().nullable().optional(), // วันที่ลบ (สามารถเป็น null หรือ undefined)
        deleted_by: zod_1.z.string().max(50).nullable().optional(), // ผู้ที่ลบ (สามารถเป็น null หรือ undefined)
        customer_tin: zod_1.z.string().max(13).optional(),
    }),
});
exports.UpdateCustomerSchema = zod_1.z.object({
    params: zod_1.z.object({
        customer_id: commonValidation_1.commonValidations.uuid,
    }),
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
