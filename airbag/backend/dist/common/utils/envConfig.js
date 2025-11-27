"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const envalid_1 = require("envalid");
dotenv_1.default.config();
exports.env = (0, envalid_1.cleanEnv)(process.env, {
    NODE_ENV: (0, envalid_1.str)({ choices: ["development", "test", "production"] }),
    HOST: (0, envalid_1.host)(),
    PORT: (0, envalid_1.port)(),
    CORS_ORIGIN: (0, envalid_1.str)(),
    COMMON_RATE_LIMIT_MAX_REQUESTS: (0, envalid_1.num)(),
    COMMON_RATE_LIMIT_WINDOW_MS: (0, envalid_1.num)(),
    JWT_SECRET: (0, envalid_1.str)(),
    ACCESS_EXPIRATION_MINUTES: (0, envalid_1.num)(),
    REFRESH_EXPIRATION_DAYS: (0, envalid_1.num)(),
    REDIS_URI: (0, envalid_1.str)(),
});
