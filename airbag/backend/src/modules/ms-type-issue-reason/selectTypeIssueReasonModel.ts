//selectTypeIssueReasonModel.ts
import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadSelectMsIssueReason = {
    type_issue_group_id: string;
    type_issue_group_name: string;
};

export const UpdateSelectTypeIssueReasonSchema = z.object({
    body: z.object({
        type_issue_group_id: commonValidations.uuid,
        type_issue_group_name: z.string().max(50),
    }),
});

export const CreateSelectTypeIssueReasonSchema = z.object({
    body: z.object({
        type_issue_group_name: z.string().max(50),
    }),
});


export const DeleteSelectTypeIssueReasonSchema = z.object({
    params: z.object({
        id: commonValidations.uuid, 
    })
});

