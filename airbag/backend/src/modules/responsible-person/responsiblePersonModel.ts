import { z } from "zod";

export enum ResponsiblePersonType {
  QUOTATION = "QUOTATION",
  REPAIR = "REPAIR",
  SUBMIT_SUB = "SUBMIT_SUB",
  RECEIVE_SUB = "RECEIVE_SUB",
  SUBMIT_CLAIM = "SUBMIT_CLAIM",
  RECEIVE_CLAIM = "RECEIVE_CLAIM",
}

export type TypePayloadResponsiblePerson = {
  type: ResponsiblePersonType;
  docno: string;
  change_date: Date;
  before_by_id: string;
  after_by_id: string;
  quotation_id?: string;
  master_repair_receipt_id?: string;
  supplier_delivery_note_id?: string;
  supplier_repair_receipt_id?: string;
  send_for_a_claim_id?: string;
  receive_for_a_claim_id?: string;
};

const baseCreateSchema = z.object({
  docno: z.string().max(20, "Document number must be 20 characters or less"),
  change_date: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date()),
  before_by_id: z.string().uuid("Invalid 'before by' user ID"),
  after_by_id: z.string().uuid("Invalid 'after by' user ID"),
});

export type TypePayloadUpdateResponsiblePerson = {
  docno?: string; // เลขที่เอกสารต้นทาง
  before_by_id?: string;
  after_by_id?: string;
};

export const CreateResponsiblePersonSchema = z.object({
  body: z.discriminatedUnion("type", [
    baseCreateSchema.extend({
      type: z.literal(ResponsiblePersonType.QUOTATION),
      quotation_id: z.string().uuid("Invalid Quotation ID"),
    }),
    baseCreateSchema.extend({
      type: z.literal(ResponsiblePersonType.REPAIR),
      master_repair_receipt_id: z.string().uuid("Invalid Master Repair Receipt ID"),
    }),
    baseCreateSchema.extend({
      type: z.literal(ResponsiblePersonType.SUBMIT_SUB),
      supplier_delivery_note_id: z.string().uuid("Invalid Supplier Delivery Note ID"),
    }),
    baseCreateSchema.extend({
      type: z.literal(ResponsiblePersonType.RECEIVE_SUB),
      supplier_repair_receipt_id: z.string().uuid("Invalid Supplier Repair Receipt ID"),
    }),
    baseCreateSchema.extend({
      type: z.literal(ResponsiblePersonType.SUBMIT_CLAIM),
      send_for_a_claim_id: z.string().uuid("Invalid Send For a Claim ID"),
    }),
    baseCreateSchema.extend({
      type: z.literal(ResponsiblePersonType.RECEIVE_CLAIM),
      receive_for_a_claim_id: z.string().uuid("Invalid Receive For a Claim ID"),
    }),
  ]),
});

export const UpdateResponsiblePersonSchema = z.object({
  body: z.object({
    log_id: z.string().uuid("Invalid Log ID"),
    docno: z.string().max(20, "Document number must be 20 characters or less").optional(),
    before_by_id: z.string().uuid("Invalid 'before by' user ID").optional(),
    after_by_id: z.string().uuid("Invalid 'after by' user ID").optional(),
  }),
});

export const GetParamResponsiblePersonSchema = z.object({
  params: z.object({
    log_id: z.string().uuid(),
  }),
});

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})