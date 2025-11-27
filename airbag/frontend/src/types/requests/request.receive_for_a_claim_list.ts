export type PayLoadTypePayloadReceiveForAClaimList = {
    finish: boolean;
    finish_by_receipt_doc: string;
    receive_for_a_claim_id: string;
};

export type PayLoadTypePayloadCreateReceiveForAClaimList = {
    receive_for_a_claim_id: string; // ฟิลด์นี้จำเป็นตาม Backend Schema
    send_for_a_claim_list_id?: string; 
    finish_by_receipt_doc?: string; 
    finish?: boolean;
    repair_receipt_id?: string;        
    master_repair_id?: string;         
    remark?: string;                   
    price?: number;                    
};