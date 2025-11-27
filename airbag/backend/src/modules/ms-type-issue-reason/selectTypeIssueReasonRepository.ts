import { PrismaClient } from "@prisma/client";
import { TypePayloadSelectMsIssueReason } from "@modules/ms-type-issue-reason/selectTypeIssueReasonModel";

const prisma = new PrismaClient();

const keys = ["type_issue_group_name", "type_issue_group_id"];

export const selectTypeIssueReasonRepository = {
  findAll: async (companyId: string) => {
    return await prisma.master_type_issue_group.findMany({
      where: {
        company_id: companyId,
      },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
  },

  findByName: async (companyId: string, type_issue_group_name: string) => {
    return await prisma.master_type_issue_group.findFirst({
      where: {
        company_id: companyId,
        type_issue_group_name: type_issue_group_name,
      },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
  },
  findById: async (companyId: string, type_issue_group_id: string) => {
    return await prisma.master_type_issue_group.findFirst({
      where: {
        company_id: companyId,
        type_issue_group_id: type_issue_group_id,
      },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
  },
  
  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadSelectMsIssueReason
  ) => {
    const type_issue_group_name = payload.type_issue_group_name.trim();
    const setPayload = {
      company_id: companyId,
      type_issue_group_name: type_issue_group_name,
      created_by: userId,
      updated_by: userId,
    };
    return await prisma.master_type_issue_group.create({
      data: setPayload,
    });
  },
  update: async (
    companyId: string,
    userId: string,
    type_issue_group_id: string,
    payload: TypePayloadSelectMsIssueReason
  ) => {
    const type_issue_group_name = payload.type_issue_group_name.trim();
    const setPayload = {
      type_issue_group_name: type_issue_group_name,
      updated_by: userId,
    };
    return await prisma.master_type_issue_group.update({
      where: {
        company_id: companyId,
        type_issue_group_id: type_issue_group_id,
      },
      data: setPayload,
    });
  },
  delete: async (companyId: string, type_issue_group_id: string) => {
    return await prisma.master_type_issue_group.delete({
      where: {
        company_id: companyId,
        type_issue_group_id: type_issue_group_id,
      },
    });
  },

  
};
