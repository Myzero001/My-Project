import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";
import { TypePayloadSupplierRepairReceiptList } from "@modules/supplier_repair_receipt_list/supplierRepairReceiptListModel";

export type TypePayloadSendForAClaimList = {
    send_for_a_claim_list_id?: string;
    send_for_a_claim_id?: string;
    supplier_delivery_note_id?: string;
    repair_receipt_id?: string;
    master_repair_id?: string;
    remark?: string;
    price?: number;
    created_at?: Date;
    created_by?: string;
    updated_at?: Date;
    updated_by?: string;

    supplier_repair_receipt_list_id?: string, // เลขใบรับซ่อม

};


const BaseSendForAClaimListSchema = z.object({
    // send_for_a_claim_id: z.string().optional(),
    supplier_delivery_note_id: z.string().optional(),
    repair_receipt_id: z.string().optional(),
    master_repair_id: z.string().optional(),
    price: z.number().optional(),
    remark: z.string().optional(),
});

export const CreateSendForAClaimListSchema = z.object({
    body: BaseSendForAClaimListSchema.extend({
        send_for_a_claim_id: commonValidations.uuid,
    })
});

export const UpdateSendForAClaimListSchema = z.object({
    body: BaseSendForAClaimListSchema.extend({
        send_for_a_claim_list_id: commonValidations.uuid,
    })
});

export const GetParamSendForAClaimListSchema = z.object({
    params: z.object({
        send_for_a_claim_list_id: z.string().max(50),
    })
});


//-----------------------------------------------

export const SubmitSendForAClaimListSchema = z.object({
    body: z.object({
        send_for_a_claim_id: z.string().uuid(), // เลขใบส่งเคลม
        supplier_delivery_note_id: z.string().max(50), // เลขใบส่งซัพพลายเออร์
        repairReceiptIDAndRepairIDList: z.array(
            z.object({
                supplier_repair_receipt_list_id: z.string().max(50), // เลขใบรับซ่อม
                repair_receipt_id: z.string().max(50), // เลขใบรับซ่อม
                master_repair_id: z.string().max(50), // เลขรายการซ่อม

                checked: z.boolean(), // สถานะของรายการ

                remark: z.string().max(255).nullable().optional(), // หมายเหตุ (nullable และ optional)
                price: z.number().min(0).nullable(), // ราคา (nullable และต้องเป็นค่าบวก)
            })
        ),
    }),
});

export type repairReceiptIDAndRepairIDList = {
    supplier_repair_receipt_list_id: string, // เลขใบรับซ่อม
    send_for_a_claim_list_id: string;
    repair_receipt_id: string;
    master_repair_id: string;
    checked: boolean;
    remark: string | null;
    price: number | null;
}

export type PayloadSubmit = {

    send_for_a_claim_id: string;
    supplier_delivery_note_id: string;
    // supplier_repair_receipt_list_id: string;
    repairReceiptIDAndRepairIDList: repairReceiptIDAndRepairIDList[];
}
