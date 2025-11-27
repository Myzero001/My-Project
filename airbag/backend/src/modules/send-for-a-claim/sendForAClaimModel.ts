import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";


export type TypePayloadSendForAClaim = {
    send_for_a_claim_id: string;
    send_for_a_claim_doc: string;
    supplier_repair_receipt_id: string;
    claim_date?: string;
    due_date?: string;
    supplier_id?: string;
    addr_number?: string;
    addr_alley?: string;
    addr_street?: string;
    addr_subdistrict?: string;
    addr_district?: string;
    addr_province?: string;
    addr_postcode?: string;
    contact_name?: string;
    contact_number?: string;
    remark?: string;
    created_at?: Date;
    created_by?: string;
    updated_at?: Date;
    updated_by?: string;
    responsible_by?: string;
};


const BaseSendForAClaimSchema = z.object({
    send_for_a_claim_doc: z.string().max(14).optional(),
    claim_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    supplier_id: z.string().optional(),
    addr_number: z.string().max(50).optional(),
    addr_alley: z.string().max(10).optional(),
    addr_street: z.string().max(50).optional(),
    addr_subdistrict: z.string().max(50).optional(),
    addr_district: z.string().max(50).optional(),
    addr_province: z.string().max(50).optional(),
    addr_postcode: z.string().max(5).optional(),
    contact_name: z.string().max(50).optional(),
    contact_number: z.string().max(15).optional(),
    remark: z.string().max(255).optional(),
});

export const CreateSendForAClaimSchema = z.object({
    body: BaseSendForAClaimSchema.extend({
        supplier_repair_receipt_id: commonValidations.uuid,
    })
});

export const UpdateSendForAClaimSchema = z.object({
    body: BaseSendForAClaimSchema.extend({
        send_for_a_claim_id: commonValidations.uuid,
    })
});

export const GetParamSendForAClaimSchema = z.object({
    params: z.object({
        send_for_a_claim_id: z.string().max(50),
    })
});

export const GetParamSupplierRepairReceiptSchema = z.object({
    params: z.object({
        id: z.string().max(50),
    })
})

export interface SendClaimDocItem {
    id: string; 
    send_for_a_claim_doc: string | null; 
}

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})