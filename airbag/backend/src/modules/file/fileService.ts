import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { fileRepository } from "./fileRepository";
import { CreateFileSchema, deleteFileSchema } from "./fileModel";

import { join } from "path";
import { stat, mkdir, writeFile, unlink, readdir, rmdir } from "fs/promises";
import mime from "mime";
import { promisify } from "util";
import { decodeString } from "@common/utils/decodeString";

import { stat as stat2, createReadStream } from "fs";
import mimeTypes from "mime-types";

const relativeUploadDir = `/uploads/images/${new Date(Date.now())
  .toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  .replace(/\//g, "-")}`;

const relativeUploadDirBoxBefore = `/uploads/file/repaire_receipt/box_before/${new Date(
  Date.now()
)
  .toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  .replace(/\//g, "-")}`;

const relativeUploadDirBoxAfter = `/uploads/file/repaire_receipt/box_after/${new Date(
  Date.now()
)
  .toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  .replace(/\//g, "-")}`;

const uploadDir = join(process.cwd(), ".", relativeUploadDir);

const uploadDirBoxBefore = join(process.cwd(), ".", relativeUploadDirBoxBefore);

const uploadDirBoxAfter = join(process.cwd(), ".", relativeUploadDirBoxAfter);

const updateFolder = async () => {
  try {
    await stat(uploadDir);
  } catch {
    await mkdir(uploadDir, { recursive: true });
  }
};

const updateFolderBoxBefore = async () => {
  try {
    await stat(uploadDirBoxBefore);
  } catch {
    await mkdir(uploadDirBoxBefore, { recursive: true });
  }
};

const updateFolderBoxAfter = async () => {
  try {
    await stat(uploadDirBoxAfter);
  } catch {
    await mkdir(uploadDirBoxAfter, { recursive: true });
  }
};

export const fileService = {
  findAll: async () => {
    try {
      const quotations = await fileRepository.findAll(); // ดึงข้อมูล

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        quotations,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching file",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findByURL: async (file_url: string) => {
    try {
      const file = await fileRepository.getFilesByUrl(file_url); // ดึงข้อมูล
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        file,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching file",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  serveFile: async (req: Request) => {
    const file_url = req.query.file_url as string;

    try {
      const statAsync = promisify(stat2);

      const filePath = join(process.cwd(), ".", file_url as string);

      const fileStat = await statAsync(filePath);
      let imageUrl: any;

      if (!fileStat.isFile()) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "URL parameter is missing or not a valid file",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      // ส่งไฟล์ไปยัง client
      const fileStream = createReadStream(filePath);
      imageUrl = fileStream;

      // ดึงประเภทไฟล์จากนามสกุล
      const mimeType = mimeTypes.lookup(file_url);
      if (!mimeType) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Unsupported file type",
          null,
          StatusCodes.UNSUPPORTED_MEDIA_TYPE
        );
      }

      return new ServiceResponse(
        ResponseStatus.Success,
        "File fetched successfully",
        imageUrl,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching file",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  create: async (req: Request) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      const errorMessage = `No file uploaded`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const AllFilesURL: string[] = [];

    try {
      await Promise.all(
        files.map(async (file) => {
          const buffer = file.buffer;

          await updateFolder();
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const filename = `${decodeString(file.originalname).replace(
            /\.[^/.]+$/,
            ""
          )}-${uniqueSuffix}.${mime.getExtension(file.mimetype)}`;

          await writeFile(`${uploadDir}/${filename}`, buffer);
          const fileUrl = `${relativeUploadDir}/${filename}`;
          AllFilesURL.push(fileUrl);
          // Save to database
          await fileRepository.create({
            file_url: fileUrl,
            file_name: decodeString(file.originalname),
            file_type: file.mimetype,
            file_size: file.size.toString(),
          });
        })
      );

      return new ServiceResponse<{ file_url: string }>(
        ResponseStatus.Success,
        "Create file success",
        {
          file_url: AllFilesURL.join(","),
        },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating file: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  createFileRepairReceiptBoxBefore: async (req: Request) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      const errorMessage = `No file uploaded`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const AllFilesURL: string[] = [];

    try {
      await Promise.all(
        files.map(async (file) => {
          const buffer = file.buffer;

          await updateFolderBoxBefore();
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const filename = `${decodeString(file.originalname).replace(
            /\.[^/.]+$/,
            ""
          )}-${uniqueSuffix}.zip`;
          await writeFile(`${uploadDirBoxBefore}/${filename}`, buffer);
          const fileUrl = `${relativeUploadDirBoxBefore}/${filename}`;
          AllFilesURL.push(fileUrl);
          // Save to database
          await fileRepository.create({
            file_url: fileUrl,
            file_name: decodeString(file.originalname),
            file_type: file.mimetype,
            file_size: file.size.toString(),
          });
        })
      );

      return new ServiceResponse<{ file_url: string }>(
        ResponseStatus.Success,
        "Create file success",
        {
          file_url: AllFilesURL.join(","),
        },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating file: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  createFileRepairReceiptBoxAfter: async (req: Request) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      const errorMessage = `No file uploaded`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const AllFilesURL: string[] = [];

    try {
      await Promise.all(
        files.map(async (file) => {
          const buffer = file.buffer;

          await updateFolderBoxAfter();
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const filename = `${decodeString(file.originalname).replace(
            /\.[^/.]+$/,
            ""
          )}-${uniqueSuffix}.zip`;

          await writeFile(`${uploadDirBoxAfter}/${filename}`, buffer);
          const fileUrl = `${relativeUploadDirBoxAfter}/${filename}`;
          AllFilesURL.push(fileUrl);
          // Save to database
          await fileRepository.create({
            file_url: fileUrl,
            file_name: decodeString(file.originalname),
            file_type: file.mimetype,
            file_size: file.size.toString(),
          });
        })
      );

      return new ServiceResponse<{ file_url: string }>(
        ResponseStatus.Success,
        "Create file success",
        {
          file_url: AllFilesURL.join(","),
        },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating file: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  delete: async (file_url: string) => {
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
          const filePath = join(process.cwd(), ".", file);

          await unlink(filePath);

          await fileRepository.delete(file);

          const directoryPath = join(
            process.cwd(),
            ".",
            file.split("/").slice(0, -1).join("/")
          );

          const filesInDirectory = await readdir(directoryPath);

          if (filesInDirectory.length === 0) {
            await rmdir(directoryPath);
          }
        }

        return new ServiceResponse<string>(
          ResponseStatus.Success,
          "Delete file success",
          "file deleted successfully",
          StatusCodes.OK
        );
      } else {
        const errorMessage = `File url is required.`;
        return new ServiceResponse(
          ResponseStatus.Failed,
          errorMessage,
          null,
          StatusCodes.BAD_REQUEST
        );
      }
    } catch (ex) {
      const errorMessage = `Error deleting file: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
