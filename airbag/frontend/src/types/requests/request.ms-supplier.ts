export type PayLoadCreateMSSupplier = {
    supplier_id?: string
    supplier_code: string
    supplier_name?: string
    contact_name?: string
    contact_number?: string
    line_id?: string
    addr_number?: string
    addr_alley?: string
    addr_street?: string
    addr_subdistrict?: string
    addr_district?: string
    addr_province?: string
    addr_postcode?: string
    payment_terms?: string
    payment_terms_day?: number | null
    remark?: string
    business_type?: string
    created_at?: Date
    updated_at?: Date
};

export type PayLoadUpdateMSSupplier = {
    supplier_id?: string
    supplier_code?: string
    supplier_name?: string
    contact_name?: string
    contact_number?: string
    line_id?: string
    addr_number?: string
    addr_alley?: string
    addr_street?: string
    addr_subdistrict?: string
    addr_district?: string
    addr_province?: string
    addr_postcode?: string
    payment_terms?: string
    payment_terms_day?: number
    remark?: string
    business_type?: string
    updated_at?: Date
    created_at?: Date
};

// export type PayLoadDeleteMSSupplier = {
//     supplier_code: string;
// };