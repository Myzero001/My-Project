export type TypeSendForAClaimAll = {
    send_for_a_claim_id: string,
    send_for_a_claim_doc: string,
    supplier_repair_receipt_id?: string,
    claim_date?: Date,
    due_date?: Date,
    supplier_id?: string,
    addr_number?: string,
    addr_alley?: string,
    addr_street?: string,
    addr_subdistrict?: string,
    addr_district?: string,
    addr_province?: string,
    addr_postcode?: string,
    contact_name?: string,
    contact_number?: string,
    remark?: string,
    master_supplier?: {
        supplier_id: string,
        supplier_code: string,
        supplier_name: string,
    },
    supplier_repair_receipt?: {
        id: string
        receipt_doc: string,
        supplier_delivery_note: {
            supplier_delivery_note_id: string;
            supplier_delivery_note_doc: string;
        }
    },

    supplier_code: string,

};


export type TypeSendForAClaim = {
    send_for_a_claim_id: string,
    send_for_a_claim_doc: string,
    supplier_repair_receipt_id?: string,
    claim_date?: Date,
    due_date?: Date,
    supplier_id?: string,
    addr_number?: string,
    addr_alley?: string,
    addr_street?: string,
    addr_subdistrict?: string,
    addr_district?: string,
    addr_province?: string,
    addr_postcode?: string,
    contact_name?: string,
    contact_number?: string,
    remark?: string,
    master_supplier?: {
        supplier_id: string,
        supplier_code: string,
        supplier_name: string,
    },
    supplier_repair_receipt?: {
        receipt_doc: string,
        supplier_delivery_note: {
            supplier_delivery_note_id: string;
            supplier_delivery_note_doc: string;
        }
    },
};

export type SendForAClaimResponse = {
    message: string,
    responseObject: TypeSendForAClaim,
    statusCode: number;
}


export type NumcountunableToDeleteCount = {
    TypeSDNandRRidSelect: number | null | undefined
}
export type claimResponse = {
    message: string,
    responseObject: NumcountunableToDeleteCount,
    statusCode: number;
}

export type CustomerSelectItem = {
  customer_id: string;
  customer_code: string;
};
  
export type CustomerSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: CustomerSelectItem[];
  };
  statusCode: number;
};