"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueReasonService = void 0;
// issueReasonService
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const issueReasonRepository_1 = require("@modules/ms-issue-reason/issueReasonRepository");
const selectTypeIssueReasonRepository_1 = require("@modules/ms-type-issue-reason/selectTypeIssueReasonRepository");
exports.issueReasonService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const issueReason = yield issueReasonRepository_1.issueReasonRepository.findAll(companyId, skip, pageSize, searchText);
            const totalCount = yield issueReasonRepository_1.issueReasonRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: issueReason,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching issueReasons", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield issueReasonRepository_1.issueReasonRepository.findAllNoPagination(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", res, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching typeIssueReason", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ก่อนสร้าง ตรวจสอบว่า group type id ส่งมาถูกต้องหรือไม่
            const checkId = yield selectTypeIssueReasonRepository_1.selectTypeIssueReasonRepository.findById(companyId, payload.type_issue_group_id);
            if (!checkId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Type Issue Reason not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ตรวจสอบว่า name และ group type ซ้ำกับฐานข้อมูลหรือไม่
            const checkIssueReason = yield issueReasonRepository_1.issueReasonRepository.findByName(companyId, payload);
            if (checkIssueReason) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, // สถานะการดำเนินการ
                "Issue Reason already exists", // ข้อความอธิบาย
                null, // ไม่มีข้อมูลเพิ่มเติม
                http_status_codes_1.StatusCodes.BAD_REQUEST // รหัสสถานะ HTTP 400
                );
            }
            // ถ้าไม่มีก็สร้างหมวดหมู่ใหม่
            const issueReason = yield issueReasonRepository_1.issueReasonRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, // สถานะการดำเนินการ
            "Success", // ข้อความอธิบาย
            // issueReason, // ข้อมูลเพิ่มเติม
            "Create Issue Reason success", http_status_codes_1.StatusCodes.OK // รหัสสถานะ HTTP 200
            );
        }
        catch (ex) {
            // ถ้ามีข้อผิดพลาดในการสร้างหมวดหมู่
            const errorMessage = "Error create Issue Reason :" + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, // สถานะการดำเนินการ
            errorMessage, // ข้อความอธิบาย
            null, // ไม่มีข้อมูลเพิ่มเติม
            http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR // รหัสสถานะ HTTP 500
            );
        }
    }),
    update: (companyId, userId, issue_reason_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ตรวจสอบว่า id มีในฐานข้อมูลหรือไม่
            const checkIssueReasonId = yield issueReasonRepository_1.issueReasonRepository.findByIdAsync(companyId, issue_reason_id);
            if (!checkIssueReasonId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Issue Reason not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ตรวจสอบว่า group type id ส่งมาถูกต้องหรือไม่
            const checkId = yield selectTypeIssueReasonRepository_1.selectTypeIssueReasonRepository.findById(companyId, payload.type_issue_group_id);
            if (!checkId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Type Issue Reason not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ตรวจสอบว่า name และ group type ซ้ำกับฐานข้อมูลหรือไม่
            const checkIssueReason = yield issueReasonRepository_1.issueReasonRepository.findByName(companyId, payload);
            if (checkIssueReason) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, // สถานะการดำเนินการ
                "Issue Reason already exists", // ข้อความอธิบาย
                null, // ไม่มีข้อมูลเพิ่มเติม
                http_status_codes_1.StatusCodes.BAD_REQUEST // รหัสสถานะ HTTP 400
                );
            }
            const issueReason = yield issueReasonRepository_1.issueReasonRepository.update(companyId, userId, issue_reason_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Success", 
            // issueReason,
            "Update Issue Reason success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update Issue Reason :" + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, issue_reason_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ตรวจสอบว่าหมวดหมู่ที่ต้องการลบมีอยู่จริงหรือไม่
            const checkIssueReason = yield issueReasonRepository_1.issueReasonRepository.findByIdAsync(companyId, issue_reason_id);
            if (!checkIssueReason) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, // สถานะการดำเนินการ
                "issueReason not found", // ข้อความอธิบาย
                null, // ไม่มีข้อมูลเพิ่มเติม
                http_status_codes_1.StatusCodes.BAD_REQUEST // รหัสสถานะ HTTP 400
                );
            }
            // ถ้ามีอยู่ก็ทำการลบหมวดหมู่นั้น
            yield issueReasonRepository_1.issueReasonRepository.delete(companyId, issue_reason_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, // สถานะการดำเนินการ
            "issueReason found", // ข้อความอธิบาย
            "Delete issueReason success", // ข้อความยืนยันการลบ
            http_status_codes_1.StatusCodes.OK // รหัสสถานะ HTTP 200
            );
        }
        catch (ex) {
            // ถ้ามีข้อผิดพลาดในการลบหมวดหมู่
            const errorMessage = "Error delete issueReason :" + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, // สถานะการดำเนินการ
            errorMessage, // ข้อความอธิบายข้อผิดพลาด
            null, // ไม่มีข้อมูลเพิ่มเติม
            http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR // รหัสสถานะ HTTP 500
            );
        }
    }),
    findById: (companyId, issue_reason_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const issueReasonn = yield issueReasonRepository_1.issueReasonRepository.findByIdAsync(companyId, issue_reason_id);
            if (!issueReasonn) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Issue Reason not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Issue Reason found", issueReasonn, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get Issue Reason request: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield issueReasonRepository_1.issueReasonRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
