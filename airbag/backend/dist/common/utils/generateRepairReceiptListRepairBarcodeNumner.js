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
exports.generateRepairReceiptListRepairBarcodeNumner = void 0;
const repairReceiptListRepairRepository_1 = require("@modules/repair-receipt-list-repair/repairReceiptListRepairRepository");
const dayjs_1 = __importDefault(require("dayjs"));
const generateRepairReceiptListRepairBarcodeNumner = (companyCode) => __awaiter(void 0, void 0, void 0, function* () {
    const datePrefix = (0, dayjs_1.default)().format("YYYYMMDD");
    let repairReceiptDoc = `${companyCode}${datePrefix}`;
    const date = new Date();
    const repairReceiptListRepairByDate = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.findByDateStartEnd(date);
    if (repairReceiptListRepairByDate &&
        repairReceiptListRepairByDate.length > 0) {
        const maxSequence = Math.max(...repairReceiptListRepairByDate.map((q) => {
            const regex = new RegExp(`${companyCode}\\d{8}(\\d{4})`);
            const match = q.barcode.match(regex);
            return match ? parseInt(match[1], 10) : 0;
        }));
        const newSequence = (maxSequence + 1).toString().padStart(4, "0");
        repairReceiptDoc += newSequence;
        console.log("repairReceiptDoc", repairReceiptDoc);
    }
    else {
        repairReceiptDoc += "0001";
        console.log("repairReceiptDoc", repairReceiptDoc);
    }
    return repairReceiptDoc;
});
exports.generateRepairReceiptListRepairBarcodeNumner = generateRepairReceiptListRepairBarcodeNumner;
