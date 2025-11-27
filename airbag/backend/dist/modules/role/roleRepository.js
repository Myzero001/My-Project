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
exports.roleRepository = exports.key2 = exports.Keys = void 0;
const db_1 = __importDefault(require("@src/db"));
exports.Keys = [
    "role_id",
    "role_name"
];
exports.key2 = [
    "role_name"
];
exports.roleRepository = {
    findById: (uuid_1, ...args_1) => __awaiter(void 0, [uuid_1, ...args_1], void 0, function* (uuid, keys = exports.Keys) {
        return db_1.default.roles.findUnique({
            where: { role_id: uuid },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_1.default.roles.findMany({
            orderBy: { created_at: "asc" },
        });
    }),
    findById2: (role_id) => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.roles.findFirst({
            where: {
                //company_id: companyId,
                role_id: role_id,
            },
            select: exports.key2.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}), // Use Keys array
        });
    }),
};
