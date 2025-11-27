//issueReasonRepository
import { master_issue_reason } from "@prisma/client";
import prisma from "@src/db";
import { TypePayLoadIssueReason } from "@modules/ms-issue-reason/issueReasonModel";
import { keys } from "object-hash";
import { count } from "console";

export const KeyIssueReason = ["issue_reason_id", "issue_reason_name"];

export const issueReasonRepository = {
  findAll: async <Key extends keyof master_issue_reason>(
    companyId: string,
    skip: number,
    take: number,
    searchText: string,
    keys: Key[] = KeyIssueReason as Key[]
  ) => {
    // กำหนดฟิลด์ที่ต้องการดึง
    const selectFields = keys.reduce(
      (obj, k) => {
        obj[k] = true;
        return obj;
      },
      {} as Record<Key, boolean>
    );

    return await prisma.master_issue_reason.findMany({
      where: {
        company_id: companyId,
        // เพิ่มเงื่อนไขค้นหาชื่อและประเภท
        ...(searchText && {
          OR: [
            {
              issue_reason_name: {
                contains: searchText,
                mode: "insensitive", // ค้นหาทั้งตัวพิมพ์เล็กและใหญ่
              },
            },
            {
              type_issue_group: {
                type_issue_group_name: {
                  contains: searchText,
                  mode: "insensitive", // ค้นหาทั้งตัวพิมพ์เล็กและใหญ่
                },
              },
            },
          ],
        }),
      },
      skip, // จำนวนข้อมูลที่ต้องข้าม
      take, // จำนวนข้อมูลที่ต้องดึง
      select: {
        ...selectFields,
        type_issue_group: {
          select: {
            type_issue_group_id: true,
            type_issue_group_name: true,
          },
        },
      },
      orderBy: { created_at: "asc" }, // การจัดเรียง
    });
  },

  count: async (companyId: string, searchText: string) => {
    return await prisma.master_issue_reason.count({
      where: {
        company_id: companyId,
        ...(searchText && {
          OR: [
            {
              issue_reason_name: {
                contains: searchText,
                mode: "insensitive", // ค้นหาทั้งตัวพิมพ์เล็กและใหญ่
              },
            },
            {
              type_issue_group: {
                type_issue_group_name: {
                  contains: searchText,
                  mode: "insensitive", // ค้นหาทั้งตัวพิมพ์เล็กและใหญ่
                },
              },
            },
          ],
        }),
      },
    });
  },

  findAllNoPagination: async (companyId: string) => {
    return await prisma.master_issue_reason.findMany({
      where: {
        company_id: companyId,
      },
      orderBy: { created_at: "asc" },
    });
  },
  select: async  (companyId: string , searchText : string) => {
      const data = await prisma.master_issue_reason.findMany({
        where: {
          company_id: companyId,
          ...(searchText && {
                issue_reason_name: {
                  contains: searchText,
                  mode: 'insensitive'
              },
          }),
        },
        skip : 0,
        take : 50,
        select: {
          issue_reason_id : true,
          issue_reason_name: true
        },
        orderBy: { created_at: "asc" }, 
      });
      return data;
    },

  findByName: async <Key extends keyof master_issue_reason>(
    companyId: string,
    payload: TypePayLoadIssueReason, // ชื่อที่ต้องการค้นหา
    keys = KeyIssueReason as Key[]
  ) => {
    return prisma.master_issue_reason.findFirst({
      where: {
        company_id: companyId,
        issue_reason_name: payload.issue_reason_name,
        type_issue_group_id: payload.type_issue_group_id,
      },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<master_issue_reason, Key> | null>; // คืนค่าหนึ่งค่า
  },

  create: async (
    companyId: string,
    userId: string,
    payload: TypePayLoadIssueReason
  ) => {
    // ตัดช่องว่างจากชื่อหมวดหมู่
    const issue_reason_name = payload.issue_reason_name.trim();
    const type_issue_group_id = payload.type_issue_group_id.trim();
    // สร้างอ็อบเจ็กต์สำหรับข้อมูลที่จะบันทึก
    const setPayload: any = {
      company_id: companyId,
      issue_reason_name: issue_reason_name,
      type_issue_group_id: type_issue_group_id,
      created_by: userId,
      updated_by: userId,
    };

    // สร้างหมวดหมู่ใหม่ในฐานข้อมูล
    return await prisma.master_issue_reason.create({
      data: setPayload,
      select: {
        issue_reason_id: true,
        issue_reason_name: true,
        type_issue_group: {
          select: {
            type_issue_group_id: true,
            type_issue_group_name: true,
          },
        },
      },
    });
  },

  findByIdAsync: async <Key extends keyof master_issue_reason>(
    companyId: string,
    issue_reason_id: string,
    keys = KeyIssueReason as Key[]
  ) => {
    return prisma.master_issue_reason.findFirst({
      where: {
        company_id: companyId,
        issue_reason_id: issue_reason_id,
      },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<master_issue_reason, Key> | null>; // คืนค่าหนึ่งค่า
  },

  update: async (
    companyId: string,
    userId: string,
    issue_reason_id: string,
    payload: TypePayLoadIssueReason
  ) => {
    const trim_issue_reason_id = issue_reason_id.trim();
    const issue_reason_name = payload.issue_reason_name.trim();
    const type_issue_group_id = payload.type_issue_group_id.trim();
    const setPayload = {
      issue_reason_name: issue_reason_name,
      type_issue_group_id: type_issue_group_id,
      updated_by: userId,
    };

    return await prisma.master_issue_reason.update({
      where: {
        company_id: companyId,
        issue_reason_id: trim_issue_reason_id,
      },
      data: setPayload,
      select: {
        issue_reason_id: true,
        issue_reason_name: true,
        type_issue_group: {
          select: {
            type_issue_group_id: true,
            type_issue_group_name: true,
          },
        },
      },
    });
  },
  delete: async (companyId: string, issue_reason_id: string) => {
    // ตัดช่องว่างจาก ID
    const trim_issue_reason_id = issue_reason_id.trim();
    // ลบหมวดหมู่จากฐานข้อมูล
    return await prisma.master_issue_reason.delete({
      where: {
        company_id: companyId,
        issue_reason_id: trim_issue_reason_id,
      },
    });
  },
};
