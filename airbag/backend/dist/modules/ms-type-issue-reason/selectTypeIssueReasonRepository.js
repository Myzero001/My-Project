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
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectTypeIssueReasonRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const keys = ["type_issue_group_name", "type_issue_group_id"];
exports.selectTypeIssueReasonRepository = {
    findAll: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_type_issue_group.findMany({
            where: {
                company_id: companyId,
            },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    findByName: (companyId, type_issue_group_name) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_type_issue_group.findFirst({
            where: {
                company_id: companyId,
                type_issue_group_name: type_issue_group_name,
            },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    findById: (companyId, type_issue_group_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_type_issue_group.findFirst({
            where: {
                company_id: companyId,
                type_issue_group_id: type_issue_group_id,
            },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const type_issue_group_name = payload.type_issue_group_name.trim();
        const setPayload = {
            company_id: companyId,
            type_issue_group_name: type_issue_group_name,
            created_by: userId,
            updated_by: userId,
        };
        return yield prisma.master_type_issue_group.create({
            data: setPayload,
        });
    }),
    update: (companyId, userId, type_issue_group_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const type_issue_group_name = payload.type_issue_group_name.trim();
        const setPayload = {
            type_issue_group_name: type_issue_group_name,
            updated_by: userId,
        };
        return yield prisma.master_type_issue_group.update({
            where: {
                company_id: companyId,
                type_issue_group_id: type_issue_group_id,
            },
            data: setPayload,
        });
    }),
    delete: (companyId, type_issue_group_id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.master_type_issue_group.delete({
            where: {
                company_id: companyId,
                type_issue_group_id: type_issue_group_id,
            },
        });
    }),
};
