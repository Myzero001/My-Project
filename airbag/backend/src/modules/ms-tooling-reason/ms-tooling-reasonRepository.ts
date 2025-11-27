import { master_tooling_reason } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TypePayloadMasterToolingReason } from "./ms-tooling-reasonModel";

const keys = [
  "master_tooling_reason_id",
  "tooling_reason_name",
  "created_at",
  "updated_at",
];
const prisma = new PrismaClient();

export const toolingReasonRepository = {
  findAll: async (
    companyId: string,
    skip: number,
    take: number,
    searchText?: string
  ) => {
    return await prisma.master_tooling_reason.findMany({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
              OR: [
                {
                  tooling_reason_name: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      skip,
      take,
      orderBy: { created_at: "asc" },
      select: {
        master_tooling_reason_id: true,
        company_id: true,
        tooling_reason_name: true,
      },
    });
  },

  count: async (companyId: string, searchText?: string) => {
    return await prisma.master_tooling_reason.count({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
              OR: [
                {
                  tooling_reason_name: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
    });
  },

  findAllNoPagination: async (company_id: string) => {
    return await prisma.master_tooling_reason.findMany({
      where: { company_id: company_id},
      orderBy: { created_at: "asc" },
    });
  },
  select: async  (companyId: string , searchText : string) => {
    const data = await prisma.master_tooling_reason.findMany({
      where: {
        company_id: companyId,
        ...(searchText && {
              tooling_reason_name: {
                contains: searchText,
                mode: 'insensitive'
            },
        }),
      },
      skip : 0,
      take : 50,
      select: {
        master_tooling_reason_id : true,
        tooling_reason_name: true
      },
      orderBy: { created_at: "asc" },
    });
    return data;
  },

  findByName: async <Key extends keyof master_tooling_reason>(
    companyId: string,
    tooling_reason_name: string,
    selectedKeys = keys as Key[]
  ) => {
    return prisma.master_tooling_reason.findFirst({
      where: { company_id: companyId, tooling_reason_name },
      select: selectedKeys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<master_tooling_reason, Key> | null>;
  },

  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadMasterToolingReason
  ) => {
    const tooling_reason_name = payload.tooling_reason_name.trim();
    const setPayload = {
      company_id: companyId,
      tooling_reason_name,
      created_by: userId,
      updated_by: userId,
    };
    return await prisma.master_tooling_reason.create({
      data: setPayload,
    });
  },

  findByIdAsync: async (
    companyId: string,
    master_tooling_reason_id: string
  ) => {
    return await prisma.master_tooling_reason.findFirst({
      where: { company_id: companyId, master_tooling_reason_id },
      select: {
        master_tooling_reason_id: true,
        tooling_reason_name: true,
      },
    });
  },

  update: async (
    companyId: string,
    userId: string,
    master_tooling_reason_id: string,
    payload: TypePayloadMasterToolingReason
  ) => {
    const setPayload = {
      tooling_reason_name: payload.tooling_reason_name.trim(),
      updated_by: userId,
    };
    return await prisma.master_tooling_reason.update({
      where: { company_id: companyId, master_tooling_reason_id },
      data: setPayload,
    });
  },

  delete: async (companyId: string, master_tooling_reason_id: string) => {
    return await prisma.master_tooling_reason.deleteMany({
      where: { company_id: companyId, master_tooling_reason_id },
    });
  },

  findById: async (companyId: string, master_tooling_reason_id: string) => {
    return await prisma.master_tooling_reason.findFirst({
      where: {
        company_id: companyId,
        master_tooling_reason_id: master_tooling_reason_id,
      },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
  },

  findMinimal: async (companyId: string) => {
    return await prisma.master_tooling_reason.findMany({
      where: { company_id: companyId },
      select: {
        master_tooling_reason_id: true,
        tooling_reason_name: true,
      },
    });
  },

  checkToolingReasonInRepairReceipt: async (companyId: string, master_tooling_reason_id: string) => {
    return await prisma.master_repair_receipt.findFirst({
      where: {
        company_id: companyId,
        OR: [
          { for_tool_one_id: master_tooling_reason_id },
          { for_tool_two_id: master_tooling_reason_id },
          { for_tool_three_id: master_tooling_reason_id }
        ]
      }
    });
  },
};
