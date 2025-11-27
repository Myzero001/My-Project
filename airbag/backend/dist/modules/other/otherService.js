"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherService = void 0;
const http_status_codes_1 = require("http-status-codes");
const otherRepository_1 = require("@modules/other/otherRepository");
const serviceResponse_1 = require("@common/models/serviceResponse");
exports.otherService = {
    searchRegister: (companyId, searchText, skip, take) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (searchText === '') {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", [], http_status_codes_1.StatusCodes.OK);
            }
            const data = yield otherRepository_1.otherRepository.searchRegister(companyId, searchText, skip, take);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", data, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error Find All data :" + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
