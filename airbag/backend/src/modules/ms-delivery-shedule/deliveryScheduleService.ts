import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { fileService } from "@modules/file/fileService";
import { deliveryScheduleRepository } from "./deliveryScheduleRepository";
import { master_delivery_schedule } from "@prisma/client";
import {
  DELIVERY_SCHEDULE_STATUS,
  TypePayloadDeliverySchedule,
} from "./deliveryScheduleModel";
import { generateDeliveryScheduleDoc } from "@common/utils/generateDeliverySchedule";
import { repairReceiptRepository } from "@modules/ms-repair-receipt/repairReceiptRepository";

export const deliveryScheduleService = {
  findAll: async (
    companyId: string,
    page: number = 1,
    pageSize: number = 12,
    searchText: string = "",
    status: string = "all"
  ) => {
    try {
      const skip = (page - 1) * pageSize;
      const receipts = await deliveryScheduleRepository.findAll(
        companyId,
        skip,
        pageSize,
        searchText,
        status
      );
      const totalCount = await deliveryScheduleRepository.count(
        companyId,
        searchText,
        status
      );

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: receipts,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching delivery schedule",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  findAllNoPagination: async (company_id: string) => {
    try {
      const customer = await deliveryScheduleRepository.findAllNoPagination(company_id);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        customer,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching delivery schedule",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  findAllPaymentNoPagination: async (company_id: string) => {
    try {
      const customer =
        await deliveryScheduleRepository.findAllPaymentNoPagination(company_id);

      const filteredCustomers : master_delivery_schedule[] = [];

      if (customer) {
        customer.forEach((payment) => {
          const totalPrice = payment.master_repair_receipt.total_price ?? 0;
          const currentPrice = payment.master_payment.reduce(
            (sum, pay) => sum + pay.price,
            0
          ); 
          if (currentPrice < totalPrice) {
            filteredCustomers.push(payment);
          }
        });
      }

      return new ServiceResponse<master_delivery_schedule[]>(
        ResponseStatus.Success,
        "Get all success",
        filteredCustomers,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching delivery schedule",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  create: async (
    payload: TypePayloadDeliverySchedule,
    userId: string,
    company_id: string
  ) => {
    try {
      const oldDeliverySchedule =
        await deliveryScheduleRepository.findByRepairReceiptIdAndCompany(
          payload.repair_receipt_id,
          company_id
        );

      if (oldDeliverySchedule) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Delivery schedule already exists for the given repair receipt and company.",
          null,
          StatusCodes.CONFLICT
        );
      }

      payload.delivery_schedule_doc = await generateDeliveryScheduleDoc();
      payload.company_id = company_id;
      payload.created_by = userId;
      payload.updated_by = userId;
      payload.status = DELIVERY_SCHEDULE_STATUS.PENDING;

      const repairReceipt = await repairReceiptRepository.findById(
        payload.repair_receipt_id
      );

      if (repairReceipt) {
        payload.addr_number = repairReceipt.master_quotation.addr_number ?? "";
        payload.addr_alley = repairReceipt.master_quotation.addr_alley ?? "";
        payload.addr_street = repairReceipt.master_quotation.addr_street ?? "";
        payload.addr_subdistrict =
          repairReceipt.master_quotation.addr_subdistrict ?? "";
        payload.addr_district =
          repairReceipt.master_quotation.addr_district ?? "";
        payload.addr_province =
          repairReceipt.master_quotation.addr_province ?? "";
        payload.addr_postcode =
          repairReceipt.master_quotation.addr_postcode ?? "";
        payload.customer_name =
          repairReceipt.master_quotation.customer_name ?? "";
        payload.position = repairReceipt.master_quotation.position ?? "";
        payload.contact_number =
          repairReceipt.master_quotation.contact_number ?? "";
        payload.line_id = repairReceipt.master_quotation.line_id ?? "";
        payload.delivery_date = repairReceipt.expected_delivery_date ?? "";
      }
      // สร้างข้อมูลใหม่
      const response = await deliveryScheduleRepository.create(payload);

      // const payloadPeyment = {
      //   option_payment: OPTION_PAYMENT.NOT_YET_PAID,
      //   type_money: TYPE_MONEY.CASH,
      //   price: repairReceipt?.total_price ?? 0,
      //   status: PAYMENT_STATUS.OVERDUE,
      //   delivery_schedule_id: response.id,
      //   company_id : company_id,
      //   created_by : userId,
      //   updated_by : userId,
      // };
      // await paymentRepository.create(payloadPeyment);

      return new ServiceResponse<master_delivery_schedule>(
        ResponseStatus.Success,
        "Create delivery schedule success",
        response,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating delivery schedule: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  update: async (
    id: string,
    payload: Partial<TypePayloadDeliverySchedule>,
    userId: string
  ) => {
    try {
      const response = await deliveryScheduleRepository.findById(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Delivery Schedule not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      payload.updated_by = userId;
      // อัปเดตข้อมูล
      const updatedRepairReceipt = await deliveryScheduleRepository.updateHome(
        id,
        payload
      );

      return new ServiceResponse<master_delivery_schedule>(
        ResponseStatus.Success,
        "Update Repair Receipt success",
        updatedRepairReceipt,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating Repair Receipt: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  requestDelivery: async (
    id: string,
    payload: Partial<TypePayloadDeliverySchedule>
  ) => {
    payload.status = DELIVERY_SCHEDULE_STATUS.SUCCESS;

    try {
      const checkDeliverySchedule =
        await deliveryScheduleRepository.findById(id);
      if (!checkDeliverySchedule) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Delivery Schedule not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัปเดตข้อมูล
      const updated = await deliveryScheduleRepository.requestDelivery(
        id,
        payload
      );

      return new ServiceResponse<master_delivery_schedule>(
        ResponseStatus.Success,
        "update status delivery schedule success",
        updated,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error approve update status delivery schedule: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  delete: async (id: string) => {
    try {
      const response = await deliveryScheduleRepository.findById(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Delivery Schedule not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // ลบข้อมูล
      await deliveryScheduleRepository.delete(id);

      if (response.delivery_schedule_image_url) {
        await fileService.delete(response.delivery_schedule_image_url);
      }

      return new ServiceResponse<string>(
        ResponseStatus.Success,
        "Delete Delivery Schedule success",
        "Delivery Schedule deleted successfully",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error deleting Delivery Schedule: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findById: async (id: string) => {
    try {
      const response = await deliveryScheduleRepository.findById(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Delivery schedule not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<master_delivery_schedule>(
        ResponseStatus.Success,
        "Delivery schedule found",
        response,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching Delivery schedule: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findAllById: async (id: string) => {
    try {
      const response = await deliveryScheduleRepository.findAllById(id);
      if (!response) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Delivery schedule not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      return new ServiceResponse<master_delivery_schedule>(
        ResponseStatus.Success,
        "Delivery schedule found",
        response,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching Delivery schedule: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findOverduePayments: async (
  companyId: string,
  page: string,
  pageSize: string,
  searchText: string
) => {
  try {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    // 1. เรียก Repository เพื่อดึงข้อมูลที่เข้าเงื่อนไข *ทั้งหมด* (ยังไม่กรองยอดค้าง)
    const allPotentialPayments = await deliveryScheduleRepository.findOverduePayments(
      companyId,
      searchText
    );

    // 2. คำนวณยอดคงเหลือสำหรับแต่ละรายการ
    const processedPayments = allPotentialPayments.map((payment) => {
      const totalPrice = payment.master_repair_receipt?.total_price ?? 0;
      const totalPaid = payment.master_payment.reduce(
        (sum, p) => sum + (p.price ?? 0), 0
      );
      const remainingBalance = totalPrice - totalPaid;

      return {
        ...payment,
        totalPrice, // อาจจะเพิ่มเข้าไปเพื่อให้เห็นภาพชัด
        totalPaid,   // อาจจะเพิ่มเข้าไปเพื่อให้เห็นภาพชัด
        remainingBalance,
      };
    });

    // 3. กรองเฉพาะรายการที่มียอดค้างชำระ (remainingBalance > 0)
    // นี่คือจุดสำคัญ: เราจะได้ข้อมูลที่ถูกต้องเฉพาะที่ค้างชำระจริงๆ
    const filteredPayments = processedPayments.filter(
      (p) => p.remainingBalance > 0
    );

    // 4. นับจำนวนทั้งหมด *หลังจาก* กรองแล้ว เพื่อให้ Pagination ถูกต้อง
    const totalCount = filteredPayments.length;

    // 5. ทำ Pagination ด้วยตัวเองจาก Array ที่กรองแล้ว
    const startIndex = (pageNumber - 1) * pageSizeNumber;
    const endIndex = startIndex + pageSizeNumber;
    const paginatedData = filteredPayments.slice(startIndex, endIndex);

    // 6. สร้าง Response object ที่สมบูรณ์
    const responseData = {
      data: paginatedData, // ส่งข้อมูลเฉพาะของหน้านั้นๆ
      total: totalCount,   // ส่ง total ที่ถูกต้อง
      page: pageNumber,
      pageSize: pageSizeNumber,
    };

    return new ServiceResponse(
      ResponseStatus.Success,
      "Overdue payments retrieved successfully",
      responseData,
      StatusCodes.OK
    );

  } catch (ex) {
    const errorMessage = `Error fetching overdue payments: ${(ex as Error).message}`;
    console.error(errorMessage);
    return new ServiceResponse(
      ResponseStatus.Failed,
      errorMessage,
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
},

  findCustomersByCompanyId: async (companyId: string, dateRange?: string) => {
    try {
      const deliverySchedules = await deliveryScheduleRepository.findCustomersByCompanyId(companyId, dateRange);
      
      // Extract customers and calculate their debt
      const customersWithDebt = deliverySchedules
        .map(item => {
          const customer = item.master_repair_receipt?.master_quotation?.master_customer;
          if (!customer) return null;
          
          // Calculate total debt for this customer
          let totalDebt = 0;
          
          // Loop through each quotation to calculate debt
          customer.master_quotation?.forEach(quotation => {
            // For each repair receipt
            quotation.master_repair_receipt?.forEach(receipt => {
              const totalPrice = receipt.total_price || 0;
              let paidAmount = 0;
              
              // Calculate paid amount from payments
              receipt.master_delivery_schedule?.forEach(delivery => {
                delivery.master_payment?.forEach(payment => {
                  paidAmount += payment.price || 0;
                });
              });
              
              // Add the remaining debt
              totalDebt += Math.max(0, totalPrice - paidAmount);
            });
          });
          
          return {
            ...customer,
            totalDebt
          };
        })
        .filter(item => item !== null && item.totalDebt > 0);
      
      // Remove duplicates by customer_id and keep the entry with the highest debt
      const uniqueCustomersMap = new Map();
      
      customersWithDebt.forEach(customer => {
        if (!customer) return;
        
        const existingCustomer = uniqueCustomersMap.get(customer.customer_id);
        if (!existingCustomer || customer.totalDebt > existingCustomer.totalDebt) {
          uniqueCustomersMap.set(customer.customer_id, customer);
        }
      });
      
      // Convert map to array and sort by debt amount (highest first)
      const rankedCustomers = Array.from(uniqueCustomersMap.values())
        .sort((a, b) => b.totalDebt - a.totalDebt);
      
      return new ServiceResponse(
        ResponseStatus.Success,
        "Customer data retrieved and ranked by debt successfully",
        rankedCustomers,
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage = `Error fetching and ranking customer data: ${(error as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findInactiveCustomersByCompanyId: async (companyId: string, dateRange?: string) => {
    try {
      const deliverySchedules = await deliveryScheduleRepository.findInactiveCustomersByCompanyId(companyId, dateRange);
      
      // Extract customers and calculate their debt
      const customersWithDebt = deliverySchedules
        .map(item => {
          const customer = item.master_repair_receipt?.master_quotation?.master_customer;
          if (!customer) return null;
          
          // Calculate total debt for this customer
          let totalDebt = 0;
          
          // Loop through each quotation to calculate debt
          customer.master_quotation?.forEach(quotation => {
            // For each repair receipt
            quotation.master_repair_receipt?.forEach(receipt => {
              const totalPrice = receipt.total_price || 0;
              let paidAmount = 0;
              
              // Calculate paid amount from payments
              receipt.master_delivery_schedule?.forEach(delivery => {
                delivery.master_payment?.forEach(payment => {
                  paidAmount += payment.price || 0;
                });
              });
              
              // Add the remaining debt
              totalDebt += Math.max(0, totalPrice - paidAmount);
            });
          });

          const checkCustomerActivity = (customer: any, dateRange?: string) => {
            if (!customer || !customer.master_quotation) return false;
            
            const currentDate = new Date();
            let startDate = new Date(currentDate);
            
            // Set start date based on range
            if (dateRange) {
              switch (dateRange) {
                case '15days':
                  startDate.setDate(currentDate.getDate() - 15);
                  break;
                case '30days':
                  startDate.setDate(currentDate.getDate() - 30);
                  break;
                case '1month':
                  startDate.setMonth(currentDate.getMonth() - 1);
                  break;
                case '3months':
                  startDate.setMonth(currentDate.getMonth() - 3);
                  break;
                case '6months':
                  startDate.setMonth(currentDate.getMonth() - 6);
                  break;
                case '1year':
                  startDate.setFullYear(currentDate.getFullYear() - 1);
                  break;
                default:
                  // Default to 30 days if invalid range provided
                  startDate.setDate(currentDate.getDate() - 30);
              }
            } else {
              // Default to 30 days if no range provided
              startDate.setDate(currentDate.getDate() - 30);
            }
            
            // Check if there are any transactions within date range
            for (const quotation of customer.master_quotation) {
              // Check if quotation is within date range
              const quotationDate = new Date(quotation.created_at || quotation.updated_at);
              if (quotationDate >= startDate && quotationDate <= currentDate) return true;
              
              // Check repair receipts
              if (quotation.master_repair_receipt && quotation.master_repair_receipt.length > 0) {
                for (const receipt of quotation.master_repair_receipt) {
                  const receiptDate = new Date(receipt.created_at || receipt.updated_at);
                  if (receiptDate >= startDate && receiptDate <= currentDate) return true;
                  
                  // Check delivery schedules
                  if (receipt.master_delivery_schedule && receipt.master_delivery_schedule.length > 0) {
                    for (const delivery of receipt.master_delivery_schedule) {
                      const deliveryDate = new Date(delivery.created_at || delivery.updated_at);
                      if (deliveryDate >= startDate && deliveryDate <= currentDate) return true;
                      
                      // Check payments
                      if (delivery.master_payment && delivery.master_payment.length > 0) {
                        for (const payment of delivery.master_payment) {
                          const paymentDate = new Date(payment.created_at || payment.updated_at);
                          if (paymentDate >= startDate && paymentDate <= currentDate) return true;
                        }
                      }
                    }
                  }
                }
              }
            }
            
            return false;
          };
  
          // Check if customer is active within the selected date range
          const isActive = checkCustomerActivity(customer, dateRange);
          
          return {
            ...customer,
            totalDebt,
            isActive // Add active status to response
          };
        })
        .filter(item => item !== null);
      
      // Remove duplicates by customer_id and keep the entry with the highest debt
      const uniqueCustomersMap = new Map();
      
      customersWithDebt.forEach(customer => {
        if (!customer) return;
        
        const existingCustomer = uniqueCustomersMap.get(customer.customer_id);
        if (!existingCustomer || customer.totalDebt > existingCustomer.totalDebt) {
          uniqueCustomersMap.set(customer.customer_id, customer);
        }
      });
      
      // Convert map to array and sort by debt amount (highest first)
      const rankedCustomers = Array.from(uniqueCustomersMap.values())
        .sort((a, b) => b.totalDebt - a.totalDebt);
      
      return new ServiceResponse(
        ResponseStatus.Success,
        "Customer data retrieved and ranked by debt successfully",
        rankedCustomers,
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage = `Error fetching and ranking customer data: ${(error as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  select: async (companyId: string , searchText: string = "") => {
      try {
        const data = await deliveryScheduleRepository.select(companyId , searchText);
        return new ServiceResponse(
          ResponseStatus.Success,
          "Select success",
          {data},
          StatusCodes.OK
        );
        
      } catch (error) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Error fetching select",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    },
  
    findCalendarRemoval: async (companyId: string , startDateFilter: string , endDateFilter: string) => {
        try {
          const data = await deliveryScheduleRepository.showDeliverySchedule(companyId , startDateFilter , endDateFilter);
    
          if (!data) {
            return new ServiceResponse(
              ResponseStatus.Failed,
              "not found",
              null,
              StatusCodes.BAD_REQUEST
            );
          }
    
          return new ServiceResponse(
            ResponseStatus.Success,
            "success",
            data,
            StatusCodes.OK
          );
        } catch (ex) {
          const errorMessage = `Error fetching calendar schedule : ${(ex as Error).message}`;
          return new ServiceResponse(
            ResponseStatus.Failed,
            errorMessage,
            null,
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }
      }
};
