import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { payment_edits, payment_edits_log } from "@prisma/client";

import { paymentEditsRepository } from "./paymentEditsRepository";
import {
  PAYMENT_EDITS_STATUS,
  TypePayloadPaymentEdits,
} from "./paymentEditsModel";
import { deliveryScheduleRepository } from "@modules/ms-delivery-shedule/deliveryScheduleRepository";
import { generatePaymentDoc } from "@common/utils/generatePayment";
import { repairReceiptRepository } from "@modules/ms-repair-receipt/repairReceiptRepository";
import { TypePayloadPaymentEditsLog } from "@modules/payment-edits-log/paymentEditsLogModel";
import { paymentEditsLogRepository } from "@modules/payment-edits-log/paymentEditsLogRepository";
import { paymentRepository } from "@modules/ms-payment/paymentRepository";
import { TypePayloadPayment } from "@modules/ms-payment/paymentModel";

export const paymentEditsService = {
  findAll: async (
    companyId: string,
    page: number = 1,
    pageSize: number = 12,
    searchText: string = "",
    status: string = "all"
  ) => {
    try {
      const skip = (page - 1) * pageSize;
      const receipts = await paymentEditsRepository.findAll(
        companyId,
        skip,
        pageSize,
        searchText,
        status
      );
      const totalCount = await paymentEditsRepository.count(
        companyId,
        searchText,
        status
      );

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: receipts,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching payment ",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  findAllNoPagination: async () => {
    try {
      const customer = await paymentEditsRepository.findAllNoPagination();
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        customer,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching payment",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  create: async (
    payload: TypePayloadPaymentEdits,
    userId: string,
    company_id: string
  ) => {
    try {
      payload.company_id = company_id;
      payload.created_by = userId;
      payload.updated_by = userId;
      payload.edit_status = PAYMENT_EDITS_STATUS.PENDING;

      // สร้างข้อมูลใหม่
      const response = await paymentEditsRepository.create(payload);

      const payloadLog: TypePayloadPaymentEditsLog = {
        payment_edit_id: response.id,
        payment_id: response.payment_id,
        edit_status: PAYMENT_EDITS_STATUS.PENDING,
        old_data: response.old_data,
        new_data: response.new_data,
        created_by: userId,
        updated_by: userId,
        company_id: company_id,
        remark: payload.remark,
      };

      await paymentEditsLogRepository.create(payloadLog);

      return new ServiceResponse<payment_edits>(
        ResponseStatus.Success,
        "Create payment edits success",
        response,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating payment edits: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  update: async (
    id: string,
    payload: Partial<TypePayloadPaymentEdits>,
    userId: string
  ) => {
    try {
      const response = await paymentEditsRepository.findByPaymentId(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "payment edits not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      payload.edit_status = PAYMENT_EDITS_STATUS.PENDING;
      payload.updated_by = userId;
      // อัปเดตข้อมูล

      const updatedPayment = await paymentEditsRepository.update(
        response[0].id,
        payload
      );

      const payloadLog: TypePayloadPaymentEditsLog = {
        payment_edit_id: response[0].id,
        payment_id: response[0].payment_id,
        edit_status: PAYMENT_EDITS_STATUS.PENDING,
        old_data: response[0].old_data,
        new_data: response[0].new_data,
        created_by: userId,
        updated_by: userId,
        remark: payload.remark,
      };

      await paymentEditsLogRepository.create(payloadLog);

      return new ServiceResponse<payment_edits>(
        ResponseStatus.Success,
        "Update payment edits success",
        updatedPayment,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating payment edits: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  approve: async (
    id: string,
    payload: Partial<TypePayloadPaymentEdits>,
    userId: string,
    company_id: string
  ) => {
    payload.edit_status = PAYMENT_EDITS_STATUS.APPROVED;
    payload.updated_by = userId;

    try {
      const checkPaymentEdits =
        await paymentEditsRepository.findByPaymentId(id);
      if (!checkPaymentEdits) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Payment Edits id not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัปเดตข้อมูล
      const updatedPaymentEdits = await paymentEditsRepository.approve(
        checkPaymentEdits[0].id,
        payload
      );
      if (checkPaymentEdits[0].master_payment) {
        const payloadPayment: any = {
          ...checkPaymentEdits[0].master_payment,
          remark: checkPaymentEdits[0].remark ?? "",
          company_id: checkPaymentEdits[0].company_id ?? "",
        };
        // if (!checkPaymentEdits[0].master_payment.check_number) {
        //   payloadPayment.check_number = "";
        // }
        // if (!checkPaymentEdits[0].master_payment.bank_name) {
        //   payloadPayment.bank_name = "";
        // }
        const newData: any = JSON.parse(checkPaymentEdits[0].new_data);
        if (newData?.remark) {
          payloadPayment.remark = newData.remark;
        }
        if (newData?.option_payment) {
          payloadPayment.option_payment = newData.option_payment;
        }
        if (newData?.type_money) {
          payloadPayment.type_money = newData.type_money;
        }
        if (newData?.price) {
          payloadPayment.price = newData.price;
        }
        if (newData?.tax) {
          payloadPayment.tax = newData.tax;
        }
        if (newData?.tax) {
          payloadPayment.total_price = newData.total_price;
        }
        if (newData?.check_number) {
          payloadPayment.check_number = newData.check_number;
        }
        if (newData?.check_date) {
          payloadPayment.check_date = newData.check_date;
        }
        if (newData?.bank_name) {
          payloadPayment.bank_name = newData.bank_name;
        }
        payload.updated_by = userId;
        // อัปเดตข้อมูล
        await paymentRepository.update(
          checkPaymentEdits[0].payment_id,
          payloadPayment
        );
      }

      const payloadLog: TypePayloadPaymentEditsLog = {
        payment_edit_id: checkPaymentEdits[0].id,
        payment_id: updatedPaymentEdits.payment_id,
        edit_status: PAYMENT_EDITS_STATUS.APPROVED,
        old_data: updatedPaymentEdits.old_data,
        new_data: updatedPaymentEdits.new_data,
        created_by: userId,
        updated_by: userId,
        company_id: company_id,
        remark: payload.remark,
      };

      await paymentEditsLogRepository.create(payloadLog);

      return new ServiceResponse<payment_edits>(
        ResponseStatus.Success,
        "Approve payment edits success",
        updatedPaymentEdits,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error approve payment edits: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  cancel: async (
    id: string,
    payload: Partial<TypePayloadPaymentEdits>,
    userId: string,
    company_id: string
  ) => {
    payload.edit_status = PAYMENT_EDITS_STATUS.CANCELED;
    payload.updated_by = userId;

    try {
      const checkpaymentEdits =
        await paymentEditsRepository.findByPaymentId(id);
      if (!checkpaymentEdits) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Payment Edits id not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      // อัปเดตข้อมูล
      const updatedPaymentEdits = await paymentEditsRepository.cancel(
        checkpaymentEdits[0].id,
        payload
      );

      const payloadLog: TypePayloadPaymentEditsLog = {
        payment_edit_id: checkpaymentEdits[0].id,
        payment_id: updatedPaymentEdits.payment_id,
        edit_status: PAYMENT_EDITS_STATUS.CANCELED,
        old_data: updatedPaymentEdits.old_data,
        new_data: updatedPaymentEdits.new_data,
        created_by: userId,
        updated_by: userId,
        company_id: company_id,
        remark: payload.remark,
      };

      await paymentEditsLogRepository.create(payloadLog);

      return new ServiceResponse<payment_edits>(
        ResponseStatus.Success,
        "Cancel payment edits success",
        updatedPaymentEdits,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error cancel payment edits: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  reject: async (
    id: string,
    payload: Partial<TypePayloadPaymentEdits>,
    userId: string,
    company_id: string
  ) => {
    payload.edit_status = PAYMENT_EDITS_STATUS.REJECTED;
    payload.updated_by = userId;

    try {
      const checkpaymentEdits =
        await paymentEditsRepository.findByPaymentId(id);
      if (!checkpaymentEdits) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Payment Edits id not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      // อัปเดตข้อมูล
      const updatedPaymentEdits = await paymentEditsRepository.reject(
        checkpaymentEdits[0].id,
        payload
      );

      const payloadLog: TypePayloadPaymentEditsLog = {
        payment_edit_id: checkpaymentEdits[0].id,
        payment_id: updatedPaymentEdits.payment_id,
        edit_status: PAYMENT_EDITS_STATUS.REJECTED,
        old_data: updatedPaymentEdits.old_data,
        new_data: updatedPaymentEdits.new_data,
        created_by: userId,
        updated_by: userId,
        company_id: company_id,
        remark: payload.remark,
      };

      await paymentEditsLogRepository.create(payloadLog);

      return new ServiceResponse<payment_edits>(
        ResponseStatus.Success,
        "Reject payment edits success",
        updatedPaymentEdits,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error reject payment edits: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // delete: async (id: string) => {
  //   try {
  //     const response = await paymentEditsRepository.findById(id);
  //     if (!response) {
  //       return new ServiceResponse(
  //         ResponseStatus.Failed,
  //         "payment not found",
  //         null,
  //         StatusCodes.BAD_REQUEST
  //       );
  //     }

  //     // ลบข้อมูล
  //     await paymentEditsRepository.delete(id);

  //     if (response.payment_image_url) {
  //       await fileService.delete(response.payment_image_url);
  //     }

  //     return new ServiceResponse<string>(
  //       ResponseStatus.Success,
  //       "Delete payment success",
  //       "payment deleted successfully",
  //       StatusCodes.OK
  //     );
  //   } catch (ex) {
  //     const errorMessage = `Error deleting payment: ${(ex as Error).message}`;
  //     return new ServiceResponse(
  //       ResponseStatus.Failed,
  //       errorMessage,
  //       null,
  //       StatusCodes.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // },

  findById: async (id: string) => {
    try {
      const response = await paymentEditsRepository.findById(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "payment not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<payment_edits>(
        ResponseStatus.Success,
        "payment found",
        response,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching payment: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findAllById: async (id: string) => {
    try {
      const response = await paymentEditsRepository.findAllById(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "payment not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<payment_edits>(
        ResponseStatus.Success,
        "payment found",
        response,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching payment: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findByPaymentId: async (id: string) => {
    try {
      const response = await paymentEditsRepository.findByPaymentId(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "payment not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<payment_edits[]>(
        ResponseStatus.Success,
        "payment found",
        response,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching payment: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  findLogByPaymentId: async (id: string) => {
    try {
      const response = await paymentEditsRepository.findLogByPaymentId(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "payment not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<payment_edits[]>(
        ResponseStatus.Success,
        "payment found",
        response,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching payment: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
