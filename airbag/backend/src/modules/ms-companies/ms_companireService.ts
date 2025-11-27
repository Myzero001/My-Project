import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { companiesRepository } from "@modules/ms-companies/ms_companiesRepository";
import { TypePayloadMastercompanies } from "@modules/ms-companies/ms_companiesModel";
import { companies } from "@prisma/client";


export const CompaniesService = {


    findAll: async (companyId:string,page: number = 1, pageSize: number = 12,searchText:string="") => {
        try {
            const skip = (page - 1) * pageSize;
            const companies = await companiesRepository.findAll(companyId,skip, pageSize,searchText);
            const totalCount = await companiesRepository.count(companyId,searchText);

            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data: companies,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
                StatusCodes.OK
            );
        } catch (error) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching companies",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    //payload, uuid, companyId
    create: async (
        companyId: string,
        userId: string,
        payload: TypePayloadMastercompanies) => {
        try {
            const createCompany = await companiesRepository.create(companyId, userId, payload);
            return new ServiceResponse<companies>(
                ResponseStatus.Success,
                "Create company success",
                createCompany,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create company: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    

    update: async (company_id: string, userId: string, payload: TypePayloadMastercompanies) => {
        try {
            const checkCompany = await companiesRepository.findById(company_id);
            if (!checkCompany) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Company not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const updateCompany = await companiesRepository.update(company_id,userId, payload);
            return new ServiceResponse< companies>(
                ResponseStatus.Success,
                "Update company success",
                updateCompany,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error update company: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    delete: async (userId:string,company_id: string) => {
        try {
            const companies = await companiesRepository.findById(company_id);
            if (!companies) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Company not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            await companiesRepository.delete(company_id);
            return new ServiceResponse<string>(
                ResponseStatus.Success,
                "Delete company success",
                "Delete company success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error delete company: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    findById: async (companyId: string) => {
        try {
          const customer = await companiesRepository.findById(
            companyId,
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

}

