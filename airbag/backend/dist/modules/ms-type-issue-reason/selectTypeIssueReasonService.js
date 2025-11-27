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
exports.selectTypeIssueReasonService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const selectTypeIssueReasonRepository_1 = require("@modules/ms-type-issue-reason/selectTypeIssueReasonRepository");
exports.selectTypeIssueReasonService = {
    findAll: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ค้นหาทั้งหมด
            const typeIssueReason = yield selectTypeIssueReasonRepository_1.selectTypeIssueReasonRepository.findAll(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", typeIssueReason, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching typeIssueReason", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ก่อนสร้าง เช็คก่อนว่ามีชื่อซ้ำหรือไม่
            const checkTypeIssueReason = yield selectTypeIssueReasonRepository_1.selectTypeIssueReasonRepository.findByName(companyId, payload.type_issue_group_name);
            if (checkTypeIssueReason) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Type Issue Reason already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // สร้าง type issue reason
            const typeIssueReason = yield selectTypeIssueReasonRepository_1.selectTypeIssueReasonRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create typeIssueReason success", typeIssueReason, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error create typeIssueReason", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, type_issue_group_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ก่อนอัพเดท เช็ค Id ที่ส่งมาถูกต้องหรือไม่
            const checkId = yield selectTypeIssueReasonRepository_1.selectTypeIssueReasonRepository.findById(companyId, type_issue_group_id);
            if (!checkId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Type Issue Reason not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ก่อนอัพเดท เช็คชื่อซ้ำกันหรือไม่
            const checkName = yield selectTypeIssueReasonRepository_1.selectTypeIssueReasonRepository.findByName(companyId, payload.type_issue_group_name);
            if (checkName) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Type Issue Reason already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัพเดท type issue reason
            const typeIssueReason = yield selectTypeIssueReasonRepository_1.selectTypeIssueReasonRepository.update(companyId, userId, type_issue_group_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update typeIssueReason success", typeIssueReason, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error update typeIssueReason", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, type_issue_group_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ก่อนอัพเดท เช็ค Id ที่ส่งมาถูกต้องหรือไม่
            const checkId = yield selectTypeIssueReasonRepository_1.selectTypeIssueReasonRepository.findById(companyId, type_issue_group_id.type_issue_group_id);
            if (!checkId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Type Issue Reason not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const typeIssueReason = yield selectTypeIssueReasonRepository_1.selectTypeIssueReasonRepository.delete(companyId, type_issue_group_id.type_issue_group_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete typeIssueReason success", typeIssueReason, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error delete typeIssueReason", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
