import { PAYMENTTYPE } from "./response.payment";
import { MS_USER_ALL } from "./response.user";

export enum PAYMENT_EDITS_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  CANCELED = "canceled",
}

export type PAYMENT_EDITS = {
  id?: string;
  payment_id: string;
  old_data: string;
  new_data: string;
  edit_status: string;
  remark?: string;

  company_id?: string;

  created_by_user: MS_USER_ALL;
  master_payment: PAYMENTTYPE;
  payment_edits_log: PAYMENT_EDITS_LOG[];
  created_at?: string; // วันที่สร้างข้อมูล (รูปแบบ YYYY-MM-DD)
  created_by?: string; // ผู้สร้างข้อมูล
  updated_at?: string; // วันที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
  updated_by?: string; // ผู้ที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
};
export type PAYMENT_EDITS_LOG = {
  payment_edit_id: string;
  payment_id: string;
  old_data: string;
  new_data: string;
  edit_status: string;
  company_id?: string;
  remark?: string;

  created_by_user: MS_USER_ALL;
  master_payment: PAYMENTTYPE;
  created_at?: string; // วันที่สร้างข้อมูล (รูปแบบ YYYY-MM-DD)
  created_by?: string; // ผู้สร้างข้อมูล
  updated_at?: string; // วันที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
  updated_by?: string; // ผู้ที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
};
