export type PayloadUpdateApproveEditPayment = {
  id: string;
  edit_status: string;
};

export enum EDIT_STATUS_PAYMENT {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    CANCELED = "canceled",
}