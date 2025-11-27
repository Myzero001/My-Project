export enum ResponsiblePersonType {
  QUOTATION = "QUOTATION",
  REPAIR = "REPAIR",
  SUBMIT_SUB = "SUBMIT_SUB",
  RECEIVE_SUB = "RECEIVE_SUB",
  SUBMIT_CLAIM = "SUBMIT_CLAIM",
  RECEIVE_CLAIM = "RECEIVE_CLAIM",
}

export interface TypeResponsiblePersonAll {
  log_id: string;
  type: ResponsiblePersonType; // ใช้ enum เพื่อ type safety ที่ดีขึ้น
  docno: string; // เลขที่เอกสารต้นทางที่บันทึกใน log
  num: number;
  change_date: Date | string; // API อาจจะส่งมาเป็น string, ควรแปลงเป็น Date object ใน client
  company_id: string; // เพิ่ม company_id ถ้ามีใน response

  // Document specific IDs (ควรมีทั้งหมดเป็น optional)
  quotation_id?: string;
  master_repair_receipt_id?: string;
  supplier_delivery_note_id?: string;
  supplier_repair_receipt_id?: string;
  send_for_a_claim_id?: string;
  receive_for_a_claim_id?: string;

  // Optional: Include full related document data if API sends it
  // และถ้า frontend ต้องการแสดงข้อมูลจากเอกสารเหล่านี้โดยตรงจาก log object
  quotation?: {
    quotation_id: string;
    quotation_doc: string;
    quotation_date: string | Date;
    customer_name?: string; // หรือ field อื่นๆ ที่เกี่ยวข้อง
    responsible_by?: string; // ID ผู้รับผิดชอบใน Quotation เอง
  };
  master_repair_receipt?: {
    id: string;
    repair_receipt_doc: string;
    responsible_by?: string;
    // ... other fields
  };
  supplier_delivery_note?: {
    supplier_delivery_note_id: string;
    supplier_delivery_note_doc: string;
    responsible_by?: string;
    // ... other fields
  };
  supplier_repair_receipt?: {
    id: string;
    receipt_doc: string; // หรือชื่อ field ที่ถูกต้อง
    responsible_by?: string;
    // ... other fields
  };
  send_for_a_claim?: {
    send_for_a_claim_id: string;
    send_for_a_claim_doc: string;
    responsible_by?: string;
    // ... other fields
  };
  receive_for_a_claim?: {
    receive_for_a_claim_id: string;
    receive_for_a_claim_doc: string;
    responsible_by?: string;
    // ... other fields
  };

  // User relations
  before_by?: {
    employee_id: string;
    username: string;
  };
  after_by?: {
    employee_id: string;
    username: string;
  };
  created_by?: {
    employee_id: string;
    username: string;
  };
}
  
export type TypeResponsiblePerson = {
  type: string;
  docno: string;
};

export interface ResponsiblePersonTypesApiResponse {
  success: boolean;
  message: string;
  responseObject: string[];
  statusCode: number;
}

export type ResponsiblePersonResponse = {
  success: boolean;
  message: string;
  responseObject: TypeResponsiblePerson;
  statusCode: number;
};

export interface DocumentIdDocItem {
  id: string; // ID ของเอกสาร
  doc: string; // เลขที่เอกสาร (doc number)
}

export interface ApiDocsResponse {
  success: boolean;
  message: string;
  responseObject?: { [key: string]: any }[];
  statusCode: number;
}

export interface ResponsibleUser {
  employee_id: string;
  username: string;
}

export interface ApiResponsibleUserResponse {
  success: boolean;
  message: string;
  responseObject: ResponsibleUser | null;
}

export interface ResponsiblePersonsApiResponse {
  success: boolean;
  message: string;
  responseObject: {
    data: TypeResponsiblePersonAll[];
    totalCount: number;
    totalPages: number;
  };
  statusCode: number;
}

export interface SingleResponsiblePersonApiResponse {
  success: boolean;
  message: string;
  responseObject: TypeResponsiblePersonAll | null; // อาจเป็น null ถ้าไม่พบ
  statusCode: number;
}

export interface ResponsibleUser {
  employee_id: string;
  username: string;
}

export interface ApiResponsibleUserResponse {
  success: boolean;
  message: string;
  responseObject: ResponsibleUser | null; // อาจจะ null ถ้าไม่มีผู้รับผิดชอบ
  statusCode?: number; // statusCode อาจจะไม่มีในทุก response object ของ API
}