import { blobToFile } from "../file";

export type PayLoadCreateQuotation = {
  quotation_doc?: string; // เอกสารใบเสนอราคา
  quotation_date?: string; // วันที่ออกใบเสนอราคา (รูปแบบ YYYY-MM-DD)
  customer_id?: string; // id customer

  addr_map?: string, // ลิ้งแผนที่
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

  image_url?: blobToFile[];

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

  repair_summary?: string; // หมายเหตุ (optional)
  is_box_detail?: boolean;

  lock?: boolean; // สถานะการล็อก (optional)

  quotation_status?: string; // สถานะการอนุมัติ (optional)
  approval_date?: string; // วันที่อนุมัติ (optional)
  approval_by?: string; // ผู้อนุมัติ (optional)
  approval_notes?: string; // หมายเหตุการอนุมัติ (optional)
  // deal_closed_status?: boolean; // สถานะการปิดดีล (optional)
  deal_closed_date?: string;
  deal_closed_by?: string; // ผู้ปิดดีล (optional)
  responsible_by?: string;
};

export type RequestCreateQuotation = {
  quotation_doc?: string; // เอกสารใบเสนอราคา
  quotation_date?: string; // วันที่ออกใบเสนอราคา (รูปแบบ YYYY-MM-DD)
  customer_id?: string; // id customer

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

  quotation_status?: string; // สถานะการอนุมัติ (optional)
  approval_date?: string; // วันที่อนุมัติ (optional)
  approval_by?: string; // ผู้อนุมัติ (optional)
  approval_notes?: string; // หมายเหตุการอนุมัติ (optional)
  // deal_closed_status?: boolean; // สถานะการปิดดีล (optional)
  deal_closed_date?: string;
  deal_closed_by?: string; // ผู้ปิดดีล (optional)
  responsible_by?: string;
};
