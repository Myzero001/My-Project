import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { colorRepository } from "@modules/ms_color/colorRepository";
import { TypePayloadColor } from "@modules/ms_color/colorModel";
import { master_color } from "@prisma/client";
import {quotationRepository} from "@modules/quotation/quotationRepository"

export const colorService = {
    findAll: async (companyId: string,page: number = 1, pageSize: number=12,searchText:string="") => {
        try{
            const skip = (page - 1) * pageSize;
            const color = await colorRepository.findAll(companyId,skip, pageSize,searchText);
            const totalCount = await colorRepository.count(companyId,searchText);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data: color,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
                StatusCodes.OK
            );
        }
        catch(error){
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching color",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    create: async (companyId: string, userId: string, payload: TypePayloadColor) => {
        const color_name = payload.color_name.trim();
        if (!color_name) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Color name is required",
                null,
                StatusCodes.BAD_REQUEST
            );
        }
        // ตรวจสอบว่า companyId มีค่า ถ้าไม่มีก็จะบังคับให้ต้องมีค่า
        if (!companyId) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Company ID is required",
                null,
                StatusCodes.BAD_REQUEST
            );
        }
    
        const checkColor = await colorRepository.findByName(companyId, color_name);
        if (checkColor) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Color already exists",
                null,
                StatusCodes.BAD_REQUEST
            );
        }
    
        const newColor = await colorRepository.create(companyId, userId, payload);
        return new ServiceResponse<master_color>(
            ResponseStatus.Success,
            "Success",
            newColor,
            StatusCodes.OK
        );
    },
  findAllNoPagination: async (companyId: string) => {
    try {
      const customer = await colorRepository.findAllNoPagination(companyId);
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


  update: async (
    color_id: string,
    payload: TypePayloadColor,
    companyId: string,
    userId: string
  ) => {
    try {
      const checkColor = await colorRepository.findById(companyId, color_id);
      if (!checkColor) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "not found color",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const checkGroup = await colorRepository.findByName(
        companyId,
        payload.color_name
      );
      if (checkGroup) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Group repair already taken",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const group = await colorRepository.update(
        companyId,
        userId,
        color_id,
        payload
      );
      return new ServiceResponse<master_color>(
        ResponseStatus.Success,
        "Success",
        group,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error update color : " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  delete: async (companyId: string, color_id: string) => {
    try {
      // ตรวจสอบว่า color_id กับ company_id ถูกส่งมาหรือไม่
      if (!companyId || !color_id) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "company_id and color_id are required",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // ตรวจสอบว่ามีสีที่ตรงกับ company_id และ color_id หรือไม่
      const colorToDelete = await colorRepository.findById(companyId, color_id);
      if (!colorToDelete) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Color not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      const checkColorinQuotation = await quotationRepository.checkQuotation(companyId, "car_color_id", color_id);
      if (checkColorinQuotation)
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Color in quotation",
          null,
          StatusCodes.BAD_REQUEST
      );

      // ดำเนินการลบสี
      await colorRepository.delete(companyId, color_id);

      return new ServiceResponse<string>(
        ResponseStatus.Success,
        "Delete color success",
        "Delete color success",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error delete color: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  search: async (query: string, companyId: string) => {
    try {
      const color = await colorRepository.search(query, companyId);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Search successful",
        color,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error searching color: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  select: async (companyId: string , searchText: string = "") => {
    try {
      const data = await colorRepository.select(companyId , searchText);
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
