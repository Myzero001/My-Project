import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { customerRepository } from "@modules/master_customer/ms_customer-Repository";
import { TypePayloadMasterCustomer } from "@modules/master_customer/ms_customer-Model";
import { master_customer } from "@prisma/client";

export const CustomerService = {
  findAll: async (
    companyId: string,
    page: number = 1,
    pageSize: number = 12,
    searchText: string = ""

  ) => {
    try {
      const skip = (page - 1) * pageSize;
      const customer = await customerRepository.findAll(
        companyId,
        skip,
        pageSize
        ,searchText
      );
      const totalCount = await customerRepository.count(companyId,searchText);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: customer,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching customer",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  findAllNoPagination: async (companyId: string) => {
    try {
      const customer = await customerRepository.findAllNoPagination(companyId);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        customer,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching customer",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  select: async (companyId: string , searchText: string = "") => {
    try {
      const data = await customerRepository.select(companyId , searchText);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Select success",
        {data},
        StatusCodes.OK
      );
      
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching select",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  findById: async (companyId: string, customer_id: string) => {
    try {
      const customer = await customerRepository.findById(
        companyId,
        customer_id
      );
      if (!customer) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Customer not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get customer success",
        customer,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error get customer: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  create: async (
    conpanyId: string,
    userId: string,
    payload: TypePayloadMasterCustomer
  ) => {
    try {
      const checkCustomer = await customerRepository.findByName(
        conpanyId,
        payload.customer_code
      );
      if (checkCustomer) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Customer name already taken",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      // ใช้ `customerRepository.create` เพื่อสร้างลูกค้าใหม่
      const customer = await customerRepository.create(
        conpanyId,
        userId,
        payload
      );
      return new ServiceResponse(
        ResponseStatus.Success,
        "Create customer success",
        customer,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error create customer: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  createWithRequiredFields: async (
    companyId: string,
    userId: string,
    payload: TypePayloadMasterCustomer
  ) => {
    try {
      const checkCustomer = await customerRepository.findByName(
        companyId,
        payload.customer_code
      );
      if (checkCustomer) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Customer code already exists",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const customer = await customerRepository.createWithRequiredFields(
        companyId,
        userId,
        payload
      );
      return new ServiceResponse(
        ResponseStatus.Success,
        "Customer created successfully",
        customer,
        StatusCodes.CREATED
      );
    } catch (ex) {
      const errorMessage = "Error creating customer: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  update: async (
    customer_id: string,
    payload: TypePayloadMasterCustomer,
    companyId: string,
    userId: string
  ) => {
    try {
      // ตรวจสอบว่ามี customer_code ในระบบหรือไม่
      const existingCustomer = await customerRepository.findById(
        companyId,
        customer_id
      );
      if (!existingCustomer) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Customer not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      const updatedCustomer = await customerRepository.update(
        companyId,
        userId,
        customer_id,
        payload
      );

      return new ServiceResponse(
        ResponseStatus.Success,
        "Update customer success",
        updatedCustomer,
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage =
        "Error updating customer: " + (error as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  delete: async (companyId: string, customer_id: string) => {
    try {
      if (!customer_id) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Customer ID is required",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const checkCustomer = await customerRepository.findById(
        companyId,
        customer_id
      );
      if (!checkCustomer) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Customer not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      const deletedCustomer = await customerRepository.delete(
        companyId,
        customer_id
      );
      return new ServiceResponse(
        ResponseStatus.Success,
        "Delete customer success",
        "Delete customer success",
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage =
        "Error deleting customer: " + (error as Error).message;
      console.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,

        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
