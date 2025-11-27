import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadMasterSupplier = {
    supplier_id: string;
    supplier_code: string;
    supplier_name?: string;
    contact_name?: string;
    contact_number?: string;
    line_id?: string;
    addr_number?: string;
    addr_alley?: string;
    addr_street?: string;
    addr_subdistrict?: string;
    addr_district?: string;
    addr_province?: string;
    addr_postcode?: string;
    payment_terms?: string;
    payment_terms_day?: number;
    remark?: string;
    business_type?: string;
    created_at?: Date;
    updated_at?: Date;
}

const BaseSupplierSchema = z.object({
    supplier_code: z.string().max(50, { message: "รหัสผู้จัดหาสินค้าต้องไม่เกิน 50 ตัวอักษร" }),
    supplier_name: z.string().max(255).default("ยังไม่ได้ระบุ"),
    contact_name: z.string().max(50).optional(),
    contact_number: z.string().regex(/^\d+$/).max(15, { message: "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น และไม่เกิน 15 ตัว" }).optional(),
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
    business_type: z.string().max(50).optional(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().optional(),
});

export const UpdateMasterSupplierSchema = z.object({
    body: BaseSupplierSchema.extend({
        supplier_id: commonValidations.uuid,
    }),
});

export const CreateMasterSupplierSchema = z.object({
    body: BaseSupplierSchema,
});

export const GetParamMasterSupplierSchema = z.object({
    params: z.object({
        supplier_id: commonValidations.uuid,
    })
});

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})