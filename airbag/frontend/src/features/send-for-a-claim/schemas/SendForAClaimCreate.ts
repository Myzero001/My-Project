import { PayLoadCreatSendForAClaim } from "@/types/requests/request.send-for-a-claim";
import { z, ZodType } from "zod";

export const CreateSendForAClaimSchema = z.object({
    send_for_a_claim_id: z.string(),
    send_for_a_claim_doc: z.string().max(14).optional(),
    supplier_repair_receipt_id: z.string(),
    claim_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    due_date: z.string().optional(),
    supplier_id: z.string().optional(),
    addr_number: z.string().max(50).optional(),
    addr_alley: z.string().max(10).optional(),
    addr_street: z.string().max(50).optional(),
    addr_subdistrict: z.string().max(50).optional(),
    addr_district: z.string().max(50).optional(),
    addr_province: z.string().max(50).optional(),
    addr_postcode: z.string().max(5).optional(),
    contact_name: z.string().max(50).min(1, { message: "กรุณาระบุชื่อผู้ติดต่อ" }).optional(),
    contact_number: z.string().max(15).min(1, { message: "กรุณาระบุเบอร์โทรผู้ติดต่อ" }).optional(),
    remark: z.string().max(255).optional(),
});
