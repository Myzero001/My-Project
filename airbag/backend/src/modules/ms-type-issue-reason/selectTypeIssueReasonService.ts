import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { selectTypeIssueReasonRepository } from "@modules/ms-type-issue-reason/selectTypeIssueReasonRepository";
import { TypePayloadSelectMsIssueReason } from "@modules/ms-type-issue-reason/selectTypeIssueReasonModel";

export const selectTypeIssueReasonService = {
  findAll: async (companyId: string) => {
    try {
      // ค้นหาทั้งหมด
      const typeIssueReason =
        await selectTypeIssueReasonRepository.findAll(companyId);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        typeIssueReason,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching typeIssueReason",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadSelectMsIssueReason
  ) => {
    try {
      // ก่อนสร้าง เช็คก่อนว่ามีชื่อซ้ำหรือไม่
      const checkTypeIssueReason =
        await selectTypeIssueReasonRepository.findByName(
          companyId,
          payload.type_issue_group_name
        );
      if (checkTypeIssueReason) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Type Issue Reason already taken",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      // สร้าง type issue reason
      const typeIssueReason = await selectTypeIssueReasonRepository.create(
        companyId,
        userId,
        payload
      );
      return new ServiceResponse(
        ResponseStatus.Success,
        "Create typeIssueReason success",
        typeIssueReason,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error create typeIssueReason",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  update: async (
    companyId: string,
    userId: string,
    type_issue_group_id: string,
    payload: TypePayloadSelectMsIssueReason
  ) => {
    try {
      // ก่อนอัพเดท เช็ค Id ที่ส่งมาถูกต้องหรือไม่
      const checkId = await selectTypeIssueReasonRepository.findById(
        companyId,
        type_issue_group_id
      );
      if (!checkId) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Type Issue Reason not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      // ก่อนอัพเดท เช็คชื่อซ้ำกันหรือไม่
      const checkName = await selectTypeIssueReasonRepository.findByName(
        companyId,
        payload.type_issue_group_name
      );
      if (checkName) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Type Issue Reason already taken",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัพเดท type issue reason
      const typeIssueReason = await selectTypeIssueReasonRepository.update(
        companyId,
        userId,
        type_issue_group_id,
        payload
      );
      return new ServiceResponse(
        ResponseStatus.Success,
        "Update typeIssueReason success",
        typeIssueReason,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error update typeIssueReason",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  delete: async (
    companyId: string,
    type_issue_group_id: TypePayloadSelectMsIssueReason
  ) => {
    try {
      // ก่อนอัพเดท เช็ค Id ที่ส่งมาถูกต้องหรือไม่
      const checkId = await selectTypeIssueReasonRepository.findById(
        companyId,
        type_issue_group_id.type_issue_group_id
      );
      if (!checkId) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Type Issue Reason not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const typeIssueReason = await selectTypeIssueReasonRepository.delete(
        companyId,
        type_issue_group_id.type_issue_group_id
      );
      return new ServiceResponse(
        ResponseStatus.Success,
        "Delete typeIssueReason success",
        typeIssueReason,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error delete typeIssueReason",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  
};
