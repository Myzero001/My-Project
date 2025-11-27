"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRepairReceiptNumber = generateRepairReceiptNumber;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const prisma = new client_1.PrismaClient();
function generateRepairReceiptNumber(companyId_1) {
    return __awaiter(this, arguments, void 0, function* (companyId, prefix = "SPR") {
        try {
            // Get current date in Bangkok timezone
            const currentDate = (0, dayjs_1.default)().tz("Asia/Bangkok");
            const year = currentDate.format("YYYY");
            const month = currentDate.format("MM");
            const day = currentDate.format("DD");
            // Find the latest receipt number for today
            const latestReceipt = yield prisma.supplier_repair_receipt.findFirst({
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
        }
        catch (error) {
            console.error('Error generating receipt number:', error);
            throw new Error('Failed to generate receipt number');
        }
    });
}
