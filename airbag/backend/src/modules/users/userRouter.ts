import express, {Request, Response, Router} from "express";

import {
    handleServiceResponse,
    validateRequest,
  } from "@common/utils/httpHandlers";
import { userService } from "@modules/users/userService";
import { CreateUserSchema, LoginUserSchema, UpdateUserSchema ,GetUserSchema} from "@modules/users/userModel";
import authenticateToken from "@common/middleware/authenticateToken";
import {authorizeByName} from "@common/middleware/permissions";

import authorizeAll from "@common/middleware/authorizeAll";




export const userRouter = (() => {
    const router = express.Router();

    router.post("/login", validateRequest(LoginUserSchema),  async (req: Request, res: Response) => {
        const payload = req.body;
        const ServiceResponse = await userService.login(payload, res);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/logout", async (req: Request, res: Response) => {
        const ServiceResponse = await userService.logout(res);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/auth-status", async (req: Request, res: Response) => {
        const ServiceResponse = await userService.authStatus(req);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get",
        authenticateToken,
        authorizeByName("พนักงาน", ["A"]),
        async (req: Request, res: Response) => {
       try{
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 12;
            const companyId = req.token.company_id;
            const searchText = (req.query.searchText as string) || "";
            const ServiceResponse = await userService.findAll(
                companyId,
                page,
                pageSize,
                searchText
            );   
            handleServiceResponse(ServiceResponse,res);
        }catch(error){
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }),

    router.patch("/update/:employee_id", 
    authenticateToken,
    authorizeByName("พนักงาน", ["A"]),
    validateRequest(UpdateUserSchema), 
    async (req: Request, res: Response) => {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;                          
            const { employee_id } = req.params;
            const payload = req.body;
            
            const ServiceResponse = await userService.update(
                companyId,
                userId,     
                employee_id,
                payload
            );
            
            handleServiceResponse(ServiceResponse, res);
        } catch (error) {
            console.error("Error in PATCH request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
});

    router.get("/usernames", authenticateToken,authorizeByName("พนักงาน", ["A"]), async (req: Request, res: Response) => {
        const ServiceResponse = await userService.getAllUsernames();
        handleServiceResponse(ServiceResponse, res);
    });

    router.get(
        "/get/:employee_id",
        authenticateToken,
        authorizeByName("พนักงาน", ["A"]),
        validateRequest(GetUserSchema),
        async (req: Request, res: Response) => {
          try {
            const { company_id } = req.token.payload;
            const { employee_id } = req.params;
            const companyId = company_id;
            const ServiceResponse = await userService.findById(
              companyId,
              employee_id
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

      router.post("/register", 
        authenticateToken, 
        authorizeByName("พนักงาน", ["A"]),
        validateRequest(CreateUserSchema),  
        async (req: Request, res: Response) => {
            try{
                const {company_id, uuid} = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const payload = req.body;
                const ServiceResponse = await userService.create(
                    companyId,
                    userId,
                    payload
                );
                handleServiceResponse(ServiceResponse, res);

            }
            catch(error){
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        })


    router.get(
    "/get_profile",
    authenticateToken,
    // authorizeByName("พนักงาน", ["A"]),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const ServiceResponse = await userService.findById4(companyId, uuid);
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error("Error in GET request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.get("/user-and-id", // <--- Endpoint ใหม่
      authenticateToken,
      authorizeByName("พนักงาน", ["A"]), // <-- ใช้ middleware เหมือนเดิม
      async (req: Request, res: Response) => {
          const ServiceResponse = await userService.getAllUsernamesAndIds(); // <--- เรียก service function ใหม่
          handleServiceResponse(ServiceResponse, res);
  });

  // Route เดิมยังคงอยู่
  router.get("/usernames", authenticateToken, authorizeByName("พนักงาน", ["A"]), async (req: Request, res: Response) => {
      const ServiceResponse = await userService.getAllUsernames();
      handleServiceResponse(ServiceResponse, res);
  });

    return router;
})();
