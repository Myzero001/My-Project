export type PayLoadCreatSendForAClaimList = {
    send_for_a_claim_id: string,
    supplier_delivery_note_id: string,
    repair_receipt_id: string,
    master_repair_id: string,
    remark?: string,
    price?: number,

};

export type PayLoadUpdateSendForAClaimList = {
    send_for_a_claim_list_id: string,
    // send_for_a_claim_id: string,
    // supplier_delivery_note_id: string,
    // repair_receipt_id: string,
    // master_repair_id: string,
    remark?: string,
    price?: number,

};



export type repairReceiptIDAndRepairIDList = {
    supplier_repair_receipt_list_id: string;
    repair_receipt_id: string;
    master_repair_id: string;
    checked: boolean;
    remark: string | null;
    price: number | null;


    //-------------------------------
    disabled?: boolean,
    supplier_repair_receipt_doc?: string,
    supplier_delivery_doc?: string,
    send_for_a_claim_doc?: string,
    master_repair_name?: string,
    repair_receipt_doc?: string,
}

export type PayloadSubmit = {
    // send_for_a_claim_list_id: string;

    send_for_a_claim_id: string;
    supplier_delivery_note_id: string;

    repairReceiptIDAndRepairIDList: repairReceiptIDAndRepairIDList[];

}
