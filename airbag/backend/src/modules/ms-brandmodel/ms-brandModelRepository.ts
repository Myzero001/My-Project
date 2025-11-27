import { TypePayloadMasterBrandModel } from "./ms-brand-Model";
import { master_brandmodel } from "@prisma/client";
import prisma from "@src/db";

export const brandModelRepository = {
  // ดึงข้อมูลทั้งหมด พร้อม pagination
  findAll: async (companyId: string, skip: number, take: number, searchText: string) => {
    return await prisma.master_brandmodel.findMany({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
              OR: [
                {
                  brandmodel_name: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
                {
                  master_brand: {
                    brand_name: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {}),
      },
      skip,
      take,
      select: {
        ms_brandmodel_id: true, // ฟิลด์ ms_brandmodel_id
        brandmodel_name: true, // ฟิลด์ brandmodel_name
        master_brand: {
          // ฟิลด์จากตาราง master_brand ที่เชื่อมโยง
          select: {
            master_brand_id: true, // ฟิลด์ master_brand_id
            brand_name: true, // ฟิลด์ brand_name
          },
        },
      },
      orderBy: { created_at: "asc" }, // เรียงลำดับตาม created_at
    });
  }, 

  findAllNoPagination: async (companyId: string) => {
    return await prisma.master_brandmodel.findMany({
      where: {
        company_id: companyId,
      },
      orderBy: { created_at: "asc" },
    });
  },
  
  select: async  (companyId: string , brandId: string, searchText : string) => {
      const data = await prisma.master_brandmodel.findMany({
        where: {
          company_id: companyId,
          master_brand_id: brandId,
          ...(searchText && {
  
                brandmodel_name: {
                  contains: searchText,
                  mode: 'insensitive'
                
              },
          }),
        },
        skip : 0,
        take : 50,
        select: {
          ms_brandmodel_id : true,
          brandmodel_name: true
        },
        orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
      });
      
  
      return data;
    },

  // นับจำนวนข้อมูลทั้งหมด
  count: async (companyId: string, searchText: string) => {
    return await prisma.master_brandmodel.count({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
              OR: [
                {
                  brandmodel_name: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
                {
                  master_brand: {
                    brand_name: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {}),
      },
    });
  },

  // ค้นหาด้วย Brand ID
  findByBrand: async <Key extends keyof master_brandmodel>(
    companyId: string,
    master_brand_id: string,
    keys: Key[] = [
      "ms_brandmodel_id",
      "brandmodel_name",
      "master_brand_id",
    ] as Key[]
  ) => {
    return prisma.master_brandmodel.findMany({
      where: {
        company_id: companyId,
        master_brand_id: master_brand_id.trim(),
      },
      select: keys.reduce((obj, key) => ({ ...obj, [key]: true }), {}),
    });
  },

  findByName: async <Key extends keyof master_brandmodel>(
    companyId: string,
    brandmodel_name: string,
    master_brand_id?: string,
    excludeId?: string,
    keys: Key[] = [
      "ms_brandmodel_id",
      "brandmodel_name",
      "master_brand_id",
      "created_at",
      "updated_at",
    ] as Key[]
  ) => {
    return prisma.master_brandmodel.findFirst({
      where: {
        // ใช้ AND เพื่อรวมเงื่อนไขทั้งหมด
        AND: [
          // เงื่อนไขที่ 1: เปรียบเทียบชื่อแบบไม่สนตัวพิมพ์เล็ก-ใหญ่
          {
            brandmodel_name: {
              equals: brandmodel_name.trim(),
              mode: 'insensitive', 
            }
          },
          // เงื่อนไขที่ 2: ต้องเป็นของบริษัทเดียวกัน
          { company_id: companyId },

          // เงื่อนไขที่ 3 (ถ้ามี): ต้องเป็นของแบรนด์เดียวกัน
          ...(master_brand_id ? [{ master_brand_id }] : []),
          
          // เงื่อนไขที่ 4 (ถ้ามี): ต้องไม่ใช่ ID ที่กำลังแก้ไข
          ...(excludeId ? [{ ms_brandmodel_id: { not: excludeId } }] : []),
        ]
      },
      select: keys.reduce((obj, key) => ({ ...obj, [key]: true }), {}),
    }) as Promise<Pick<master_brandmodel, Key> | null>;
  },

  // สร้างข้อมูลใหม่
  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadMasterBrandModel
  ) => {
    const brandmodel_name = payload.brandmodel_name.trim();
    return prisma.master_brandmodel.create({
      data: {
        company_id: companyId,
        brandmodel_name,
        master_brand_id: payload.master_brand_id || null,
        created_by: userId,
        updated_by: userId,
      },
      select: {
        brandmodel_name: true,
        created_at: true,
        created_by: true,
      },
    });
  },

  // ค้นหาด้วย ID
  findById: async <Key extends keyof master_brandmodel>(
    companyId: string,
    ms_brandmodel_id: string,
    keys: Key[] = [
      "ms_brandmodel_id",
      "brandmodel_name",
      "master_brand_id",
      "created_at",
      "updated_at",
    ] as Key[]
  ) => {
    return prisma.master_brandmodel.findFirst({
      where: {
        company_id: companyId,
        ms_brandmodel_id,
      },
      select: keys.reduce((obj, key) => ({ ...obj, [key]: true }), {}),
    }) as Promise<Pick<master_brandmodel, Key> | null>;
  },

  // อัปเดตข้อมูล
  update: async (
    companyId: string,
    userId: string,
    ms_brandmodel_id: string,
    payload: TypePayloadMasterBrandModel
  ) => {
    const brandmodel_name = payload.brandmodel_name.trim();
    return prisma.master_brandmodel.update({
      where: {
        ms_brandmodel_id,
        company_id: companyId,
      },
      data: {
        brandmodel_name,
        master_brand_id: payload.master_brand_id || null,
        updated_by: userId,
      },
      select: {
        brandmodel_name: true,
        updated_at: true,
        updated_by: true,
      },
    });
  },

  // ลบข้อมูล
  delete: async (companyId: string, ms_brandmodel_id: string) => {
    return prisma.master_brandmodel.delete({
      where: {
        ms_brandmodel_id,
        company_id: companyId,
      },
    });
  },
};
