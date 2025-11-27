// Type for a single payment in the nested structure
export type TypeInactiveCustomerPayment = {
    payment_doc: string;
    price: number;
    type_money: string;
    status: string;
    created_at: string | Date;
    updated_at: string | Date;
};

// Type for a delivery schedule in the nested structure
export type TypeInactiveCustomerDeliverySchedule = {
    delivery_schedule_doc: string;
    delivery_location: string | null;
    delivery_schedule_image_url: string | null;
    remark: string | null;
    status: string;
    created_at: string | Date;
    updated_at: string | Date;
    master_payment: TypeInactiveCustomerPayment[];
};

// Type for a repair receipt in the nested structure
export type TypeInactiveCustomerRepairReceipt = {
    id: string;
    repair_receipt_doc: string;
    repair_receipt_status: string;
    total_price: number;
    created_at: string | Date;
    updated_at: string | Date;
    master_delivery_schedule: TypeInactiveCustomerDeliverySchedule[];
};

// Type for a quotation in the nested structure
export type TypeInactiveCustomerQuotation = {
    quotation_id: string;
    quotation_doc: string;
    total_price: number;
    created_at: string | Date;
    updated_at: string | Date;
    master_repair_receipt: TypeInactiveCustomerRepairReceipt[];
};

// Basic inactive customer information type
export type TypeInactiveCustomer = {
    customer_id: string;
    customer_code: string;
    contact_name: string;
    contact_number?: string;
    customer_prefix: string;
    line_id?: string;
    addr_number?: string;
    addr_alley?: string;
    addr_street?: string;
    addr_subdistrict?: string;
    addr_district?: string;
    addr_province?: string;
    addr_postcode?: string;
    created_at: string | Date;
    updated_at: string | Date;
    master_quotation: TypeInactiveCustomerQuotation[];
    totalDebt: number;
    isActive: boolean;
};

// Type for inactive customer detailed information
export type TypeInactiveCustomerDetail = TypeInactiveCustomer & {
    lastActivity?: string | Date;
    daysSinceLastActivity?: number;
    inactivityPeriod?: string; // e.g. '15days', '30days', '1month', etc.
};

// Response type for the list of inactive customers
export type TypeInactiveCustomerListResponse = {
    success: boolean;
    message: string;
    responseObject: TypeInactiveCustomer[];
    statusCode: number;
};

// Response type for a single inactive customer
export type InactiveCustomerResponse = {
    success: boolean;
    message: string;
    responseObject: TypeInactiveCustomerDetail;
    statusCode: number;
};

// Type for inactive customer statistics
export type TypeInactiveCustomerStats = {
    totalInactiveCustomers: number;
    totalDebtAmount: number;
    averageDebtPerInactiveCustomer: number;
    inactiveCustomersByPeriod: {
        period: string;
        count: number;
    }[];
    potentialRevenueLoss: number;
    highestDebtInactiveCustomer: {
        customer_name: string;
        customer_id: string;
        amount: number;
        daysSinceLastActivity: number;
    };
};

// Response type for inactive customer statistics
export type InactiveCustomerStatsResponse = {
    success: boolean;
    message: string;
    responseObject: TypeInactiveCustomerStats;
    statusCode: number;
};

// Type for parameters used in fetching inactive customers
export type TypeInactiveCustomerQueryParams = {
    dateRange?: '15days' | '30days' | '1month' | '3months' | '6months' | '1year';
    sortBy?: 'debt' | 'lastActivity' | 'customerName';
    sortOrder?: 'asc' | 'desc';
    minDebt?: number;
    maxDebt?: number;
    customerPrefix?: string;
};