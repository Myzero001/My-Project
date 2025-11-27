export type PayLoadCreatSupplierRepairReceipt = {
    supplier_delivery_note_id: string
};

export type PayLoadUpdateSupplierRepairReceipt = {
    id: string;
    receipt_doc?: string;
    repair_date_supplier_repair_receipt?: Date;
    supplier_delivery_note_id: string;
    supplier_id?: string;
    company_id?: string;
    master_repair_receipt_id?: string;
    supplier_delivery_note_repair_receipt_list_id?: string;
    master_repair_id?: string;
    repair_receipt_list_repair_id?: string;
    status?: string;
    remark?: string;
    responsible_by?: string;
};

export type PayLoadUpdateSupplierRepairReceiptForResponsiblePerson = {
    id: string;
    responsible_by?: string;
}

export type PayLoadGetByIdSupplierRepairReceipt = {
    id: string;
};

export type PayLoadDeleteSupplierRepairReceipt = {
    id: string;
};