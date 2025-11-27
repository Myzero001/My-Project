import { StatusCodes } from "http-status-codes";
import { toolRepository } from "@modules/tool/toolRepository";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { TypePayloadtool } from "@modules/tool/toolModel";
import { master_tool } from "@prisma/client";
import { repairReceiptRepository } from "@modules/ms-repair-receipt/repairReceiptRepository";

export const toolService = {
  findAll: async (
    companyId: string,
    page: number = 1,
    pageSize: number = 12,
    searchText: string = ""
  ) => {
    try {
      const skip = (page - 1) * pageSize;
      const tool = await toolRepository.findAll(
        companyId,
        skip,
        pageSize,
        searchText
      );
      const totalCount = await toolRepository.count(companyId, searchText);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: tool,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error Find All Tool :" + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findAllNoPagination: async (company_id: string) => {
    try {
      const res = await toolRepository.findAllNoPagination(company_id);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        res,
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
    payload: TypePayloadtool
  ) => {
    try {
      const tool = payload.tool?.trim();
      if (!tool) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Tool name is required",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const checktool = await toolRepository.findByName(companyId, tool);
      if (checktool) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Tool name already exists",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const newTool = await toolRepository.create(companyId, userId, payload);
      return new ServiceResponse<master_tool>(
        ResponseStatus.Success,
        "Success",
        newTool,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error Create Tool :" + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  delete: async (companyId: string, tool_id: string) => {
    try {
      const checkTool = await toolRepository.findById(companyId, tool_id);
      if (!checkTool) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "tool not found",

          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const checktool1 = await repairReceiptRepository.checkRepairReceipt(companyId, "tool_one_id", tool_id);
            if (checktool1)
              return new ServiceResponse(
                ResponseStatus.Failed,
                "tool in Repair Receipt",
                null,
                StatusCodes.BAD_REQUEST
      );
      const checktool2 = await repairReceiptRepository.checkRepairReceipt(companyId, "tool_two_id", tool_id);
            if (checktool2)
              return new ServiceResponse(
                ResponseStatus.Failed,
                "tool in Repair Receipt",
                null,
                StatusCodes.BAD_REQUEST
      );
      const checktool3 = await repairReceiptRepository.checkRepairReceipt(companyId, "tool_three_id", tool_id);
            if (checktool3)
              return new ServiceResponse(
                ResponseStatus.Failed,
                "tool in Repair Receipt",
                null,
                StatusCodes.BAD_REQUEST
      );
      

      await toolRepository.delete(companyId, tool_id);
      return new ServiceResponse<string>(
        ResponseStatus.Success,
        "Tool found",
        "Delete Tool success",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error delete Tool :" + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  update: async (
    tool_id: string,
    payload: TypePayloadtool,
    companyId: string,
    userId: string
  ) => {
    try {
      const checkTool_Id = await toolRepository.findById(companyId, tool_id);
      if (!checkTool_Id) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "tool not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const checkTool = await toolRepository.findByName(
        companyId,
        payload.tool
      );
      if (checkTool) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Tool name already exists",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      //อัพเดท
      const tool = await toolRepository.update(
        companyId,
        userId,
        tool_id,
        payload
      );
      // ไม่จำเป็นต้องเปลี่ยนลำดับในฐานข้อมูล
      return new ServiceResponse<master_tool>(
        ResponseStatus.Success,
        "Success",
        tool,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error Update Tool :" + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  search: async (query: string) => {
    try {
      const tools = await toolRepository.search(query);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Search successful",
        tools,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error searching tools: " + (ex as Error).message;
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
      const data = await toolRepository.select(companyId , searchText);
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
