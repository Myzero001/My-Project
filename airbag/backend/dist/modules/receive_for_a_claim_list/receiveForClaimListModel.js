"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParamPayloadListSchema = exports.GetByReceiveForAClaimIdSchema = exports.GetParamReceiveForAClaimListSchema = exports.UpdateReceiveForAClaimListSchema = exports.CreateMultipleReceiveForAClaimListSchema = exports.CreateReceiveForAClaimListSchema = void 0;
// receiveForClaimListModel.ts
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
const BaseReceiveForAClaimListSchema = zod_1.z.object({
    receive_for_a_claim_id: commonValidation_1.commonValidations.uuid,
    send_for_a_claim_list_id: commonValidation_1.commonValidations.uuid.optional(),
    repair_receipt_id: commonValidation_1.commonValidations.uuid.optional(),
    master_repair_id: commonValidation_1.commonValidations.uuid.optional(),
    remark: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
    finish: zod_1.z.boolean().optional(),
    finish_by_receipt_doc: zod_1.z.string().optional(),
    claim_Date: zod_1.z.string().optional(),
});
exports.CreateReceiveForAClaimListSchema = zod_1.z.object({
    body: BaseReceiveForAClaimListSchema
});
exports.CreateMultipleReceiveForAClaimListSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z.array(BaseReceiveForAClaimListSchema)
    })
});
exports.UpdateReceiveForAClaimListSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: commonValidation_1.commonValidations.uuid,
    }),
    body: BaseReceiveForAClaimListSchema,
});
exports.GetParamReceiveForAClaimListSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetByReceiveForAClaimIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        receive_for_a_claim_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamPayloadListSchema = zod_1.z.object({
    params: zod_1.z.object({
        receive_for_a_claim_id: commonValidation_1.commonValidations.uuid,
        send_for_a_claim_id: commonValidation_1.commonValidations.uuid
    })
});
