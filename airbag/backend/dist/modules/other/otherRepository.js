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
exports.otherRepository = void 0;
const db_1 = __importDefault(require("@src/db"));
exports.otherRepository = {
    searchRegister: (companyId, searchText, skip, take) => __awaiter(void 0, void 0, void 0, function* () {
        searchText = searchText.trim();
        return yield db_1.default.master_repair_receipt.findMany({
            where: {
                company_id: companyId,
                register: {
                    equals: searchText,
                    mode: 'insensitive'
                }
            },
            skip: (skip - 1) * take,
            take: take,
            select: {
                id: true,
                register: true,
                repair_receipt_doc: true,
                total_price: true,
                master_quotation: {
                    select: {
                        quotation_id: true,
                        quotation_doc: true,
                        insurance: true,
                        insurance_date: true,
                        master_brand: { select: { master_brand_id: true, brand_name: true } },
                        master_brandmodel: { select: { ms_brandmodel_id: true, brandmodel_name: true } },
                        repair_receipt_list_repair: {
                            select: {
                                id: true,
                                is_active: true,
                                master_repair: { select: { master_repair_name: true, } }
                            }
                        },
                    }
                },
                master_delivery_schedule: {
                    select: {
                        id: true,
                        delivery_schedule_doc: true,
                        delivery_date: true,
                        master_payment: {
                            select: {
                                id: true,
                                payment_doc: true,
                                option_payment: true,
                                total_price: true,
                            }
                        }
                    }
                }
            },
            orderBy: { register: 'asc' }
        });
    }),
};
