import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchRegisterData } from "@/hooks/useSelect";
import { FaCar, FaTools, FaFileInvoiceDollar, FaReceipt, FaSearch, FaExclamationCircle, FaFileAlt } from "react-icons/fa";

// --- Helper Functions (เหมือนเดิม แต่ปรับปรุงเล็กน้อย) ---
const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-"; // จัดการกรณี date string ไม่ถูกต้อง
    return date.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric", calendar: "gregory" });
};

const formatCurrency = (amount: number | null | undefined) => {
    if (typeof amount !== 'number') return "-";
    return amount.toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 });
};

const translatePaymentOption = (option: string | null | undefined) => {
    if (!option) return "รอข้อมูล";
    const options: { [key: string]: string } = {
        'full-payment': 'ชำระเต็มจำนวน',
        'partial-payment': 'ชำระบางส่วน'
    };
    return options[option] || option;
};


// --- [ปรับปรุง] คอมโพเนนต์ Card สำหรับแสดงผลข้อมูล 1 ชุด ---

const RepairRecordCard = ({ receipt }: { receipt: any }) => {
    const navigate = useNavigate();

    // [ปรับปรุง] ดึงข้อมูลตามโครงสร้างใหม่
    const {
        id,
        register,
        repair_receipt_doc,
        total_price, // ดึงจาก root
        master_quotation,
        master_delivery_schedule
    } = receipt;

    const brand = master_quotation?.master_brand?.brand_name || "N/A";
    const model = master_quotation?.master_brandmodel?.brandmodel_name || "N/A";
    const insurance = master_quotation?.insurance || false;
    const insurance_date = master_quotation?.insurance_date || "";
    const quotationId = master_quotation?.quotation_doc || "N/A";
    const deliveryInfo = master_delivery_schedule?.[0];
    const paymentInfo = deliveryInfo?.master_payment?.[0];
    const paidAmount = paymentInfo?.total_price ?? 0;
    const remainingAmount = total_price - paidAmount;
    const allRepairItems = master_quotation?.repair_receipt_list_repair || [];
    const activeRepairItems = allRepairItems.filter(item => item.is_active);

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
            {/* --- Card Header --- */}
            <header className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">เลขที่ใบรับซ่อม</p>
                    <h2 className="text-xl font-bold text-indigo-600">{repair_receipt_doc}</h2>
                </div>
                <button
                    onClick={() => navigate(`/ms-repair-receipt/${id}`)}
                    className="flex items-center gap-2 bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors"
                    title="ดูรายละเอียดใบรับซ่อมฉบับเต็ม"
                >
                    <FaReceipt />
                    <span>รายละเอียด</span>
                </button>
            </header>

            {/* [ปรับปรุง] Card Body: เปลี่ยนเป็น 4 คอลัมน์สำหรับจอใหญ่ */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Part 1: Car Information */}
                <div className="space-y-4">
                    <h3 className="flex items-center gap-3 text-lg font-bold text-gray-800 border-b pb-2">
                        <FaCar className="text-blue-500" />
                        <span>ข้อมูลรถยนต์</span>
                    </h3>
                    <div className="space-y-1 text-md">
                        <p className="flex justify-between items-baseline">
                            <span className="font-semibold text-gray-600">ทะเบียน:</span>
                            <span className="font-bold text-xl text-blue-600">{register}</span>
                        </p>
                        <p className="flex justify-between items-center">
                            <span className="font-semibold text-gray-600">ยี่ห้อ:</span>
                            <span className="text-gray-800 font-medium">{brand}</span>
                        </p>
                        <p className="flex justify-between items-center">
                            <span className="font-semibold text-gray-600">รุ่น:</span>
                            <span className="text-gray-800 font-medium">{model}</span>
                        </p>
                        
                        <div className="pt-2 mt-2 space-y-1">
                            <p className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">ประกัน:</span>
                                <span className={insurance ? 'text-green-600 font-bold' : 'text-red-500'}>
                                    {insurance ? 'มีประกัน' : 'ไม่มี'}
                                </span>
                            </p>
                            {insurance && (
                                <p className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-600">วันที่:</span>
                                    <span className="text-gray-800 font-medium">{formatDate(insurance_date)}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* [ใหม่] Part 2: Quotation Information */}
                <div className="space-y-4">
                    <h3 className="flex items-center gap-3 text-lg font-bold text-gray-800 border-b pb-2">
                        <FaFileAlt className="text-purple-500" />
                        <span>ใบเสนอราคา</span>
                    </h3>
                    <div className="space-y-2 text-md">
                        <p className="flex justify-between items-center">
                            <span className="font-semibold text-gray-600">เลขที่ใบเสนอราคา:</span>
                            <span className="text-purple-700 font-mono text-base">{quotationId}</span>
                        </p>
                        <div className="pt-2 mt-2">
                            <div className="flex justify-between items-baseline">
                                <span className="font-semibold text-gray-600">ยอดรวมทั้งหมด:</span>
                                <span className="font-bold text-xl text-purple-600">{formatCurrency(total_price)}</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Part 3: Repair List */}
                <div className="space-y-4">
                    <h3 className="flex items-center gap-3 text-lg font-bold text-gray-800 border-b pb-2">
                        <FaTools className="text-orange-500" />
                        {/* 3. ใช้ .length ของ array ที่กรองแล้ว เพื่อแสดงจำนวนที่ถูกต้อง */}
                        <span>รายการซ่อม ({activeRepairItems.length})</span>
                    </h3>
                    {/* 4. ตรวจสอบ .length จาก array ที่กรองแล้ว */}
                    {activeRepairItems.length > 0 ? (
                         <ul className="text-gray-700 space-y-1 max-h-40 overflow-y-auto pr-2">
                            {/* 5. map จาก array ที่กรองแล้ว */}
                            {activeRepairItems.map((item: any) => (
                                // 6. ไม่ต้องมีเงื่อนไข is_active อีกต่อไป เพราะทุกรายการเป็น active แล้ว
                                <li key={item.id} className="flex items-center gap-2">
                                  <span className="text-orange-500/80">•</span>
                                  {item.master_repair?.master_repair_name || "N/A"}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">ไม่มีรายการซ่อมที่อนุมัติ</p>
                    )}
                </div>

                {/* Part 4: Delivery & Payment */}
                <div className="space-y-4">
                    <h3 className="flex items-center gap-3 text-lg font-bold text-gray-800 border-b pb-2">
                        <FaFileInvoiceDollar className="text-green-500" />
                        <span>การส่งมอบและชำระเงิน</span>
                    </h3>
                    {deliveryInfo ? (
                        <div className="text-sm space-y-2">
                            <div className="flex justify-between"><span className="text-gray-600">นัดส่งมอบ:</span> <span className="font-semibold">{formatDate(deliveryInfo.delivery_date)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">สถานะ:</span> <span className="font-semibold">{translatePaymentOption(paymentInfo?.option_payment)}</span></div>
                            <div className="mt-2 pt-2 border-t">
                                <div className="flex justify-between text-gray-700"><span>ยอดเต็ม:</span> <span>{formatCurrency(total_price)}</span></div>
                                <div className="flex justify-between text-green-600"><span>ชำระแล้ว:</span> <span>{formatCurrency(paidAmount)}</span></div>
                                <div className={`flex justify-between font-bold text-lg ${remainingAmount > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                                    <span>คงเหลือ:</span>
                                    <span>{formatCurrency(remainingAmount)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center text-gray-500 italic h-full bg-gray-50 rounded-md p-4">
                            ยังไม่มีข้อมูลการส่งมอบ
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- คอมโพเนนต์หลักของหน้า (ไม่มีการเปลี่ยนแปลง) ---
export default function SearchRegisterFeature() {
    // ... โค้ดส่วนนี้เหมือนเดิมทั้งหมด ...
    const [searchText, setSearchText] = useState("");
    const [activeSearch, setActiveSearch] = useState<string | null>(null);

    const { data: searchResult, isLoading, isError } = useSearchRegisterData({
        page: 1,
        pageSize: 100, // หรือตั้งค่าตามที่ต้องการ
        search: activeSearch ?? "",
        enabled: activeSearch !== null && activeSearch.trim() !== "",
    });

    const registerDataList = activeSearch !== null ? (searchResult?.responseObject || []) : [];
    
    const handleSearch = () => {
        if (searchText.trim() !== "") {
            setActiveSearch(searchText);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center p-10 text-lg text-gray-600">กำลังค้นหาข้อมูล...</div>;
        }

        if (isError) {
             return (
                <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">
                    <FaExclamationCircle className="mx-auto text-4xl mb-3"/>
                    <h3 className="text-xl font-semibold">เกิดข้อผิดพลาด</h3>
                    <p>ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้</p>
                </div>
            );
        }

        const hasResults = registerDataList.length > 0;

        if (activeSearch !== null && !hasResults) {
            return (
                <div className="text-center p-10 text-gray-600 bg-yellow-100 rounded-lg">
                    <h3 className="text-xl font-semibold">ไม่พบข้อมูล</h3>
                    <p>ไม่พบประวัติการซ่อมสำหรับเลขทะเบียน "{activeSearch}"</p>
                </div>
            );
        }

        if (hasResults) {
            return (
                <div className="flex flex-col gap-6">
                    {registerDataList.map((receipt) => (
                        <RepairRecordCard key={receipt.id} receipt={receipt} />
                    ))}
                </div>
            );
        }

        return (
            <div className="text-center p-10 text-gray-500">
                <FaSearch className="mx-auto text-5xl text-gray-300 mb-4" />
                <h3 className="text-2xl font-light">เริ่มต้นค้นหางานซ่อม</h3>
                <p className="mt-2">กรุณาระบุเลขทะเบียนรถในช่องค้นหาด้านบนเพื่อดูประวัติ</p>
            </div>
        );
    };

    return (
        <div className="bg-slate-50 min-h-screen w-full p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl mx-auto mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-4">ค้นหาประวัติการซ่อม</h1>
                <div className="relative flex items-center shadow-lg rounded-full">
                    <input
                        id="search_register"
                        type="text"
                        placeholder="พิมพ์เลขทะเบียนรถเพื่อค้นหา..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full py-4 pl-6 pr-32 text-lg text-gray-800 bg-white border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-semibold py-2.5 px-8 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-gray-400"
                    >
                        {isLoading ? '...' : 'ค้นหา'}
                    </button>
                </div>
            </div>
            
            <main className="w-full max-w-screen-2xl mx-auto">
                {renderContent()}
            </main>
        </div>
    );
}