import { z, ZodType } from "zod"; // Add new import
import { DeliveryScheduleUpdateType } from "../types/update";

// @ts-ignore
export const DeliveryScheduleUpdateSchema: ZodType<DeliveryScheduleUpdateType> =
  z.object({
    id: z.string().min(1),

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
    delivery_date: z.string().optional(),
    delivery_location: z
      .string()
      .min(1, { message: "กรุณาระบุสถานที่ส่งมอบ " }),
    delivery_schedule_image_url: z.array(z.any().optional()),
    remark: z.string().optional(),
  });
