"use strict";
// import express,{Request, Response} from "express";
// import {handleServiceResponse,validateRequest} from "@common/utils/httpHandlers";
// export const ms_customer_image_Router = (() => {
//     const router = express.Router();
//     router.get("/get", async (req: Request, res: Response) => {
//         const page = parseInt(req.query.page as string) || 1;
//         const pageSize = parseInt(req.query.pageSize as string) || 12;
//         const ServiceResponse = await ms_customer_imageService.findAll(page, pageSize);
//         handleServiceResponse(ServiceResponse, res);
//     })
//     router.post("/create", validateRequest(CreateCustomerImageSchema), async (req: Request, res: Response) => {
//         const payload = req.body;
//         const ServiceResponse = await ms_customer_imageService.create(payload);
//         handleServiceResponse(ServiceResponse, res);
//     })
//     return router;
// })();
