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
exports.sendForAClaimListRepository = void 0;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const keys = [
    "send_for_a_claim_list_id",
    "send_for_a_claim_id",
    "supplier_delivery_note_id",
    "repair_receipt_id",
    "master_repair_id",
    "remark",
    "price",
];
const prisma = new client_1.PrismaClient();
exports.sendForAClaimListRepository = {
    findAll: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.send_for_a_claim_list.findMany({
            where: {
                company_id: companyId,
            },
            select: {
                send_for_a_claim_list_id: true,
                send_for_a_claim_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                remark: true,
                price: true,
                send_for_a_claim: {
                    select: {
                        send_for_a_claim_id: true,
                        send_for_a_claim_doc: true,
                        due_date: true,
                        claim_date: true,
                    },
                },
                repair_receipt: {
                    select: {
                        id: true,
                        repair_receipt_doc: true,
                    },
                },
                master_repair: {
                    select: {
                        master_repair_id: true,
                        master_repair_name: true,
                    },
                },
            },
            orderBy: { created_at: "asc" },
        });
    }),
    count: (companyId, searchText, send_for_a_claim_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.send_for_a_claim_list.count({
            where: Object.assign({ company_id: companyId, send_for_a_claim_id: send_for_a_claim_id }, (searchText && {
                OR: [
                    { remark: { contains: searchText, mode: "insensitive" } },
                ],
            })),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!payload.send_for_a_claim_id) {
            throw new Error("supplier_repair_receipt_id is required");
        }
        if (!payload.supplier_delivery_note_id) {
            throw new Error("supplier_delivery_note_id is required");
        }
        if (!payload.repair_receipt_id) {
            throw new Error("repair_receipt_id is required");
        }
        if (!payload.master_repair_id) {
            throw new Error("master_repair_id is required");
        }
        const sendForAClaimData = yield prisma.send_for_a_claim.findUnique({
            where: { send_for_a_claim_id: payload.send_for_a_claim_id },
            // select: {
            // },
        });
        const setPayload = {
            company_id: companyId,
            send_for_a_claim_id: payload.send_for_a_claim_id,
            supplier_delivery_note_id: payload.supplier_delivery_note_id,
            supplier_repair_receipt_list_id: payload.supplier_repair_receipt_list_id,
            repair_receipt_id: payload.repair_receipt_id,
            master_repair_id: payload.master_repair_id,
            remark: payload.remark,
            price: payload.price,
            created_at: (_a = payload.created_at) !== null && _a !== void 0 ? _a : new Date().toISOString(),
            created_by: userId,
            updated_at: payload.updated_at,
            updated_by: userId,
        };
        return yield prisma.send_for_a_claim_list.create({
            data: setPayload,
            select: {
                send_for_a_claim_list_id: true,
                send_for_a_claim_id: true,
                supplier_delivery_note_id: true,
                supplier_repair_receipt_list_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                remark: true,
                price: true
            }
        });
    }),
    findByIdAsync: (companyId, send_for_a_claim_list_id) => __awaiter(void 0, void 0, void 0, function* () {
        const claim = yield prisma.send_for_a_claim_list.findFirst({
            where: {
                company_id: companyId,
                send_for_a_claim_list_id: send_for_a_claim_list_id, // เพิ่มเงื่อนไขในการหาข้อมูลตาม ID
            },
            select: {
                send_for_a_claim_list_id: true,
                send_for_a_claim_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                remark: true,
                price: true
            }
        });
        if (!claim) {
            return null;
        }
        return claim;
    }),
    update: (companyId, userId, send_for_a_claim_list_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const setPayload = Object.assign(Object.assign({}, payload), { updated_at: new Date(), updated_by: userId });
        // อัพเดต supplier_delivery_note ด้วย status ใหม่
        yield prisma.send_for_a_claim_list.update({
            where: {
                company_id: companyId,
                send_for_a_claim_list_id: send_for_a_claim_list_id,
            },
            data: setPayload,
        });
    }),
    delete: (companyId, send_for_a_claim_list_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.send_for_a_claim_list.delete({
            where: {
                company_id: companyId,
                send_for_a_claim_list_id: send_for_a_claim_list_id
            },
        });
    }),
    dataBefore: (companyId, send_for_a_claim_id, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.send_for_a_claim_list.findMany({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
                supplier_delivery_note_id: supplier_delivery_note_id,
                // repair_receipt_id: repair_receipt_id,
                // master_repair_id: master_repair_id
            },
            select: {
                supplier_repair_receipt_list_id: true,
                send_for_a_claim_list_id: true,
                send_for_a_claim_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                remark: true,
                price: true
            }
        });
    }),
    checkClaimListinReceiveForAClaim: (companyId, send_for_a_claim_list_id) => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield prisma.receive_for_a_claim_list.findMany({
            where: {
                company_id: companyId,
                send_for_a_claim_list_id: send_for_a_claim_list_id,
                finish: true
            }
        });
        return results;
    }),
};
