import express, { Request, Response, Router } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { searchRegisterSchema } from "./otherModel";
import { otherService } from "./otherService";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";

export const otherRouter = (()=>{
 const router= express.Router();

  router.get("/search-register", 
  authenticateToken, 
  validateRequest(searchRegisterSchema),
  async (req: Request, res: Response) => {
    try{
      const companyId = req.token.company_id;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 50;
      const searchText = (req.query.search as string) || "";
      const ServiceResponse = await otherService.searchRegister(companyId ,searchText , page , pageSize);
      handleServiceResponse(ServiceResponse, res);
    }
    catch(error){
      console.error("Error in GET request:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  });




  return router;
})();

