export type TypeSupplierDeliveryNoteAll = {
    supplier_delivery_note_id: string,
    supplier_delivery_note_doc: string,
    date_of_submission?: Date,
    due_date?: Date,
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
    master_supplier?: {
        supplier_id: string,
        supplier_code: string,
        supplier_name: string,
    }
}

export type TypeSupplierDeliveryNote = {
    supplier_delivery_note_id: string,
    supplier_delivery_note_doc: string,
    date_of_submission?: Date,
    due_date?: Date,
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
    master_supplier?: {
        supplier_id: string,
        supplier_code: string,
        supplier_name: string,
    }
}

export type SupplierInvoiceResponse = {
    message: string,
    responseObject: TypeSupplierDeliveryNote,
    statusCode: number;
}

export type TypeMasterSupplierIdCode = {
    supplier_id: string
    supplier_code: string
}

export type NumcountunableToDeleteCount = {
    TypeSDNandRRidSelect: number | null | undefined
}
export type SDNResponse = {
    message: string,
    responseObject: NumcountunableToDeleteCount,
    statusCode: number;
}

export type SupplierSelectItem = {
  supplier_id: string;
  supplier_code: string;
};
  
export type SupplierSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: SupplierSelectItem[];
  };
  statusCode: number;
};

export type SupplierDeliveryNoteSelectItem = {
  supplier_delivery_note_id: string;
  supplier_delivery_note_doc: string;
};
  
export type SupplierDeliveryNoteSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: SupplierDeliveryNoteSelectItem[];
  };
  statusCode: number;
};