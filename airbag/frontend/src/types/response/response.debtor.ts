// Basic debtor information type
export type TypeDebtor = {
    customer_id: string;
    customer_code: string;
    contact_name: string;
    contact_number?: string;
    line_id?: string;
    addr_number?: string;
    addr_alley?: string;
    addr_street?: string;
    addr_subdistrict?: string;
    addr_district?: string;
    addr_province?: string;
    addr_postcode?: string;
    totalDebt: number;
}

// Response object for a single debtor
export interface TypeDebtorResponse {
    customer_id: string;
    customer_code: string;
    contact_name: string;
    contact_number?: string;
    line_id?: string;
    addr_number?: string;
    addr_alley?: string;
    addr_street?: string;
    addr_subdistrict?: string;
    addr_district?: string;
    addr_province?: string;
    addr_postcode?: string;
    totalDebt: number;
    created_at: Date;
}

// Debtor with additional information for the listing
export type TypeDebtorDetail = {
    customer_id: string;
    customer_code: string;
    contact_name: string;
    totalDebt: number;
    lastPaymentDate?: Date;
    overdueStatus?: 'normal' | 'warning' | 'critical'; // Based on days overdue
    deliverySchedules?: Array<{
        delivery_schedule_doc: string;
        total_price: number;
        paid_amount: number;
        remaining_amount: number;
    }>;
}

// Response type for the list of debtors with pagination
export type TypeDebtorListResponse = {
    responseObject: {
        totalCount: number;
        data: TypeDebtorDetail[];
        totalDebt: number; // Sum of all debts
    };
    success: boolean;
    message: string;
    statusCode: number;
};

// Response type for a single debtor
export type DebtorResponse = {
    success: boolean;
    message: string;
    responseObject: TypeDebtorDetail;
    statusCode: number;
};

// Type for debtor statistics
export type TypeDebtorStats = {
    totalDebtors: number;
    totalDebtAmount: number;
    averageDebtPerCustomer: number;
    highestDebt: {
        customer_name: string;
        customer_id: string;
        amount: number;
    };
    debtByDateRange: {
        range: string;
        amount: number;
        count: number;
    }[];
};

// Response type for debtor statistics
export type DebtorStatsResponse = {
    success: boolean;
    message: string;
    responseObject: TypeDebtorStats;
    statusCode: number;
};