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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ms_customerRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const ms_customer_Service_1 = require("@modules/master_customer/ms_customer-Service");
const ms_customer_Model_1 = require("@modules/master_customer/ms_customer-Model");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.ms_customerRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ลูกค้า", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const companyId = req.token.company_id;
            const searchText = req.query.searchText || "";
            const ServiceResponse = yield ms_customer_Service_1.CustomerService.findAll(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/select", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ลูกค้า", ["A", "R"]), (0, httpHandlers_1.validateRequest)(ms_customer_Model_1.SelectSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const searchText = req.query.searchText || "";
        const companyId = company_id;
        const ServiceResponse = yield ms_customer_Service_1.CustomerService.select(companyId, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_all", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ลูกค้า", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id, } = req.token.payload;
        const companyId = company_id;
        const ServiceResponse = yield ms_customer_Service_1.CustomerService.findAllNoPagination(companyId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ลูกค้า", ["A"]), (0, httpHandlers_1.validateRequest)(ms_customer_Model_1.CreateCustomerSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            const ServiceResponse = yield ms_customer_Service_1.CustomerService.create(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update/:customer_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ลูกค้า", ["A"]), (0, httpHandlers_1.validateRequest)(ms_customer_Model_1.UpdateCustomerSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const { customer_id } = req.params;
            const payload = req.body;
            const ServiceResponse = yield ms_customer_Service_1.CustomerService.update(customer_id, payload, companyId, userId);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.delete("/delete/:customer_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ลูกค้า", ["A"]), (0, httpHandlers_1.validateRequest)(ms_customer_Model_1.GetCustomerSchema_id), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { customer_id } = req.params;
            const ServiceResponse = yield ms_customer_Service_1.CustomerService.delete(company_id, customer_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in DELETE request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/get/:customer_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ลูกค้า", ["A", "R"]), (0, httpHandlers_1.validateRequest)(ms_customer_Model_1.GetCustomerSchema_id), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { customer_id } = req.params;
            const companyId = company_id;
            const ServiceResponse = yield ms_customer_Service_1.CustomerService.findById(companyId, customer_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
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
