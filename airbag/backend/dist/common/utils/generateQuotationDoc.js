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
exports.generateQuotationDoc = void 0;
const quotationRepository_1 = require("@modules/quotation/quotationRepository");
const dayjs_1 = __importDefault(require("dayjs"));
const generateQuotationDoc = () => __awaiter(void 0, void 0, void 0, function* () {
    const datePrefix = (0, dayjs_1.default)().format("YYYYMMDD"); // วันที่ในรูปแบบ YYYYMMDD
    let quotationDoc = `QTN${datePrefix}`;
    const date = new Date();
    const quotationByDate = yield quotationRepository_1.quotationRepository.findByDate(date); // ดึงข้อมูลตามวันที่
    if (quotationByDate && quotationByDate.length > 0) {
        // ดึงส่วนลำดับเลขสูงสุด (aaa) จาก quotation_doc ที่มีอยู่
        const maxSequence = Math.max(...quotationByDate.map((q) => {
            const match = q.quotation_doc.match(/QTN\d{8}(\d{3})/); // หาเลขท้าย aaa
            return match ? parseInt(match[1], 10) : 0; // แปลงเป็นตัวเลข
        }));
        const newSequence = (maxSequence + 1).toString().padStart(3, "0"); // เพิ่ม 1 และเติมเลข 0 ด้านหน้าให้ครบ 3 หลัก
        quotationDoc += newSequence;
    }
    else {
        quotationDoc += "001"; // เริ่มต้นที่ 001 ถ้าไม่มีเอกสารในวันนั้น
        console.log("quotationDoc", quotationDoc);
    }
    return quotationDoc;
});
exports.generateQuotationDoc = generateQuotationDoc;
