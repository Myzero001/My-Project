import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { fileService } from "@modules/file/fileService";
import { master_delivery_schedule, master_payment } from "@prisma/client";

import { paymentRepository } from "./paymentRepository";
import { PAYMENT_STATUS, TypePayloadPayment } from "./paymentModel";
import { deliveryScheduleRepository } from "@modules/ms-delivery-shedule/deliveryScheduleRepository";
import { generatePaymentDoc } from "@common/utils/generatePayment";
import { repairReceiptRepository } from "@modules/ms-repair-receipt/repairReceiptRepository";

export const paymentService = {
  findAll: async (
    companyId: string,
    page: number = 1,
    pageSize: number = 12,
    searchText: string = "",
    status: string = "all"
  ) => {
    try {
      const skip = (page - 1) * pageSize;
      const receipts = await paymentRepository.findAll(
        companyId,
        skip,
        pageSize,
        searchText,
        status
      );
      const totalCount = await paymentRepository.count(
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
  findAllNoPagination: async (company_id: string) => {
    try {
      const customer = await paymentRepository.findAllNoPagination(company_id);
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
    payload: TypePayloadPayment,
    userId: string,
    company_id: string
  ) => {
    try {
      const responseDeliveryScheduleById =
        await deliveryScheduleRepository.findAllById(
          payload.delivery_schedule_id
        );
      if (responseDeliveryScheduleById?.master_repair_receipt.id) {
        const responsePaymentRepository =
          await paymentRepository.findAllByRepairReceiptId(
            responseDeliveryScheduleById.master_repair_receipt.id
          );
        const totalPriceReceipt = responsePaymentRepository.reduce(
          (sum, item) => sum + item.price,
          0
        );
        const totalPriceAll =
          responseDeliveryScheduleById.master_repair_receipt.total_price ?? 0;
        if (
          payload.price > totalPriceAll - totalPriceReceipt ||
          totalPriceAll - totalPriceReceipt === 0
        ) {
          return new ServiceResponse(
            ResponseStatus.Failed,
            `ยอดคงเหลือที่ต้องชำระคือ ${(totalPriceAll - totalPriceReceipt).toLocaleString()} บาท ไม่สามารถรับชำระเกินจำนวนนี้ได้`,
            null,
            StatusCodes.BAD_REQUEST
          );
        }
      }

      // payload.payment_doc = "PM20240507001";
      payload.payment_doc = await generatePaymentDoc();
      payload.company_id = company_id;
      payload.created_by = userId;
      payload.updated_by = userId;
      payload.status = PAYMENT_STATUS.OVERDUE;
      // สร้างข้อมูลใหม่
      const response = await paymentRepository.create(payload);
      return new ServiceResponse<master_payment>(
        ResponseStatus.Success,
        "Create payment success",
        response,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating payment: ${(ex as Error).message}`;
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
    payload: Partial<TypePayloadPayment>,
    userId: string
  ) => {
    try {
      const response = await paymentRepository.findById(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "payment not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      payload.updated_by = userId;
      // อัปเดตข้อมูล
      const updatedPayment = await paymentRepository.update(id, payload);

      return new ServiceResponse<master_payment>(
        ResponseStatus.Success,
        "Update payment success",
        updatedPayment,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating payment: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  delete: async (id: string) => {
    try {
      const response = await paymentRepository.findById(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "payment not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // ลบข้อมูล
      await paymentRepository.delete(id);

      if (response.payment_image_url) {
        await fileService.delete(response.payment_image_url);
      }

      return new ServiceResponse<string>(
        ResponseStatus.Success,
        "Delete payment success",
        "payment deleted successfully",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error deleting payment: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findById: async (id: string) => {
    try {
      const response = await deliveryScheduleRepository.findById(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "payment not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<master_delivery_schedule>(
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
      const response = await paymentRepository.findAllById(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "payment not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<master_payment>(
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
  findAllByRepairReceiptId: async (repairReceiptId: string) => {
    try {
      const response =
        await paymentRepository.findAllByRepairReceiptId(repairReceiptId);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "payment not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      return new ServiceResponse<master_payment[]>(
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
