import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadSupplierRepairReceipt = {
    id: string;
    receipt_doc?: string;
    repair_date_supplier_repair_receipt?: Date;
    supplier_delivery_note_id: string;
    supplier_id?: string;
    company_id?: string;
    master_repair_receipt_id?: string;
    supplier_delivery_note_repair_receipt_list_id?: string;
    master_repair_id?: string;
    repair_receipt_list_repair_id?: string;
    status?: string;
    remark?: string;
    created_at?: Date;
    created_by?: string;
    updated_at?: Date;
    updated_by?: string;
    responsible_by?: string;
};

const BaseSupplierRepairReceiptSchema = z.object({
    receipt_doc: z.string().optional(),
    repair_date_supplier_repair_receipt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
    supplier_delivery_note_id: commonValidations.uuid.optional(),
    supplier_id: commonValidations.uuid.optional(),
    master_repair_receipt_id: commonValidations.uuid.optional(),
    supplier_delivery_note_repair_receipt_list_id: commonValidations.uuid.optional(),
    master_repair_id: commonValidations.uuid.optional(),
    repair_receipt_list_repair_id: commonValidations.uuid.optional(),
    status: z.string().optional(),
    remark: z.string().max(255).optional(),
});

export const CreateSupplierRepairReceiptSchema = z.object({
    body: BaseSupplierRepairReceiptSchema
});

export const UpdateSupplierRepairReceiptSchema = z.object({
    body: BaseSupplierRepairReceiptSchema.extend({
        id: commonValidations.uuid,
    })
});

export const GetParamSupplierRepairReceiptSchema = z.object({
    params: z.object({
        id: commonValidations.uuid,
    })
});

export interface SupplierReceiptDocItem {
    id: string;
    receipt_doc: string | null;
  }

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})