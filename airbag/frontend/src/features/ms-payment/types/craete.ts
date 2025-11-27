import { blobToFile } from "@/types/file";

export type paymentUpdateType = {
  option_payment: string;
  type_money: string;
  price: number;
  tax: number;
  total_price: number;
  tax_rate: number;
  tax_status: boolean;
  payment_image_url: blobToFile[];
  remark: string;

  check_number?: string;
  check_date?: string;
  bank_name?: string;
};
