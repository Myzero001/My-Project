import { roles } from "@prisma/client";
import prisma from "@src/db";
import { equal } from "assert";


export const otherRepository = {
    
    searchRegister: async (
      companyId: string,
      searchText: string,
      skip: number, 
      take: number,
    ) => {
      searchText = searchText.trim();
      return await prisma.master_repair_receipt.findMany({
        where: { 
          company_id : companyId ,  
          register : {
            equals: searchText,
            mode : 'insensitive'
          }
        },
        skip : (skip - 1) * take,
        take: take,
        select: {
          id: true,
          register: true,
          repair_receipt_doc: true,
          total_price: true,
          master_quotation: {
            select : { 
              quotation_id: true,
              quotation_doc: true,
              insurance: true,
              insurance_date: true,
              master_brand : { select: { master_brand_id : true , brand_name: true } },
              master_brandmodel: { select : { ms_brandmodel_id: true , brandmodel_name: true }},
              repair_receipt_list_repair : {
                select: {
                  id : true,
                  is_active : true,
                  master_repair: {select: { master_repair_name : true, }}
                }},
            }
          },
          master_delivery_schedule: {
            select: {
              id: true,
              delivery_schedule_doc: true,
              delivery_date: true,
              master_payment: {
                select : { 
                  id: true , 
                  payment_doc: true,
                  option_payment: true,
                  total_price: true,
                } 
              }
            }
          }
        },
        orderBy: { register : 'asc' }
      });
    },

    
}
