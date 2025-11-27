// export type TypeIssueReasonAll = {
//     issue_reason_id: string
//     issue_reason_name: string
//     type_issue_group: {
//         type_issue_group_id: string;
//         type_issue_group_name: string;
//     };
// }

// export type TypeIssueReason = {
//     issue_reason_id: string
//     issue_reason_name: string
//     type_issue_group: {
//         type_issue_group_id: string;
//         type_issue_group_name: string;
//     };
// }

// export type IssueReasonResponse = {
//     success: boolean
//     message: string
//     responseObject:  TypeIssueReason[];
//     statusCode: number
// }
// export type APIResponseType<T> = {
//     success: boolean;
//     message: string;
//     responseObject: T;
//     statusCode: number;
// };
// export type APIPaginationType<T> = {
//     data: T;
//     totalCount: number;
//     totalPages: number;
// };
export type TypeIssueReasonAll = {
    issue_reason_id: string;
    issue_reason_name: string;
    type_issue_group: {
        type_issue_group_id: string;
        type_issue_group_name: string;
    };
};

export type TypeIssueReason = {
    issue_reason_id: string;
    issue_reason_name: string;
    type_issue_group: {
        type_issue_group_id: string;
        type_issue_group_name: string;
    };
};

// ใช้ APIResponseType สำหรับข้อมูลแบบทั่วไป
export type IssueReasonResponse = APIResponseType<APIPaginationType<TypeIssueReason[]>>;

// ใช้ APIPaginationType สำหรับข้อมูลที่มีการแบ่งหน้า
export type PaginatedIssueReasonResponse = APIResponseType<APIPaginationType<TypeIssueReason[]>>;

// General types
export type APIResponseType<T> = {
    success: boolean;
    message: string;
    responseObject: T;
    statusCode: number;
};

export type APIPaginationType<T> = {
    data: T;
    totalCount: number;
    totalPages: number;
};

export type IssueReasonSelectItem = {
  issue_reason_id: string;
  issue_reason_name: string;
};
  
export type IssueReasonSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: IssueReasonSelectItem[];
  };
  statusCode: number;
};