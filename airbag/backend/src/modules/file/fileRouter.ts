import exprss, { Request, Response } from "express";
import multer from "multer";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import authenticateToken from "@common/middleware/authenticateToken";
import { CreateFileSchema, deleteFileSchema } from "./fileModel";
import { fileService } from "./fileService";
import upload from "@common/middleware/multerConfig";
import mimeTypes from "mime-types";

export const fileRouter = (() => {
  const router = exprss.Router();

  router.post("/get/file_by_url", async (req: Request, res: Response) => {
    const { file_url } = req.body;
    const ServiceResponse = await fileService.findByURL(file_url);
    handleServiceResponse(ServiceResponse, res);
  });

  router.get("/serve_file", async (req: Request, res: Response) => {
    const ServiceResponse = await fileService.serveFile(req);
    const file_url = req.query.file_url as string;

    if (ServiceResponse.responseObject) {
      const fileStream = ServiceResponse.responseObject; // The file stream returned from the service
      const mimeType = mimeTypes.lookup(file_url);
      // Set appropriate headers for streaming an image
      if (mimeType) {
        res.setHeader("Content-Type", mimeType);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
      // Pipe the file stream to the response
      fileStream.pipe(res);
    } else {
      handleServiceResponse(ServiceResponse, res);
    }
  });

  router.post(
    "/create",
    authenticateToken,
    upload, // Apply the Multer middleware
    async (req: Request, res: Response) => {
      const ServiceResponse = await fileService.create(req);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post(
    "/create/repair_receipt/box_before",
    authenticateToken,
    upload, // Apply the Multer middleware
    async (req: Request, res: Response) => {
      const ServiceResponse =
        await fileService.createFileRepairReceiptBoxBefore(req);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post(
    "/create/repair_receipt/box_after",
    authenticateToken,
    upload, // Apply the Multer middleware
    async (req: Request, res: Response) => {
      const ServiceResponse =
        await fileService.createFileRepairReceiptBoxAfter(req);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post(
    "/delete",
    validateRequest(deleteFileSchema),
    async (req: Request, res: Response) => {
      const { file_url } = req.body;
      const ServiceResponse = await fileService.delete(file_url);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
