import { z, ZodType } from "zod";
import { PayLoadCreateCustomer } from "@/types/requests/request.ms-customer";

// สร้าง schema ของลูกค้าด้วย Zod
export const CreateCustomerSchema: ZodType<
  PayLoadCreateCustomer,
  z.ZodTypeDef,
  PayLoadCreateCustomer
> = z.object({
  customer_code: z.string().max(50).optional(),
  customer_prefix: z
    .string()
    .max(20)
    .min(1, { message: "กรุณาระบุคํานําหน้า" })
    .optional(),
  customer_name: z
    .string()
    .max(255)
    .min(1, { message: "กรุณาระบุชื่อลูกค้า" })
    .optional(),
  contact_name: z
    .string()
    .max(50)
    .min(1, { message: "กรุณาระบุชื่อผู้ติดต่อ" })
    .optional(),
  customer_position: z.string().max(50).optional(),
  contact_number: z
    .string()
    .min(1, { message: "กรุณาระบุเบอร์โทรศัพท์" })
    .optional(),
  line_id: z.string().max(20).optional(),
  addr_number: z.string().max(10).optional(),
  addr_alley: z.string().max(50).optional(),
  image_url: z.array(z.any().optional()),
  addr_street: z.string().max(100).optional(),
  addr_subdistrict: z.string().max(50).optional(),
  addr_district: z.string().max(50).optional(),
  addr_province: z.string().max(50).optional(),
  addr_postcode: z.string().max(5).optional(),
  payment_terms: z.string().max(10).optional(),
  payment_terms_day: z.number().optional(),
  tax: z.number().optional().default(0),
  comment_customer: z.string().max(255).optional(),
  comment_sale: z.string().max(255).optional(),
  competitor: z.string().max(255).optional(),
  created_by: z.string().max(50).optional(),
  updated_by: z.string().max(50).optional(),
  created_at: z.date().optional().default(new Date()),
  updated_at: z.date().optional().default(new Date()),
  deleted_at: z.date().nullable().optional(),
  deleted_by: z.string().max(50).nullable().optional(),
  customer_tin: z.string().max(13).optional(),
});
