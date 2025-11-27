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
exports.deliveryScheduleService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const fileService_1 = require("@modules/file/fileService");
const deliveryScheduleRepository_1 = require("./deliveryScheduleRepository");
const deliveryScheduleModel_1 = require("./deliveryScheduleModel");
const generateDeliverySchedule_1 = require("@common/utils/generateDeliverySchedule");
const repairReceiptRepository_1 = require("@modules/ms-repair-receipt/repairReceiptRepository");
exports.deliveryScheduleService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "", status = "all") {
        try {
            const skip = (page - 1) * pageSize;
            const receipts = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findAll(companyId, skip, pageSize, searchText, status);
            const totalCount = yield deliveryScheduleRepository_1.deliveryScheduleRepository.count(companyId, searchText, status);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: receipts,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching delivery schedule", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNoPagination: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findAllNoPagination(company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching delivery schedule", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllPaymentNoPagination: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findAllPaymentNoPagination(company_id);
            const filteredCustomers = [];
            if (customer) {
                customer.forEach((payment) => {
                    var _a;
                    const totalPrice = (_a = payment.master_repair_receipt.total_price) !== null && _a !== void 0 ? _a : 0;
                    const currentPrice = payment.master_payment.reduce((sum, pay) => sum + pay.price, 0);
                    if (currentPrice < totalPrice) {
                        filteredCustomers.push(payment);
                    }
                });
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", filteredCustomers, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching delivery schedule", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (payload, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        try {
            const oldDeliverySchedule = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findByRepairReceiptIdAndCompany(payload.repair_receipt_id, company_id);
            if (oldDeliverySchedule) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Delivery schedule already exists for the given repair receipt and company.", null, http_status_codes_1.StatusCodes.CONFLICT);
            }
            payload.delivery_schedule_doc = yield (0, generateDeliverySchedule_1.generateDeliveryScheduleDoc)();
            payload.company_id = company_id;
            payload.created_by = userId;
            payload.updated_by = userId;
            payload.status = deliveryScheduleModel_1.DELIVERY_SCHEDULE_STATUS.PENDING;
            const repairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.findById(payload.repair_receipt_id);
            if (repairReceipt) {
                payload.addr_number = (_a = repairReceipt.master_quotation.addr_number) !== null && _a !== void 0 ? _a : "";
                payload.addr_alley = (_b = repairReceipt.master_quotation.addr_alley) !== null && _b !== void 0 ? _b : "";
                payload.addr_street = (_c = repairReceipt.master_quotation.addr_street) !== null && _c !== void 0 ? _c : "";
                payload.addr_subdistrict =
                    (_d = repairReceipt.master_quotation.addr_subdistrict) !== null && _d !== void 0 ? _d : "";
                payload.addr_district =
                    (_e = repairReceipt.master_quotation.addr_district) !== null && _e !== void 0 ? _e : "";
                payload.addr_province =
                    (_f = repairReceipt.master_quotation.addr_province) !== null && _f !== void 0 ? _f : "";
                payload.addr_postcode =
                    (_g = repairReceipt.master_quotation.addr_postcode) !== null && _g !== void 0 ? _g : "";
                payload.customer_name =
                    (_h = repairReceipt.master_quotation.customer_name) !== null && _h !== void 0 ? _h : "";
                payload.position = (_j = repairReceipt.master_quotation.position) !== null && _j !== void 0 ? _j : "";
                payload.contact_number =
                    (_k = repairReceipt.master_quotation.contact_number) !== null && _k !== void 0 ? _k : "";
                payload.line_id = (_l = repairReceipt.master_quotation.line_id) !== null && _l !== void 0 ? _l : "";
                payload.delivery_date = (_m = repairReceipt.expected_delivery_date) !== null && _m !== void 0 ? _m : "";
            }
            // สร้างข้อมูลใหม่
            const response = yield deliveryScheduleRepository_1.deliveryScheduleRepository.create(payload);
            // const payloadPeyment = {
            //   option_payment: OPTION_PAYMENT.NOT_YET_PAID,
            //   type_money: TYPE_MONEY.CASH,
            //   price: repairReceipt?.total_price ?? 0,
            //   status: PAYMENT_STATUS.OVERDUE,
            //   delivery_schedule_id: response.id,
            //   company_id : company_id,
            //   created_by : userId,
            //   updated_by : userId,
            // };
            // await paymentRepository.create(payloadPeyment);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create delivery schedule success", response, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error creating delivery schedule: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (id, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findById(id);
            if (!response) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Delivery Schedule not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            payload.updated_by = userId;
            // อัปเดตข้อมูล
            const updatedRepairReceipt = yield deliveryScheduleRepository_1.deliveryScheduleRepository.updateHome(id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update Repair Receipt success", updatedRepairReceipt, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error updating Repair Receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    requestDelivery: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        payload.status = deliveryScheduleModel_1.DELIVERY_SCHEDULE_STATUS.SUCCESS;
        try {
            const checkDeliverySchedule = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findById(id);
            if (!checkDeliverySchedule) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Delivery Schedule not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updated = yield deliveryScheduleRepository_1.deliveryScheduleRepository.requestDelivery(id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "update status delivery schedule success", updated, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error approve update status delivery schedule: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findById(id);
            if (!response) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Delivery Schedule not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ลบข้อมูล
            yield deliveryScheduleRepository_1.deliveryScheduleRepository.delete(id);
            if (response.delivery_schedule_image_url) {
                yield fileService_1.fileService.delete(response.delivery_schedule_image_url);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete Delivery Schedule success", "Delivery Schedule deleted successfully", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error deleting Delivery Schedule: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findById(id);
            if (!response) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Delivery schedule not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delivery schedule found", response, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching Delivery schedule: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findAllById(id);
            if (!response) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Delivery schedule not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delivery schedule found", response, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching Delivery schedule: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findOverduePayments: (companyId, page, pageSize, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pageNumber = parseInt(page, 10);
            const pageSizeNumber = parseInt(pageSize, 10);
            // 1. เรียก Repository เพื่อดึงข้อมูลที่เข้าเงื่อนไข *ทั้งหมด* (ยังไม่กรองยอดค้าง)
            const allPotentialPayments = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findOverduePayments(companyId, searchText);
            // 2. คำนวณยอดคงเหลือสำหรับแต่ละรายการ
            const processedPayments = allPotentialPayments.map((payment) => {
                var _a, _b;
                const totalPrice = (_b = (_a = payment.master_repair_receipt) === null || _a === void 0 ? void 0 : _a.total_price) !== null && _b !== void 0 ? _b : 0;
                const totalPaid = payment.master_payment.reduce((sum, p) => { var _a; return sum + ((_a = p.price) !== null && _a !== void 0 ? _a : 0); }, 0);
                const remainingBalance = totalPrice - totalPaid;
                return Object.assign(Object.assign({}, payment), { totalPrice, // อาจจะเพิ่มเข้าไปเพื่อให้เห็นภาพชัด
                    totalPaid, // อาจจะเพิ่มเข้าไปเพื่อให้เห็นภาพชัด
                    remainingBalance });
            });
            // 3. กรองเฉพาะรายการที่มียอดค้างชำระ (remainingBalance > 0)
            // นี่คือจุดสำคัญ: เราจะได้ข้อมูลที่ถูกต้องเฉพาะที่ค้างชำระจริงๆ
            const filteredPayments = processedPayments.filter((p) => p.remainingBalance > 0);
            // 4. นับจำนวนทั้งหมด *หลังจาก* กรองแล้ว เพื่อให้ Pagination ถูกต้อง
            const totalCount = filteredPayments.length;
            // 5. ทำ Pagination ด้วยตัวเองจาก Array ที่กรองแล้ว
            const startIndex = (pageNumber - 1) * pageSizeNumber;
            const endIndex = startIndex + pageSizeNumber;
            const paginatedData = filteredPayments.slice(startIndex, endIndex);
            // 6. สร้าง Response object ที่สมบูรณ์
            const responseData = {
                data: paginatedData, // ส่งข้อมูลเฉพาะของหน้านั้นๆ
                total: totalCount, // ส่ง total ที่ถูกต้อง
                page: pageNumber,
                pageSize: pageSizeNumber,
            };
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Overdue payments retrieved successfully", responseData, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching overdue payments: ${ex.message}`;
            console.error(errorMessage);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findCustomersByCompanyId: (companyId, dateRange) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deliverySchedules = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findCustomersByCompanyId(companyId, dateRange);
            // Extract customers and calculate their debt
            const customersWithDebt = deliverySchedules
                .map(item => {
                var _a, _b, _c;
                const customer = (_b = (_a = item.master_repair_receipt) === null || _a === void 0 ? void 0 : _a.master_quotation) === null || _b === void 0 ? void 0 : _b.master_customer;
                if (!customer)
                    return null;
                // Calculate total debt for this customer
                let totalDebt = 0;
                // Loop through each quotation to calculate debt
                (_c = customer.master_quotation) === null || _c === void 0 ? void 0 : _c.forEach(quotation => {
                    var _a;
                    // For each repair receipt
                    (_a = quotation.master_repair_receipt) === null || _a === void 0 ? void 0 : _a.forEach(receipt => {
                        var _a;
                        const totalPrice = receipt.total_price || 0;
                        let paidAmount = 0;
                        // Calculate paid amount from payments
                        (_a = receipt.master_delivery_schedule) === null || _a === void 0 ? void 0 : _a.forEach(delivery => {
                            var _a;
                            (_a = delivery.master_payment) === null || _a === void 0 ? void 0 : _a.forEach(payment => {
                                paidAmount += payment.price || 0;
                            });
                        });
                        // Add the remaining debt
                        totalDebt += Math.max(0, totalPrice - paidAmount);
                    });
                });
                return Object.assign(Object.assign({}, customer), { totalDebt });
            })
                .filter(item => item !== null && item.totalDebt > 0);
            // Remove duplicates by customer_id and keep the entry with the highest debt
            const uniqueCustomersMap = new Map();
            customersWithDebt.forEach(customer => {
                if (!customer)
                    return;
                const existingCustomer = uniqueCustomersMap.get(customer.customer_id);
                if (!existingCustomer || customer.totalDebt > existingCustomer.totalDebt) {
                    uniqueCustomersMap.set(customer.customer_id, customer);
                }
            });
            // Convert map to array and sort by debt amount (highest first)
            const rankedCustomers = Array.from(uniqueCustomersMap.values())
                .sort((a, b) => b.totalDebt - a.totalDebt);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Customer data retrieved and ranked by debt successfully", rankedCustomers, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            const errorMessage = `Error fetching and ranking customer data: ${error.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findInactiveCustomersByCompanyId: (companyId, dateRange) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deliverySchedules = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findInactiveCustomersByCompanyId(companyId, dateRange);
            // Extract customers and calculate their debt
            const customersWithDebt = deliverySchedules
                .map(item => {
                var _a, _b, _c;
                const customer = (_b = (_a = item.master_repair_receipt) === null || _a === void 0 ? void 0 : _a.master_quotation) === null || _b === void 0 ? void 0 : _b.master_customer;
                if (!customer)
                    return null;
                // Calculate total debt for this customer
                let totalDebt = 0;
                // Loop through each quotation to calculate debt
                (_c = customer.master_quotation) === null || _c === void 0 ? void 0 : _c.forEach(quotation => {
                    var _a;
                    // For each repair receipt
                    (_a = quotation.master_repair_receipt) === null || _a === void 0 ? void 0 : _a.forEach(receipt => {
                        var _a;
                        const totalPrice = receipt.total_price || 0;
                        let paidAmount = 0;
                        // Calculate paid amount from payments
                        (_a = receipt.master_delivery_schedule) === null || _a === void 0 ? void 0 : _a.forEach(delivery => {
                            var _a;
                            (_a = delivery.master_payment) === null || _a === void 0 ? void 0 : _a.forEach(payment => {
                                paidAmount += payment.price || 0;
                            });
                        });
                        // Add the remaining debt
                        totalDebt += Math.max(0, totalPrice - paidAmount);
                    });
                });
                const checkCustomerActivity = (customer, dateRange) => {
                    if (!customer || !customer.master_quotation)
                        return false;
                    const currentDate = new Date();
                    let startDate = new Date(currentDate);
                    // Set start date based on range
                    if (dateRange) {
                        switch (dateRange) {
                            case '15days':
                                startDate.setDate(currentDate.getDate() - 15);
                                break;
                            case '30days':
                                startDate.setDate(currentDate.getDate() - 30);
                                break;
                            case '1month':
                                startDate.setMonth(currentDate.getMonth() - 1);
                                break;
                            case '3months':
                                startDate.setMonth(currentDate.getMonth() - 3);
                                break;
                            case '6months':
                                startDate.setMonth(currentDate.getMonth() - 6);
                                break;
                            case '1year':
                                startDate.setFullYear(currentDate.getFullYear() - 1);
                                break;
                            default:
                                // Default to 30 days if invalid range provided
                                startDate.setDate(currentDate.getDate() - 30);
                        }
                    }
                    else {
                        // Default to 30 days if no range provided
                        startDate.setDate(currentDate.getDate() - 30);
                    }
                    // Check if there are any transactions within date range
                    for (const quotation of customer.master_quotation) {
                        // Check if quotation is within date range
                        const quotationDate = new Date(quotation.created_at || quotation.updated_at);
                        if (quotationDate >= startDate && quotationDate <= currentDate)
                            return true;
                        // Check repair receipts
                        if (quotation.master_repair_receipt && quotation.master_repair_receipt.length > 0) {
                            for (const receipt of quotation.master_repair_receipt) {
                                const receiptDate = new Date(receipt.created_at || receipt.updated_at);
                                if (receiptDate >= startDate && receiptDate <= currentDate)
                                    return true;
                                // Check delivery schedules
                                if (receipt.master_delivery_schedule && receipt.master_delivery_schedule.length > 0) {
                                    for (const delivery of receipt.master_delivery_schedule) {
                                        const deliveryDate = new Date(delivery.created_at || delivery.updated_at);
                                        if (deliveryDate >= startDate && deliveryDate <= currentDate)
                                            return true;
                                        // Check payments
                                        if (delivery.master_payment && delivery.master_payment.length > 0) {
                                            for (const payment of delivery.master_payment) {
                                                const paymentDate = new Date(payment.created_at || payment.updated_at);
                                                if (paymentDate >= startDate && paymentDate <= currentDate)
                                                    return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return false;
                };
                // Check if customer is active within the selected date range
                const isActive = checkCustomerActivity(customer, dateRange);
                return Object.assign(Object.assign({}, customer), { totalDebt,
                    isActive // Add active status to response
                 });
            })
                .filter(item => item !== null);
            // Remove duplicates by customer_id and keep the entry with the highest debt
            const uniqueCustomersMap = new Map();
            customersWithDebt.forEach(customer => {
                if (!customer)
                    return;
                const existingCustomer = uniqueCustomersMap.get(customer.customer_id);
                if (!existingCustomer || customer.totalDebt > existingCustomer.totalDebt) {
                    uniqueCustomersMap.set(customer.customer_id, customer);
                }
            });
            // Convert map to array and sort by debt amount (highest first)
            const rankedCustomers = Array.from(uniqueCustomersMap.values())
                .sort((a, b) => b.totalDebt - a.totalDebt);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Customer data retrieved and ranked by debt successfully", rankedCustomers, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            const errorMessage = `Error fetching and ranking customer data: ${error.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield deliveryScheduleRepository_1.deliveryScheduleRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findCalendarRemoval: (companyId, startDateFilter, endDateFilter) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield deliveryScheduleRepository_1.deliveryScheduleRepository.showDeliverySchedule(companyId, startDateFilter, endDateFilter);
            if (!data) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "success", data, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching calendar schedule : ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    })
};
