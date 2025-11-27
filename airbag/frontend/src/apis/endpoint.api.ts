export const GET_TOOL_ALL = "/v1/tool/get";
export const GET_TOOL_ALL_NO_PAGINATION = "/v1/tool/get_all";
export const SELECT_TOOL = "/v1/tool/select";
export const CREATE_TOOL = "/v1/tool/create";
export const UPDATE_TOOL = "/v1/tool/update";
export const DELETE_TOOL = "/v1/tool/delete";
export const SEARCH_TOOL = "/v1/tool/search";

export const GET_ISSUE_REASONS_ALL = "/v1/ms-issue-reason/get";
export const GET_ISSUE_REASONS_ALL_NO_PAGINATION =
  "/v1/ms-issue-reason/get_all";
export const SELECET_ISSUE_REASONS = "/v1/ms-issue-reason/select";
export const CREATE_ISSUE_REASONS = "/v1/ms-issue-reason/create";
export const UPDATE_ISSUE_REASONS = "/v1/ms-issue-reason/update";
export const DELETE_ISSUE_REASONS = "/v1/ms-issue-reason/delete";

export const GET_MS_BRAND = "/v1/ms-brand/get";
export const GET_MS_BRANDL_NO_PAGINATION = "/v1/ms-brand/get_all";
export const CREATE_MS_BRAND = "/v1/ms-brand/create";
export const UPDATE_MS_BRAND = "/v1/ms-brand/update";
export const DELETE_MS_BRAND = "/v1/ms-brand/delete";
export const GET_MS_BRANDS = "/v1/ms-brand/get-minimal";
export const SELECT_BRAND = "/v1/ms-brand/select";

export const GET_MS_BRANDMODEL = "/v1/ms-brandModel/get";
export const GET_MS_BRANDMODEL_NO_PAGINATION = "/v1/ms-brandModel/get_all";
export const GET_MS_BRANDMODEL_BY_BRANDS = "/v1/ms-brandModel/get-by-brand";
export const GET_MS_BRANDMODEL_WITH_SEARCH = "/v1/ms-brandModel/select";
export const CREATE_MS_BRANDMODEL = "/v1/ms-brandModel/create";
export const UPDATE_MS_BRANDMODEL = "/v1/ms-brandModel/update";
export const DELETE_MS_BRANDMODEL = "/v1/ms-brandModel/delete";

export const GET_MS_GROUP_REPAIR = "/v1/ms-group-repair/get";
export const CREATE_MS_GROUP_REPAIR = "/v1/ms-group-repair/create";
export const UPDATE_MS_GROUP_REPAIR = "/v1/ms-group-repair/update";
export const DELETE_MS_GROUP_REPAIR = "/v1/ms-group-repair/delete";
export const GET_MS_GROUP_REPAIR_SELECT = "v1/ms-group-repair/get-minimal";

export const GET_RESPONSIBLE_PERSONS = "/v1/responsible-person/get";
export const GET_USER_ID = "/v1/user/user-and-id";
export const CREATE_RESPONSIBLE_PERSON = "/v1/responsible-person/create";
export const UPDATE_RESPONSIBLE_PERSON = "/v1/responsible-person/update";
export const DELETE_RESPONSIBLE_PERSON =
  "/v1/responsible-person/delete/:log_id";
export const GET_RESPONSIBLE_PERSON_BY_ID =
  "/v1/responsible-person/get/:log_id";
export const GET_RESPONSIBLE_PERSON_TYPE = "/v1/responsible-person/types";
export const GET_REPAIR_RECEIPT_DOCS_AND_IDS = "/v1/ms-repair-receipt/get-repair-docs";
export const GET_SUPPLIER_REPAIR_RECEIPT_DOCS_AND_IDS = "/v1/supplier_repair_receipt/get-receipt-docs";
export const GET_RECEIVE_CLAIM_DOCS_AND_IDS = "/v1/receive-for-a-claim/get-receive-claim-docs-only";
export const GET_SEND_CLAIM_DOCS_AND_IDS = "/v1/send-for-a-claim/get-send-claim-docs-only";
export const GET_SUPPLIER_DELIVERY_NOTE_DOCS_AND_IDS = "/v1/supplier-delivery-note/get-delivery-note-docs-only";
export const GET_REPAIR_RECEIPT_RESPONSIBLE_USER = "/v1/ms-repair-receipt/get-with-responsible"; // ตรวจสอบ path ให้ตรงกับ backend router
export const GET_SUPPLIER_DELIVERY_NOTE_RESPONSIBLE_USER = "/v1/supplier-delivery-note/get-with-responsible"; // ตรวจสอบ path
export const GET_SUPPLIER_REPAIR_RECEIPT_RESPONSIBLE_USER = "/v1/supplier_repair_receipt/get-with-responsible"; // ตรวจสอบ path
export const GET_SEND_FOR_A_CLAIM_RESPONSIBLE_USER = "/v1/send-for-a-claim/get-with-responsible"; // ตรวจสอบ path
export const GET_RECEIVE_FOR_A_CLAIM_RESPONSIBLE_USER = "/v1/receive-for-a-claim/get-with-responsible";
export const UPDATE_REPAIR_RECEIPT_RESPONSIBLE_ENDPOINT = "/v1/ms-repair-receipt/update-responsible";
export const UPDATE_MASTER_REPAIR_RECEIPT_RESPONSIBLE = "/v1/ms-repair-receipt/update-responsible";

export const GET_COLOR_ALL = "/v1/color/get";
export const GET_COLOR_ALL_NO_PAGINATION = "/v1/color/get_all";
export const SELECT_COLOR = "/v1/color/select";
export const CREATE_COLOR = "/v1/color/create";
export const UPDATE_COLOR = "/v1/color/update";
export const DELETE_COLOR = "/v1/color/delete";
export const SEARCH_COLOR = "/v1/color/search";

export const GET_CUSTOMER_ALL = "/v1/customer/get";
// export const GET_CUSTOMER_ALL_NO_PAGINATION = "/v1/customer/get_all";
export const GET_CUSTOMER_ALL_NO_PAGINATION = "/v1/customer/get_all";
export const API_CUSTOMER_SELECT = "/v1/customer/select";
export const CREATE_CUSTOMER_REQUIRE = "/v1/customer/create_at_quotation";
export const CREATE_CUSTOMER = "/v1/customer/create";
export const UPDATE_CUSTOMER = "/v1/customer/update";
export const DELETE_CUSTOMER = "/v1/customer/delete";
export const SEARCH_CUSTOMER = "/v1/customer/get";

export const GET_MS_TYPE_GROUP_ISSUEREASON = "/v1/ms-type-issue-reason/get";

export const GET_MS_POSITION_ALL = "/v1/ms-position/get";
export const CREATE_MS_POSITION = "/v1/ms-position/create";
export const UPDATE_MS_POSITION = "/v1/ms-position/update";
export const DELETE_MS_POSITION = "/v1/ms-position/delete";
export const SELECT_POSITION = "/v1/ms-position/select";
// Auth
export const LOGIN = "/v1/user/login";
export const AUTH_STATUS = "/v1/user/auth-status";
export const LOGOUT = "/v1/user/logout";
export const GET_USERNAME = "/v1/user/usernames";

export const GET_MS_REPAIR_ALL = "/v1/ms-repair/get";
export const GET_MS_REPAIR_ALL_NO_PAGINATION = "/v1/ms-repair/get_all";
export const CREATE_MS_REPAIR = "/v1/ms-repair/create";
export const UPDATE_MS_REPAIR = "/v1/ms-repair/update";
export const DELETE_MS_REPAIR = "/v1/ms-repair/delete";
export const GET_MS_REPAIR_NAME = "/v1/ms-repair/get_repair_names";
export const GET_MS_REPAIR_BY_ID = "/v1/ms-repair/getByID";

export const GET_MS_COMPANY_ALL = "/v1/ms-companies/get";
export const CREATE_MS_COMPANY = "/v1/ms-companies/create";
export const UPDATE_MS_COMPANY = "/v1/ms-companies/update";
export const DELETE_MS_COMPANY = "/v1/ms-companies/delete";


export const GET_MS_SUPPLIER_ALL = "/v1/ms-supplier/get";
export const GET_MS_SUPPLIER_BY_ID = "/v1/ms-supplier/getByID";
export const CREATE_MS_SUPPLIER = "/v1/ms-supplier/create";
export const UPDATE_MS_SUPPLIER = "/v1/ms-supplier/update";
export const DELETE_MS_SUPPLIER = "/v1/ms-supplier/delete";

export const GET_APPROVE_QUOTATION_ALL = "/v1/quotation/get/approve";
export const GET_QUOTATION_ALL = "/v1/quotation/get";
export const GET_QUOTATION_BY_ID = "/v1/quotation/get";
export const GET_QUOTATION_LOG_STATUS_BY_QUOTATION_ID =
  "/v1/quotation-log-status/get_by_quotation_id";
export const CREATE_QUOTATION = "/v1/quotation/create";
export const UPDATE_QUOTATION = "/v1/quotation/update";
export const GET_QUOTATION_DOCS = "/v1/quotation/get-docs";
export const GET_QUOTATION_RESPONSIBLE_BY = "/v1/quotation/responsible-by";
export const GET_QUOTATION_CALENDAR_REMOVAL =
  "/v1/quotation/get/calendar-removal";
export const GET_QUOTATION_CALENDAR_REMOVALS = "/v1/quotation/get/calendar-removal";

// export const DELETE_QUOTATION = "/v1/quotation/delete/:quotation_id/:quotation_doc";

export const GET_VISIT_CUSTOMER_ALL = "/v1/visit-customer/get";
export const CREATE_VISIT_CUSTOMER = "/v1/visit-customer/create";
export const UPDATE_VISIT_CUSTOMER = "/v1/visit-customer/update";
export const DELETE_VISIT_CUSTOMER = "/v1/visit-customer/delete";
export const GET_VISIT_CUSTOMER_BY_ID = "/v1/visit-customer/getByID";

export const UPDATE_REQUEST_APPROVE_QUOTATION = "/v1/quotation/request_approve";
export const UPDATE_CANCEL_QUOTATION = "/v1/quotation/cancel";
export const UPDATE_REQUEST_EDIT_QUOTATION = "/v1/quotation/request_edit";
export const UPDATE_CLOSE_DEAL_QUOTATION = "/v1/quotation/close_deal";
export const UPDATE_APPROVE_QUOTATION = "/v1/quotation/approve";
export const UPDATE_REJECT_QUOTATION = "/v1/quotation/reject";
export const DELETE_QUOTATION = "/v1/quotation/delete";

export const GET_FILE_BY_URL = "/v1/file/get/file_by_url";
export const GET_SERVE_FILE = "/v1/file/serve_file";
export const CREATE_FILE = "/v1/file/create";
export const CREATE_FILE_REPAIR_RECEIPT_BOX_BEFORE =
  "/v1/file/create/repair_receipt/box_before";
export const CREATE_FILE_REPAIR_RECEIPT_BOX_AFTER =
  "/v1/file/create/repair_receipt/box_after";
export const DELETE_FILE = "/v1/file/delete";

export const GET_USER_ALL = "/v1/user/get";
export const GET_USER_PROFILE = "/v1/user/get_profile";
export const POST_REGISTER = "/v1/user/register";
export const UPDATE_USER = "/v1/user/update";
export const GET_QUOTATION_REPAIR_BY_QUOTATION_ID =
  "/v1/quotation-repair/get_by_quotationid";

export const GET_REPAIR_RECEIPT_LIST_REPAIR_BY_ID =
  "/v1/repair-receipt-list-repair/get";
export const GET_REPAIR_RECEIPT_LIST_REPAIR_BY_REPAIR_RECEIPT_ID =
  "/v1/repair-receipt-list-repair/get_by_repair_receipt_id";
export const GET_REPAIR_RECEIPT_LIST_REPAIR_BY_REPAIR_RECEIPT_ID_ACTIVE =
  "/v1/repair-receipt-list-repair/get_by_repair_receipt_id_active";
  
export const CRETE_REPAIR_RECEIPT_LIST_REPAIR =
  "/v1/repair-receipt-list-repair/create";
export const UPDATE_REPAIR_RECEIPT_CHECKED_BOX_STATUS =
  "/v1/repair-receipt-list-repair/update-checked-box-status";
export const UPDATE_REPAIR_RECEIPT_UNCHECK_BOX_STATUS =
  "/v1/repair-receipt-list-repair/update-uncheck-box-status";
export const UPDATE_REPAIR_RECEIPT_IS_ACTIVE_STATUS =
  "/v1/repair-receipt-list-repair/update_status_is_active";

export const GET_REPAIR_RECEIVE_ALL = "/v1/ms-repair-receipt/get";
export const GET_REPAIR_RECEIVE_JOB = "/v1/ms-repair-receipt/jobs";
export const GET_REPAIR_RECEIVE_ALL_NO_PAGINATION =
  "/v1/ms-repair-receipt/get_all";
export const GET_REPAIR_RECEIVE__NOT_DELIVERY_NO_PAGINATION =
  "/v1/ms-repair-receipt/get_by_not_delivered";
export const SELECT_REPAIR_RECEIVE = "/v1/ms-repair-receipt/select";
export const GET_REPAIR_RECEIVE_BY_ID = "/v1/ms-repair-receipt/get";
export const UPDATE_REPAIR_RECEIVE = "/v1/ms-repair-receipt/update";
export const UPDATE_REPAIR_RECEIVE_BOX = "/v1/ms-repair-receipt/update/box";
export const UPDATE_REPAIR_RECEIVE_BOX_CLEAR_BY =
  "/v1/ms-repair-receipt/update/box_clear_by";
export const DELETE_REPAIR_RECEIVE = "/v1/ms-repair-receipt/delete";
export const UPDATE_REPAIR_RECEIVE_STATUS_CANCEL =
  "/v1/ms-repair-receipt/cancel";
export const GET_REPAIR_RECEIPT_FOR_JOB =
  "/v1/ms-repair-receipt/get/payloadjob";
export const GET_REPAIR_RECEIPT_BY_FINISH =
  "/v1/ms-repair-receipt/get-by-finish";
export const SET_REPAIR_RECEIPT_FINISH = "/v1/ms-repair-receipt/finish";
export const SET_REPAIR_RECEIPT_UNFINISH = "/v1/ms-repair-receipt/unfinish";
export const GET_REPAIR_RECEIPT_DOC = "/v1/ms-repair-receipt/get-doc-id";

export const GET_MS_TOOLING_REASON = "/v1/ms-tooling-reason/get";
export const SELECT_TOOLING_REASON = "/v1/ms-tooling-reason/select";
export const GET_MS_TOOLING_REASON_NO_PAGINATION =
  "/v1/ms-tooling-reason/get_all";
export const CREATE_MS_TOOLING_REASON = "/v1/ms-tooling-reason/create";
export const UPDATE_MS_TOOLING_REASON = "/v1/ms-tooling-reason/update";
export const DELETE_MS_TOOLING_REASON = "/v1/ms-tooling-reason/delete";
export const GET_MS_TOOLING_REASON_SELECT = "v1/ms-tooling-reason/get-minimal";

export const Get_MS_CLEAR_BY = "/v1/ms-clear-by/get";
export const Get_MS_CLEAR_BY_NO_PAGINATION = "/v1/ms-clear-by/get_all";
export const CREATE_MS_CLEAR_BY = "/v1/ms-clear-by/create";
export const UPDATE_MS_CLEAR_BY = "/v1/ms-clear-by/update";
export const DELETE_MS_CLEAR_BY = "/v1/ms-clear-by/delete";

export const GET_SUPPLIER_ALL_NO_PAGINATION = "/v1/ms-supplier/get_all";
export const SELECT_SUPPLIER = "/v1/ms-supplier/select";
export const SELECT_SUPPLIER_DELIVERY_NOTE = "/v1/supplier-delivery-note/select";
export const GET_SUPPLIER_DELIVERY_NOTE_ALL = "/v1/supplier-delivery-note/get";
export const GET_SUPPLIER_DELIVERY_NOTE_DOC =
  "/v1/supplier-delivery-note/getSupplierDeliveryNoteDoc";
export const GET_SUPPLIER_DELIVERY_NOTE_BY_ID =
  "/v1/supplier-delivery-note/getByID";
export const CREATE_SUPPLIER_DELIVERY_NOTE =
  "/v1/supplier-delivery-note/create";
export const UPDATE_SUPPLIER_DELIVERY_NOTE =
  "/v1/supplier-delivery-note/update";
export const DELETE_SUPPLIER_DELIVERY_NOTE =
  "/v1/supplier-delivery-note/delete";

export const GET_SDN_LIST = "/v1/sdn-repair-receipt-list/get";
export const CREATE_SND_LIST = "/v1/sdn-repair-receipt-list/create";
export const UPDATE_SDN_LIST = "/v1/sdn-repair-receipt-list/update";
export const DELETE_SDN_LIST = "/v1/sdn-repair-receipt-list/delete";
export const CUD_SDN_LIST = "/v1/sdn-repair-receipt-list/update-data";
export const GET_REPAIR_RECIPT_SELECT = "/v1/ms-repair-receipt/get-select";

export const GET_DELIVERY_SCHEDULE_ALL = "/v1/ms-delivery-schedule/get";
export const GET_DELIVERY_SCHEDULE_ALL_NO_PAGINATION =
  "/v1/ms-delivery-schedule/get_all";
export const GET_DELIVERY_SCHEDULE_ALL_PAYMENT_NO_PAGINATION =
  "/v1/ms-delivery-schedule/get_all_payment";
export const SELECT_DELIVERY_SCHEDULE = "/v1/ms-delivery-schedule/select";
export const GET_DELIVERY_SCHEDULE_CALENDAR = "/v1/ms-delivery-schedule/get/delivery_schedule";
export const GET_DELIVERY_SCHEDULE_BY_ID = "/v1/ms-delivery-schedule/get";
export const CREATE_DELIVERY_SCEDULE = "/v1/ms-delivery-schedule/create";
export const UPDATE_DELIVERY_SCEDULE = "/v1/ms-delivery-schedule/update";
export const UPDATE_REQUEST_DELIVERY_SCEDULE =
  "/v1/ms-delivery-schedule/request_delivery";

export const GET_PAYMENT_ALL = "/v1/ms-payment/get";
export const GET_PAYMENT_BY_ID = "/v1/ms-payment/get";
export const GET_PAYMENT_BY_REPAIR_RECEIPT_ID =
  "/v1/ms-payment/get_by_repair_receipt_id";
export const CREATE_PAYMENT = "/v1/ms-payment/create";
export const UPDATE_PAYMENT = "/v1/ms-payment/update";
export const DELETE_PAYMENT = "/v1/ms-payment/delete";
export const GET_BY_SDN_AND_RR_ID_SELECT =
  "/v1/sdn-repair-receipt-list/getByRRID";

export const GET_SUPPLIER_REPAIR_RECEIPT_ALL =
  "/v1/supplier_repair_receipt/get";
export const GET_SUPPLIER_REPAIR_RECEIPT_BY_ID =
  "/v1/supplier_repair_receipt/getById";
export const CREATE_SUPPLIER_REPAIR_RECEIPT =
  "/v1/supplier_repair_receipt/create";
export const UPDATE_SUPPLIER_REPAIR_RECEIPT =
  "/v1/supplier_repair_receipt/update";
export const DELETE_SUPPLIER_REPAIR_RECEIPT =
  "/v1/supplier_repair_receipt/delete";
export const GET_PAYLOAD_FOR_SUPPLIER_REPAIR_RECEIPT =
  "/v1/supplier_repair_receipt/payLoadForSupplierRepairReceipt";
export const SELECT_SUPPLIER_REPAIR_RECEIPT = "/v1/supplier_repair_receipt/select";

export const GET_SUPPLIER_REPAIR_RECEIPT_LIST_ALL =
  "/v1/supplier_repair_receipt_list/get";
export const GET_SUPPLIER_REPAIR_RECEIPT_LIST_BY_ID =
  "/v1/supplier_repair_receipt_list/getById";
export const CREATE_SUPPLIER_REPAIR_RECEIPT_LIST =
  "/v1/supplier_repair_receipt_list/create";
export const UPDATE_SUPPLIER_REPAIR_RECEIPT_LIST =
  "/v1/supplier_repair_receipt_list/update";
export const DELETE_SUPPLIER_REPAIR_RECEIPT_LIST =
  "/v1/supplier_repair_receipt_list/delete";
export const GET_PAYLOAD_LIST_SUPPLIER_REPAIR_RECEIPT =
  "/v1/supplier_repair_receipt_list/payLoadForSupplierRepairReceiptList";
export const UPDATE_FINISH_STATUS_SUPPLIER_REPAIR_RECEIPT_LIST =
  "/v1/supplier_repair_receipt_list/updateFinishStatus";

export const Get_ALL_ROLE = "/v1/role/get";

export const GET_REPAIR_RECEIPT_LIST_REPAIR_LOG_STATUS_BY_REPAIR_RECEIPT_ID =
  "/v1/repair-receipt-list-repair-log-status/get_by_repair_receipt_id";

export const GET_LATE_PAYMENTS = "/v1/ms-delivery-schedule/get_all_overdue_payments";
export const GET_LATE_PAYMENT_BY_ID = "/v1/ms-payment/payment_overdue_summary";

export const GET_PAYMENT_EDITS_ALL = "/v1/payment-edits/get";
export const GET_PAYMENT_EDITS_BY_ID = "/v1/payment-edits/get";
export const GET_PAYMENT_EDITS_BY_PAYMENT_ID =
  "/v1/payment-edits/get_by_payment_id";
export const GET_PAYMENT_EDITS_LOG = "/v1/payment-edits/get_log_by_payment_id";
export const CREATE_PAYMENT_EDITS = "/v1/payment-edits/create";
export const UPDATE_PAYMENT_EDITS = "/v1/payment-edits/update";
export const UPDATE_APPROVE_PAYMENT_EDITS = "/v1/payment-edits/approve";
export const UPDATE_CANCEL_PAYMENT_EDITS = "/v1/payment-edits/cancel";
export const UPDATE_REJECT_PAYMENT_EDITS = "/v1/payment-edits/reject";
export const GET_SEND_FOR_A_CLAIM_ALL = "/v1/send-for-a-claim/get";
export const GET_SEND_FOR_A_CLAIM_BY_ID = "/v1/send-for-a-claim/getByID";
export const CREATE_SEND_FOR_A_CLAIM = "/v1/send-for-a-claim/create";
export const UPDATE_SEND_FOR_A_CLAIM = "/v1/send-for-a-claim/update";
export const DELETE_SEND_FOR_A_CLAIM = "/v1/send-for-a-claim/delete";
export const GET_SUPPLIER_REPAIR_RECEIPT_DOC = "/v1/send-for-a-claim/getSupplierRepairReceiptDoc";
export const GET_SUPPLIER_REPAIR_RECEIPT_LIST_BY_ID_SRRID = "/v1/send-for-a-claim/getBySupplierRepairReceiptId";

export const GET_SEND_FOR_A_CLAIM_LIST_BY_CLAIM_ID = "/v1/send-for-a-claim-list/get";    //send_for_a_claim_id
export const GET_SEND_FOR_A_CLAIM_LIST_BY_CLAIM_LIST_ID = "/v1/send-for-a-claim-list/getByID"; //send_for_a_claim_list_id
export const CREATE_SEND_FOR_A_CLAIM_LIST = "/v1/send-for-a-claim-list/create";
export const UPDATE_SEND_FOR_A_CLAIM_LIST = "/v1/send-for-a-claim-list/update";
export const DELETE_SEND_FOR_A_CLAIM_LIST = "/v1/send-for-a-claim-list/delete";
export const CUD_SEND_FOR_A_CLAIM_LIST = "/v1/send-for-a-claim-list/update-data";
export const GET_DASHBOARD_TOP_TEN_CUSTOMER = "/v1/dashboard-customer-quotation/getTopTenCustomer";
export const GET_DASHBOARD_QUOTATION_STATUS = "/v1/dashboard-customer-quotation/getQuotationStatus";
export const GET_DASHBOARD_PRICE_ALL = "/v1/dashboard-customer-quotation/getTotalAmount";

export const GET_RECEIVE_FOR_A_CLAIM_ALL = "/v1/receive-for-a-claim/get";
export const GET_RECEIVE_FOR_A_CLAIM_BY_ID = "/v1/receive-for-a-claim/getByID";
export const CREATE_RECEIVE_FOR_A_CLAIM = "/v1/receive-for-a-claim/create";
export const UPDATE_RECEIVE_FOR_A_CLAIM = "/v1/receive-for-a-claim/update";
export const DELETE_RECEIVE_FOR_A_CLAIM = "/v1/receive-for-a-claim/delete";
export const GET_SEND_FOR_A_CLAIM_DOC = "/v1/receive-for-a-claim/getSendForClaimDoc";
export const GET_RECEIVE_FOR_A_CLAIM_Pay_Load_For_Receive_For_A_Claim_List_ALL
  = "/v1/receive-for-a-claim/payLoadForReceiveForAClaim";
export const SELECT_SEND_FOR_A_CLAIM = "/v1/send-for-a-claim/select";

export const GET_RECEIVE_FOR_A_CLAIM_LIST_ALL = "/v1/receive-for-a-claim-list/get";
export const GET_RECEIVE_FOR_A_CLAIM_LIST_BY_RECEIVE_FOR_A_CLAIM_LIST_ID = "/v1/receive-for-a-claim-list/getByID";
export const CREATE_RECEIVE_FOR_A_CLAIM_LIST = "/v1/receive-for-a-claim-list/create";
export const UPDATE_RECEIVE_FOR_A_CLAIM_LIST = "/v1/receive-for-a-claim-list/update";
export const DELETE_RECEIVE_FOR_A_CLAIM_LIST = "/v1/receive-for-a-claim-list/delete";
export const GET_RECEIVE_FOR_A_CLAIM_LIST_PAYLOAD = "/v1/receive-for-a-claim-list/payLoadForReceiveForAClaimList";

export const GET_DEBTORS_ALL = "/v1/ms-delivery-schedule/get_customers";
export const GET_INACTIVE_CUSTOMERS = "/v1/ms-delivery-schedule/get_inactive_customers";
export const Get_QR_Code = "/v1/Qrcode/qr";

export const GET_DASHBOARD_TOP_TEN_EMPLOYEE = "/v1/dashboard-customer-quotation/getTopTenSale";
export const GET_DASHBOARD_QUOTATION_SUMMARY = "/v1/dashboard-customer-quotation/getQuotationSummary";

export const SEARCH_FROM_REGISTER ="/v1/other/search-register";