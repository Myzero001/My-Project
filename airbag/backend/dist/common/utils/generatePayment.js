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
exports.generatePaymentDoc = void 0;
const paymentRepository_1 = require("@modules/ms-payment/paymentRepository");
const dayjs_1 = __importDefault(require("dayjs"));
const generatePaymentDoc = () => __awaiter(void 0, void 0, void 0, function* () {
    const datePrefix = (0, dayjs_1.default)().format("YYYYMMDD");
    let PaymentDoc = `PM${datePrefix}`;
    const date = new Date();
    const PaymentByDate = yield paymentRepository_1.paymentRepository.findByDate(date); // ดึงข้อมูลตามวันที่
    if (PaymentByDate && PaymentByDate.length > 0) {
        const maxSequence = Math.max(...PaymentByDate.map((q) => {
            const match = q.payment_doc.match(/PM\d{8}(\d{3})/);
            return match ? parseInt(match[1], 10) : 0;
        }));
        const newSequence = (maxSequence + 1).toString().padStart(3, "0");
        PaymentDoc += newSequence;
        console.log("PaymentDoc", PaymentDoc);
    }
    else {
        PaymentDoc += "001";
        console.log("PaymentDoc", PaymentDoc);
    }
    return PaymentDoc;
});
exports.generatePaymentDoc = generatePaymentDoc;
