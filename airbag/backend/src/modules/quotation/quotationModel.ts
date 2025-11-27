import { z } from "zod";
import { commonValidations } from "@common/utils/commonValidation";

export enum QUOTATION_STATUS {
  PENDING = "pending",
  WAITING_FOR_APPROVE = "waiting_for_approve",
  APPROVED = "approved",
  REJECT_APPROVED = "reject_approve",
  CLOSE_DEAL = "close_deal",
  CANCEL = "cancel",
}

// ประเภทข้อมูลสำหรับ Payload ของ Quotation
export type TypePayloadQuotation = {
  quotation_doc: string; // เอกสารใบเสนอราคา
  quotation_date?: string; // วันที่ออกใบเสนอราคา (รูปแบบ YYYY-MM-DD)
  customer_id: string; // id customer

  addr_map?: string; 
  addr_number?: string; // หมายเลขที่อยู่ (optional)
  addr_alley?: string; // ซอย (optional)
  addr_street?: string; // ถนน (optional)
  addr_subdistrict?: string; // ตำบล (optional)
  addr_district?: string; // อำเภอ (optional)
  addr_province?: string; // จังหวัด (optional)
  addr_postcode?: string; // รหัสไปรษณีย์ (optional)

  customer_name?: string; // ชื่อผู้ติดต่อ (optional)
  position?: string; // ตำแหน่ง (optional)
  contact_number?: string; // เบอร์ติดต่อ (optional)
  line_id?: string; // Line ID (optional)

  image_url?: string;

  brand_id?: string;
  model_id?: string; // ชื่อรุ่น
  car_year?: string; // ปีของรถ (ความยาว 4 ตัวอักษร)
  car_color_id?: string;
  total_price?: number; // ราคาทั้งหมด
  tax?: number; // ภาษี
  deadline_day?: number; // จำนวนวันที่ครบกำหนด (optional)
  appointment_date?: string; // วันที่นัดหมาย (optional)
  remark?: string; // หมายเหตุ (optional)
  
  insurance?: boolean;
  insurance_date?: string;
  repair_summary?: string;
  is_box_detail?: boolean;

  lock?: boolean; // สถานะการล็อก (optional)

  responsible_by: string;
  responsible_date: string;

  quotation_status?: string; // สถานะการอนุมัติ (optional)
  approval_date?: string; // วันที่อนุมัติ (optional)
  approval_by?: string; // ผู้อนุมัติ (optional)
  approval_notes?: string; // หมายเหตุการอนุมัติ (optional)
  // deal_closed_status?: boolean; // สถานะการปิดดีล (optional)
  deal_closed_date?: string;
  deal_closed_by?: string; // ผู้ปิดดีล (optional)

  company_id?: string;

  created_at: Date; // วันที่สร้างข้อมูล (รูปแบบ YYYY-MM-DD)
  created_by: string; // ผู้สร้างข้อมูล
  updated_at?: Date; // วันที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
  updated_by: string; // ผู้ที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
};

// Schema สำหรับการสร้าง Quotation
export const CreateQuotationSchema = z.object({
  body: z.object({
    quotation_doc: z
      .string()
      .max(14, "Quotation Doc should not exceed 14 characters")
      .optional(),
    quotation_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .optional(),
    customer_id: z.string(),

    addr_map: z.string().max(100).optional(),
    addr_number: z.string().max(50).optional(),
    addr_alley: z.string().max(50).optional(),
    addr_street: z.string().max(50).optional(),
    addr_subdistrict: z.string().max(50).optional(),
    addr_district: z.string().max(50).optional(),
    addr_province: z.string().max(50).optional(),
    addr_postcode: z.string().max(10).optional(),
    customer_name: z.string().max(255).optional(),
    position: z.string().max(50).optional(),
    contact_number: z.string().max(20).optional(),
    line_id: z.string().max(50).optional(),

    image_url: z.string().optional(),

    brand_id: z.string().optional(),
    model_id: z.string().optional(),
    car_year: z.string().length(4).optional(),
    car_color_id: z.string().max(20).optional(),
    total_price: z.number().min(0).optional(),
    tax: z.number().int().min(0).optional(),
    deadline_day: z.number().optional(),
    appointment_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .optional(),
    remark: z.string().optional(),

    insurance: z.boolean().optional(),
    insurance_date: z.string().optional(),

    lock: z.boolean().optional(),

    quotation_status: z.string().optional(),
    approval_date: z.string().optional(),
    approval_by: z.string().optional(),
    approval_notes: z.string().optional(),
    // deal_closed_status: z.boolean().optional(),
    deal_closed_date: z.string().optional(),
    deal_closed_by: z.string().optional(),
  }),
});

// Schema สำหรับการอัปเดต Quotation
export const UpdateQuotationSchema = z.object({
  body: z.object({
    customer_id: z.string().optional(),
    addr_map: z.string().max(100).optional(),
    addr_number: z.string().max(50).optional(),
    addr_alley: z.string().max(50).optional(),
    addr_street: z.string().max(50).optional(),
    addr_subdistrict: z.string().max(50).optional(),
    addr_district: z.string().max(50).optional(),
    addr_province: z.string().max(50).optional(),
    addr_postcode: z.string().max(10).optional(),
    customer_name: z.string().max(255).optional(),
    position: z.string().max(50).optional(),
    contact_number: z.string().max(20).optional(),
    line_id: z.string().max(50).optional(),

    image_url: z.string().optional(),

    brand_id: z.string().optional(),
    model_id: z.string().optional(),
    car_year: z.string().length(4).optional(),
    car_color_id: z.string().optional(),
    total_price: z.number().min(0).optional(),
    tax: z.number().int().min(0).optional(),
    deadline_day: z.number().optional(),
    appointment_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .optional(),
    remark: z.string().optional(),
    insurance: z.boolean().optional(),
    insurance_date: z.string().optional(),

    repair_summary: z.string().optional(),

    lock: z.boolean().optional(),

    quotation_status: z.string().optional(),
    approval_date: z.string().optional(),
    approval_by: z.string().optional(),
    approval_notes: z.string().optional(),
    // deal_closed_status: z.boolean().optional(),
    deal_closed_date: z.string().optional(),
    deal_closed_by: z.string().optional(),
    responsible_by: z.string().optional(),
  }),
});

export const UpdateStatusQuotationSchema = z.object({
  body: z.object({
    quotation_id: z.string(),
    repair_summary: z.string().optional(),
  }),
});

export const RequestEditQuotationSchema = z.object({
  body: z.object({
    quotation_id: z.string(),
    remark: z.string().optional(),
  }),
});

export const DeleteQuotationSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const ShowCalendarRemovalSchema = z.object({
  body: z.object({
    startDate : z.string().min(1).max(20),
    endDate : z.string().min(1).max(20),
  })
})