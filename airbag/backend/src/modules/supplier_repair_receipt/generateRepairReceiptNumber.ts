import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

export async function generateRepairReceiptNumber(companyId: string, prefix: string = "SPR"): Promise<string> {
    try {
        // Get current date in Bangkok timezone
        const currentDate = dayjs().tz("Asia/Bangkok");
        const year = currentDate.format("YYYY");
        const month = currentDate.format("MM");
        const day = currentDate.format("DD");

        // Find the latest receipt number for today
        const latestReceipt = await prisma.supplier_repair_receipt.findFirst({
            where: {
                company_id: companyId,
                receipt_doc: {
                    startsWith: `${prefix}${year}${month}${day}`
                }
            },
            orderBy: {
                receipt_doc: 'desc'
            }
        });

        let nextNumber = 1;
        
        if (latestReceipt && latestReceipt.receipt_doc) {
            // Extract the running number from the latest receipt
            const lastNumber = parseInt(latestReceipt.receipt_doc.slice(-3)) || 0;
            nextNumber = lastNumber + 1;
        }

        // Format: SPRYYYYMMDDXXX
        const formattedNumber = nextNumber.toString().padStart(3, '0');
        const receiptNumber = `${prefix}${year}${month}${day}${formattedNumber}`;

        return receiptNumber;
    } catch (error) {
        console.error('Error generating receipt number:', error);
        throw new Error('Failed to generate receipt number');
    }
}