import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadMasterCustomer = {
  customer_id: string;
  customer_code: string; // ฟิลด์ที่จำเป็นต้องมี
  customer_prefix?: string; // ฟิลด์ที่อาจไม่มี
  customer_name?: string;
  contact_name?: string;
  customer_position?: string;
  contact_number?: string;
  line_id?: string;
  image_url?: string;
  addr_number?: string;
  addr_alley?: string;
  addr_street?: string;
  addr_subdistrict?: string;
  addr_district?: string;
  addr_province?: string;
  addr_postcode?: string;
  payment_terms?: string;
  payment_terms_day?: number;
  tax?: number;
  comment_customer?: string;
  comment_sale?: string;
  competitor?: string;
  created_by: string; // จำเป็นต้องมีฟิลด์นี้
  updated_by: string; // จำเป็นต้องมีฟิลด์นี้
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null; // ฟิลด์อาจเป็น null หรือ undefined
  deleted_by?: string | null; // ฟิลด์อาจเป็น null หรือ undefined
  customer_tin?:string;
};

export const GetCustomerSchema = z.object({
  params: z.object({
    customer_code: z.string().max(50),
  }),
});

export const GetCustomerSchema_id = z.object({
  params: z.object({
    customer_id: z.string().uuid(),
  }),
});

export const CreateCustomerSchema = z.object({
  body: z.object({
    customer_code: z
      .string()
      .max(50, "Customer code must not exceed 50 characters")
      .optional(), // รหัสลูกค้า (จำเป็น)
    customer_prefix: z.string().max(20).optional(), // คำนำหน้า (ถ้ามี)
    customer_name: z
      .string()
      .max(255, "Customer name must not exceed 255 characters")
      .optional(),
    contact_name: z.string().max(50).optional(), // ชื่อผู้ติดต่อ (ถ้ามี)
    customer_position: z.string().max(50).optional(), // ตําแหน่ง (ถ้ามี)
    contact_number: z
      .string()
      .refine((value) => commonValidations.isPhoneNumber(value), {
        message: "Invalid phone number format",
      })
      .optional(), // เบอร์ติดต่อ (ถ้ามี)
    line_id: z.string().max(20).optional(), // ไลน์ไอดี (ถ้ามี)
    addr_number: z.string().max(10).optional(), // บ้านเลขที่ (ถ้ามี)
    addr_alley: z.string().max(50).optional(), // ซอย (ถ้ามี)
    image_url: z.array(z.any()).optional().default([]),
    addr_street: z.string().max(100).optional(), // ถนน (ถ้ามี)
    addr_subdistrict: z.string().max(50).optional(), // ตำบล (ถ้ามี)
    addr_district: z.string().max(50).optional(), // อำเภอ (ถ้ามี)
    addr_province: z.string().max(50).optional(), // จังหวัด (ถ้ามี)
    addr_postcode: z.string().max(5).optional(), // รหัสไปรษณีย์ (ถ้ามี)
    payment_terms: z.string().max(10).optional(), // ระยะเวลาการชำระ (ถ้ามี)
    payment_terms_day: z.number().optional(), // จำนวนวันชำระ (ถ้ามี)
    tax: z.number().optional(), // ภาษี (ถ้ามี)
    comment_customer: z.string().max(255).optional(), // ความคิดเห็นจากลูกค้า (ถ้ามี)
    comment_sale: z.string().max(255).optional(), // ความคิดเห็นจากตัวแทน (ถ้ามี)
    competitor: z.string().max(255).optional(), // คู่แข่ง (ถ้ามี)
    created_by: z
      .string()
      .max(50, "Created by must not exceed 50 characters")
      .optional(),
    updated_by: z
      .string()
      .max(50, "Updated by must not exceed 50 characters")
      .optional(),
    created_at: z.date().optional().default(new Date()), // กำหนดวันที่สร้างเป็นปัจจุบัน
    updated_at: z.date().optional().default(new Date()), // กำหนดวันที่อัปเดตเป็นปัจจุบัน
    deleted_at: z.date().nullable().optional(), // วันที่ลบ (สามารถเป็น null หรือ undefined)
    deleted_by: z.string().max(50).nullable().optional(), // ผู้ที่ลบ (สามารถเป็น null หรือ undefined)
    customer_tin: z.string().max(13).optional(),
  }),
});

export const UpdateCustomerSchema = z.object({
  params: z.object({
    customer_id: commonValidations.uuid,
  }),
});


export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
});

export const CreateCustomerWithRequiredFieldsSchema = z.object({
  body: z.object({
    customer_code: z.string().max(50, "Customer code must not exceed 50 characters"),
    customer_prefix: z.string().max(20),
    customer_name: z.string().max(255, "Customer name must not exceed 255 characters"),
    contact_name: z.string().max(50),
    contact_number: z.string().max(50, "Contact number must not exceed 50 characters"),
  }),
});