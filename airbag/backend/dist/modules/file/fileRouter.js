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
exports.fileRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const fileModel_1 = require("./fileModel");
const fileService_1 = require("./fileService");
const multerConfig_1 = __importDefault(require("@common/middleware/multerConfig"));
const mime_types_1 = __importDefault(require("mime-types"));
exports.fileRouter = (() => {
    const router = express_1.default.Router();
    router.post("/get/file_by_url", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { file_url } = req.body;
        const ServiceResponse = yield fileService_1.fileService.findByURL(file_url);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/serve_file", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ServiceResponse = yield fileService_1.fileService.serveFile(req);
        const file_url = req.query.file_url;
        if (ServiceResponse.responseObject) {
            const fileStream = ServiceResponse.responseObject; // The file stream returned from the service
            const mimeType = mime_types_1.default.lookup(file_url);
            // Set appropriate headers for streaming an image
            if (mimeType) {
                res.setHeader("Content-Type", mimeType);
                res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
            }
            // Pipe the file stream to the response
            fileStream.pipe(res);
        }
        else {
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
    }));
    router.post("/create", authenticateToken_1.default, multerConfig_1.default, // Apply the Multer middleware
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ServiceResponse = yield fileService_1.fileService.create(req);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create/repair_receipt/box_before", authenticateToken_1.default, multerConfig_1.default, // Apply the Multer middleware
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ServiceResponse = yield fileService_1.fileService.createFileRepairReceiptBoxBefore(req);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create/repair_receipt/box_after", authenticateToken_1.default, multerConfig_1.default, // Apply the Multer middleware
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ServiceResponse = yield fileService_1.fileService.createFileRepairReceiptBoxAfter(req);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/delete", (0, httpHandlers_1.validateRequest)(fileModel_1.deleteFileSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { file_url } = req.body;
        const ServiceResponse = yield fileService_1.fileService.delete(file_url);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
