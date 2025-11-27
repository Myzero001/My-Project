"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.GetIssueReasonSchema = exports.DeleteIssueReasonSchema = exports.UpdateIssueReasonSchema = exports.CreateIssueReasonSchema = void 0;
// issueReasonModel
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
exports.CreateIssueReasonSchema = zod_1.z.object({
    body: zod_1.z.object({
        issue_reason_name: zod_1.z.string().max(50),
        type_issue_group_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.UpdateIssueReasonSchema = zod_1.z.object({
    body: zod_1.z.object({
        issue_reason_id: commonValidation_1.commonValidations.uuid,
        issue_reason_name: zod_1.z.string().max(50),
        type_issue_group_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.DeleteIssueReasonSchema = zod_1.z.object({
    params: zod_1.z.object({
        issue_reason_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetIssueReasonSchema = zod_1.z.object({
    params: zod_1.z.object({
        issue_reason_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
