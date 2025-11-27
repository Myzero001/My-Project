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
exports.generateSupplierDeliveryNoteDoc = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const generateSupplierDeliveryNoteDoc = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    const datePrefix = (0, dayjs_1.default)().format("YYYYMMDD");
    let supplierDeliveryNoteDoc = `SPS${datePrefix}`;
    const supplierDeliveryNote = yield prisma.supplier_delivery_note.findMany({
        where: {
            company_id: companyId,
            supplier_delivery_note_doc: {
                startsWith: supplierDeliveryNoteDoc,
            },
        },
    });
    if (supplierDeliveryNote.length > 0) {
        const maxSequence = Math.max(...supplierDeliveryNote.map((SDN) => {
            const match = SDN.supplier_delivery_note_doc.match(/SPS\d{8}(\d{3})/);
            return match ? parseInt(match[1], 10) : 0;
        }));
        const newSequence = (maxSequence + 1).toString().padStart(3, "0");
        supplierDeliveryNoteDoc += newSequence;
    }
    else {
        supplierDeliveryNoteDoc += "001";
    }
    return supplierDeliveryNoteDoc;
});
exports.generateSupplierDeliveryNoteDoc = generateSupplierDeliveryNoteDoc;
