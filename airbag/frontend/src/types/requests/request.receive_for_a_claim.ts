export type PayLoadUpdateClaimDate = {
    claim_date: string;
};

export type PayLoadCreateReceiveForAClaim = {
    send_for_a_claim_id: string;
};

export interface PayLoadUpdateReceiveForAClaimResponsible {
  responsible_by?: string;
}