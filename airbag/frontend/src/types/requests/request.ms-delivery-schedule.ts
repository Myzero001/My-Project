export type PayloadCreateDeliverySchedule = {
  repair_receipt_id: string;
};

export type PayloadUpdateDeliverySchedule = {
  id: string;

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
  delivery_date?: string;

  delivery_location: string;
  delivery_schedule_image_url?: string;
  remark?: string;
};
