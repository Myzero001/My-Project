import { z, ZodType } from "zod";
import { PayLoadCreateCustomerVisit } from "@/types/requests/request.customer-visit";

export const customerVisitCreateSchema: ZodType<PayLoadCreateCustomerVisit> = z.object({
    customer_visit_doc: z.string().max(14).optional(),
    customer_id: z.string().optional(),
    customer_code: z.string().max(50).optional(),
    customer_name: z.string().max(50).optional(),
    contact_name: z.string().max(50).min(1, { message: "กรุณาระบุชื่อผู้ติดต่อ" }).optional(),
    contact_number: z.string().max(15).min(1, { message: "กรุณาระบุเบอร์โทรผู้ติดต่อ" }).optional(),
    line_id: z.string().max(20).optional(),
    addr_map: z.string().max(255).optional(),
    addr_number: z.string().max(10).optional(),
    addr_alley: z.string().max(50).optional(),
    addr_street: z.string().max(100).optional(),
    addr_subdistrict: z.string().max(50).optional(),
    addr_district: z.string().max(50).optional(),
    addr_province: z.string().max(50).optional(),
    addr_postcode: z.string().max(5).optional(),
    date_go: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    topic: z.string().max(255).min(1, { message: "กรุณาระบุหัวข้อ" }).optional(),
    next_topic: z.string().max(255).optional(),
    next_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    rating: z.number().min(1, { message: "กรุณาระบุคะแนนลูกค้า" }).optional(),
    created_at: z.string().optional(), 
    created_by: z.string().max(20).optional(),
    updated_at: z.string().optional(), 
    updated_by: z.string().max(20).optional(),
});
