import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { groupRepairRepository } from "@modules/ms-group-repair/ms-group-repairRepository";
import { TypePayloadMasterGroupRepair } from "@modules/ms-group-repair/ms-group-repairModel";
import { master_group_repair } from "@prisma/client";

export const groupRepairService = {
    findAll: async (companyId: string, page: number = 1, pageSize: number = 12, searchText: string = "") => {
        try {
            const skip = (page - 1) * pageSize;
            const groupRepairs = await groupRepairRepository.findAll(companyId, skip, pageSize, searchText);
            const totalCount = await groupRepairRepository.count(companyId, searchText);

            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data: groupRepairs,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
                StatusCodes.OK
            );
        } catch (error) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching group repairs",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    create: async (companyId: string, userId: string, payload: TypePayloadMasterGroupRepair) => {
        try {
            const checkGroupName = await groupRepairRepository.findByName(companyId, payload.group_repair_name);
            if (checkGroupName) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Group repair already taken",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const group = await groupRepairRepository.create(companyId, userId, payload);
            return new ServiceResponse<{ master_group_repair_id: string }>(
                ResponseStatus.Success,
                "Create group repair success",
                { master_group_repair_id: group.master_group_repair_id },
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create group repair: " + (ex as Error).message;
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
        master_group_repair_id: string,
        payload: TypePayloadMasterGroupRepair
    ) => {
        try {
            const checkGroupId = await groupRepairRepository.findByIdAsync(companyId, master_group_repair_id);
            if (!checkGroupId) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Group repair not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const checkGroup = await groupRepairRepository.findByName(companyId, payload.group_repair_name);
            if (checkGroup) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Group repair already taken",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }

            const updatedGroup = await groupRepairRepository.update(companyId, userId, master_group_repair_id, payload);

            // ตรวจสอบ updated_at ให้เป็น Date เสมอ
            const updatedAt = updatedGroup.updated_at ?? new Date();

            return new ServiceResponse<{
                group_repair_name: string;
                updated_at: Date;
                updated_by: string;
            }>(
                ResponseStatus.Success,
                "Update group repair success",
                {
                    group_repair_name: updatedGroup.group_repair_name,
                    updated_at: updatedAt,
                    updated_by: updatedGroup.updated_by,
                },
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error update group repair: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    delete: async (companyId: string, master_group_repair_id: string) => {
        try {
            const checkGroup = await groupRepairRepository.findByIdAsync(companyId, master_group_repair_id);
            if (!checkGroup) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Group repair not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const checkGroupRepairHaveRepair = await groupRepairRepository.checkGroupRepairHaveRepair(companyId, master_group_repair_id);
            if (checkGroupRepairHaveRepair) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Group repair have repair ",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            await groupRepairRepository.delete(companyId, master_group_repair_id);
            return new ServiceResponse<string>(
                ResponseStatus.Success,
                "Delete group repair success",
                "Delete group repair success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error delete group repair: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (companyId: string, master_group_repair_id: string) => {
        try {
            const groupRepair = await groupRepairRepository.findByIdAsync(companyId, master_group_repair_id);
            if (!groupRepair) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Group repair not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse<master_group_repair>(
                ResponseStatus.Success,
                "Group repair found",
                groupRepair,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error get group repair request: " + (ex as Error).message;
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
            const brands = await groupRepairRepository.findMinimal(companyId);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get minimal grouprepair data success",
                brands,
                StatusCodes.OK
            );
        } catch (error) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching minimal grouprepair data",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },



};