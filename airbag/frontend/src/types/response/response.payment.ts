import { DeliverySchedule } from "./response.delivery-schedule";
import { Type_MS_CompaniesL_All } from "./response.ms-companies";

export type PAYMENTTYPE = {
  id: string;
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

  master_delivery_schedule: DeliverySchedule;
  companies: Type_MS_CompaniesL_All;

  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
};

