// issueReasonService
import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { issueReasonRepository } from "@modules/ms-issue-reason/issueReasonRepository";
import { TypePayLoadIssueReason } from "@modules/ms-issue-reason/issueReasonModel";
import { master_issue_reason } from "@prisma/client";
import { selectTypeIssueReasonRepository } from "@modules/ms-type-issue-reason/selectTypeIssueReasonRepository";

export const issueReasonService = {
  findAll: async (
    companyId: string,
    page: number = 1,
    pageSize: number = 12,
    searchText: string = ""
  ) => {
    try {
      const skip = (page - 1) * pageSize;
      const issueReason = await issueReasonRepository.findAll(
        companyId,
        skip,
        pageSize,
        searchText
      );
      const totalCount = await issueReasonRepository.count(
        companyId,
        searchText
      );

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: issueReason,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching issueReasons",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findAllNoPagination: async (companyId: string) => {
    try {
      const res = await issueReasonRepository.findAllNoPagination(companyId);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        res,
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
    payload: TypePayLoadIssueReason
  ) => {
    try {
      // ก่อนสร้าง ตรวจสอบว่า group type id ส่งมาถูกต้องหรือไม่
      const checkId = await selectTypeIssueReasonRepository.findById(
        companyId,
        payload.type_issue_group_id
      );
      if (!checkId) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Type Issue Reason not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      // ตรวจสอบว่า name และ group type ซ้ำกับฐานข้อมูลหรือไม่
      const checkIssueReason = await issueReasonRepository.findByName(
        companyId,
        payload
      );
      if (checkIssueReason) {
        return new ServiceResponse(
          ResponseStatus.Failed, // สถานะการดำเนินการ
          "Issue Reason already exists", // ข้อความอธิบาย
          null, // ไม่มีข้อมูลเพิ่มเติม
          StatusCodes.BAD_REQUEST // รหัสสถานะ HTTP 400
        );
      }
      // ถ้าไม่มีก็สร้างหมวดหมู่ใหม่
      const issueReason = await issueReasonRepository.create(
        companyId,
        userId,
        payload
      );
      return new ServiceResponse(
        ResponseStatus.Success, // สถานะการดำเนินการ
        "Success", // ข้อความอธิบาย
        // issueReason, // ข้อมูลเพิ่มเติม
        "Create Issue Reason success",
        StatusCodes.OK // รหัสสถานะ HTTP 200
      );
    } catch (ex) {
      // ถ้ามีข้อผิดพลาดในการสร้างหมวดหมู่
      const errorMessage =
        "Error create Issue Reason :" + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed, // สถานะการดำเนินการ
        errorMessage, // ข้อความอธิบาย
        null, // ไม่มีข้อมูลเพิ่มเติม
        StatusCodes.INTERNAL_SERVER_ERROR // รหัสสถานะ HTTP 500
      );
    }
  },

  update: async (
    companyId: string,
    userId: string,
    issue_reason_id: string,
    payload: TypePayLoadIssueReason
  ) => {
    try {
      // ตรวจสอบว่า id มีในฐานข้อมูลหรือไม่
      const checkIssueReasonId = await issueReasonRepository.findByIdAsync(
        companyId,
        issue_reason_id
      );
      if (!checkIssueReasonId) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Issue Reason not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // ตรวจสอบว่า group type id ส่งมาถูกต้องหรือไม่
      const checkId = await selectTypeIssueReasonRepository.findById(
        companyId,
        payload.type_issue_group_id
      );
      if (!checkId) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Type Issue Reason not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // ตรวจสอบว่า name และ group type ซ้ำกับฐานข้อมูลหรือไม่
      const checkIssueReason = await issueReasonRepository.findByName(
        companyId,
        payload
      );
      if (checkIssueReason) {
        return new ServiceResponse(
          ResponseStatus.Failed, // สถานะการดำเนินการ
          "Issue Reason already exists", // ข้อความอธิบาย
          null, // ไม่มีข้อมูลเพิ่มเติม
          StatusCodes.BAD_REQUEST // รหัสสถานะ HTTP 400
        );
      }

      const issueReason = await issueReasonRepository.update(
        companyId,
        userId,
        issue_reason_id,
        payload
      );
      return new ServiceResponse(
        ResponseStatus.Success,
        "Success",
        // issueReason,
        "Update Issue Reason success",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage =
        "Error update Issue Reason :" + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  delete: async (companyId: string, issue_reason_id: string) => {
    try {
      // ตรวจสอบว่าหมวดหมู่ที่ต้องการลบมีอยู่จริงหรือไม่
      const checkIssueReason = await issueReasonRepository.findByIdAsync(
        companyId,
        issue_reason_id
      );
      if (!checkIssueReason) {
        return new ServiceResponse(
          ResponseStatus.Failed, // สถานะการดำเนินการ
          "issueReason not found", // ข้อความอธิบาย
          null, // ไม่มีข้อมูลเพิ่มเติม
          StatusCodes.BAD_REQUEST // รหัสสถานะ HTTP 400
        );
      }
      // ถ้ามีอยู่ก็ทำการลบหมวดหมู่นั้น
      await issueReasonRepository.delete(companyId, issue_reason_id);
      return new ServiceResponse<string>(
        ResponseStatus.Success, // สถานะการดำเนินการ
        "issueReason found", // ข้อความอธิบาย
        "Delete issueReason success", // ข้อความยืนยันการลบ
        StatusCodes.OK // รหัสสถานะ HTTP 200
      );
    } catch (ex) {
      // ถ้ามีข้อผิดพลาดในการลบหมวดหมู่
      const errorMessage = "Error delete issueReason :" + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed, // สถานะการดำเนินการ
        errorMessage, // ข้อความอธิบายข้อผิดพลาด
        null, // ไม่มีข้อมูลเพิ่มเติม
        StatusCodes.INTERNAL_SERVER_ERROR // รหัสสถานะ HTTP 500
      );
    }
  },
  findById: async (companyId: string, issue_reason_id: string) => {
    try {
      const issueReasonn = await issueReasonRepository.findByIdAsync(
        companyId,
        issue_reason_id
      );
      if (!issueReasonn) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Issue Reason not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      return new ServiceResponse<master_issue_reason>(
        ResponseStatus.Success,
        "Issue Reason found",
        issueReasonn,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage =
        "Error get Issue Reason request: " + (ex as Error).message;
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
      const data = await issueReasonRepository.select(companyId , searchText);
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
