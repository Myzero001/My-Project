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
exports.generateRepairReceiptDoc = void 0;
const repairReceiptRepository_1 = require("@modules/ms-repair-receipt/repairReceiptRepository");
const dayjs_1 = __importDefault(require("dayjs"));
const generateRepairReceiptDoc = () => __awaiter(void 0, void 0, void 0, function* () {
    const datePrefix = (0, dayjs_1.default)().format("YYYYMMDD"); // วันที่ในรูปแบบ YYYYMMDD
    let repairReceiptDoc = `RP${datePrefix}`;
    const date = new Date();
    const repairReceiptByDate = yield repairReceiptRepository_1.repairReceiptRepository.findByDate(date); // ดึงข้อมูลตามวันที่
    if (repairReceiptByDate && repairReceiptByDate.length > 0) {
        // ดึงส่วนลำดับเลขสูงสุด (aaa) จาก repairReceipt_doc ที่มีอยู่
        const maxSequence = Math.max(...repairReceiptByDate.map((q) => {
            const match = q.repair_receipt_doc.match(/RP\d{8}(\d{3})/); // หาเลขท้าย aaa
            return match ? parseInt(match[1], 10) : 0; // แปลงเป็นตัวเลข
        }));
        const newSequence = (maxSequence + 1).toString().padStart(3, "0"); // เพิ่ม 1 และเติมเลข 0 ด้านหน้าให้ครบ 3 หลัก
        repairReceiptDoc += newSequence;
        console.log("repairReceiptDoc", repairReceiptDoc);
    }
    else {
        repairReceiptDoc += "001"; // เริ่มต้นที่ 001 ถ้าไม่มีเอกสารในวันนั้น
        console.log("repairReceiptDoc", repairReceiptDoc);
    }
    return repairReceiptDoc;
});
exports.generateRepairReceiptDoc = generateRepairReceiptDoc;
