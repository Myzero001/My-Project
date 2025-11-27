export type TypeSupplierDeliveryNoteListAll = {
    send_for_a_claim_list_id: string,
    send_for_a_claim_id: string,
    supplier_delivery_note_id?: string,
    repair_receipt_id?: string,
    master_repair_id?: string,
    remark?: string,
    price?: number,
    send_for_a_claim?: {
        send_for_a_claim_id: string,
        send_for_a_claim_doc: string,
        due_date: Date,
        claim_date: Date
    },
    repair_receipt?: {
        id: string,
        repair_receipt_doc: string,
    },
    master_repair?: {
        master_repair_id: string,
        master_repair_name: string,
    },
};

export type TypeSupplierDeliveryNoteList = {
    send_for_a_claim_list_id: string,
    send_for_a_claim_id: string,
    supplier_delivery_note_id?: string,
    repair_receipt_id?: string,
    master_repair_id?: string,
    remark?: string,
    price?: number,
    send_for_a_claim?: {
        send_for_a_claim_id: string,
        send_for_a_claim_doc: string,
        due_date: Date,
        claim_date: Date
    },
    repair_receipt?: {
        id: string,
        repair_receipt_doc: string,
    },
    master_repair?: {
        master_repair_id: string,
        master_repair_name: string,
    },
};


export type SendForAClaimListResponse = {
    message: string,
    responseObject: TypeSupplierDeliveryNoteList,
    statusCode: number;
}
