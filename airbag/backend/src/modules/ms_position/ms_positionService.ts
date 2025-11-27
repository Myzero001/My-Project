// ms_positionService.ts
import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { ms_positionRepository } from "@modules/ms_position/ms_positionRepository";
import { TypePayloadMasterPosition } from "@modules/ms_position/ms_positionModel";
import { master_position } from "@prisma/client";


export const ms_positionService = {
    findAll: async (companyId: string, page: number, pageSize: number = 12, searchText: string = "") => {
        try {
            const skip = (page - 1) * pageSize;
            const position = await ms_positionRepository.findAll(companyId, skip, pageSize, searchText);
            if (!position) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "No positions found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const totalCount = await ms_positionRepository.count(companyId,searchText);

            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data: position,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
                StatusCodes.OK
            );
        } catch (error) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Get all failed",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    create: async (companyId: string, userId: string, payload: TypePayloadMasterPosition) => {
        try {
            const checkPosition = await ms_positionRepository.findByName(companyId, payload.position_name);
            if (checkPosition) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Position already taken",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const newPosition = await ms_positionRepository.create(companyId, userId, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Create position success",
                "Create position success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create position: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Create position failed",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (companyId: string, userId: string, position_id: string, payload: TypePayloadMasterPosition) => {
        try {
            const checkPositionId = await ms_positionRepository.findByIdAsync(companyId, position_id);
            if (!checkPositionId) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Position not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const checkPosition = await ms_positionRepository.findByName(companyId, payload.position_name);
            if (checkPosition) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Position already taken",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const updatePosition = await ms_positionRepository.update(companyId, userId, position_id, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update position success",
                "Update position success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error update position: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    delete: async (companyId: string, position_id: string) => {
        try {
            const checkPositionId = await ms_positionRepository.findByIdAsync(companyId, position_id);
            if (!checkPositionId) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Position not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            await ms_positionRepository.delete(companyId, position_id);
            return new ServiceResponse<string>(
                ResponseStatus.Success,
                "Delete position success",
                "Delete position success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error delete position: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (companyId: string, position_id: string) => {
        try {
            const checkPositionId = await ms_positionRepository.findByIdAsync(companyId, position_id);
            if (!checkPositionId) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Position not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse<master_position>(
                ResponseStatus.Success,
                "Position found",
                checkPositionId,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error get position request: " + (ex as Error).message;
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
          const data = await ms_positionRepository.select(companyId , searchText);
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