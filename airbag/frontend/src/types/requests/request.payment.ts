export type PayloadCreatePayment = {
  delivery_schedule_id: string;
  option_payment: string;
  type_money: string;
  price?: number;
  tax?: number;
  tax_rate?: number;
  tax_status?: boolean;
  total_price?: number;
  payment_image_url?: string;
  remark?: string;

  check_number?: string;
  check_date?: string;
  bank_name?: string;
};

export type PayloadUpdatePayment = {
  id: string;
  option_payment: string;
  type_money: string;
  price?: number;
  tax?: number;
  tax_rate?: number;
  tax_status?: boolean;
  total_price?: number;
  payment_image_url?: string;
  remark?: string;
  check_number?: string;
  check_date?: string;
  bank_name?: string;
};

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

export enum TYPE_MONEY_TEXT {
  "cash" = "เงินสด",
  "transfer-money" = "เงินโอน",
  "check" = "เช็ค",
}

