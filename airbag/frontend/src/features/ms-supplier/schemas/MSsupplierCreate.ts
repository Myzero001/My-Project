import { PayLoadCreateMSSupplier } from "@/types/requests/request.ms-supplier";
import { z, ZodType } from "zod";

// @ts-ignore
export const MSsupplierCreateSchema: ZodType<PayLoadCreateMSSupplier> = z.object({
    supplier_code: z.string().max(50),
    supplier_name: z.string().max(255).min(1,{message:"กรุณาระบุชื่อร้านค้า"}),
    contact_name: z.string().max(50).min(1, { message: "กรุณาระบุชื่อผู้ติดต่อ" }).optional(),
    contact_number: z
        .string()
        .regex(/^\d+$/, { message: "กรุณาระบุเบอร์โทรศัพท์ให้ถูกต้อง" })
        .max(15).min(1, { message: "กรุณาระบุเบอร์โทรศัพท์ให้ถูกต้อง" })
        .optional(),
    line_id: z.string().max(20).optional(),
    addr_number: z.string().max(10).optional(),
    addr_alley: z.string().max(50).optional(),
    addr_street: z.string().max(100).optional(),
    addr_subdistrict: z.string().max(50).optional(),
    addr_district: z.string().max(50).optional(),
    addr_province: z.string().max(50).optional(),
    addr_postcode: z.string().max(5).optional(),
    payment_terms: z.string().max(10).optional(),
    payment_terms_day: z.number().int().nullable().optional(),
    remark: z.string().max(255).optional(),
    business_type: z.string().max(50).min(1, { message: "กรุณาระบุประเภทกิจการ" }).optional(),
    is_deleted: z.boolean().default(false),
    created_at: z.date().default(() => new Date()),
});
