import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { brandRepository } from "@modules/ms-brand/ms-brandRepository";
import { TypePayloadMasterBrand } from "@modules/ms-brand/ms-brandModel";
import { master_brand } from "@prisma/client";

export const brandService = {
  findAll: async (companyId: string, page: number = 1, pageSize: number = 12, searchText: string = "") => {
    try {
      const skip = (page - 1) * pageSize;
      const group = await brandRepository.findAll(companyId, skip, pageSize, searchText);
      const totalCount = await brandRepository.count(companyId, searchText);


      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: group,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching brands",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findAllNoPagination: async (companyId: string) => {
    try {
      const customer = await brandRepository.findAllNoPagination(companyId);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        customer,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching brand",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadMasterBrand
  ) => {
    try {
      const checkBrand = await brandRepository.findByName(
        companyId,
        payload.brand_name
      );
      if (checkBrand) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Brand already taken",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const brand = await brandRepository.create(companyId, userId, payload);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Create brand success",
        brand, // ส่งเฉพาะ brand_name, updated_at, updated_by
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error create brand: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  update: async (
    companyId: string,
    userId: string,
    master_brand_id: string,
    payload: TypePayloadMasterBrand
  ) => {
    try {
      const checkBrandId = await brandRepository.findByIdAsync(
        companyId,
        master_brand_id
      );
      if (!checkBrandId) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Brand not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const checkBrand = await brandRepository.findByName(
        companyId,
        payload.brand_name
      );
      if (checkBrand) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Brand already taken",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const brand = await brandRepository.update(
        companyId,
        userId,
        master_brand_id,
        payload
      );
      return new ServiceResponse(
        ResponseStatus.Success,
        "Brand updated successfully",
        brand, // ส่งเฉพาะ brand_name, updated_at, updated_by
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error update brand: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  delete: async (companyId: string, master_brand_id: string) => {
    try {
      const checkBrand = await brandRepository.findByIdAsync(
        companyId,
        master_brand_id
      );
      if (!checkBrand) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Brand not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const checkBarndModelInBrand = await brandRepository.checkBarndModelInBrand(companyId, master_brand_id);
      if (checkBarndModelInBrand) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Brand model in brand",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      await brandRepository.delete(companyId, master_brand_id);
      return new ServiceResponse<string>(
        ResponseStatus.Success,
        "Delete brand success",
        "Delete brand success",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error delete brand: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findById: async (companyId: string, master_brand_id: string) => {
    try {
      const brand = await brandRepository.findByIdAsync(
        companyId,
        master_brand_id
      );
      if (!brand) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Brand not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      return new ServiceResponse<master_brand>(
        ResponseStatus.Success,
        "Brand found",
        brand,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error get brand request: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findMinimal: async (companyId: string) => {
    try {
      const brands = await brandRepository.findMinimal(companyId);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get minimal brand data success",
        brands,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching minimal brand data",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  select: async (companyId: string , searchText: string = "") => {
    try {
      const data = await brandRepository.select(companyId , searchText);
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
};
