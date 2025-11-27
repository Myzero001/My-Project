import React, { useEffect, useState, useCallback } from "react";
import { Text } from "@radix-ui/themes";
import DialogShow from "@/components/customs/dialog/dialog.show.component";
import { useNavigate } from "react-router-dom";
import { useDeliveryScheduleCalendar } from "@/hooks/useDeliverySchedule";
import { IoDocumentTextOutline } from "react-icons/io5";
import "@/features/appointment-calendar-removal/hide-scrollbar/index.css";

// 1. Interface ที่รองรับสถานะ 'เลยกำหนด'
interface SpecialDate {
  BillID: string;
  DeliveryScheduleID: string;
  Billnumber: string;
  CustomerNumber: string;
  Customer_name: string;
  repair_receipt_doc: string;
  DayStart: string; // YYYY-MM-DD
  day: string; // YYYY-MM-DD
  price: string;
  Car: string;
  status: 'เลยกำหนด' | 'ส่งมอบสำเร็จ' | 'กำลังดำเนินการ';
  License_plate: string;
}

interface BillDetailProps {
  bill: SpecialDate;
  onClose: () => void;
}

// --- Helper function: แปลง Date object เป็น 'YYYY-MM-DD' ---
const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<SpecialDate[] | null>(null);
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [selectedBill, setSelectedBill] = useState<SpecialDate | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [dateRangeForQuery, setDateRangeForQuery] = useState<{ startDate: string; endDate: string; }>({
    startDate: '',
    endDate: ''
  });

  // useEffect สำหรับคำนวณช่วงวันที่ที่มองเห็นในปฏิทิน (เหมือน CalendarRemoval)
  useEffect(() => {
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

    setDateRangeForQuery({
      startDate: formatDateToISO(calendarStartDate),
      endDate: formatDateToISO(calendarEndDate),
    });
  }, [currentDate]);

  // Hook สำหรับดึงข้อมูล (เหมือนเดิม)
  const {
    data: dataDeliveryScheduleCalendar,
    isLoading,
    isError
  } = useDeliveryScheduleCalendar({
    startDate: dateRangeForQuery.startDate,
    endDate: dateRangeForQuery.endDate,
  });

  // useEffect สำหรับ Map ข้อมูลให้กำหนดสถานะ 'เลยกำหนด' ได้
  useEffect(() => {
    if (dataDeliveryScheduleCalendar?.responseObject) {
      const today = new Date();
      // สร้าง Date ของวันนี้โดยไม่เอาเวลามาคิด (เที่ยงคืน) เพื่อเปรียบเทียบวันที่อย่างเดียว
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const formattedData = dataDeliveryScheduleCalendar.responseObject
        .map((item) => {
          if (!item.delivery_date || !item.master_repair_receipt?.id) {
            return null;
          }
          
          const deliveryDate = new Date(item.delivery_date);
          // ทำเหมือนกันกับ delivery_date
          const deliveryDateOnly = new Date(deliveryDate.getFullYear(), deliveryDate.getMonth(), deliveryDate.getDate());

          let status: 'เลยกำหนด' | 'ส่งมอบสำเร็จ' | 'กำลังดำเนินการ' = 'กำลังดำเนินการ';
          if (item.status === 'success') {
            status = 'ส่งมอบสำเร็จ';
          } else if (deliveryDateOnly < todayOnly) {
            status = 'เลยกำหนด';
          }

          const dateKey = item.delivery_date.split("T")[0];

          return {
            BillID: item.master_repair_receipt.id,
            Billnumber: item.delivery_schedule_doc,
            DeliveryScheduleID: item.id,
            CustomerNumber: item.contact_number,
            Customer_name: item.customer_name,
            DayStart: dateKey,
            day: dateKey,
            repair_receipt_doc: item.master_repair_receipt.repair_receipt_doc,
            price: item.master_repair_receipt.master_quotation.total_price.toString(),
            Car: `${item.master_repair_receipt.master_quotation.master_brand.brand_name}/${item.master_repair_receipt.master_quotation.master_brandmodel.brandmodel_name}`,
            status: status,
            License_plate: item.master_repair_receipt.register,
          };
        })
        .filter((item): item is SpecialDate => item !== null);

      setSpecialDates(formattedData);
    } else {
      setSpecialDates([]);
    }
  }, [dataDeliveryScheduleCalendar]);

  // --- Functions จัดการ Event และ Dialog (เหมือน CalendarRemoval) ---
  const handleEventClick = (event: React.MouseEvent, bill: SpecialDate) => {
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

  const handleChangeMonth = (offset: number) => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
      changeMonth(offset);
      setTimeout(() => setIsButtonDisabled(false), 300);
    }
  };

  const changeMonth = useCallback((offset: number) => {
    setCurrentDate(current => {
      const newDate = new Date(current);
      newDate.setDate(1);
      newDate.setMonth(current.getMonth() + offset);
      return newDate;
    });
  }, []);
  
  const isToday = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  // --- BillDetailComponent (เหมือน CalendarRemoval แต่ปรับ field ให้ตรง) ---
  const BillDetailComponent: React.FC<BillDetailProps> = ({ bill, onClose }) => {
    const navigate = useNavigate();
    const handleEdit = () => {
      if (bill.BillID) {
        navigate(`/ms-repair-receipt/${bill.BillID}`);
        onClose();
      }
    };
    const formatDate = (dateString: string) => {
      if (!dateString) return " - ";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return " - ";
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear() + 543}`;
    };
    const formatPrice = (price: string) => {
        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) return " - ";
        return numPrice.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return (
      <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-3 pb-2 border-b">
          <h3 className="font-bold text-lg text-gray-800">รายละเอียดการส่งมอบ</h3>
          {bill.BillID && (
            <IoDocumentTextOutline className="text-blue-500 hover:text-blue-600 cursor-pointer w-6 h-6" onClick={handleEdit} title="ไปที่ใบรับซ่อม" />
          )}
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="grid grid-cols-3 gap-x-2"><span className="font-medium text-gray-600">เลขที่ใบส่งมอบ:</span><span className="col-span-2">{bill.Billnumber || " - "}</span></div>
          <div className="grid grid-cols-3 gap-x-2"><span className="font-medium text-gray-600">เลขที่ใบรับซ่อม:</span><span className="col-span-2">{bill.repair_receipt_doc || " - "}</span></div>
          <div className="grid grid-cols-3 gap-x-2"><span className="font-medium text-gray-600">ชื่อลูกค้า:</span><span className="col-span-2">{bill.Customer_name || " - "}</span></div>
          <div className="grid grid-cols-3 gap-x-2"><span className="font-medium text-gray-600">วันที่ส่งมอบ:</span><span className="col-span-2">{formatDate(bill.day)}</span></div>
          <div className="grid grid-cols-3 gap-x-2"><span className="font-medium text-gray-600">ราคา:</span><span className="col-span-2">{formatPrice(bill.price)} บาท</span></div>
          <div className="grid grid-cols-3 gap-x-2"><span className="font-medium text-gray-600">รุ่น/รถ:</span><span className="col-span-2">{bill.Car || " - "}</span></div>
          <div className="grid grid-cols-3 gap-x-2"><span className="font-medium text-gray-600">เลขทะเบียน:</span><span className="col-span-2">{bill.License_plate || " - "}</span></div>
          <div className="grid grid-cols-3 gap-x-2 items-center">
            <span className="font-medium text-gray-600">สถานะ:</span>
            <span className={`col-span-2 px-2 py-1 rounded-full text-xs font-semibold ${bill.status === 'เลยกำหนด' ? 'bg-red-100 text-red-700' : bill.status === 'ส่งมอบสำเร็จ' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{bill.status}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => navigate(`/ms-payment/${bill.DeliveryScheduleID}`)} className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors shadow-sm">
            ไปที่หน้าชำระเงิน
          </button>
        </div>
      </div>
    );
  };


  // --- ฟังก์ชัน renderDays ที่สมบูรณ์ ---
  const renderDays = () => {
    // ส่วน Loading และ Error
    if (isLoading) {
      return Array.from({ length: 42 }).map((_, index) => (
        <div key={index} className="border border-gray-200 p-1.5 bg-gray-50 animate-pulse min-h-[calc((100vh-200px)/6)] md:min-h-[calc((100vh-220px)/6)] lg:h-[calc((100%))]"></div>
      ));
    }
    if (isError) {
      return <div className="col-span-7 text-center p-4 text-red-500">ไม่สามารถโหลดข้อมูลได้</div>;
    }

    // --- ประกาศตัวแปรที่จำเป็น ---
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    const days: JSX.Element[] = [];
    const MAX_EVENTS_DISPLAY = 2;

    // --- Helper function สำหรับสร้าง Item ---
    const renderEventItem = (event: SpecialDate, index: number, keyPrefix: string) => {
        let statusPrefix = "";
        let styleClass = "";
        switch (event.status) {
            case 'เลยกำหนด':
                statusPrefix = "เลยกำหนด:";
                styleClass = "bg-red-100 text-red-700 hover:bg-red-200";
                break;
            case 'กำลังดำเนินการ':
                statusPrefix = "รอส่งมอบ:";
                styleClass = "bg-blue-100 text-blue-700 hover:bg-blue-200";
                break;
            case 'ส่งมอบสำเร็จ':
                statusPrefix = "สำเร็จ:";
                styleClass = "bg-green-100 text-green-700 hover:bg-green-200";
                break;
        }
        return (
            <div key={`${keyPrefix}-${event.BillID}-${index}`} className={`text-xs p-1 rounded cursor-pointer transition-colors truncate ${styleClass}`} onClick={(e) => handleEventClick(e, event)} title={event.Customer_name}>
                <span className="font-semibold">{statusPrefix}</span> {event.Customer_name || "N/A"}
            </div>
        );
    };

    // === ส่วนที่ 1: วันที่ของเดือนก่อนหน้า ===
    const prevMonthDate = new Date(year, month, 0);
    const totalDaysInPrevMonth = prevMonthDate.getDate();
    for (let i = 0; i < startDay; i++) {
        const day = totalDaysInPrevMonth - startDay + 1 + i;
        days.push( <div key={`prev-${i}`} className="border border-gray-200 bg-gray-50 p-1.5 flex flex-col opacity-60 min-h-[calc((100vh-200px)/6)] md:min-h-[calc((100vh-220px)/6)] lg:h-[calc((100%))]"> <div className="font-semibold text-[10px] text-gray-500">{day}</div> </div> );
    }
    
    // === ส่วนที่ 2: วันที่ของเดือนปัจจุบัน ===
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const specialDateList = specialDates.filter(item => item.day === dateKey);
        const totalEvents = specialDateList.length;
        const isSpecial = totalEvents > 0;

        days.push(
            <div key={`day-${day}`} className={`flex flex-col border border-gray-300 p-1.5 relative min-h-[calc((100vh-200px)/6)] md:min-h-[calc((100vh-220px)/6)] lg:h-[calc((100%))] hover:bg-gray-50 transition-colors duration-150 cursor-pointer group`} onClick={() => handleDayClick(dateKey)}>
                <div className="flex justify-between items-start">
                    <div className={`font-semibold text-[10px] w-[2vh] flex items-center justify-center rounded-full transition-colors ${isToday(year, month, day) ? "bg-sky-500 text-white" : isSpecial ? "text-sky-600 group-hover:bg-sky-100" : "text-gray-700 group-hover:bg-gray-100"}`}>{day}</div>
                    {isSpecial && totalEvents > 1 && ( <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-red-600 z-10" onClick={(e) => handleCountClick(e, dateKey)} title={`มี ${totalEvents} รายการ`}>{totalEvents}</div> )}
                </div>
                {isSpecial && (
                    <div className="mt-1 flex-grow overflow-y-auto hide-scrollbar space-y-1 pr-0.5">
                        {(() => {
                            const statusOrder = ["เลยกำหนด", "กำลังดำเนินการ", "ส่งมอบสำเร็จ"];
                            const sortedEvents = [...specialDateList].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
                            const eventsToDisplay = sortedEvents.slice(0, MAX_EVENTS_DISPLAY);
                            return (
                                <>
                                    {eventsToDisplay.map((event, index) => renderEventItem(event, index, 'current'))}
                                    {totalEvents > MAX_EVENTS_DISPLAY && (
                                        <div className="text-xs p-1 rounded cursor-pointer text-blue-600 hover:bg-blue-50 transition-colors font-medium text-center" onClick={(e) => handleCountClick(e, dateKey)} title={`และอีก ${totalEvents - MAX_EVENTS_DISPLAY} รายการ`}>
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

    // === ส่วนที่ 3: วันที่ของเดือนถัดไป (ส่วนที่แก้ไข) ===
    const totalCells = startDay + totalDaysInMonth;
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
            <div key={`next-month-${day}`} className={`flex flex-col border border-gray-200 p-1.5 relative min-h-[calc((100vh-200px)/6)] md:min-h-[calc((100vh-220px)/6)] lg:h-[calc((100%))] bg-gray-50 hover:bg-gray-100 transition-colors duration-150 cursor-pointer group`} onClick={() => handleDayClick(dateKey)}>
                <div className="flex justify-between items-start opacity-70">
                    <div className={`font-semibold text-[10px] flex items-center justify-center rounded-full transition-colors ${isSpecial ? "text-sky-600 group-hover:bg-sky-100" : "text-gray-500 group-hover:bg-gray-200"}`}>{day}</div>
                    {isSpecial && totalEvents > 1 && (<div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-red-600 z-10" onClick={(e) => handleCountClick(e, dateKey)} title={`มี ${totalEvents} รายการ`}>{totalEvents}</div>)}
                </div>
                {isSpecial && (
                    <div className="mt-1 flex-grow overflow-y-auto hide-scrollbar space-y-1 pr-0.5">
                        {(() => {
                            const statusOrder = ["เลยกำหนด", "กำลังดำเนินการ", "ส่งมอบสำเร็จ"];
                            const sortedEvents = [...specialDateList].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
                            const eventsToDisplay = sortedEvents.slice(0, MAX_EVENTS_DISPLAY);
                            return (
                                <>
                                    {eventsToDisplay.map((event, index) => renderEventItem(event, index, 'next'))}
                                    {totalEvents > MAX_EVENTS_DISPLAY && (
                                        <div className="text-xs p-1 rounded cursor-pointer text-blue-600 hover:bg-blue-50 transition-colors font-medium text-center" onClick={(e) => handleCountClick(e, dateKey)} title={`และอีก ${totalEvents - MAX_EVENTS_DISPLAY} รายการ`}>
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

  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const dayNames = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const resetToToday = () => { setCurrentDate(new Date()); };

  // --- Layout หลักของ Component ---
  return (
    <div className="flex flex-col h-[85vh] max-h-screen overflow-hidden">
      <div className="flex flex-col flex-grow h-[100%] bg-white p-2 overflow-hidden">
        {/* -- Header & Navigation -- */}
        <div className="flex space-x-2 sm:space-x-4 h-[5vh] items-center mb-3">
          <div className="p-1 h-auto"> <Text weight="bold" className="text-[13px] xs:text-lg text-gray-800">ปฏิทินกำหนดการส่งมอบ</Text> </div>
          <button onClick={resetToToday} className="font-semibold bg-sky-500 text-white px-3 py-1.5 rounded text-[9px] xs:text-sm shadow hover:bg-sky-600 transition-colors">วันนี้</button>
          <button onClick={() => handleChangeMonth(-1)} disabled={isButtonDisabled} className={`flex items-center justify-center w-5 h-5 text-[12px] xs:w-8 xs:h-8 xs:text-md rounded-full shadow-md transition-colors ${isButtonDisabled ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`} aria-label="เดือนก่อนหน้า">◀</button>
          <button onClick={() => handleChangeMonth(1)} disabled={isButtonDisabled} className={`flex items-center justify-center w-5 h-5 text-[12px] xs:w-8 xs:h-8 xs:text-md rounded-full shadow-md transition-colors ${isButtonDisabled ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`} aria-label="เดือนถัดไป">▶</button>
          <span className="font-medium text-gray-800 text-[13px] sm:text-base">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear() + 543}</span>
        </div>

        {/* -- Day Names Header -- */}
        <div className="grid grid-cols-7 sticky top-0 h-[7vh] bg-white z-20 shadow-sm">
          {dayNames.map((day) => (<div key={day} className="flex items-center justify-center border border-gray-200 bg-gray-50 p-1 text-gray-600 font-semibold text-xs sm:text-sm">{day}</div>))}
        </div>

        {/* -- Calendar Grid -- */}
        <div className="grid grid-cols-7 overflow-hidden h-full flex-grow">
          {renderDays()}
        </div>
      </div>

      {/* --- Dialogs --- */}
      {isDialogOpen && dialogData && (
          <DialogShow isOpen={isDialogOpen} onClose={handleCloseDialog} title="เลือกรายการส่งมอบ" cancelText="ปิด">
              <div className="max-h-[60vh] overflow-y-auto hide-scrollbar p-1">
                  <div className="grid grid-cols-1 gap-3">
                      {dialogData.map((bill) => (
                          <div key={bill.BillID} className="p-3 rounded-lg cursor-pointer transition-all border bg-gray-50 hover:bg-gray-100 border-gray-200" onClick={() => { setSelectedBill(bill); setShowDetailDialog(true); setIsDialogOpen(false); }}>
                              <p className="font-semibold text-gray-800">เลขที่ใบส่งมอบ: {bill.Billnumber}</p>
                              <p className="mt-1 text-sm text-gray-600">ลูกค้า: {bill.Customer_name || "N/A"}</p>
                              <p className="mt-0.5 text-sm text-gray-600">รุ่น/รถ: {bill.Car}</p>
                              <div className={`mt-2 text-xs px-2.5 py-1 rounded-full inline-block font-medium ${bill.status === 'เลยกำหนด' ? 'bg-red-100 text-red-700' : bill.status === 'ส่งมอบสำเร็จ' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{bill.status}</div>
                          </div>
                      ))}
                  </div>
              </div>
          </DialogShow>
      )}

      {showDetailDialog && selectedBill && (
          <DialogShow isOpen={showDetailDialog} onClose={handleCloseDialog} title="รายละเอียดส่งมอบ" cancelText="ปิด">
              <div className="max-h-[70vh] overflow-y-auto hide-scrollbar pr-2">
                <BillDetailComponent bill={selectedBill} onClose={handleCloseDialog} />
              </div>
          </DialogShow>
      )}
    </div>
  );
};

export default Calendar;