export type PayLoadCreatSendForAClaim = {
    send_for_a_claim_id?: string,
    send_for_a_claim_doc?: string,
    supplier_repair_receipt_id: string,
    claim_date?: string,
    due_date?: string,
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
    //add
    supplier_code?: string
    supplier_delivery_note_doc?: string
    supplier_repair_receipt_doc?: string
    supplier_delivery_note_id?: string

};

export type PayLoadUpdateSendForAClaim = {
    // send_for_a_claim_list_id: string,
    send_for_a_claim_id: string,
    send_for_a_claim_doc?: string,
    supplier_repair_receipt_id?: string,
    claim_date?: string,
    due_date?: string,
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
    responsible_by?: string;
};
