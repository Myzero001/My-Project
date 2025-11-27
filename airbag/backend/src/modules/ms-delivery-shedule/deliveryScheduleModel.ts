import { z } from "zod";

export enum DELIVERY_SCHEDULE_STATUS {
  PENDING = "pending",
  SUCCESS = "success",
}

export type TypePayloadDeliverySchedule = {
  id?: string;
  delivery_schedule_doc: string;
  delivery_location?: string;
  delivery_schedule_image_url?: string;
  remark?: string;
  delivery_date?: string;

  status?: string;

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

  company_id?: string;
  repair_receipt_id: string;

  created_at?: Date; // วันที่สร้างข้อมูล (รูปแบบ YYYY-MM-DD)
  created_by?: string; // ผู้สร้างข้อมูล
  updated_at?: Date; // วันที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
  updated_by?: string; // ผู้ที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
};

export const CreateDeliveryScheduleSchema = z.object({
  body: z.object({
    repair_receipt_id: z.string(),
  }),
});

// Schema สำหรับการอัปเดต DeliverySchedule
export const UpdateDeliveryScheduleSchema = z.object({
  body: z.object({
    id: z.string(),
    delivery_location: z.string().optional(),
    delivery_schedule_image_url: z.string().optional(),
    remark: z.string().optional(),
  }),
});

export const UpdateDeliveryScheduleStatusSchema = z.object({
  body: z.object({
    id: z.string(),
  }),
});

export const deleteDeliveryScheduleSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})

export const ShowCalendarScheduleSchema = z.object({
  body: z.object({
    startDate : z.string().min(1).max(20),
    endDate : z.string().min(1).max(20),
  })
})