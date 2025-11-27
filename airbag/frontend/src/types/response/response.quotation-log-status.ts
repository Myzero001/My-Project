import { MS_USER_ALL } from "./response.user";

export type QUOTATION_LOG_STATUS = {
  id: string;
  quotation_id: string;
  quotation_status: string;
  remark: string | undefined | string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  profile: MS_USER_ALL;
};
