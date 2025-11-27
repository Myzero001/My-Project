"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParamReceiveForAClaimSchema = exports.UpdateReceiveForAClaimSchema = exports.CreateReceiveForAClaimSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
const BaseReceiveForAClaimSchema = zod_1.z.object({
    company_id: commonValidation_1.commonValidations.uuid.optional(),
    receive_for_a_claim_doc: zod_1.z.string().optional(),
    send_for_a_claim_id: commonValidation_1.commonValidations.uuid.optional(),
    receive_date: zod_1.z.date().optional(),
    supplier_id: commonValidation_1.commonValidations.uuid.optional(),
    addr_number: zod_1.z.string().optional(),
    addr_alley: zod_1.z.string().optional(),
    addr_street: zod_1.z.string().optional(),
    addr_subdistrict: zod_1.z.string().optional(),
    addr_district: zod_1.z.string().optional(),
    addr_province: zod_1.z.string().optional(),
    addr_postcode: zod_1.z.string().optional(),
    contact_name: zod_1.z.string().optional(),
    contact_number: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    claim_date: zod_1.z.string().optional(),
});
exports.CreateReceiveForAClaimSchema = zod_1.z.object({
    body: BaseReceiveForAClaimSchema
});
exports.UpdateReceiveForAClaimSchema = zod_1.z.object({
    body: BaseReceiveForAClaimSchema,
});
exports.GetParamReceiveForAClaimSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: commonValidation_1.commonValidations.uuid,
    })
});
