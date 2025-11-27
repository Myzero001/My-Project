// ms_positionRepository.ts
import { master_position } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TypePayloadMasterPosition } from "@modules/ms_position/ms_positionModel";
import { DELIVERY_SCHEDULE_STATUS } from "@modules/ms-delivery-shedule/deliveryScheduleModel";
const prisma = new PrismaClient();


export const dashboardCQRepository = {
    findTopTenCustomer: async (companyId: string) => {
        // 1. นับจำนวนลูกค้าทั้งหมดที่บริษัทมี
        const totalCustomers = await prisma.master_customer.count({
            where: { company_id: companyId },
        });

        // 2. ดึง 10 อันดับลูกค้าที่มียอดรวม total_price มากที่สุด
        const topCustomers = await prisma.master_quotation.groupBy({
            by: ['customer_id'],
            where: {
                company_id: companyId,
                is_deleted: false,
                total_price: { not: null },
            },
            _sum: {
                total_price: true,
            },
            orderBy: {
                _sum: {
                    total_price: 'desc',
                },
            },
            take: 10,
        });

        // 3. ดึงข้อมูลลูกค้าเพิ่มเติม
        const customerIds = topCustomers.map((c) => c.customer_id);
        const customerDetails = await prisma.master_customer.findMany({
            where: {
                customer_id: { in: customerIds },
            },
            select: {
                customer_id: true,
                customer_code: true,
                customer_name: true,
                contact_number: true,
                company_id: true,
            },
        });

        // 4. รวมข้อมูลลูกค้า + ยอดรวม total_price
        const topTenCustomers = topCustomers.map((customer) => {
            const details = customerDetails.find((c) => c.customer_id === customer.customer_id);
            return {
                customer_id: customer.customer_id,
                customer_code: details?.customer_code || null,
                customer_name: details?.customer_name || null,
                contact_number: details?.contact_number || null,
                total_money: customer._sum.total_price ?? 0,

            };
        });

        // 5. ส่งข้อมูลกลับไปพร้อมกับ total_customers
        return {
            total_customers: totalCustomers,
            top_customers: topTenCustomers,
        };
    },


    findQuotationStatus: async (companyId: string, startDate?: string) => {
        const status = await prisma.master_quotation.groupBy({
            by: ['quotation_status'],
            where: {
                company_id: companyId,
                ...(startDate && {
                    created_at: {
                        gte: new Date(startDate),
                    },
                }),
            },
            _count: {
                quotation_status: true,
            },
        });

        return status.map((s) => {
            return {
                quotation_status: s.quotation_status,
                total_quotations: s._count.quotation_status,
            };
        });
    },

    findTotalAmount: async (companyId: string) => {
        //การชำระเงิน
        //จำนวนที่ชำระเงินแล้วทั้งหมด
        const total_payment = await prisma.master_payment.count({
            where: {
                company_id: companyId,
            },
        })
        const total_payment_price = await prisma.master_payment.aggregate({
            where: {
                company_id: companyId,
            },
            _sum: {
                price: true,
            },
        })
        const paidPayments = await prisma.master_payment.findMany({
            where: {
                company_id: companyId,
            },
            select: {
                master_delivery_schedule: {
                    select: {
                        master_repair_receipt: {
                            select: {
                                id: true,
                                total_price: true
                            }
                        }
                    }
                }
            }
        })
        const receiptMap = new Map<string, number>();
        paidPayments.forEach(p => {
            const receipt = p.master_delivery_schedule?.master_repair_receipt;
            if (receipt?.id && receipt.total_price !== null && receipt.total_price !== undefined) {
                if (!receiptMap.has(receipt.id)) {
                    receiptMap.set(receipt.id, receipt.total_price);
                }
            }
        });
        const totalPaymentPriceAll = Array.from(receiptMap.values()).reduce(
            (sum, price) => sum + price,
            0
        );
        // ยอดรวมใบเสนอราคา
        const totalQuotationCount = await prisma.master_quotation.count({
            where: {
                company_id: companyId,
                is_deleted: false,
            },
        });

        const closedQuotationCount = await prisma.master_quotation.count({
            where: {
                company_id: companyId,
                is_deleted: false,
                quotation_status: 'close_deal',
            },
        });

        const totalQuotationPrice = await prisma.master_quotation.aggregate({
            where: {
                company_id: companyId,
                is_deleted: false,
            },
            _sum: {
                total_price: true,
            },
        });

        const closedQuotationPrice = await prisma.master_quotation.aggregate({
            where: {
                company_id: companyId,
                is_deleted: false,
                quotation_status: 'close_deal',
            },
            _sum: {
                total_price: true,
            },
        });


        //ยอดรวมใบรับซ่อม
        const totalRepairReceiptCount = await prisma.master_repair_receipt.count({
            where: {
                company_id: companyId,
            },
        });

        const totalRepairReceiptPrice = await prisma.master_repair_receipt.aggregate({
            where: {
                company_id: companyId,
            },
            _sum: {
                total_price: true,
            },
        });
        const repair_receipts_have_been_paid_count = await prisma.master_payment.count({
            where: {
                company_id: companyId,
                master_delivery_schedule: {
                    master_repair_receipt: {
                        company_id: companyId,
                    },
                },
            },
        })
        const totalAmountPaidRepairReceiptPercentage = totalRepairReceiptPrice._sum.total_price
            ? (total_payment_price._sum.price ?? 0) / totalRepairReceiptPrice._sum.total_price * 100
            : 0;
        // มูลค่าการส่งมอบ
        const deliverySchedules = await prisma.master_delivery_schedule.findMany({
            where: {
                company_id: companyId,
                status: DELIVERY_SCHEDULE_STATUS.SUCCESS
            },
            select: {
                id: true,
                repair_receipt_id: true,
                master_repair_receipt: {
                    select: {
                        total_price: true,
                    },
                },
            },
        });
        const totalDeliveryScheduleCount = deliverySchedules.length;
        const totalDeliverySchedulePrice = deliverySchedules.reduce((sum, schedule) => {
            return sum + (schedule.master_repair_receipt?.total_price || 0);
        }, 0);
        const delivery_schedules_have_been_paid_count = await prisma.master_payment.count({
            where: {
                company_id: companyId,
                master_delivery_schedule: {
                    company_id: companyId,
                },
            },
        })
        const totalAmountPaidDeliverySchedulePercentage = totalDeliverySchedulePrice
            ? (total_payment_price._sum.price ?? 0) / totalDeliverySchedulePrice * 100
            : 0;
        return {
            payment: { // ชำระเงิน
                total_payment: total_payment ?? 0,
                total_payment_price_customer_pay: total_payment_price._sum.price ?? 0,
                // total_payment_price_to_be_received_all: totalPaymentPriceAll ?? 0,
                total_payment_price_to_be_received_all: totalDeliverySchedulePrice ?? 0,

            },
            quotation: {
                total_quotation_count: totalQuotationCount ?? 0,//จำนวนใบเสนอราคา
                closed_deal_count: closedQuotationCount ?? 0,//จำนวนใบเสนอราคาที่ปิดดิล
                total_price_all: totalQuotationPrice._sum.total_price ?? 0,//ยอดรวมใบเสนอราคา
                closed_deal_price: closedQuotationPrice._sum.total_price ?? 0,//ยอดรวมใบเสนอราคาที่ปิดดิล
            },
            repair_receipt: {
                total_count: totalRepairReceiptCount ?? 0,//จำนวนใบรับซ่อม
                total_price: totalRepairReceiptPrice._sum.total_price ?? 0,//ยอดรวมใบรับซ่อมทั้งหมด
                total_repair_receipt_paid_count: repair_receipts_have_been_paid_count ?? 0,//จำนวนใบรับซ่อมที่มีการจ่ายแล้ว
                // total_amount_paid_repair_receipt: (totalRepairReceiptPrice._sum.total_price ?? 0) - (total_payment_price._sum.price ?? 0),//ชำระเงินเมื่อเทียบกับใบรับซ่อม
                total_amount_paid_repair_receipt_percentage: totalAmountPaidRepairReceiptPercentage.toFixed(2) ?? 0,
                outstanding_balance_on_repair_receipt: (totalRepairReceiptPrice._sum.total_price ?? 0) - (total_payment_price._sum.price ?? 0),
            },
            delivery_schedule: {//การส่งมอบ
                total_count: totalDeliveryScheduleCount ?? 0,//จำนวนใบส่งมอบ
                total_price: totalDeliverySchedulePrice ?? 0,//ยอดรวมใบส่งมอบ
                total_delivery_schedule_paid_count: delivery_schedules_have_been_paid_count ?? 0,//จำนวนใบส่งมอบที่มีการจ่ายแล้ว
                // total_amount_paid_delivery_schedule:  (totalDeliverySchedulePrice) - (total_payment_price._sum.price ?? 0),//ชำระเงินเมื่อเทียบกับใบส่งมอบ
                total_amount_paid_delivery_schedule_percentage: totalAmountPaidDeliverySchedulePercentage.toFixed(2) ?? 0,
                outstanding_balance_on_delivery_schedule: (totalDeliverySchedulePrice ?? 0) - (total_payment_price._sum.price ?? 0),
            },
        };
    },

    findTopTenSale: async (companyId: string) => {
        const topSales = await prisma.master_quotation.groupBy({
            by: ['responsible_by'],
            where: {
                company_id: companyId,
                is_deleted: false,
                total_price: {
                    not: null, // ต้องมีราคาด้วย
                },
            },
            _sum: {
                total_price: true,
            },
            _count: {
                quotation_id: true,
            },
            orderBy: {
                _sum: {
                    total_price: 'desc',
                },
            },
            take: 10,
        });

        const responsibleByIds = topSales.map(s => s.responsible_by);
        const employees = await prisma.users.findMany({
            where: {
                employee_id: { in: responsibleByIds },
                // is_active: true
            },
            select: {
                company_id: true,
                employee_id: true,
                username: true,
                role: true,
                first_name: true,
                last_name: true,
                phone_number: true,
                position: true,
            },
        });

        // รวมข้อมูลจาก topSales และ customers
        return topSales.map((s) => {
            const employee = employees.find(c => c.employee_id === s.responsible_by);
            return {
                responsible_by: s.responsible_by,
                responsible_info: employee,
                total_quotation: s._count.quotation_id,
                total_price: s._sum.total_price,
            };
        });
    },
    findQuotationSummary: async (
        companyId: string,
        startDate?: string,
        groupBy?: 'day' | 'week' | 'month' | 'year'
    ) => {
        let groupSQL: string;
        switch (groupBy) {
            case 'day':
                groupSQL = `TO_CHAR(created_at, 'DD/MM/YYYY')`; 
                break;
                case 'week':
                    groupSQL = `
                        TO_CHAR(
                            DATE_TRUNC('week', created_at), 
                            'DD/MM/YYYY'
                        ) || ' - ' || 
                        TO_CHAR(
                            DATE_TRUNC('week', created_at) + INTERVAL '6 days', 
                            'DD/MM/YYYY'
                        )
                    `;
                    break;                
            case 'month':
                groupSQL = `TO_CHAR(created_at, 'MM/YYYY')`;  
                break;
            case 'year':
            default:
                groupSQL = `TO_CHAR(created_at, 'YYYY')`; 
                break;
        }

        const result = await prisma.$queryRawUnsafe<any>(`
            SELECT 
                ${groupSQL} AS label,
                COUNT(*) AS total_count,
                SUM(total_price) AS total_price
            FROM master_quotation
            WHERE 1=1
            ${startDate ? `AND created_at >= $1::timestamp` : ``}
            GROUP BY label
            ORDER BY MIN(created_at)
        `,
            ...(startDate ? [startDate] : []));  
        return {
            data: result.map((row: any) => ({
                label: row.label,  
                total_count: Number(row.total_count),
                total_price: Number(row.total_price)
            })),
            summary: {
                total_price_all: result.reduce((total: number, row: any) => total + Number(row.total_price), 0),
                total_quotation_count: result.reduce((total: number, row: any) => total + Number(row.total_count), 0)
            }
        };
    },

};
