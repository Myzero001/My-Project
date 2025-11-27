import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { msSupplierRepository } from "@modules/ms-supplier/ms-supplierRepository";
import { TypePayloadMasterSupplier } from "@modules/ms-supplier/ms-supplierModel";
import { master_supplier } from "@prisma/client";


export const supplierService = {
    findAll: async (companyId: string, page: number = 1, pageSize: number = 12, searchText: string = "") => {
        try {
            const skip = (page - 1) * pageSize;
            const supplier = await msSupplierRepository.findAll(companyId, skip, pageSize, searchText);
            if (!supplier) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "No suppliers found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const totalCount = await msSupplierRepository.count(companyId, searchText);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data: supplier,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
                StatusCodes.OK
            );
        } catch {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching suppliers",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    create: async (companyId: string, userId: string, payload: TypePayloadMasterSupplier) => {
        try {
            const supplier = await msSupplierRepository.findByName(companyId, payload.supplier_code);
            if (supplier) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Supplier already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }

            const newSupplier = await msSupplierRepository.create(companyId, userId, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Create supplier success",
                newSupplier,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create supplier: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    update: async (companyId: string, userId: string, supplier_id: string, payload: TypePayloadMasterSupplier) => {
        try {
            const supplier = await msSupplierRepository.findByIdAsync(companyId, supplier_id);
            if (!supplier) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Supplier not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            const updatedSupplier = await msSupplierRepository.update(companyId, userId, supplier_id, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update supplier success",
                "Update supplier success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error update supplier: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    delete: async (companyId: string, supplier_id: string) => {
        try {
            const supplier = await msSupplierRepository.findByIdAsync(companyId, supplier_id);
            if (!supplier) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Supplier not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            await msSupplierRepository.delete(companyId, supplier_id);
            return new ServiceResponse<string>(
                ResponseStatus.Success,
                "Delete supplier success",
                "Delete supplier success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error delete supplier: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findOne: async (companyId: string, supplier_id: string) => {
        try {
            const supplier = await msSupplierRepository.findByIdAsync(companyId, supplier_id);

            if (!supplier) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Supplier not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get supplier success",
                supplier,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error get supplier: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findAllNoPagination: async (companyId : string) => {
        try {
            const res = await msSupplierRepository.findAllNoPagination(companyId);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                res,
                StatusCodes.OK
            );
        } catch (error) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching suppliers",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    select: async (companyId: string , searchText: string = "") => {
    try {
        const data = await msSupplierRepository.select(companyId , searchText);
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

}