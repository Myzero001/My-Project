//---------------------------------------------- C
export interface TypeTopTenCustomerResponse {
    total_customers: number;
    top_customers: TypeTopTenCustomerAll[];
}

export type TypeTopTenCustomerAll = {
    customer_id: string;
    customer_code: string;
    customer_name: string;
    contact_number: string;
    total_money: string;
};
export type TypeTopTenCustomer = {
    customer_id: string;
    customer_code: string;
    customer_name: string;
    contact_number: string;
    total_money: string;
};


//---------------------------------------------- Q

export type TypeQuotationStatusAll = {
    quotation_status: string;
    total_quotations: number;
};
export type TypeQuotationStatus = {
    quotation_status: string;
    total_quotations: number;
};


//---------------------------------------------- P
export type TypePriceAll = {
    payment: {
        total_payment: number;
        total_payment_price_customer_pay: number;
        total_payment_price_to_be_received_all: number;
    };
    quotation: {
        total_quotation_count: number;
        closed_deal_count: number;
        total_price_all: number;
        closed_deal_price: number;
    };
    repair_receipt: {
        total_count: number;
        total_price: number;
        total_repair_receipt_paid_count: number;
        // total_amount_paid_repair_receipt: number;
        total_amount_paid_repair_receipt_percentage: number;
        outstanding_balance_on_repair_receipt: number;
    };
    delivery_schedule: {
        total_count: number;
        total_price: number;
        total_delivery_schedule_paid_count: number;
        // total_amount_paid_delivery_schedule: number;
        total_amount_paid_delivery_schedule_percentage: number;
        outstanding_balance_on_delivery_schedule: number;
    };
};

export type ApiResponse = {
    success: boolean;
    message: string;
    responseObject: TypePriceAll;
    statusCode: number;
};

//---------------------------------------------- E
export type Role = {
    role_id: string;
    role_name: string;
    created_at: string;
    updated_at: string;
};

export type ResponsibleInfo = {
    company_id: string;
    employee_id: string;
    username: string;
    role: Role;
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    position: string | null;
};

export type SaleInfo = {
    responsible_by: string;
    responsible_info: ResponsibleInfo;
    total_quotation: number;
    total_price: number;
};

export type TypeTopTenEmployeeResponse = {
    success: boolean;
    message: string;
    responseObject: SaleInfo[];
    statusCode: number;
};

//---------------------------------------------- S
export type QuotationSummaryData = {
    label: string;
    total_count: number;
    total_price: number;
};

export type QuotationSummaryResponse = {
    data: QuotationSummaryData[];
    summary: {
        total_price_all: number;
        total_quotation_count: number;
    };
};