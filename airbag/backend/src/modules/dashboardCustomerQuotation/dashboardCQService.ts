// ms_positionService.ts
import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { ms_positionRepository } from "@modules/ms_position/ms_positionRepository";
import { TypePayloadMasterPosition } from "@modules/ms_position/ms_positionModel";
import { master_position } from "@prisma/client";
import { dashboardCQRepository } from "./dashboardCQRepository";
import { get } from "http";


export const dashboardCQService = {
    getTopTenCustomer: async (companyId: string) => {
        try {
            const customer = await dashboardCQRepository.findTopTenCustomer(companyId);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                customer,
                StatusCodes.OK
            );
        } catch (error) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching customer",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    getTotalAmount: async (companyId: string) => {
        try {
            const total = await dashboardCQRepository.findTotalAmount(companyId);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                total,
                StatusCodes.OK
            );
        } catch (error) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching total amount",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },



    getQuotationStatus: async (companyId: string, dateRange?: string) => {
        try {
            const currentDate = new Date();
            let startDate: Date | null = new Date(currentDate);

            // Set start date based on range
            if (dateRange) {
                switch (dateRange) {
                    case '15days':
                        startDate.setDate(currentDate.getDate() - 15);
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
                    case 'all':
                        startDate = null;
                        break;
                    default:
                        startDate.setMonth(currentDate.getMonth() - 1);
                }
            } else {
                startDate.setMonth(currentDate.getMonth() - 1);
            }

            // 🛠 แปลง Date เป็น string หรือ undefined ก่อนส่งเข้า repository
            const formattedStartDate = startDate ? startDate.toISOString() : undefined;

            const status = await dashboardCQRepository.findQuotationStatus(companyId, formattedStartDate);

            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                status,
                StatusCodes.OK
            );
        } catch (error) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching status",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },


    getTopTenSale: async (companyId: string) => {
        try {
            const sale = await dashboardCQRepository.findTopTenSale(companyId);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                sale,
                StatusCodes.OK
            );
        } catch (error) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching sale",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    getQuotationSummary: async (companyId: string, dateRange?: string, groupBy?: 'day' | 'week' | 'month' | 'year') => {
        try {
            const currentDate = new Date();
            let startDate: Date | null = new Date(currentDate);
            let groupBy: 'day' | 'week' | 'month' | 'year' = 'day';

            if (dateRange) {
                switch (dateRange) {
                    case '7days':
                    case '15days':
                    case '1month':
                        groupBy = 'day';
                        if (dateRange === '7days') startDate.setDate(currentDate.getDate() - 7);
                        if (dateRange === '15days') startDate.setDate(currentDate.getDate() - 15);
                        if (dateRange === '1month') startDate.setMonth(currentDate.getMonth() - 1);
                        break;

                    case '3months':
                    case '6months':
                        groupBy = 'week';
                        if (dateRange === '3months') startDate.setMonth(currentDate.getMonth() - 3);
                        if (dateRange === '6months') startDate.setMonth(currentDate.getMonth() - 6);
                        break;

                    case '1year':
                    case '3years':
                        groupBy = 'month';
                        if (dateRange === '1year') startDate.setFullYear(currentDate.getFullYear() - 1);
                        if (dateRange === '3years') startDate.setFullYear(currentDate.getFullYear() - 3);
                        break;

                    case 'all':
                        groupBy = 'year';
                        // startDate = new Date(currentDate);
                        // startDate.setFullYear(currentDate.getFullYear() - 10);
                        startDate = null;
                        break;

                    default:
                        groupBy = 'day';
                        startDate.setMonth(currentDate.getMonth() - 1);
                }
            } else {
                startDate.setMonth(currentDate.getMonth() - 1);
                groupBy = 'day';
            }
            const formattedStartDate = startDate ? startDate.toISOString() : undefined;
            const QuotationSummary = await dashboardCQRepository.findQuotationSummary(companyId, formattedStartDate, groupBy);

            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                QuotationSummary,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error fetching Quotation Summary: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching Quotation Summary",
                errorMessage,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },


}