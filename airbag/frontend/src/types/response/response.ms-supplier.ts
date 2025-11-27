export type TypeMasterSupplierAll = {
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
    payment_terms_day?: number
    remark?: string
    business_type?: string
    updated_at?: string
    created_at?: string
}

export type TypeMasterSupplier = {
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
    payment_terms_day?: number
    remark?: string
    business_type?: string
}

export type SupplierResponse = {
    success: boolean
    message: string
    responseObject: TypeMasterSupplierAll
    statusCode: number
}

