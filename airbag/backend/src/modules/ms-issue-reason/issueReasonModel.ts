// issueReasonModel
import { commonValidations } from "@common/utils/commonValidation";
import { validateRequest } from "@common/utils/httpHandlers";
import { z } from "zod";

export type TypePayLoadIssueReason = {
    issue_reason_name: string
    type_issue_group_id: string
}

export const CreateIssueReasonSchema = z.object({
    body: z.object({
        issue_reason_name: z.string().max(50),
        type_issue_group_id: commonValidations.uuid,
    })
});

export const UpdateIssueReasonSchema = z.object({

    body: z.object({
        issue_reason_id: commonValidations.uuid,
        issue_reason_name: z.string().max(50),
        type_issue_group_id: commonValidations.uuid,
    })
});

export const DeleteIssueReasonSchema = z.object({
    params: z.object({
        issue_reason_id: commonValidations.uuid,
    })
});


export const GetIssueReasonSchema = z.object({
    params: z.object({
        issue_reason_id: commonValidations.uuid,
    })
});

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})