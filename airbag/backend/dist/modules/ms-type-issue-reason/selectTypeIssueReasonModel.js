"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSelectTypeIssueReasonSchema = exports.CreateSelectTypeIssueReasonSchema = exports.UpdateSelectTypeIssueReasonSchema = void 0;
//selectTypeIssueReasonModel.ts
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
exports.UpdateSelectTypeIssueReasonSchema = zod_1.z.object({
    body: zod_1.z.object({
        type_issue_group_id: commonValidation_1.commonValidations.uuid,
        type_issue_group_name: zod_1.z.string().max(50),
    }),
});
exports.CreateSelectTypeIssueReasonSchema = zod_1.z.object({
    body: zod_1.z.object({
        type_issue_group_name: zod_1.z.string().max(50),
    }),
});
exports.DeleteSelectTypeIssueReasonSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: commonValidation_1.commonValidations.uuid,
    })
});
