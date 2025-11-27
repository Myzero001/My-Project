
export type PayLoadCreatSupplierDeliveryNote = {
    supplier_id: string,
    supplier_delivery_note_id?: string,
    supplier_delivery_note_doc?: string,
    date_of_submission?: string,
    due_date?: string,
    amount?: number,
    status?: string,
    addr_number?: string,
    addr_alley?: string,
    addr_street?: string,
    addr_subdistrict?: string,
    addr_district?: string,
    addr_province?: string,
    addr_postcode?: string,
    contact_name?: string,
    contact_number?: string,
    payment_terms?: string,
    payment_terms_day?: number,
    remark?: string,
    supplier_code?: string

};

export type PayLoadUpdateSupplierDeliveryNote = {
    supplier_delivery_note_id: string,
    supplier_delivery_note_doc?: string,
    date_of_submission?: string,
    due_date?: string,
    amount?: number,
    status?: string,
    addr_number?: string,
    addr_alley?: string,
    addr_street?: string,
    addr_subdistrict?: string,
    addr_district?: string,
    addr_province?: string,
    addr_postcode?: string,
    contact_name?: string,
    contact_number?: string,
    payment_terms?: string,
    payment_terms_day?: number,
    remark?: string,
    supplier_id?: string,
    supplier_code?: string,
    responsible_by?: string,

};
