import { PayLoadCreatSupplierDeliveryNote } from "@/types/requests/request.supplier-delivery-note";
import { z, ZodType } from "zod";

export const CreateSupplierDeliveryNoteSchema = z.object({
    supplier_delivery_note_id: z.string().optional(),
    supplier_delivery_note_doc: z.string().max(14).optional(),
    date_of_submission: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    amount: z.number().optional(),
    status: z.string().optional(),
    addr_number: z.string().max(50).optional(),
    addr_alley: z.string().max(50).optional(),
    addr_street: z.string().max(50).optional(),
    addr_subdistrict: z.string().max(50).optional(),
    addr_district: z.string().max(50).optional(),
    addr_province: z.string().max(50).optional(),
    addr_postcode: z.string().max(5).optional(),
    contact_name: z.string().max(50).min(1, { message: "กรุณาระบุชื่อผู้ติดต่อ" }).optional(),
    contact_number: z.string().max(15).min(1, { message: "กรุณาระบุเบอร์โทรผู้ติดต่อ" }).optional(),
    payment_terms: z.string().max(20).optional(),
    payment_terms_day: z.number().optional(),
    remark: z.string().max(255).optional(),
    supplier_id: z.string(),
    supplier_code: z.string().max(50).optional(),
});
