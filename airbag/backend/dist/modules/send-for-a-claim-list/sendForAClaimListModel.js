"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitSendForAClaimListSchema = exports.GetParamSendForAClaimListSchema = exports.UpdateSendForAClaimListSchema = exports.CreateSendForAClaimListSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
const BaseSendForAClaimListSchema = zod_1.z.object({
    // send_for_a_claim_id: z.string().optional(),
    supplier_delivery_note_id: zod_1.z.string().optional(),
    repair_receipt_id: zod_1.z.string().optional(),
    master_repair_id: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
    remark: zod_1.z.string().optional(),
});
exports.CreateSendForAClaimListSchema = zod_1.z.object({
    body: BaseSendForAClaimListSchema.extend({
        send_for_a_claim_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.UpdateSendForAClaimListSchema = zod_1.z.object({
    body: BaseSendForAClaimListSchema.extend({
        send_for_a_claim_list_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamSendForAClaimListSchema = zod_1.z.object({
    params: zod_1.z.object({
        send_for_a_claim_list_id: zod_1.z.string().max(50),
    })
});
//-----------------------------------------------
exports.SubmitSendForAClaimListSchema = zod_1.z.object({
    body: zod_1.z.object({
        send_for_a_claim_id: zod_1.z.string().uuid(), // เลขใบส่งเคลม
        supplier_delivery_note_id: zod_1.z.string().max(50), // เลขใบส่งซัพพลายเออร์
        repairReceiptIDAndRepairIDList: zod_1.z.array(zod_1.z.object({
            supplier_repair_receipt_list_id: zod_1.z.string().max(50), // เลขใบรับซ่อม
            repair_receipt_id: zod_1.z.string().max(50), // เลขใบรับซ่อม
            master_repair_id: zod_1.z.string().max(50), // เลขรายการซ่อม
            checked: zod_1.z.boolean(), // สถานะของรายการ
            remark: zod_1.z.string().max(255).nullable().optional(), // หมายเหตุ (nullable และ optional)
            price: zod_1.z.number().min(0).nullable(), // ราคา (nullable และต้องเป็นค่าบวก)
        })),
    }),
});
