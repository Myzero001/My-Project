import exprss, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import authenticateToken from "@common/middleware/authenticateToken";
import { deliveryScheduleService } from "./deliveryScheduleService";
import {
  CreateDeliveryScheduleSchema,
  deleteDeliveryScheduleSchema,
  UpdateDeliveryScheduleSchema,
  UpdateDeliveryScheduleStatusSchema,
  SelectSchema,
  ShowCalendarScheduleSchema
} from "./deliveryScheduleModel";
import { authorizeByName } from "@common/middleware/permissions";

export const deliveryScheduleRouter = (() => {
  const router = exprss.Router();

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("บิลใบส่งมอบ", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 12;
      const searchText = (req.query.searchText as string) || "";
      const status = (req.query.status as string) || "";
      const ServiceResponse = await deliveryScheduleService.findAll(
        company_id,
        page,
        pageSize,
        searchText,
        status
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get("/get_all", 
    authenticateToken,
    authorizeByName("บิลใบส่งมอบเพิ่มเติม", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
    const ServiceResponse = await deliveryScheduleService.findAllNoPagination(company_id);
    handleServiceResponse(ServiceResponse, res);
  });
  router.get("/get_all_payment", 
    authenticateToken,
    authorizeByName("บิลใบส่งมอบเพิ่มเติม", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const ServiceResponse =
      await deliveryScheduleService.findAllPaymentNoPagination(company_id);
    handleServiceResponse(ServiceResponse, res);
  });

  router.get(
    "/get/:id",
    authenticateToken,
    authorizeByName("บิลใบส่งมอบ", ["A", "R"]),
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const ServiceResponse = await deliveryScheduleService.findAllById(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("บิลใบส่งมอบ", ["A"]),
    validateRequest(CreateDeliveryScheduleSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const userId = req.token.payload.uuid;
      const { company_id } = req.token.payload;
      const ServiceResponse = await deliveryScheduleService.create(
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
    authorizeByName("บิลใบส่งมอบ", ["A"]),
    validateRequest(UpdateDeliveryScheduleSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const { id } = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await deliveryScheduleService.update(
        id,
        payload,
        userId
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/request_delivery",
    authenticateToken,
    authorizeByName("บิลใบส่งมอบ", ["A"]),
    validateRequest(UpdateDeliveryScheduleStatusSchema),
    async (req: Request, res: Response) => {
      const { id } = req.body;
      const payload = req.body;
      const ServiceResponse = await deliveryScheduleService.requestDelivery(
        id,
        payload
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.delete(
    "/delete/:id",
    authorizeByName("บิลใบส่งมอบ", ["A"]),
    validateRequest(deleteDeliveryScheduleSchema),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const ServiceResponse = await deliveryScheduleService.delete(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get_all_overdue_payments",
      authenticateToken,
      authorizeByName("การชำระเงินล่าช้า", ["A"]),
      async (req: Request, res: Response) => {
        const { company_id } = req.token.payload;
        
        // รับค่า query parameters จาก URL (เช่น /.../?page=1&pageSize=25&searchText=test)
        const page = req.query.page as string || '1';
        const pageSize = req.query.pageSize as string || '25';
        const searchText = req.query.searchText as string || ''; // ถ้าไม่มีให้เป็นค่าว่าง

        // ส่งค่าทั้งหมดไปยัง Service
        const serviceResponse = await deliveryScheduleService.findOverduePayments(
          company_id,
          page,
          pageSize,
          searchText
        );
        handleServiceResponse(serviceResponse, res);
      }
  );

  router.get(
    "/get_customers",
    authenticateToken,
    authorizeByName("บิลใบส่งมอบ", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const dateRange = req.query.dateRange as string; // '7days', '15days', '30days', '3months', '1year'
      const serviceResponse = await deliveryScheduleService.findCustomersByCompanyId(company_id, dateRange);
      handleServiceResponse(serviceResponse, res);
    }
  );

  router.get(
    "/get_inactive_customers",
    authenticateToken,
    authorizeByName("บิลใบส่งมอบ", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const dateRange = req.query.dateRange as string; // '15days', '30days', '1month', '3months', '6months', '1year'
      const serviceResponse = await deliveryScheduleService.findInactiveCustomersByCompanyId(company_id, dateRange);
      handleServiceResponse(serviceResponse, res);
    }
  );

  router.get("/select",
    authenticateToken,
    authorizeByName("บิลใบส่งมอบ", ["A", "R"]),
    validateRequest(SelectSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const searchText = (req.query.searchText as string) || "";
      const companyId = company_id;
      const ServiceResponse = await deliveryScheduleService.select(companyId, searchText);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post(
    "/get/delivery_schedule",
    authenticateToken,
    validateRequest(ShowCalendarScheduleSchema),
    authorizeByName("บิลใบส่งมอบ", ["A"]),
    async (req: Request, res: Response) => {
      const companyId = req.token.company_id;
      const startDateFilter = req.body.startDate;
      const endDateFilter = req.body.endDate;
      const ServiceResponse = await deliveryScheduleService.findCalendarRemoval(
        companyId,
        startDateFilter,
        endDateFilter
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
