import { StatusCodes } from "http-status-codes";
import { otherRepository } from "@modules/other/otherRepository";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";

import { roles } from "@prisma/client";

export const otherService = {
    searchRegister: async (companyId: string , searchText: string, skip: number, take: number,) => {
        try {
            if(searchText === ''){
                return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                [],
                StatusCodes.OK
            );
            }
            const data = await otherRepository.searchRegister(companyId , searchText , skip , take);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                data,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error Find All data :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    
}

