"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.GetParamResponsiblePersonSchema = exports.UpdateResponsiblePersonSchema = exports.CreateResponsiblePersonSchema = exports.ResponsiblePersonType = void 0;
const zod_1 = require("zod");
var ResponsiblePersonType;
(function (ResponsiblePersonType) {
    ResponsiblePersonType["QUOTATION"] = "QUOTATION";
    ResponsiblePersonType["REPAIR"] = "REPAIR";
    ResponsiblePersonType["SUBMIT_SUB"] = "SUBMIT_SUB";
    ResponsiblePersonType["RECEIVE_SUB"] = "RECEIVE_SUB";
    ResponsiblePersonType["SUBMIT_CLAIM"] = "SUBMIT_CLAIM";
    ResponsiblePersonType["RECEIVE_CLAIM"] = "RECEIVE_CLAIM";
})(ResponsiblePersonType || (exports.ResponsiblePersonType = ResponsiblePersonType = {}));
const baseCreateSchema = zod_1.z.object({
    docno: zod_1.z.string().max(20, "Document number must be 20 characters or less"),
    change_date: zod_1.z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), zod_1.z.date()),
    before_by_id: zod_1.z.string().uuid("Invalid 'before by' user ID"),
    after_by_id: zod_1.z.string().uuid("Invalid 'after by' user ID"),
});
exports.CreateResponsiblePersonSchema = zod_1.z.object({
    body: zod_1.z.discriminatedUnion("type", [
        baseCreateSchema.extend({
            type: zod_1.z.literal(ResponsiblePersonType.QUOTATION),
            quotation_id: zod_1.z.string().uuid("Invalid Quotation ID"),
        }),
        baseCreateSchema.extend({
            type: zod_1.z.literal(ResponsiblePersonType.REPAIR),
            master_repair_receipt_id: zod_1.z.string().uuid("Invalid Master Repair Receipt ID"),
        }),
        baseCreateSchema.extend({
            type: zod_1.z.literal(ResponsiblePersonType.SUBMIT_SUB),
            supplier_delivery_note_id: zod_1.z.string().uuid("Invalid Supplier Delivery Note ID"),
        }),
        baseCreateSchema.extend({
            type: zod_1.z.literal(ResponsiblePersonType.RECEIVE_SUB),
            supplier_repair_receipt_id: zod_1.z.string().uuid("Invalid Supplier Repair Receipt ID"),
        }),
        baseCreateSchema.extend({
            type: zod_1.z.literal(ResponsiblePersonType.SUBMIT_CLAIM),
            send_for_a_claim_id: zod_1.z.string().uuid("Invalid Send For a Claim ID"),
        }),
        baseCreateSchema.extend({
            type: zod_1.z.literal(ResponsiblePersonType.RECEIVE_CLAIM),
            receive_for_a_claim_id: zod_1.z.string().uuid("Invalid Receive For a Claim ID"),
        }),
    ]),
});
exports.UpdateResponsiblePersonSchema = zod_1.z.object({
    body: zod_1.z.object({
        log_id: zod_1.z.string().uuid("Invalid Log ID"),
        docno: zod_1.z.string().max(20, "Document number must be 20 characters or less").optional(),
        before_by_id: zod_1.z.string().uuid("Invalid 'before by' user ID").optional(),
        after_by_id: zod_1.z.string().uuid("Invalid 'after by' user ID").optional(),
    }),
});
exports.GetParamResponsiblePersonSchema = zod_1.z.object({
    params: zod_1.z.object({
        log_id: zod_1.z.string().uuid(),
    }),
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
