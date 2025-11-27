import { Type_MS_CompaniesL_All } from "./response.ms-companies";
import { repairReceipt } from "./response.repair-receipt";

export type DeliverySchedule = {
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

  companies: Type_MS_CompaniesL_All;
  master_repair_receipt: repairReceipt;

  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
};

export type DeliveryScheduleSelectItem = {
  id: string;
  delivery_schedule_doc: string;
};
  
export type DeliveryScheduleSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: DeliveryScheduleSelectItem[];
  };
  statusCode: number;
};

export interface DeliveryScheduleCalendar {
  id: string;
  delivery_schedule_doc: string;
  customer_name: string;
  contact_number: string;
  delivery_date: string; // หรือ Date ถ้ามีการแปลงข้อมูล
  status: string;
  master_repair_receipt: {
    id: string;
    repair_receipt_doc: string;
    register: string;
    master_quotation: {
      quotation_id: string;
      total_price: number; // Prisma จะแปลงเป็น number
      master_brand: {
        master_brand_id: string;
        brand_name: string;
      };
      master_brandmodel: {
        ms_brandmodel_id: string;
        brandmodel_name: string;
      };
    };
  };
}