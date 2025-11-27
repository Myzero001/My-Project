import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadReceiveForAClaim = {
    id?: string;
    receive_for_a_claim_id?: string;
    receive_for_a_claim_doc?: string;
    send_for_a_claim_id: string;
    receive_date?: Date;
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
    status?: string;
    claim_date?: string;
    company_id?: string;
    created_at?: Date;
    created_by: string;
    updated_at?: Date;
    updated_by: string;
    responsible_by?: string;
};

const BaseReceiveForAClaimSchema = z.object({
    company_id: commonValidations.uuid.optional(),
    receive_for_a_claim_doc: z.string().optional(),
    send_for_a_claim_id: commonValidations.uuid.optional(),
    receive_date: z.date().optional(),
    supplier_id: commonValidations.uuid.optional(),
    addr_number: z.string().optional(),
    addr_alley: z.string().optional(),
    addr_street: z.string().optional(),
    addr_subdistrict: z.string().optional(),
    addr_district: z.string().optional(),
    addr_province: z.string().optional(),
    addr_postcode: z.string().optional(),
    contact_name: z.string().optional(),
    contact_number: z.string().optional(),
    status: z.string().optional(),
    claim_date: z.string().optional(),
});

export const CreateReceiveForAClaimSchema = z.object({
    body: BaseReceiveForAClaimSchema
});

export const UpdateReceiveForAClaimSchema = z.object({
    body: BaseReceiveForAClaimSchema,
});


export const GetParamReceiveForAClaimSchema = z.object({
    params: z.object({
        id: commonValidations.uuid,
    })
});

export interface ReceiveClaimDocItem {
    id: string; 
    receive_for_a_claim_doc: string | null;
  }