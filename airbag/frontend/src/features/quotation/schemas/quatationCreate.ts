import { PayLoadCreateQuotation } from "@/types/requests/request.quotation";
import { z, ZodType } from "zod"; // Add new import

export const QuatationCreateSchema: ZodType<PayLoadCreateQuotation> = z.object({
  quotation_doc: z
    .string()
    .max(14, "Quotation Doc should not exceed 14 characters")
    .optional(),
  quotation_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  customer_id: z.string().optional(),
  addr_map: z.string().max(100).optional(),
  addr_number: z.string().max(50).optional(),
  addr_alley: z.string().max(50).optional(),
  addr_street: z.string().max(50).optional(),
  addr_subdistrict: z.string().max(50).optional(),
  addr_district: z.string().max(50).optional(),
  addr_province: z.string().max(50).optional(),
  addr_postcode: z.string().max(10).optional(),
  customer_name: z.string().max(255).optional(),
  position: z.string().max(50).optional(),
  contact_number: z.string().max(20).optional(),
  line_id: z.string().max(50).optional(),

  image_url: z.array(z.any().optional()),

  brand_id: z.string().min(1, { message: "กรุณาเลือกแบบรถยนต์" }),
  model_id: z.string().min(1, { message: "กรุณาเลือกรุ่น" }),
  car_year: z
    .string()
    .length(4, { message: "กรุณาเลือกปีรถยนต์" })
    .min(1, { message: "กรุณาเลือกปีรถยนต์" }),
  car_color_id: z.string().min(1, { message: "กรุณาเลือกสีรถยนต์" }),
  total_price: z.number().min(0),
  tax: z.number().int().min(0),
  deadline_day: z.number(),
  appointment_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  remark: z.string().optional(),

  insurance: z.boolean().optional(),
  insurance_date: z.string().optional(),


  repair_summary: z.string().optional(),
  is_box_detail: z.boolean().optional(),

  lock: z.boolean().optional(),

  quotation_status: z.string().optional(),
  approval_date: z.string().optional(),
  approval_by: z.string().optional(),
  approval_notes: z.string().optional(),
  // deal_closed_status: z.boolean().optional(),
  deal_closed_date: z.string().optional(),
  deal_closed_by: z.string().optional(),
});
