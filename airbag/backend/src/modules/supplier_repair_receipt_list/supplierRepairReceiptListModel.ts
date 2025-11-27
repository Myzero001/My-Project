import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadSupplierRepairReceiptList = {
    id?: string; 
    supplier_delivery_note_repair_receipt_list_id?: string; 
    supplier_repair_receipt_id?: string;
    supplier_delivery_note_id: string;
    repair_receipt_id: string;
    master_repair_id: string;
    price?: number;
    quantity?: number;
    total_price?: number;
    status: string;
    company_id?: string;
    created_at?: Date;
    created_by: string;
    updated_at?: Date;
    updated_by: string;
};

const BaseSupplierRepairReceiptListSchema = z.object({
    supplier_repair_receipt_id: z.string().optional(),
    supplier_delivery_note_id: commonValidations.uuid,
    repair_receipt_id: commonValidations.uuid,
    master_repair_id: commonValidations.uuid,
    supplier_delivery_note_repair_receipt_list_id: commonValidations.uuid.optional(),
    price: z.number().optional(),
    quantity: z.number().optional(),
    total_price: z.number().optional(),
    status: z.string(),
});

export const CreateSupplierRepairReceiptListSchema = z.object({
    body: BaseSupplierRepairReceiptListSchema
});

export const UpdateSupplierRepairReceiptListSchema = z.object({
    body: BaseSupplierRepairReceiptListSchema.extend({
        supplier_delivery_note_repair_receipt_list_id: commonValidations.uuid,
    })
});

export const GetParamSupplierRepairReceiptListSchema = z.object({
    params: z.object({
        supplier_repair_receipt_list_id: commonValidations.uuid,
    })
});

export const UpdateFinishStatusSchema = z.object({
    params: z.object({
        supplier_delivery_note_repair_receipt_list_id: commonValidations.uuid,
    }),
    body: z.object({
        finish: z.boolean(),
        finish_by_receipt_doc: z.string(),
        supplier_repair_receipt_id: commonValidations.uuid,
    }),
});

export const GetParamPayloadListSchema = z.object({
    params: z.object({
        supplier_repair_receipt_id: commonValidations.uuid,
        supplier_delivery_note_id: commonValidations.uuid
    })
});

export const UpdateSupplierRepairReceiptIdSchema = z.object({
    params: z.object({
        supplier_delivery_note_repair_receipt_list_id: commonValidations.uuid,
    }),
    body: z.object({
        supplier_repair_receipt_id: commonValidations.uuid,
    }),
});