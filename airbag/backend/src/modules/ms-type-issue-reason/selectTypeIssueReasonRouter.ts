import express, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { selectTypeIssueReasonService } from "@modules/ms-type-issue-reason/selectTypeIssueReasonService";
import {
  CreateSelectTypeIssueReasonSchema,
  UpdateSelectTypeIssueReasonSchema,
  DeleteSelectTypeIssueReasonSchema,
} from "@modules/ms-type-issue-reason/selectTypeIssueReasonModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";

export const msTypeIssueReasonRouter = (() => {
  const router = express.Router();

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("ประเภทของปัญหา", ["A", "R"]),
    async (req: Request, res: Response) => {
      try {
        const companyId = req.token.company_id;
        const serviceResponse =
          await selectTypeIssueReasonService.findAll(companyId);
        handleServiceResponse(serviceResponse, res);
      } catch (error) {
        console.error("Error in GET request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  // ไม่ได้ใช้
  router.post(
    "/create",
    authenticateToken,
    authorizeAll,
    validateRequest(CreateSelectTypeIssueReasonSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const payload = req.body;

        const serviceResponse = await selectTypeIssueReasonService.create(
          companyId,
          userId,
          payload
        );
        handleServiceResponse(serviceResponse, res);
      } catch (error) {
        console.error("Error in POST request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  // ไม่ได้ใช้
  router.patch(
    "/update",
    authenticateToken,
    authorizeAll,
    validateRequest(UpdateSelectTypeIssueReasonSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const { type_issue_group_id } = req.body;
        const payload = req.body;
        const serviceResponse = await selectTypeIssueReasonService.update(
          companyId,
          userId,
          type_issue_group_id,
          payload
        );
        handleServiceResponse(serviceResponse, res);
      } catch (error) {
        console.error("Error in PATCH request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  // ไม่ได้ใช้
  // router.delete(
  //   "/delete/:id",
  //   authenticateToken,
  //   authorizeAll,
  //   validateRequest(DeleteSelectTypeIssueReasonSchema),
  //   async (req: Request, res: Response) => {
  //     try {
  //       const { company_id } = req.token.payload;
  //       const companyId = company_id;
  //       const { id } = req.params;
  //       const type_issue_group_id = id;
  //       const serviceResponse = await selectTypeIssueReasonService.delete(
  //         companyId,
  //         type_issue_group_id
  //       );
  //       handleServiceResponse(serviceResponse, res);
  //     } catch (error) {
  //       console.error("Error in DELETE request:", error);
  //       res
  //         .status(500)
  //         .json({ status: "error", message: "Internal Server Error" });
  //     }
  //   }
  // );

  

  return router;
})();
