import exprss, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import {
  UpdateQuotationSchema,
  CreateQuotationSchema,
  UpdateStatusQuotationSchema,
} from "@modules/quotation/quotationModel";
import authenticateToken from "@common/middleware/authenticateToken";
import { repairReceiptService } from "./repairReceiptService";
import {
  CreateRepairReceiptSchema,
  deleteRepairReceiptSchema,
  UpdateRepairReceiptSchema,
  UpdateStatusRepairReceiptSchema,
  SelectSchema
} from "./repairReceiptModel";
import { authorizeByName } from "@common/middleware/permissions";
import { StatusCodes } from "http-status-codes";
import {
  ServiceResponse,
  ResponseStatus,
} from "@common/models/serviceResponse";
export const repairReceiptRouter = (() => {
  const router = exprss.Router();

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("ใบรับซ่อม", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 12;
      const searchText = (req.query.searchText as string) || "";
      const status = (req.query.status as string) || "all";
      const ServiceResponse = await repairReceiptService.findAll(
        company_id,
        page,
        pageSize,
        searchText,
        status
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  // router.get(
  //   "/get_all",
  //   authenticateToken,
  //   // authorizeByName("ใบเสนอราคา", ["A", "R"]),
  //   async (req: Request, res: Response) => {
  //     const { company_id } = req.token.payload;
  //     const ServiceResponse = await repairReceiptService.findAllNoPagination(company_id);
  //     handleServiceResponse(ServiceResponse, res);
  //   }
  // );

  router.get(
    "/get_by_not_delivered",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const ServiceResponse =
        await repairReceiptService.findAllNotDeliveryNoPagination(company_id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get/:id",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A", "R"]),
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const ServiceResponse = await repairReceiptService.findAllById(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post(
    "/create",
    authenticateToken,
    validateRequest(CreateRepairReceiptSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const { company_id } = req.token.payload;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await repairReceiptService.create(
        payload,
        userId,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/update",
    authenticateToken,
    authorizeByName("ใบรับซ่อมหน้าแรกหน้ารายการซ่อม", ["A"]),
    validateRequest(UpdateRepairReceiptSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const { id } = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await repairReceiptService.update(
        id,
        payload,
        userId
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/update/box",
    authenticateToken,
    authorizeByName("ใบรับซ่อมหน้ากล่อง", ["A"]),
    validateRequest(UpdateRepairReceiptSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const { id } = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await repairReceiptService.updateBox(
        id,
        payload,
        userId
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );
  router.patch(
    "/update/box_clear_by",
    authenticateToken,
    authorizeByName("ใบรับซ่อมหน้ากล่อง clear by", ["A"]),
    validateRequest(UpdateRepairReceiptSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const { id } = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await repairReceiptService.updateBox(
        id,
        payload,
        userId
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/success",
    authenticateToken,
    validateRequest(UpdateStatusRepairReceiptSchema),
    async (req: Request, res: Response) => {
      const { quotation_id } = req.body;
      const payload = req.body;
      const ServiceResponse = await repairReceiptService.success(
        quotation_id,
        payload
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/cancel",
    authenticateToken,
    validateRequest(UpdateStatusRepairReceiptSchema),
    async (req: Request, res: Response) => {
      const { id } = req.body;
      const payload = req.body;
      const ServiceResponse = await repairReceiptService.cancel(id, payload);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.delete(
    "/delete/:id",
    validateRequest(deleteRepairReceiptSchema),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const ServiceResponse = await repairReceiptService.delete(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get("/get/payloadjob/:id",
    authenticateToken,
    authorizeByName("งาน", ["A","R"]),
    async (req: Request, res: Response) => {
    const id = req.params.id;
    const ServiceResponse =
      await repairReceiptService.findSelectedFieldsById(id);
    handleServiceResponse(ServiceResponse, res);
  });

  router.patch(
    "/finish/:id",
    authenticateToken,
    authorizeByName("งาน", ["A","R"]),
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const ServiceResponse = await repairReceiptService.setFinishToTrue(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/unfinish/:id",
    authenticateToken,
    authorizeByName("งาน", ["A","R"]),
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const ServiceResponse = await repairReceiptService.setFinishToFalse(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get("/get-by-finish/:id",
    authenticateToken,
    authorizeByName("งาน", ["A","R"]),
    async (req: Request, res: Response) => {
    const id = req.params.id;
    const isFinished = req.query.finish === "true";
    const ServiceResponse = await repairReceiptService.findByFinishStatusAndId(
      id,
      isFinished
    );
    handleServiceResponse(ServiceResponse, res);
  });

  router.get(
    "/get-select",
    authenticateToken,
    authorizeByName("ปฏิทินนัดหมายถอด", ["A", "R"]),
    async (req: Request, res: Response) => {
      const companyId = req.token.company_id;

      const ServiceResponse = await repairReceiptService.findSelect(companyId);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/pay-load-calendar-removal/:id",
    authenticateToken,
    authorizeByName("ปฏิทินนัดหมายถอด", ["A"]),
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const { company_id } = req.token.payload;
      const ServiceResponse = await repairReceiptService.findCalendarRemoval(
        id,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get-doc-id",
    authenticateToken,
    authorizeByName("ปฏิทินนัดหมายถอด", ["A"]),
    async (req: Request, res: Response) => {
      const companyId = req.token.company_id;

      const ServiceResponse = await repairReceiptService.findDocAndId(companyId);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get-repair-docs",
    authenticateToken,
    authorizeByName("เปลี่ยนผู้รับผิดชอบ", ["A"]),
    async (req: Request, res: Response) => {
      const company_id = (req.token as any)?.payload?.company_id;

      if (!company_id) {
          handleServiceResponse(new ServiceResponse( 
              ResponseStatus.Failed,              
              "Company ID not found in token.",
              null,
              StatusCodes.UNAUTHORIZED          
          ), res);
          return;
      }

      const serviceResponse = await repairReceiptService.findRepairDocsByCompanyId(company_id);
      handleServiceResponse(serviceResponse, res);
    }
  );

  router.get(
    "/get-with-responsible/:id",
    authenticateToken,
    authorizeByName("เปลี่ยนผู้รับผิดชอบ", ["A"]),
    async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) {
                handleServiceResponse(new ServiceResponse(
                    ResponseStatus.Failed,
                    "Repair receipt ID is required.",
                    null,
                    StatusCodes.BAD_REQUEST
                ), res);
                return;
            }
            // เรียกฟังก์ชัน service ที่อัปเดตแล้ว
            const serviceResponse = await repairReceiptService.findResponsibleUserForRepairReceipt(id);
            handleServiceResponse(serviceResponse, res);
        } catch (error) {
            console.error(`Error in /get-with-responsible/${req.params.id}:`, error);
            const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
            handleServiceResponse(new ServiceResponse(
                ResponseStatus.Failed,
                `Error processing request: ${errorMessage}`,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            ), res);
        }
    }
);

router.patch(
  "/update-responsible/:id",
  authenticateToken,
  authorizeByName("เปลี่ยนผู้รับผิดชอบ", ["A"]),
  async (req: Request, res: Response): Promise<void> => { 
    try {
      const { id } = req.params;
      const responsible_by = (req.body as { responsible_by?: string })?.responsible_by;
      const userId = (req.token as any)?.payload?.uuid;

      if (!id) {
        handleServiceResponse(new ServiceResponse(
          ResponseStatus.Failed,
          "Document ID is required in path parameters.",
          null,
          StatusCodes.BAD_REQUEST
        ), res);
        return; // ออกจากฟังก์ชันหลังจากส่ง response
      }

      if (!responsible_by) {
        handleServiceResponse(new ServiceResponse(
          ResponseStatus.Failed,
          "responsible_by field is required in the payload.",
          null,
          StatusCodes.BAD_REQUEST
        ), res);
        return; // ออกจากฟังก์ชันหลังจากส่ง response
      }

      if (!userId) {
        handleServiceResponse(new ServiceResponse(
            ResponseStatus.Failed,
            "User ID not found in token.",
            null,
            StatusCodes.UNAUTHORIZED
        ), res);
        return;
      }

      const serviceResponse = await repairReceiptService.updateResponsibleBy(id, responsible_by, userId);
      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      console.error(`Critical error in PATCH /${req.params.id}/responsible-by:`, error);
      handleServiceResponse(new ServiceResponse(
        ResponseStatus.Failed,
        "An unexpected server error occurred.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      ), res);
    }
  }
);

  router.get("/select",
    authenticateToken,
    authorizeByName("ใบรับซ่อม", ["A", "R"]),
    validateRequest(SelectSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const searchText = (req.query.searchText as string) || "";
      const companyId = company_id;
      const ServiceResponse = await repairReceiptService.select(companyId, searchText);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/jobs",
    authenticateToken,
    authorizeByName("งาน", ["A", "R"]),
    async (req: Request, res: Response): Promise<void> => {                                                                                                                                           
      try { // <-- แนะนำให้ครอบด้วย try...catch ด้วย
        const { company_id } = req.token.payload;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 25;
        const searchText = (req.query.searchText as string) || "";
        const status = (req.query.status as string) || "all";
  
        if (!['all', 'pending', 'success'].includes(status)) {
           // ไม่ต้องมี return ข้างหน้า handleServiceResponse
           handleServiceResponse(new ServiceResponse(
              ResponseStatus.Failed,
              "Invalid status value. Must be 'all', 'pending', or 'success'.",
              null,
              StatusCodes.BAD_REQUEST
            ), res);
            return; // ใช้ return เปล่าๆ เพื่อจบการทำงานของฟังก์ชัน
        }
  
        const serviceResponse = await repairReceiptService.findAllJobs(
          company_id,
          page,
          pageSize,
          status as 'all' | 'pending' | 'success',
          searchText
        );
        handleServiceResponse(serviceResponse, res);

      } catch (error) {
        // จัดการ error ที่อาจเกิดขึ้นโดยไม่คาดฝัน
        handleServiceResponse(new ServiceResponse(
            ResponseStatus.Failed,
            "An unexpected error occurred in /jobs endpoint.",
            null,
            StatusCodes.INTERNAL_SERVER_ERROR
          ), res);
      }
    }
  );

  return router;
})();
