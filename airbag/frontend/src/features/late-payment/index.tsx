import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { useSearchParams } from "react-router-dom";
import { useLatePayment } from "@/hooks/useLatePayment";
import { TypeRepairReceiptDoc } from "@/types/response/response.repair-receipt";
import { TypeLatePayment } from "@/types/response/response.late-payment";

type DataTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeLatePayment;
}[];

export default function LatePaymentFeature() {
    const [searchText, setSearchText] = useState("");
    const [data, setData] = useState<DataTableType>([]);
    const { showToast } = useToast();
    const [repairReceiptIds, setRepairReceiptIds] = useState<TypeRepairReceiptDoc[]>([]);
    const [latePaymentDetails, setLatePaymentDetails] = useState<any[]>([]);
    const [totalRemaining, setTotalRemaining] = useState<number>(0);
    const [customerCount, setCustomerCount] = useState<number>(0);
    const [repairReceiptCount, setRepairReceiptCount] = useState<number>(0);
    const [latePayments, setLatePayments] = useState<TypeLatePayment[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebounce, setSearchTextDebounce] = useState("");

    const { data: latePaymentData, refetch: refetchLatePayment, isLoading } = useLatePayment({
        page,
        pageSize,
        searchText: searchTextDebounce,
    });

    useEffect(() => {
        if (latePaymentData?.responseObject?.data) {
            const responseData = latePaymentData.responseObject;
            
            if (Array.isArray(responseData.data) && responseData.data.length > 0) {
                setLatePayments(responseData.data);
            } else {
                 setLatePayments([]);
            }
        } else {
            setLatePayments([]);
        }
    }, [latePaymentData]);

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === "-") return "-";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "-";
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "-";
        }
    };

    const calculateOverdueDays = (deliveryDate: string) => {
        if (!deliveryDate || deliveryDate === "-") return "-";
        try {
            const deliveryDateObj = new Date(deliveryDate);
            const today = new Date();
            if (isNaN(deliveryDateObj.getTime())) return "-";
            const diffTime = today.getTime() - deliveryDateObj.getTime();
            if (diffTime < 0) return "0";
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return diffDays.toString();
        } catch (error) {
            console.error("Error calculating overdue days:", error);
            return "-";
        }
    };

    useEffect(() => {
        if (latePayments && latePayments.length > 0) {
            const successDeliveryItems = latePayments.filter(item => {
                return item.remainingBalance > 0 && item.status === "success";
            });

            if (successDeliveryItems.length > 0) {
                const total = successDeliveryItems.reduce((sum, item) => {
                    return sum + (item.remainingBalance || 0);
                }, 0);
                setTotalRemaining(total);

                const uniqueCustomers = new Set(
                    successDeliveryItems
                        .map(item => item.master_repair_receipt?.master_quotation?.customer_name || item.customer_name)
                        .filter(name => name && name.trim() !== "")
                );
                setCustomerCount(uniqueCustomers.size || 1);

                setRepairReceiptCount(successDeliveryItems.length);

                const pageNumber = parseInt(page, 10) || 1;
                const pageSizeNumber = parseInt(pageSize, 10) || 25;
                const startIndex = (pageNumber - 1) * pageSizeNumber;

                const formattedData = successDeliveryItems.map((item, index) => {
                    const repair_receipt = item.master_repair_receipt;
                    const repairReceiptDoc = repair_receipt?.repair_receipt_doc ?? "-";
                    const customerName = item.master_repair_receipt?.master_quotation?.customer_name || "-";
                    const quotationDoc = item.master_repair_receipt?.master_quotation?.quotation_doc || "-";
                    const deliveryDate = repair_receipt?.expected_delivery_date ?? "-";
                    const formattedDeliveryDate = formatDate(deliveryDate);
                    const overdueDays = calculateOverdueDays(deliveryDate);
                    
                    let overdueDaysClass = "text-center";
                    if (overdueDays !== "-" && parseInt(overdueDays) > 0) {
                        if (parseInt(overdueDays) > 30) {
                            overdueDaysClass = "text-center text-red-600 font-bold";
                        } else if (parseInt(overdueDays) > 15) {
                            overdueDaysClass = "text-center text-orange-500 font-bold";
                        } else {
                            overdueDaysClass = "text-center text-yellow-500";
                        }
                    }
                    
                    const totalPrice = repair_receipt?.total_price ?? 0;
                    const remainingAmount = item.remainingBalance ?? 0;
                    const totalPaid = totalPrice - remainingAmount;
                    const percentPaid = totalPrice > 0 ? (totalPaid / totalPrice * 100).toFixed(2) : "0.00";
                    
                    return {
                        className: "",
                        cells: [
                            { value: startIndex + index + 1, className: "text-center" },
                            { value: customerName, className: "text-left" },
                            { value: overdueDays, className: overdueDaysClass },
                            { value: repairReceiptDoc, className: "text-center" },
                            { value: quotationDoc, className: "text-center" },
                            { value: formattedDeliveryDate, className: "text-center" },
                            { value: totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), className: "text-right" },
                            { value: remainingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), className: "text-right" },
                            { value: percentPaid + "%", className: "text-center" },
                        ],
                        data: item,
                    };
                });
                setData(formattedData);
            } else {
                setData([]);
                setTotalRemaining(0);
                setCustomerCount(0);
                setRepairReceiptCount(0);
            }
        } else {
            setData([]);
            setTotalRemaining(0);
            setCustomerCount(0);
            setRepairReceiptCount(0);
        }
    }, [latePayments, page, pageSize]);

    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebounce("");
        }
    }, [searchText]);

    const handleSearch = () => {
        setSearchParams({ page: "1", pageSize });
        setSearchTextDebounce(searchText);
    };

    const headers = [
        { label: "ลำดับ", colSpan: 1, className: "w-1/12" },
        { label: "ชื่อกิจการ", colSpan: 1, className: "w-2/12" },
        { label: "เลยกำหนด (วัน)", colSpan: 1, className: "w-1/12" },
        { label: "เลขที่ใบรับซ่อม", colSpan: 1, className: "w-2/12" },
        { label: "เลขที่ใบเสนอราคา", colSpan: 1, className: "w-2/12" },
        { label: "วันที่ส่งมอบ", colSpan: 1, className: "w-1/12" },
        { label: "จำนวนเงินทั้งหมด", colSpan: 1, className: "w-1/12" },
        { label: "เงินที่ค้างชำระ", colSpan: 1, className: "w-1/12" },
        { label: "% การชำระ", colSpan: 1, className: "w-1/12" },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-red-400 p-3 rounded-xl shadow-lg border border-red-300">
                    <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-red-300 opacity-30"></div>
                    <div className="absolute -left-4 -bottom-4 w-12 h-12 rounded-full bg-red-300 opacity-20"></div>
                    <div className="flex items-center mb-1">
                        <div className="bg-white bg-opacity-20 p-1.5 rounded-md mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h2 className="text-sm font-bold text-white">ยอดค้างชำระ</h2>
                    </div>
                    <div className="flex flex-col items-center mt-1">
                        <div className="flex items-baseline">
                            <p className="text-lg sm:text-xl font-bold text-white drop-shadow-md break-all">{totalRemaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className="text-xs text-red-100 font-medium ml-1">บาท</p>
                        </div>
                    </div>
                </div>
                <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500 to-amber-300 p-3 rounded-xl shadow-lg border border-yellow-300">
                    <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-yellow-300 opacity-30"></div>
                    <div className="absolute -left-4 -bottom-4 w-12 h-12 rounded-full bg-yellow-300 opacity-20"></div>
                    <div className="flex items-center mb-1">
                        <div className="bg-white bg-opacity-20 p-1.5 rounded-md mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <h2 className="text-sm font-bold text-white">จำนวนลูกค้าฯ</h2>
                    </div>
                    <div className="flex items-center justify-center">
                        <p className="text-lg font-bold text-white drop-shadow-md">{customerCount}</p>
                        <p className="text-base font-medium text-yellow-100 ml-1.5">ราย</p>
                    </div>
                    <div className="w-3/4 h-px bg-black my-1 mx-auto opacity-50"></div>
                    <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p className="text-xs font-medium text-white">ใบรับซ่อม: <span className="font-bold">{repairReceiptCount}</span></p>
                    </div>
                </div>
            </div>
            
            <MasterTableFeature
                title="การชำระเงินล่าช้า"
                hideTitleBtn
                inputs={[
                    {
                        id: "search_input",
                        value: searchText,
                        size: "3",
                        placeholder: "ค้นหา เลขที่ใบซ่อม  ชื่อกิจการ เลขที่ใบเสนอราคา",
                        onChange: setSearchText,
                        onAction: handleSearch,
                    },
                ]}
                onSearch={handleSearch}
                headers={headers}
                rowData={data}
                // --- [ แก้ไขเป็น total ] ---
                totalData={latePaymentData?.responseObject?.total || 0}
            />
        </div>
    );
}