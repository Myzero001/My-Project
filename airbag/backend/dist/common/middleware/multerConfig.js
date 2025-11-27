"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Configure memory storage
const storage = multer_1.default.memoryStorage();
// Set up Multer to handle multiple files
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // Optional: Limit file size to 10MB
}).array("files", 20); // Accept up to 30 files with the key "files"
exports.default = upload;
