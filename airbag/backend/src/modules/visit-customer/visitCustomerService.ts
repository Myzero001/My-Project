import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { visitCustomerRepository } from "@modules/visit-customer/visitCustomerRepository";
import { TypePayloadVisitCustomer } from "@modules/visit-customer/visitCustomerModel";
import { customer_visit } from "@prisma/client";
import { generateCustomerVisitDoc } from "@common/utils/generateCustomerVisitDoc";



export const visitCustomerService = {
    findAll: async (
        companyId: string,
        page: number = 1,
        pageSize: number = 12,
        searchText: string = ""
    ) => {
        try {
            const skip = (page - 1) * pageSize;
            const CustomerVisit = await visitCustomerRepository.findAll(companyId, skip, pageSize, searchText);
            if (!CustomerVisit) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "No CustomerVisit found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const totalCount = await visitCustomerRepository.count(companyId,searchText);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data: CustomerVisit,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error fetching CustomerVisit: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching CustomerVisit",
                errorMessage,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    create: async (companyId: string, userId: string, payload: TypePayloadVisitCustomer) => {
        try {
            // const CustomerVisit = await visitCustomerRepository.findByName(companyId, payload.customer_code);
            // if (CustomerVisit) {
            //     return new ServiceResponse(
            //         ResponseStatus.Failed,
            //         "Customer already exists",
            //         null,
            //         StatusCodes.BAD_REQUEST
            //     )
            // }
            payload.customer_visit_doc = await generateCustomerVisitDoc(companyId);

            const newCustomerVisit = await visitCustomerRepository.create(companyId, userId, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Create CustomerVisit success",
                newCustomerVisit,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create CustomerVisit: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    update: async (companyId: string, userId: string, customer_visit_id: string, payload: TypePayloadVisitCustomer) => {
        try {
            const visitcustomer = await visitCustomerRepository.findByIdAsync(companyId, customer_visit_id);
            if (!visitcustomer) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "CustomerVisit not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            // const checkSupplier = await msSupplierRepository.findByName(companyId, payload.supplier_code);
            // if (checkSupplier) {
            //     return new ServiceResponse(
            //         ResponseStatus.Failed,
            //         "Supplier already exists",
            //         null,
            //         StatusCodes.BAD_REQUEST
            //     )
            // }
            const updatedVisitcustomer = await visitCustomerRepository.update(companyId, userId, customer_visit_id, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update customer visit success",
                "Update customer visit success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error update visit customer: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    delete: async (companyId: string, customer_visit_id: string) => {
        try {
            const visitcustomer = await visitCustomerRepository.findByIdAsync(companyId, customer_visit_id);
            if (!visitcustomer) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    " visit customer not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            await visitCustomerRepository.delete(companyId, customer_visit_id);
            return new ServiceResponse<string>(
                ResponseStatus.Success,
                "delete visit customer success",
                "delete visit customer success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error delete  visit customer: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findOne: async (companyId: string, customer_visit_id: string) => {
        try {
            const visitcustomer = await visitCustomerRepository.findByIdAsync(companyId, customer_visit_id);

            if (!visitcustomer) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "visit customer not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get visit customer success",
                visitcustomer,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error get visit customer: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
}