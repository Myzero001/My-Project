import { z, ZodType } from "zod"; // Add new import
import { paymentUpdateType } from "../types/craete";

// @ts-ignore
export const PaymentUpdateSchema: ZodType<paymentUpdateType> = z.object({
  option_payment: z.string().min(1),
  type_money: z.string().min(1),
  price: z.number(),
  payment_image_url: z.array(z.any().optional()),
  remark: z.string(),
  check_number: z.string().optional(),
  check_date: z.string().optional(),
  bank_name: z.string().optional(),
});
