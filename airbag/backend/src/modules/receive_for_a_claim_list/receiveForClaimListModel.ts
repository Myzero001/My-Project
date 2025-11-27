// receiveForClaimListModel.ts
import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadReceiveForAClaimList = {
    receive_for_a_claim_list_id?: string;
    receive_for_a_claim_id: string;
    send_for_a_claim_list_id?: string;
    repair_receipt_id?: string;
    master_repair_id?: string;
    remark?: string;
    price?: number;
    finish?: boolean;
    finish_by_receipt_doc?: string;
    claim_Date?: string;
    created_at?: Date;
    created_by: string;
    updated_at?: Date;
    updated_by: string;
};

const BaseReceiveForAClaimListSchema = z.object({
    receive_for_a_claim_id: commonValidations.uuid,
    send_for_a_claim_list_id: commonValidations.uuid.optional(),
    repair_receipt_id: commonValidations.uuid.optional(),
    master_repair_id: commonValidations.uuid.optional(),
    remark: z.string().optional(),
    price: z.number().optional(),
    finish: z.boolean().optional(),
    finish_by_receipt_doc: z.string().optional(),
    claim_Date: z.string().optional(),
});

export const CreateReceiveForAClaimListSchema = z.object({
    body: BaseReceiveForAClaimListSchema
});

export const CreateMultipleReceiveForAClaimListSchema = z.object({
    body: z.object({
        items: z.array(BaseReceiveForAClaimListSchema)
    })
});

export const UpdateReceiveForAClaimListSchema = z.object({
    params: z.object({
        id: commonValidations.uuid,
    }),
    body: BaseReceiveForAClaimListSchema,
});


export const GetParamReceiveForAClaimListSchema = z.object({
    params: z.object({
        id: commonValidations.uuid,
    })
});

export const GetByReceiveForAClaimIdSchema = z.object({
    params: z.object({
        receive_for_a_claim_id: commonValidations.uuid,
    })
});

export const GetParamPayloadListSchema = z.object({
    params: z.object({
        receive_for_a_claim_id: commonValidations.uuid,
        send_for_a_claim_id: commonValidations.uuid
    })
});