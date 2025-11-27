import { blobToFile } from "../file";
export type PayLoadCreateCustomer = {
    customer_code?: string;
    customer_prefix?: string;
    customer_name?: string;
    contact_name?: string;
    customer_position?: string;
    contact_number?: string;
    line_id?: string;
    addr_number?: string;
    image_url?: blobToFile[];
    addr_alley?: string;
    addr_street?: string;
    addr_subdistrict?: string;
    addr_district?: string;
    addr_province?: string;
    addr_postcode?: string;
    payment_terms?: string;
    payment_terms_day?: number;
    tax?: number | undefined; // เปลี่ยนเป็น optional
    comment_customer?: string;
    comment_sale?: string;
    competitor?: string;
    created_at?: Date;
    customer_tin?: string
    created_by?: string;
    updated_by?: string;
}

export type RequestCreateCustomer = {
    customer_code?: string;
    customer_prefix?: string;
    customer_name?: string;
    contact_name?: string;
    customer_position?: string;
    contact_number?: string;
    line_id?: string;
    addr_number?: string;
    image_url?: string;
    addr_alley?: string;
    addr_street?: string;
    addr_subdistrict?: string;
    addr_district?: string;
    addr_province?: string;
    addr_postcode?: string;
    payment_terms?: string;
    payment_terms_day?: number;
    tax?: number | undefined; // เปลี่ยนเป็น optional
    comment_customer?: string;
    comment_sale?: string;
    competitor?: string;
    created_at?: Date;
    customer_tin?: string
}

export type RequestCreateCustomerWithRequiredFields = {
    customer_code: string;
    customer_prefix: string;
    customer_name: string;
    contact_name: string;
    contact_number: string;
};