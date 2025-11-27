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
exports.fileService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const fileRepository_1 = require("./fileRepository");
const path_1 = require("path");
const promises_1 = require("fs/promises");
const mime_1 = __importDefault(require("mime"));
const util_1 = require("util");
const decodeString_1 = require("@common/utils/decodeString");
const fs_1 = require("fs");
const mime_types_1 = __importDefault(require("mime-types"));
const relativeUploadDir = `/uploads/images/${new Date(Date.now())
    .toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
})
    .replace(/\//g, "-")}`;
const relativeUploadDirBoxBefore = `/uploads/file/repaire_receipt/box_before/${new Date(Date.now())
    .toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
})
    .replace(/\//g, "-")}`;
const relativeUploadDirBoxAfter = `/uploads/file/repaire_receipt/box_after/${new Date(Date.now())
    .toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
})
    .replace(/\//g, "-")}`;
const uploadDir = (0, path_1.join)(process.cwd(), ".", relativeUploadDir);
const uploadDirBoxBefore = (0, path_1.join)(process.cwd(), ".", relativeUploadDirBoxBefore);
const uploadDirBoxAfter = (0, path_1.join)(process.cwd(), ".", relativeUploadDirBoxAfter);
const updateFolder = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, promises_1.stat)(uploadDir);
    }
    catch (_a) {
        yield (0, promises_1.mkdir)(uploadDir, { recursive: true });
    }
});
const updateFolderBoxBefore = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, promises_1.stat)(uploadDirBoxBefore);
    }
    catch (_a) {
        yield (0, promises_1.mkdir)(uploadDirBoxBefore, { recursive: true });
    }
});
const updateFolderBoxAfter = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, promises_1.stat)(uploadDirBoxAfter);
    }
    catch (_a) {
        yield (0, promises_1.mkdir)(uploadDirBoxAfter, { recursive: true });
    }
});
exports.fileService = {
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const quotations = yield fileRepository_1.fileRepository.findAll(); // ดึงข้อมูล
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", quotations, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching file", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findByURL: (file_url) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const file = yield fileRepository_1.fileRepository.getFilesByUrl(file_url); // ดึงข้อมูล
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", file, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching file", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    serveFile: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const file_url = req.query.file_url;
        try {
            const statAsync = (0, util_1.promisify)(fs_1.stat);
            const filePath = (0, path_1.join)(process.cwd(), ".", file_url);
            const fileStat = yield statAsync(filePath);
            let imageUrl;
            if (!fileStat.isFile()) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "URL parameter is missing or not a valid file", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ส่งไฟล์ไปยัง client
            const fileStream = (0, fs_1.createReadStream)(filePath);
            imageUrl = fileStream;
            // ดึงประเภทไฟล์จากนามสกุล
            const mimeType = mime_types_1.default.lookup(file_url);
            if (!mimeType) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Unsupported file type", null, http_status_codes_1.StatusCodes.UNSUPPORTED_MEDIA_TYPE);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "File fetched successfully", imageUrl, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching file", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const files = req.files;
        if (!files || files.length === 0) {
            const errorMessage = `No file uploaded`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const AllFilesURL = [];
        try {
            yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const buffer = file.buffer;
                yield updateFolder();
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const filename = `${(0, decodeString_1.decodeString)(file.originalname).replace(/\.[^/.]+$/, "")}-${uniqueSuffix}.${mime_1.default.getExtension(file.mimetype)}`;
                yield (0, promises_1.writeFile)(`${uploadDir}/${filename}`, buffer);
                const fileUrl = `${relativeUploadDir}/${filename}`;
                AllFilesURL.push(fileUrl);
                // Save to database
                yield fileRepository_1.fileRepository.create({
                    file_url: fileUrl,
                    file_name: (0, decodeString_1.decodeString)(file.originalname),
                    file_type: file.mimetype,
                    file_size: file.size.toString(),
                });
            })));
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create file success", {
                file_url: AllFilesURL.join(","),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error creating file: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    createFileRepairReceiptBoxBefore: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const files = req.files;
        if (!files || files.length === 0) {
            const errorMessage = `No file uploaded`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const AllFilesURL = [];
        try {
            yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const buffer = file.buffer;
                yield updateFolderBoxBefore();
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const filename = `${(0, decodeString_1.decodeString)(file.originalname).replace(/\.[^/.]+$/, "")}-${uniqueSuffix}.zip`;
                yield (0, promises_1.writeFile)(`${uploadDirBoxBefore}/${filename}`, buffer);
                const fileUrl = `${relativeUploadDirBoxBefore}/${filename}`;
                AllFilesURL.push(fileUrl);
                // Save to database
                yield fileRepository_1.fileRepository.create({
                    file_url: fileUrl,
                    file_name: (0, decodeString_1.decodeString)(file.originalname),
                    file_type: file.mimetype,
                    file_size: file.size.toString(),
                });
            })));
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create file success", {
                file_url: AllFilesURL.join(","),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error creating file: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    createFileRepairReceiptBoxAfter: (req) => __awaiter(void 0, void 0, void 0, function* () {
        const files = req.files;
        if (!files || files.length === 0) {
            const errorMessage = `No file uploaded`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const AllFilesURL = [];
        try {
            yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const buffer = file.buffer;
                yield updateFolderBoxAfter();
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const filename = `${(0, decodeString_1.decodeString)(file.originalname).replace(/\.[^/.]+$/, "")}-${uniqueSuffix}.zip`;
                yield (0, promises_1.writeFile)(`${uploadDirBoxAfter}/${filename}`, buffer);
                const fileUrl = `${relativeUploadDirBoxAfter}/${filename}`;
                AllFilesURL.push(fileUrl);
                // Save to database
                yield fileRepository_1.fileRepository.create({
                    file_url: fileUrl,
                    file_name: (0, decodeString_1.decodeString)(file.originalname),
                    file_type: file.mimetype,
                    file_size: file.size.toString(),
                });
            })));
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create file success", {
                file_url: AllFilesURL.join(","),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error creating file: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (file_url) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (file_url) {
                // const responseGetFilesByUrl =
                //   await fileRepository.getFilesByUrl(file_url);
                // if (!(responseGetFilesByUrl && responseGetFilesByUrl.length > 0)) {
                //   const errorMessage = `Not found file`;
                //   return new ServiceResponse(
                //     ResponseStatus.Failed,
                //     errorMessage,
                //     null,
                //     StatusCodes.NOT_FOUND
                //   );
                // }
                const All_file_url = file_url;
                for (const file of All_file_url.split(",")) {
                    const filePath = (0, path_1.join)(process.cwd(), ".", file);
                    yield (0, promises_1.unlink)(filePath);
                    yield fileRepository_1.fileRepository.delete(file);
                    const directoryPath = (0, path_1.join)(process.cwd(), ".", file.split("/").slice(0, -1).join("/"));
                    const filesInDirectory = yield (0, promises_1.readdir)(directoryPath);
                    if (filesInDirectory.length === 0) {
                        yield (0, promises_1.rmdir)(directoryPath);
                    }
                }
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete file success", "file deleted successfully", http_status_codes_1.StatusCodes.OK);
            }
            else {
                const errorMessage = `File url is required.`;
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
        }
        catch (ex) {
            const errorMessage = `Error deleting file: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
