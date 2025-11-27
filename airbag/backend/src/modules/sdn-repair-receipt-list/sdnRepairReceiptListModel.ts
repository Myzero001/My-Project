import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export enum SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS {
    PENDING = "pending",
    SUCCESS = "success",
    CLAIM = "claim",
}
export type TypePayloadSupplierDeliveryNoteRRList = {
    supplier_delivery_note_repair_receipt_list_id?: string,
    supplier_delivery_note_id: string,
    repair_receipt_id?: string,
    master_repair_id?: string,
    price?: number,
    quantity?: number,
    total_price?: number,
    status?: string,
    // company_id?: string,
    created_at?: Date;
    created_by?: string;
    updated_at?: Date;
    updated_by?: string;

}

const BaseSupplierSchema = z.object({
    // supplier_delivery_note_repair_receipt_list_id: commonValidations.uuid,
    supplier_delivery_note_id: z.string().optional(),
    repair_receipt_id: z.string().optional(),
    master_repair_id: z.string().optional(),
    price: z.number().optional(),
    quantity: z.number().optional(),
    total_price: z.number().optional(),
    status: z.string().optional(),
});

export const CreateSupplierDeliveryNoteRRListSchema = z.object({
    body: BaseSupplierSchema
});

export const UpdateSupplierDeliveryNoteRRListSchema = z.object({
    body: BaseSupplierSchema.extend({
        supplier_delivery_note_repair_receipt_list_id: commonValidations.uuid,
    })
});

export const GetParamSupplierDeliveryNoteRRListSchema = z.object({
    params: z.object({
        supplier_delivery_note_repair_receipt_list_id: z.string().max(50),
    })
});

export const SubmitSupplierDeliveryNoteRRListSchema = z.object({
    body: z.object({
        supplier_delivery_note_id: z.string(),
        repair_receipt_id: z.string(),
        repairList: z.array(
            z.object({
                status: z.boolean(),
                id_repair_list: z.string(),
                price: z.number().min(0),  // ตรวจสอบว่า price เป็นตัวเลขและไม่ต่ำกว่า 0
                qty: z.number().min(0),    // ตรวจสอบว่า qty เป็นตัวเลขและไม่ต่ำกว่า 0
                total: z.number().min(0),  // ตรวจสอบว่า total เป็นตัวเลขและไม่ต่ำกว่า 0
            })
        ),

    })
})

export type RepairListItem = {
    status: boolean;
    id_repair_list: string;
    price: number;
    qty: number;
    total: number;
};

export type PayloadSubmit = {
    supplier_delivery_note_id: string;
    repair_receipt_id: string;
    repairList: RepairListItem[];
};