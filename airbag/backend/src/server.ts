import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import errorHandler from "@common/middleware/errorHandler";
import cookieParser from "cookie-parser";

import { env } from "@common/utils/envConfig";
import { pino } from "pino";
import { groupRouterRepair } from "@modules/ms-group-repair/ms-group-repairRouter";
import { issueReasonRouter } from "@modules/ms-issue-reason/issueReasonRouter";
import { userRouter } from "@modules/users/userRouter";
import { toolRouter } from "@modules/tool/toolRouter";
import { colorRouter } from "@modules/ms_color/colorRouter";
import { ms_customerRouter } from "@modules/master_customer/ms_customer-Router";
import { mspositionRouter } from "@modules/ms_position/ms_positionRouter";
import { msTypeIssueReasonRouter } from "@modules/ms-type-issue-reason/selectTypeIssueReasonRouter";
import { brandRouter } from "@modules/ms-brand/ms-brandRouter";
import { ms_repairRouter } from "@modules/ms_repair/ms-repairRouter";
import { brandModelRouter } from "@modules/ms-brandmodel/ms-brandModelRouter";
import { msSupplierRouter } from "@modules/ms-supplier/ms-supplierRouter";

import { ms_companiesModelRouter } from "@modules/ms-companies/ms_companiesModelRouter";
import { quotationRouter } from "@modules/quotation/quotationRouter";
import { visitCustomerRouter } from "@modules/visit-customer/visitCustomerRouter";
import { responsiblePersonRouter } from "@modules/responsible-person/responsiblePersonRouter";
import { quotationRepairRouter } from "@modules/quotation-repair/quotationRepairRouter";
import { fileRouter } from "@modules/file/fileRouter";
import { repairReceiptRouter } from "@modules/ms-repair-receipt/repairReceiptRouter";
import { repairReceiptListRepairRouter } from "@modules/repair-receipt-list-repair/repairReceiptListRepairRouter";
import { toolingReasonRouter } from "@modules/ms-tooling-reason/ms-tooling-reasonRouter";
import { clearByReasonRouter } from "@modules/master_clear_by/ms-clear-by-reasonRouter";
import { supplierDeliveryNoteRouter } from "@modules/supplier-delivery-note/supplierDeliveryNoteRouter";
import { sdnRepairReceiptListRouter } from "@modules/sdn-repair-receipt-list/sdnRepairReceiptListRouter";
import { deliveryScheduleRouter } from "@modules/ms-delivery-shedule/deliveryScheduleRouter";
import { paymentRouter } from "@modules/ms-payment/paymentRouter";
import { quotationLogStatusRouter } from "@modules/quotation_log_status/quotationLogStatusRouter";
import { supplierRepairReceiptRouter } from "@modules/supplier_repair_receipt/supplierRepairReceiptRouter";
import { supplierRepairReceiptListRouter } from "@modules/supplier_repair_receipt_list/supplierRepairReceiptListRouter";
import { repairReceiptListRepairLogStatusRouter } from "@modules/repair_receipt_list_repair_log_status/repairReceiptListRepairLogStatusRouter";
import { roleRouter } from "@modules/role/roleRouter";
import { paymentEditsRouter } from "@modules/payment_edits/paymentEditsRouter";
import { sendForAClaimRouter } from "@modules/send-for-a-claim/sendForAClaimRouter";
import { sendForAClaimListRouter } from "@modules/send-for-a-claim-list/sendForAClaimListRouter";
import { dashboardCQRouter } from "@modules/dashboardCustomerQuotation/dashboardCQRouter";
import { receiveForAClaimRouter } from "@modules/receive_for_a_claim/receiveForClaimRouter";
import { receiveForAClaimListRouter } from "@modules/receive_for_a_claim_list/receiveForClaimListRouter";
import { GetQrcode } from "@modules/qrcode/GetQrcode";
import { otherRouter } from "@modules/other/otherRouter";

const logger = pino({ name: "server start" });
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

// Routes
app.use("/v1/tool", toolRouter);
app.use("/v1/ms-issue-reason", issueReasonRouter);
app.use("/v1/ms-type-issue-reason", msTypeIssueReasonRouter);
app.use("/v1/user", userRouter);
app.use("/v1/color", colorRouter);
app.use("/v1/customer", ms_customerRouter);
app.use("/v1/ms-position", mspositionRouter);
app.use("/v1/ms-group-repair", groupRouterRepair);
app.use("/v1/ms-brand", brandRouter);
app.use("/v1/ms-repair", ms_repairRouter);
app.use("/v1/ms-brandModel", brandModelRouter);
app.use("/v1/ms-supplier", msSupplierRouter);
app.use("/v1/ms-companies", ms_companiesModelRouter);
app.use("/v1/quotation", quotationRouter);
app.use("/v1/quotation-log-status", quotationLogStatusRouter);
app.use("/v1/quotation-repair", quotationRepairRouter);
app.use("/v1/repair-receipt-list-repair", repairReceiptListRepairRouter);
app.use("/v1/ms-repair-receipt", repairReceiptRouter);
app.use("/v1/visit-customer", visitCustomerRouter);
app.use("/v1/responsible-person", responsiblePersonRouter);
app.use("/v1/file", fileRouter);
app.use("/v1/ms-tooling-reason", toolingReasonRouter);
app.use("/v1/ms-clear-by", clearByReasonRouter);
app.use("/v1/supplier-delivery-note", supplierDeliveryNoteRouter);
app.use("/v1/sdn-repair-receipt-list", sdnRepairReceiptListRouter);
app.use("/v1/ms-delivery-schedule", deliveryScheduleRouter);
app.use("/v1/ms-payment", paymentRouter);
app.use("/v1/supplier_repair_receipt", supplierRepairReceiptRouter);
app.use("/v1/supplier_repair_receipt_list", supplierRepairReceiptListRouter);
app.use(
  "/v1/repair-receipt-list-repair-log-status",
  repairReceiptListRepairLogStatusRouter
);
app.use("/v1/role", roleRouter)
app.use("/v1/payment-edits", paymentEditsRouter);
app.use("/v1/send-for-a-claim", sendForAClaimRouter);
app.use("/v1/send-for-a-claim-list", sendForAClaimListRouter);
app.use("/v1/dashboard-customer-quotation", dashboardCQRouter);
app.use("/v1/receive-for-a-claim", receiveForAClaimRouter);
app.use("/v1/receive-for-a-claim-list", receiveForAClaimListRouter);

app.use("/v1/Qrcode", GetQrcode);
app.use("/v1/other", otherRouter);

app.use(errorHandler());
export { app, logger };
