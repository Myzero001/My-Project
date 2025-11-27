import express, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { CustomerService } from "@modules/master_customer/ms_customer-Service";
import {
  CreateCustomerSchema,
  GetCustomerSchema_id,
  GetCustomerSchema,
  UpdateCustomerSchema,
  SelectSchema,
  CreateCustomerWithRequiredFieldsSchema,
} from "@modules/master_customer/ms_customer-Model";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";

export const ms_customerRouter = (() => {
  const router = express.Router();

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("ลูกค้า", ["A", "R"]),
    async (req: Request, res: Response) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 12;
        const companyId = req.token.company_id;
        const searchText = (req.query.searchText as string) || "";
        const ServiceResponse = await CustomerService.findAll(
          companyId,
          page,
          pageSize,
          searchText
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error("Error in GET request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.get("/select",
    authenticateToken,
    authorizeByName("ลูกค้า", ["A", "R"]),
    validateRequest(SelectSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const searchText = (req.query.searchText as string) || "";
      const companyId = company_id;
      const ServiceResponse = await CustomerService.select(companyId, searchText);
      handleServiceResponse(ServiceResponse, res);
    }
  );
  router.get("/get_all", 
    authenticateToken,
    authorizeByName("ลูกค้า", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id,  } = req.token.payload;
      const companyId = company_id;
      const ServiceResponse = await CustomerService.findAllNoPagination(companyId);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("ลูกค้า", ["A"]),
    validateRequest(CreateCustomerSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const payload = req.body;
        const ServiceResponse = await CustomerService.create(
          companyId,
          userId,
          payload
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error("Error in POST request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.post(
    "/create_at_quotation",
    authenticateToken,
    authorizeByName("ลูกค้า", ["A"]),
    validateRequest(CreateCustomerWithRequiredFieldsSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const payload = req.body;
        const serviceResponse = await CustomerService.createWithRequiredFields(
          companyId,
          userId,
          payload
        );
        handleServiceResponse(serviceResponse, res);
      } catch (error) {
        console.error("Error in POST /create_require request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.patch(
    "/update/:customer_id",
    authenticateToken,
    authorizeByName("ลูกค้า", ["A"]),
    validateRequest(UpdateCustomerSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const { customer_id } = req.params;
        const payload = req.body;
        const ServiceResponse = await CustomerService.update(
          customer_id,
          payload,
          companyId,
          userId
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error("Error in PATCH request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.delete(
    "/delete/:customer_id",
    authenticateToken,
    authorizeByName("ลูกค้า", ["A"]),
    validateRequest(GetCustomerSchema_id),
    async (req: Request, res: Response) => {
      try {
        const { company_id } = req.token.payload;
        const { customer_id } = req.params;
        const ServiceResponse = await CustomerService.delete(
          company_id,
          customer_id
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error("Error in DELETE request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.get(
    "/get/:customer_id",
    authenticateToken,
    authorizeByName("ลูกค้า", ["A", "R"]),
    validateRequest(GetCustomerSchema_id),
    async (req: Request, res: Response) => {
      try {
        const { company_id } = req.token.payload;
        const { customer_id } = req.params;
        const companyId = company_id;
        const ServiceResponse = await CustomerService.findById(
          companyId,
          customer_id
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error("Error in GET request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  return router;
})();

// TEST POST MAN
// {
//     "customer_code": "CUST001",
//         "customer_prefix": "Mr.",
//         "customer_name": "John Doe",
//         "contact_name": "Jane Doe",
//         "contact_number": "0123456789",
//         "line_id": "john_doe_line",
//         "addr_number": "123",
//         "addr_alley": "Alley Name",
//         "addr_street": "Main Street",
//         "addr_subdistrict": "Subdistrict Name",
//         "addr_district": "District Name",
//         "addr_province": "Province Name",
//         "addr_postcode": "12345",
//         "payment_terms": "Net30",
//         "payment_terms_day": 30,
//         "tax": 7,
//         "comment_customer": "Preferred customer",
//         "comment_sale": "High-value customer",
//         "competitor": "Competitor XYZ",
//         "created_by": "admin",
//         "updated_by": "admin"
// }
