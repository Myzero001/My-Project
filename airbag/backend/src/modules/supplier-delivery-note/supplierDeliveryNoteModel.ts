import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadSupplierDeliveryNote = {
    supplier_delivery_note_id: string,
    supplier_delivery_note_doc: string,
    date_of_submission?: string,
    due_date?: string,
    amount?: number,
    status?: string,
    addr_number?: string,
    addr_alley?: string,
    addr_street?: string,
    addr_subdistrict?: string,
    addr_district?: string,
    addr_province?: string,
    addr_postcode?: string,
    contact_name?: string,
    contact_number?: string,
    payment_terms?: string,
    payment_terms_day?: number;
    remark?: string,
    // company_id?: string,
    supplier_id?: string,
    created_at: Date;  
    created_by: string;
    updated_at?: Date;
    updated_by?: string;
    responsible_by?: string;
}

const BaseSupplierSchema = z.object({
    // supplier_delivery_note_id: commonValidations.uuid,
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
    contact_name: z.string().max(50).optional(),
    contact_number: z.string().max(15).optional(),
    payment_terms: z.string().max(20).optional(),
    payment_terms_day: z.number().optional(),
    remark: z.string().max(255).optional(),
    created_at: z.date().optional(),
    created_by: z.string().max(20).optional(),
    updated_at: z.date().optional(),
    updated_by: z.string().max(20).optional(),

    supplier_id: z.string().optional(),
    company_id: z.string().optional(),


});

export const CreateSupplierDeliveryNoteSchema = z.object({
    body: BaseSupplierSchema
});

export const UpdateSupplierDeliveryNoteSchema = z.object({
    body: BaseSupplierSchema.extend({
        supplier_delivery_note_id: commonValidations.uuid,
    })
});

export const GetParamSupplierDeliveryNoteSchema = z.object({
    params: z.object({
        supplier_delivery_note_id: z.string().max(50),
    })
});

export interface DeliveryNoteDocItem {
    id: string;
    supplier_delivery_note_doc: string | null;
  }

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})