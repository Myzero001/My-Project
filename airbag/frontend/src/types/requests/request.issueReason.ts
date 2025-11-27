//request.issueReason.ts
export type PayLoadCreateIssueReason = {
    issue_reason_name: string;
    type_issue_group_id: string;
};  
//
export type PayLoadUpdateIssueReason = {
    issue_reason_id: string;
    issue_reason_name: string;
    type_issue_group_id: string;
};

export type PayLoadDeleteIssueReason = {
    issue_reason_id: string;
    // issue_fixed_reason: string;
    // issue_group: string;
}