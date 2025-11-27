// hooks/useSelect/response.ts (หรือ path ที่ถูกต้องของคุณ)

export type TypeSearchRegister = {
    id: string;
    register: string;
    repair_receipt_doc: string;
    total_price: number; // ย้ายมาอยู่ที่ root level
    master_quotation: {
        quotation_id: string;
        quotation_doc: string;
        insurance: boolean; // เพิ่ม field ใหม่
        insurance_date: string; // เพิ่ม field ใหม่
        master_brand: {
            master_brand_id: string;
            brand_name: string;
        } | null;
        master_brandmodel: {
            ms_brandmodel_id: string;
            brandmodel_name: string;
        } | null;
        // เปลี่ยนชื่อและโครงสร้างของรายการซ่อม
        repair_receipt_list_repair: {
            id: string;
            is_active: boolean;
            master_repair: {
                master_repair_name: string;
            } | null;
        }[];
    } | null;
    master_delivery_schedule: {
        id: string;
        delivery_schedule_doc: string;
        delivery_date: string; // ควรเป็น string ถ้า backend ส่งมาแบบนั้น
        // master_payment เป็น array
        master_payment: {
            id: string;
            payment_doc: string;
            option_payment: string;
            total_price: number; // นี่คือยอดที่จ่ายแล้ว
        }[];
    }[];
};

export type SearchRegisterResponse = {
    success: boolean; // แก้ไขตาม JSON ตัวอย่าง
    message: string;
    responseObject: TypeSearchRegister[];
    statusCode: number;
};