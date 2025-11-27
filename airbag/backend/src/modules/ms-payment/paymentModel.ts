import { z } from "zod";

export enum PAYMENT_STATUS {
  OVERDUE = "overdue",
  PARTIAL_PAYMENT = "partial-payment",
  SUCCESS = "success",
}

export enum OPTION_PAYMENT {
  FULL_PAYMENT = "full-payment",
  PARTIAL_PAYMENT = "partial-payment",
  NOT_YET_PAID = "not-yet-paid",
}

export enum TYPE_MONEY {
  CASH = "cash",
  TRANSFER_MONEY = "transfer-money",
  CHECK = "check",
}

export type TypePayloadPayment = {
  id?: string;
  payment_doc: string;
  option_payment: string;
  type_money: string;
  price: number;
  tax: number;
  tax_rate: number;
  tax_status: boolean;
  total_price: number;
  payment_image_url?: string;
  remark?: string;

  check_number?: string;
  check_date?: string;
  bank_name?: string;

  status: string;

  company_id?: string;
  delivery_schedule_id: string;

  created_at?: Date; // วันที่สร้างข้อมูล (รูปแบบ YYYY-MM-DD)
  created_by?: string; // ผู้สร้างข้อมูล
  updated_at?: Date; // วันที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
  updated_by?: string; // ผู้ที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
};

export const GetPaymentByDeliveryScheduleIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const CreatePaymentSchema = z.object({
  body: z.object({
    delivery_schedule_id: z.string(),
    option_payment: z.string(),
    type_money: z.string(),
    price: z.number(),
    tax: z.number(),
    tax_rate: z.number(),
    tax_status: z.boolean(),
    total_price: z.number(),
    payment_image_url: z.string().optional(),
    status: z.string().optional(),
    remark: z.string().optional(),
    check_number: z.string().optional(),
    check_date: z.string().optional(),
    bank_name: z.string().optional(),
  }),
});

// Schema สำหรับการอัปเดต Payment
export const UpdatePaymentSchema = z.object({
  body: z.object({
    id: z.string(),
    option_payment: z.string().optional(),
    type_money: z.string().optional(),
    price: z.number().optional(),
    tax: z.number().optional(),
    tax_rate: z.number().optional(),
    tax_status: z.boolean().optional(),
    total_price: z.number().optional(),
    payment_image_url: z.string().optional(),
    remark: z.string().optional(),
    check_number: z.string().optional(),
    check_date: z.string().optional(),
    bank_name: z.string().optional(),
  }),
});

export const UpdatePaymentStatusSchema = z.object({
  body: z.object({
    id: z.string(),
  }),
});

export const deletePaymentSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
