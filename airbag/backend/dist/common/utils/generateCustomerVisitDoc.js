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
exports.generateCustomerVisitDoc = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const generateCustomerVisitDoc = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    const datePrefix = (0, dayjs_1.default)().format("YYYYMMDD"); // วันที่ในรูปแบบ YYYYMMDD
    let customerVisitDoc = `CVT${datePrefix}`;
    // ดึงข้อมูล customer_visit ที่เริ่มต้นด้วย CVTYYYYMMDD ใน companyId นั้น
    const customerVisits = yield prisma.customer_visit.findMany({
        where: {
            company_id: companyId,
            customer_visit_doc: {
                startsWith: customerVisitDoc, // กรองเอกสารที่เริ่มต้นด้วย CVTYYYYMMDD
            },
        },
    });
    if (customerVisits.length > 0) {
        // หาเลขลำดับสูงสุด (aaa) จาก customer_visit_doc ที่มีอยู่
        const maxSequence = Math.max(...customerVisits.map((visit) => {
            const match = visit.customer_visit_doc.match(/CVT\d{8}(\d{3})/); // หาเลขท้าย aaa
            return match ? parseInt(match[1], 10) : 0; // แปลงเป็นตัวเลข
        }));
        const newSequence = (maxSequence + 1).toString().padStart(3, "0"); // เพิ่ม 1 และเติมเลข 0 ด้านหน้าให้ครบ 3 หลัก
        customerVisitDoc += newSequence;
    }
    else {
        customerVisitDoc += "001"; // เริ่มต้นที่ 001 ถ้าไม่มีเอกสารในวันนั้น
    }
    return customerVisitDoc;
});
exports.generateCustomerVisitDoc = generateCustomerVisitDoc;
