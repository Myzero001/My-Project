import React, { useState, useEffect, useCallback } from "react";
import { Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import DialogShow from "@/components/customs/dialog/dialog.show.component";
import { IoDocumentTextOutline } from "react-icons/io5";
import { getQuotationDoc, getCalendarRemovalDetails , getCalendarRemovalsByDateRange  } from "@/services/ms.quotation.service";
import "@/features/appointment-calendar-removal/hide-scrollbar/index.css";

interface CalendarRemovalDetail {
  Billnumber: string;
  CustomerNumber: string;
  Customer_name: string;
  DayStart: string;
  day: string; // YYYY-MM-DD format
  Car: string;
  status: string;
  License_plate: string; // เราจะใช้ `|| ""` เพื่อให้เป็น string เสมอ
  quotationId?: string;
  repairReceiptId?: string;      // <<< แก้ไข: เพิ่ม ? ทำให้เป็น optional (string | undefined)
  repairReceiptDoc?: string;   // <<< แก้ไข: เพิ่ม ? ทำให้เป็น optional
  addr_number?: string;
  addr_alley?: string;
  addr_street?: string;
  addr_subdistrict?: string;
  addr_district?: string;
  addr_province?: string;
  expected_delivery_date?: string; // <<< แก้ไข: เพิ่ม ? ทำให้เป็น optional
  // Properties ที่ไม่มีใน map ก็ควรเป็น optional
  CalendarRemovalDetail?: string; 
  price?: string; // price ถูกกำหนดเป็น "" ใน map แต่ถ้าอาจไม่มี ก็ควรเป็น optional
}

interface CalendarRemovalResponse {
  appointment_date: string;
  quotation_doc: string;
  addr_number: string;
  addr_alley: string;
  addr_street: string;
  addr_subdistrict: string;
  addr_district: string;
  addr_province: string;
  customer_name: string;
  contact_number: string;
  master_customer: {
    customer_name: string;
  };
  master_brand: {
    brand_name: string;
  };
  master_brandmodel: {
    brandmodel_name: string;
  };
  master_repair_receipt: Array<{
    register?: string;
    repair_receipt_doc?: string;
    id: string;
    expected_delivery_date?: string;
    master_delivery_schedule?: Array<{
      status: string;
    }>;
  }>;
}

const CalendarRemoval: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<CalendarRemovalDetail[] | null>(null);
  const [specialDates, setSpecialDates] = useState<CalendarRemovalDetail[]>([]);
  const [selectedBill, setSelectedBill] = useState<CalendarRemovalDetail | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisibleCalendarData = async () => {
      setIsLoading(true);

      try {
        // --- ส่วนที่ 1: คำนวณหาช่วงวันที่ที่แสดงผลทั้งหมด (Dynamic) ---

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const startDayOfWeek = firstDayOfMonth.getDay();
        
        const calendarStartDate = new Date(firstDayOfMonth);
        calendarStartDate.setDate(firstDayOfMonth.getDate() - startDayOfWeek);
        
        const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
        const totalOccupiedCells = startDayOfWeek + daysInCurrentMonth;
        const totalGridCells = Math.ceil(totalOccupiedCells / 7) * 7;
        
        const calendarEndDate = new Date(calendarStartDate);
        calendarEndDate.setDate(calendarStartDate.getDate() + (totalGridCells - 1));

        // ======================= ส่วนที่แก้ไข =======================
        // สร้างฟังก์ชัน Helper เพื่อแปลง Date เป็น YYYY-MM-DD อย่างปลอดภัย
        const toYYYYMMDD = (date: Date): string => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        // ใช้ฟังก์ชัน Helper ใหม่แทน toISOString().split('T')[0]
        const startDateString = toYYYYMMDD(calendarStartDate);
        const endDateString = toYYYYMMDD(calendarEndDate);
        // ==========================================================
        
        // console.log(`Fetching data from: ${startDateString} to ${endDateString}`); // สำหรับ Debug
        
        // --- ส่วนที่ 2 และ 3: เรียก API และประมวลผล (เหมือนเดิม) ---
        
        const response = await getCalendarRemovalsByDateRange(startDateString, endDateString);

        if (response.success && Array.isArray(response.data)) {
          const transformedDates = response.data
            .map(detailData => {
              // ... โค้ด .map() ทั้งหมดของคุณเหมือนเดิมทุกประการ ...
              if (!detailData.appointment_date) { return null; }
              const appointmentDate = new Date(detailData.appointment_date);
              // แก้ไขการสร้าง Date ที่นี่ด้วยเพื่อความปลอดภัยสูงสุด
              const utcDate = new Date(appointmentDate.getUTCFullYear(), appointmentDate.getUTCMonth(), appointmentDate.getUTCDate());
              const today = new Date();
              const appointmentDateOnly = new Date(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate());
              const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const repairReceipt = detailData.master_repair_receipt?.[0];
              const deliveryStatus = repairReceipt?.master_delivery_schedule?.[0]?.status;
              let status = "กำลังดำเนินการ";
              if (deliveryStatus === "success") { status = "ส่งมอบสำเร็จ"; } 
              else if (appointmentDateOnly < todayOnly) { status = "เลยกำหนด"; } 
              else if (appointmentDateOnly.getTime() === todayOnly.getTime()) { status = "ถึงวันที่นัดหมาย"; }
              const dateKey = `${utcDate.getFullYear()}-${String(utcDate.getMonth() + 1).padStart(2, '0')}-${String(utcDate.getDate()).padStart(2, '0')}`;
              return {
                Billnumber: detailData.quotation_doc,
                CustomerNumber: detailData.contact_number || "N/A",
                Customer_name: detailData.customer_name || detailData.master_customer?.customer_name || "N/A",
                DayStart: detailData.appointment_date,
                day: dateKey, 
                Car: `${detailData.master_brand?.brand_name || 'N/A'}/${detailData.master_brandmodel?.brandmodel_name || 'N/A'}`,
                status: status,
                License_plate: repairReceipt?.register || "",
                repairReceiptId: repairReceipt?.id,
                repairReceiptDoc: repairReceipt?.repair_receipt_doc,
                expected_delivery_date: repairReceipt?.expected_delivery_date || undefined,
                addr_number: detailData.addr_number || "",
                addr_alley: detailData.addr_alley || "",
                addr_street: detailData.addr_street || "",
                addr_subdistrict: detailData.addr_subdistrict || "",
                addr_district: detailData.addr_district || "",
                addr_province: detailData.addr_province || "",
              } as CalendarRemovalDetail;
            })
            .filter((item): item is CalendarRemovalDetail => item !== null); 

          setSpecialDates(transformedDates);

        } else {
          console.error("Failed to process calendar data:", response.message);
          setSpecialDates([]);
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        setSpecialDates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisibleCalendarData();
  }, [currentDate]);

  const daysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleEventClick = (event: React.MouseEvent, bill: CalendarRemovalDetail) => {
    event.stopPropagation();
    setSelectedBill(bill);
    setShowDetailDialog(true);
  };

  const handleCountClick = (event: React.MouseEvent, dateKey: string) => {
    event.stopPropagation();
    const specialDateList = specialDates.filter((item) => item.day === dateKey);
    setDialogData(specialDateList);
    setIsDialogOpen(true);
  };

  const handleDayClick = (dateKey: string) => {
    const specialDateList = specialDates.filter((item) => item.day === dateKey);

    if (specialDateList.length === 1) {
      setSelectedBill(specialDateList[0]);
      setShowDetailDialog(true);
    } else if (specialDateList.length > 1) {
      setDialogData(specialDateList);
      setIsDialogOpen(true);
      setSelectedBill(null);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setShowDetailDialog(false);
    setDialogData(null);
    setSelectedBill(null);
  };

  const startDayOfWeek = (year: number, month: number): number => {
    const date = new Date(year, month, 1);
    return date.getDay();
  };

  const dayNames = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

  const handleChangeMonth = (offset: number) => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
      changeMonth(offset);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 300);
    }
  };

  const changeMonth = useCallback((offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(1); // Ensure we are on the first day of the month before changing month
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  }, [currentDate]);

  const isToday = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  const BillDetailComponent = ({ bill, onClose }: { bill: CalendarRemovalDetail, onClose: () => void }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
      if (bill.repairReceiptId) {
        navigate(`/ms-repair-receipt/${bill.repairReceiptId}`);
        onClose();
      }
    };

    const formatDate = (dateString: string | undefined) => {
      if (!dateString || dateString.trim() === "") { // ตรวจสอบ string ว่างหรือ space เปล่าๆ
        return " - "; // แสดงขีดกลางถ้าไม่มีข้อมูล
      }
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) { // ตรวจสอบว่าเป็น Invalid Date หรือไม่
          return " - "; // แสดงขีดกลางถ้า date ไม่ถูกต้อง
        }
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      } catch (e) {
        return " - "; // หากเกิด error ในการ parse date
      }
    };

    const formatAddress = () => {
      const addressParts = [
        bill.addr_number ? `เลขที่ ${bill.addr_number}` : null,
        bill.addr_street ? `ถนน ${bill.addr_street}` : null,
        bill.addr_alley ? `ซอย ${bill.addr_alley}` : null,
        bill.addr_subdistrict ? `แขวง/ตำบล ${bill.addr_subdistrict}` : null,
        bill.addr_district ? `เขต/อำเภอ ${bill.addr_district}` : null,
        bill.addr_province ? `จังหวัด ${bill.addr_province}` : null,
      ].filter(part => part !== null); // กรองส่วนที่เป็น null ออก

      if (addressParts.length === 0) {
        return " - "; // แสดงขีดกลางถ้าไม่มีข้อมูลที่อยู่
      }
      return addressParts.join(' '); // ใช้ join(' ') เพื่อให้อยู่บรรทัดเดียว หรือ '\n' ถ้าต้องการหลายบรรทัด
    };

    return (
      <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-3 pb-2 border-b">
          <h3 className="font-bold text-lg text-gray-800">รายละเอียดบิล</h3>
          {bill.repairReceiptId && (
            <IoDocumentTextOutline
              className="text-blue-500 hover:text-blue-600 cursor-pointer w-6 h-6"
              onClick={handleEdit}
              title="ไปที่ใบรับซ่อม"
            />
          )}
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="grid grid-cols-3 gap-x-2 gap-y-1">
            <span className="font-medium text-gray-600">เลขที่ใบเสนอราคา:</span>
            <span className="col-span-2">{bill.Billnumber || " - "}</span>
          </div>
          {bill.repairReceiptDoc && (
            <div className="grid grid-cols-3 gap-x-2 gap-y-1">
              <span className="font-medium text-gray-600">เลขที่ใบรับซ่อม:</span>
              <span className="col-span-2">{bill.repairReceiptDoc}</span>
            </div>
          )}
          <div className="grid grid-cols-3 gap-x-2 gap-y-1">
            <span className="font-medium text-gray-600">ชื่อลูกค้า:</span>
            <span className="col-span-2">{bill.Customer_name || " - "}</span>
          </div>
          <div className="grid grid-cols-3 gap-x-2 gap-y-1">
            <span className="font-medium text-gray-600">เบอร์ติดต่อ:</span>
            <span className="col-span-2">{bill.CustomerNumber || " - "}</span>
          </div>
          <div className="grid grid-cols-3 gap-x-2 gap-y-1">
            <span className="font-medium text-gray-600">วันที่นัดหมาย:</span>
            <span className="col-span-2">{formatDate(bill.DayStart)}</span>
          </div>
          <div className="grid grid-cols-3 gap-x-2 gap-y-1">
            <span className="font-medium text-gray-600">วันที่ส่งมอบ:</span>
            <span className="col-span-2">{formatDate(bill.expected_delivery_date)}</span>
          </div>
          <div className="grid grid-cols-3 gap-x-2 gap-y-1">
            <span className="font-medium text-gray-600">รุ่น/รถ:</span>
            <span className="col-span-2">{bill.Car || " - "}</span>
          </div>
          <div className="grid grid-cols-3 gap-x-2 gap-y-1">
            <span className="font-medium text-gray-600">เลขทะเบียน:</span>
            <span className="col-span-2">{bill.License_plate || " - "}</span>
          </div>
          <div className="grid grid-cols-3 gap-x-2 gap-y-1">
            <span className="font-medium text-gray-600">ที่อยู่:</span>
            <span className="col-span-2 whitespace-pre-line">{formatAddress()}</span>
          </div>
          <div className="grid grid-cols-3 gap-x-2 gap-y-1 items-center">
            <span className="font-medium text-gray-600">สถานะ:</span>
            <span className={`col-span-2 px-2 py-1 rounded-full text-xs font-semibold
              ${bill.status === 'เลยกำหนด'
                ? 'bg-red-100 text-red-700'
                : bill.status === 'ส่งมอบสำเร็จ'
                  ? 'bg-green-100 text-green-700'
                  : bill.status === 'ถึงวันที่นัดหมาย'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700' // สำหรับ 'กำลังดำเนินการ' หรือสถานะอื่นๆ
              }`}
            >
              {bill.status}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // วางทับฟังก์ชัน renderDays เดิมทั้งหมดในคอมโพเนนต์ CalendarRemoval ของคุณ
  const renderDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const totalDays = daysInMonth(year, month);
      const startDay = startDayOfWeek(year, month); // 0=Sun, 6=Sat

      const days: JSX.Element[] = [];
      const MAX_EVENTS_DISPLAY = 2; // <-- กำหนดค่าสูงสุดที่จะแสดงที่นี่

      // --- ส่วนที่ 1: วันที่ของเดือนก่อนหน้า (ยังคงเป็นสีเทาและคลิกไม่ได้) ---
      const prevMonthDate = new Date(year, month, 0);
      const totalDaysInPrevMonth = prevMonthDate.getDate();
      for (let i = 0; i < startDay; i++) {
        const prevMonthDay = totalDaysInPrevMonth - startDay + 1 + i;
        days.push(
          <div
            key={`prev-month-${i}`}
            className="border border-gray-200 bg-gray-50 p-1.5 flex flex-col opacity-60 min-h-[calc((100vh-200px)/6)] md:min-h-[calc((100vh-220px)/6)] lg:h-[calc((100%))]"
          >
            <div className="font-semibold text-[10px] text-gray-500">{prevMonthDay}</div>
          </div>
        );
      }

      // Helper function สำหรับการ render event item เพื่อลดโค้ดซ้ำซ้อน
      const renderEventItem = (specialDate: CalendarRemovalDetail, index: number, keyPrefix: string) => {
          let statusPrefix = "";
          let styleClass = "";

          switch (specialDate.status) {
              case 'เลยกำหนด':
                  statusPrefix = "เลยกำหนด:";
                  styleClass = "bg-red-100 text-red-700 hover:bg-red-200";
                  break;
              case 'ถึงวันที่นัดหมาย':
                  statusPrefix = "วันนี้:";
                  styleClass = "bg-blue-100 text-blue-700 hover:bg-blue-200";
                  break;
              case 'กำลังดำเนินการ':
                  statusPrefix = "นัดถอด:";
                  styleClass = "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
                  break;
              case 'ส่งมอบสำเร็จ':
                  statusPrefix = "ส่งมอบแล้ว:";
                  styleClass = "bg-green-100 text-green-700 hover:bg-green-200";
                  break;
          }

          return (
              <div
                  key={`${keyPrefix}-${index}-${specialDate.Billnumber}`}
                  className={`text-xs pl-1 rounded cursor-pointer transition-colors truncate ${styleClass}`}
                  onClick={(e) => handleEventClick(e, specialDate)}
                  title={specialDate.Customer_name}
              >
                  <span className="font-semibold">{statusPrefix}</span> {specialDate.Customer_name || "N/A"}
              </div>
          );
      };

      // --- ส่วนที่ 2: วันที่ของเดือนปัจจุบัน ---
      for (let day = 1; day <= totalDays; day++) {
          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const specialDateList = specialDates.filter(item => item.day === dateKey);
          const totalEvents = specialDateList.length;
          const isSpecial = totalEvents > 0;

          days.push(
              <div
                  key={`day-${day}`}
                  className={`flex flex-col border border-gray-300 p-1.5 relative min-h-[calc((100vh-200px)/6)] md:min-h-[calc((100vh-220px)/6)] lg:h-[calc((100% - 10vh))] hover:bg-gray-50 transition-colors duration-150 cursor-pointer group`}
                  onClick={() => handleDayClick(dateKey)}
              >
                  <div className="flex justify-between items-start">
                      <div className={`font-semibold text-[10px] w-[2vh] flex items-center justify-center rounded-full transition-colors ${isToday(year, month, day) ? "bg-sky-500 text-white" : isSpecial ? "text-sky-600 group-hover:bg-sky-100" : "text-gray-700 group-hover:bg-gray-100"}`}>
                          {day}
                      </div>
                      {isSpecial && totalEvents > 1 && (
                          <div
                              className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-red-600 z-10"
                              onClick={(e) => handleCountClick(e, dateKey)}
                              title={`มี ${totalEvents} รายการ`}
                          >
                              {totalEvents}
                          </div>
                      )}
                  </div>
                  {isSpecial && (
                      <div className="mt-1 flex-grow overflow-y-auto hide-scrollbar space-y-1 pr-0.5">
                          {(() => {
                              // จัดลำดับความสำคัญของสถานะ
                              const statusOrder = ["เลยกำหนด", "ถึงวันที่นัดหมาย", "กำลังดำเนินการ", "ส่งมอบสำเร็จ"];
                              const sortedEvents = [...specialDateList].sort((a, b) => 
                                  statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
                              );

                              const eventsToDisplay = sortedEvents.slice(0, MAX_EVENTS_DISPLAY);

                              return (
                                  <>
                                      {eventsToDisplay.map((event, index) => renderEventItem(event, index, "current"))}
                                      
                                      {totalEvents > MAX_EVENTS_DISPLAY && (
                                          <div
                                              className="text-xs p-1 rounded cursor-pointer text-blue-600 hover:bg-blue-50 transition-colors font-medium text-center"
                                              onClick={(e) => handleCountClick(e, dateKey)}
                                              title={`และอีก ${totalEvents - MAX_EVENTS_DISPLAY} รายการ`}
                                          >
                                              ...ดูทั้งหมด {totalEvents} รายการ
                                          </div>
                                      )}
                                  </>
                              );
                          })()}
                      </div>
                  )}
              </div>
          );
      }

      // --- ส่วนที่ 3: วันที่ของเดือนถัดไป ---
      const totalCells = startDay + totalDays;
      const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
      const nextMonthDate = new Date(year, month + 1, 1);
      const nextMonthYear = nextMonthDate.getFullYear();
      const nextMonth = nextMonthDate.getMonth();

      for (let day = 1; day <= remainingCells; day++) {
          const dateKey = `${nextMonthYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const specialDateList = specialDates.filter(item => item.day === dateKey);
          const totalEvents = specialDateList.length;
          const isSpecial = totalEvents > 0;

          days.push(
              <div
                  key={`next-month-${day}`}
                  className={`flex flex-col border border-gray-200 p-1.5 relative min-h-[calc((100vh-200px)/6)] md:min-h-[calc((100vh-220px)/6)] lg:h-[calc((100%))] bg-gray-50 hover:bg-gray-100 transition-colors duration-150 cursor-pointer group`}
                  onClick={() => handleDayClick(dateKey)}
              >
                  <div className="flex justify-between items-start opacity-70">
                      <div className={`font-semibold text-[10px] flex items-center justify-center rounded-full transition-colors ${isSpecial ? "text-sky-600 group-hover:bg-sky-100" : "text-gray-500 group-hover:bg-gray-200"}`}>
                          {day}
                      </div>
                      {isSpecial && totalEvents > 1 && (
                          <div
                              className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-red-600 z-10"
                              onClick={(e) => handleCountClick(e, dateKey)}
                              title={`มี ${totalEvents} รายการ`}
                          >
                              {totalEvents}
                          </div>
                      )}
                  </div>
                  {isSpecial && (
                      <div className="mt-1 flex-grow overflow-y-auto hide-scrollbar space-y-1 pr-0.5">
                          {(() => {
                              const statusOrder = ["เลยกำหนด", "ถึงวันที่นัดหมาย", "กำลังดำเนินการ", "ส่งมอบสำเร็จ"];
                              const sortedEvents = [...specialDateList].sort((a, b) => 
                                  statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
                              );

                              const eventsToDisplay = sortedEvents.slice(0, MAX_EVENTS_DISPLAY);

                              return (
                                  <>
                                      {eventsToDisplay.map((event, index) => renderEventItem(event, index, "next"))}

                                      {totalEvents > MAX_EVENTS_DISPLAY && (
                                          <div
                                              className="text-xs p-1 rounded cursor-pointer text-blue-600 hover:bg-blue-50 transition-colors font-medium text-center"
                                              onClick={(e) => handleCountClick(e, dateKey)}
                                              title={`และอีก ${totalEvents - MAX_EVENTS_DISPLAY} รายการ`}
                                          >
                                              ...ดูทั้งหมด {totalEvents} รายการ
                                          </div>
                                      )}
                                  </>
                              );
                          })()}
                      </div>
                  )}
              </div>
          );
      }
      
      return days;
  };

  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    // This outer div helps control the overall height and scrolling
    <div className="flex flex-col h-[85vh] max-h-screen overflow-hidden"> {/* Full height, prevent body scroll */}
      

      {/* Calendar container: flex-grow allows it to take available vertical space */}
      <div className="flex flex-col flex-grow h-[100%] bg-white p-2 overflow-hidden"> {/* overflow-hidden on parent */}
        {/* Calendar navigation */}
        <div className="flex space-x-2 sm:space-x-4 h-[5vh] items-center mb-3">
          <div className="p-1 h-auto "> {/* Added padding around the title */}
            <Text  weight="bold" className="text-[13px] xs:text-lg text-gray-800">
              ปฏิทินนัดหมายถอด
            </Text>
          </div>
          <button
            onClick={resetToToday}
            className="font-semibold bg-sky-500 text-white px-3 py-1.5 rounded text-[9px] xs:text-sm shadow hover:bg-sky-600 transition-colors"
          >
            วันนี้
          </button>

          <button
            onClick={() => handleChangeMonth(-1)} // Use handleChangeMonth for consistency
            disabled={isButtonDisabled}
            className={`flex items-center justify-center w-5 h-5 text-[12px] xs:w-8 xs:h-8 xs:text-md rounded-full shadow-md transition-colors
                        ${isButtonDisabled ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            aria-label="เดือนก่อนหน้า"
          >
            ◀
          </button>
          <button
            onClick={() => handleChangeMonth(1)}
            disabled={isButtonDisabled}
            className={`flex items-center justify-center w-5 h-5 text-[12px] xs:w-8 xs:h-8 xs:text-md rounded-full shadow-md transition-colors
                        ${isButtonDisabled ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            aria-label="เดือนถัดไป"
          >
            ▶
          </button>

          <span className="font-medium text-gray-800 text-[13px] sm:text-base">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear() + 543} {/* แสดงเป็น พ.ศ. */}
          </span>
        </div>

        {/* Day names header */}
        <div className="grid grid-cols-7 sticky top-0 h-[7vh] bg-white z-20 shadow-sm"> {/* Sticky header */}
          {dayNames.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-center border border-gray-200  bg-gray-50 p-1 text-gray-600 font-semibold text-xs sm:text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid: overflow-y-auto allows grid to scroll if content exceeds flex-grow space */}
        {/* <div className="grid grid-cols-7  flex-grow overflow-y-auto hide-scrollbar"> Grid itself scrolls */}
        <div className="grid grid-cols-7 overflow-hidden h-full  flex-grow"> {/* Grid itself scrolls */}
          {renderDays()}
        </div>
      </div>

      {isDialogOpen && dialogData && (
        <DialogShow
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          title="เลือกรายการนัดหมาย"
          cancelText="ปิด"
        >
          {/* Max height for dialog content, scrollable */}
          <div className="max-h-[60vh] overflow-y-auto hide-scrollbar p-1">
            <div className="grid grid-cols-1 gap-3">
              {dialogData.map((bill) => (
                <div
                  key={bill.Billnumber}
                  className={`p-3 rounded-lg cursor-pointer transition-all border
                    ${selectedBill?.Billnumber === bill.Billnumber
                      ? 'bg-blue-50 border-blue-400 shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    }`}
                  onClick={() => {
                    setSelectedBill(bill);
                    setShowDetailDialog(true);
                    setIsDialogOpen(false); // Close this dialog when an item is selected
                  }}
                >
                  <p className="font-semibold text-gray-800">เลขที่ใบเสนอราคา: {bill.Billnumber}</p>
                  <p className="mt-1 text-sm text-gray-600">ลูกค้า: {bill.Customer_name || "N/A"}</p>
                  <p className="mt-0.5 text-sm text-gray-600">รุ่น/รถ: {bill.Car}</p>
                  <div className={`mt-2 text-xs px-2.5 py-1 rounded-full inline-block font-medium
                    ${bill.status === 'เลยกำหนด'
                      ? 'bg-red-100 text-red-700'
                      : bill.status === 'ส่งมอบสำเร็จ'
                        ? 'bg-green-100 text-green-700'
                        : bill.status === 'ถึงวันที่นัดหมาย'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700' // กำลังดำเนินการ
                    }`}
                  >
                    {bill.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogShow>
      )}

      {showDetailDialog && selectedBill && (
        <DialogShow
          isOpen={showDetailDialog}
          onClose={handleCloseDialog}
          title="รายละเอียดนัดหมาย"
          cancelText="ปิด"
        >
          {/* Max height for dialog content, scrollable */}
          <div className="max-h-[70vh] overflow-y-auto hide-scrollbar pr-2"> {/* Add pr for scrollbar space if not hidden */}
            <BillDetailComponent bill={selectedBill} onClose={handleCloseDialog} />
          </div>
        </DialogShow>
      )}
    </div>
  );
};

export default CalendarRemoval;