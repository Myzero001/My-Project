import { commonValidations } from "@common/utils/commonValidation";
import { date, z } from "zod";

export type TypePayloadVisitCustomer = {
    customer_visit_id: string; ///
    customer_visit_doc: string;///
    customer_id: string;
    customer_code?: string; //
    customer_name?: string; //
    contact_name?: string;
    contact_number?: string;
    line_id?: string;
    addr_map?: string;
    addr_number?: string;
    addr_alley?: string;
    addr_street?: string;
    addr_subdistrict?: string;
    addr_district?: string;
    addr_province?: string;
    addr_postcode?: string;
    date_go?: string;
    topic?: string;
    next_topic?: string;
    next_date?: string;
    rating?: number;
    created_at: Date;   //
    created_by: string; //
    updated_at?: Date;
    updated_by?: string;
}

const BaseSupplierSchema = z.object({
    // customer_visit_id: commonValidations.uuid,
    customer_visit_doc: z.string().max(14).optional(),

    customer_id: commonValidations.uuid.optional(),
    customer_code: z.string().max(50).optional(),
    customer_name: z.string().max(50).optional(),
    contact_name: z.string().max(50).optional(),
    contact_number: z.string().max(15).optional(),
    line_id: z.string().max(20).optional(),
    addr_map: z.string().max(255).optional(),
    addr_number: z.string().max(10).optional(),
    addr_alley: z.string().max(50).optional(),
    addr_street: z.string().max(100).optional(),
    addr_subdistrict: z.string().max(50).optional(),
    addr_district: z.string().max(50).optional(),
    addr_province: z.string().max(50).optional(),
    addr_postcode: z.string().max(5).optional(),
    // date_go:  z.date().optional(),
    date_go: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    topic: z.string().max(255).optional(),
    next_topic: z.string().max(255).optional(),
    // next_date: z.date().optional(),
    next_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    rating: z.number().optional(),
    created_at: z.date().optional(),
    created_by: z.string().max(20).optional(),
    updated_at: z.date().optional(),
    updated_by: z.string().max(20).optional()
});

export const CreateMasterVisitCustomerSchema = z.object({
    body: BaseSupplierSchema
});

export const UpdateMasterVisitCustomerSchema = z.object({
    body: BaseSupplierSchema.extend({
        customer_visit_id: commonValidations.uuid,
    })
});

export const GetParamVisitCustomerSchema = z.object({
    params: z.object({
        customer_visit_id: z.string().max(50),
    })
});

