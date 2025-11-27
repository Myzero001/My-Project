import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { FaEye } from "react-icons/fa";
import { useToast } from "@/components/customs/alert/toast.main.component";
import {
  setRepairReceiptFinish,
  setRepairReceiptUnFinish,
} from "@/services/ms.repair.receipt";
import {
  getRepairReceiptListRepairByRepairReceiptId,
  updateRepairReceiptUncheckedBoxStatus,
  updateRepairReceiptCheckedBoxStatus,
} from "@/services/repair.receipt.list.repair.service";
import { useJobs } from "@/hooks/useJob";
import { useSearchParams } from "react-router-dom";

type dataTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: any;
}[];

export default function JobFeature() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchText, setSearchText] = useState(searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "pending");
  
  // --- MODIFIED START: แยก State สำหรับการ์ดสรุปผล ---
  const [totalPendingJobs, setTotalPendingJobs] = useState(0);
  const [totalOverdueJobs, setTotalOverdueJobs] = useState(0);
  // --- MODIFIED END ---

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [pendingChanges, setPendingChanges] = useState<{ [key: string]: string }>({});

  const { showToast } = useToast();
  
  // --- (1) การดึงข้อมูลสำหรับตาราง (ตามฟิลเตอร์) ---
  const { 
    data: jobsData, 
    isLoading,
    isError,
    error,
    refetch: refetchJobs
  } = useJobs({
    page,
    pageSize,
    searchText,
    status: statusFilter,
  });
  
  // --- NEW START: (2) การดึงข้อมูลสำหรับ "การ์ดสรุปผล" แยกต่างหาก ---
  // เราจะดึงข้อมูลงานที่ 'pending' ทั้งหมดเสมอเพื่อคำนวณค่าบนการ์ด
  const { data: summaryData, refetch: refetchSummary } = useJobs({
    status: 'pending',
    page: '1',
    // ดึงข้อมูลจำนวนมากพอที่จะคำนวณงานเลยกำหนดได้อย่างถูกต้อง
    // หากมีงานค้างเยอะมาก อาจจะต้องปรับค่านี่้ หรือปรับ API ให้คืนค่า overdue มาโดยตรง
    pageSize: '10000', 
    searchText: '', // ไม่ใช้ searchText ในการคำนวณภาพรวม
  });
  // --- NEW END ---

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      calendar: "gregory",
    });
  };

  const isJobOverdue = (job: any) => {
    const appointmentDate = job.estimated_date_repair_completion
      ? new Date(job.estimated_date_repair_completion)
      : null;
    if (!appointmentDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  };

  const getJobRowClassName = (job: any) => {
    const isComplete = job.total_repairs > 0 && job.completed_repairs === job.total_repairs;
    if (isComplete) {
      return "bg-green-100";
    }
    // ใช้ isJobOverdue สำหรับงานที่ยังไม่เสร็จเท่านั้น
    return !isComplete && isJobOverdue(job) ? "bg-red-100" : "";
  };

  useEffect(() => {
    if (isError) {
      console.error("Error fetching jobs:", error);
      showToast("เกิดข้อผิดพลาดในการดึงข้อมูลงาน", false);
    }
  }, [isError, error, showToast]);

  // --- NEW START: useEffect สำหรับคำนวณค่าบน "การ์ดสรุปผล" ---
  useEffect(() => {
    if (summaryData?.success && summaryData.responseObject) {
      const allPendingJobs = summaryData.responseObject.data || [];
      const totalCount = summaryData.responseObject.totalCount || 0;
      
      // "งานค้างทั้งหมด" คือจำนวนงาน pending ทั้งหมดที่ API คืนค่ามา
      setTotalPendingJobs(totalCount);

      // "งานที่เลยกำหนด" คือการกรองงาน pending ที่เลยกำหนดแล้ว
      const overdueCount = allPendingJobs.filter(job => isJobOverdue(job)).length;
      setTotalOverdueJobs(overdueCount);

    } else {
      // Reset ค่าหากไม่มีข้อมูล
      setTotalPendingJobs(0);
      setTotalOverdueJobs(0);
    }
  }, [summaryData]); // ทำงานเมื่อข้อมูล summary อัปเดต
  // --- NEW END ---

  // --- REMOVED: ลบ useEffect เดิมที่คำนวณค่าบนการ์ดออกไป ---
  // เราได้สร้าง useEffect ใหม่ด้านบนเพื่อจัดการเรื่องนี้โดยเฉพาะแล้ว

  const handlePageChange = (newPage: string) => {
    setSearchParams({ page: newPage, pageSize, status: statusFilter, q: searchText });
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setSearchParams({ page: "1", pageSize: newPageSize, status: statusFilter, q: searchText });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setSearchParams({ page: "1", pageSize, status: value, q: searchText });
  };

  const handleSearch = () => {
    setSearchParams({ page: "1", pageSize, status: statusFilter, q: searchText });
  };

  const handleViewDetails = async (job: any) => {
    try {
      const response = await getRepairReceiptListRepairByRepairReceiptId(job.id);
      if (response?.success) {
        const activeRepairDetails = response.responseObject
          ? response.responseObject.filter((detail: any) => detail.is_active === true)
          : [];

        setSelectedJob({ ...job, repairDetails: activeRepairDetails });
        setIsDialogOpen(true);

        const initialChanges: { [key: string]: string } = {};
        activeRepairDetails.forEach((detail: any) => {
          if (detail.status_date) {
            initialChanges[detail.id] = detail.status_date;
          }
        });
        setPendingChanges(initialChanges);
      }
    } catch (fetchError) {
      console.error("Error fetching repair details:", fetchError);
      showToast("เกิดข้อผิดพลาดในการดึงรายละเอียดการซ่อม", false);
    }
  };
  
  const checkAndUpdateRepairStatus = async (currentJobId: string) => {
    const isLastItemOnPage = jobsData?.responseObject?.data?.length === 1;
    const isNotFirstPage = parseInt(page) > 1;
    
    await Promise.all([
      refetchJobs(),
      refetchSummary()
    ]);

    if (isLastItemOnPage && isNotFirstPage) {
      const newPage = parseInt(page) - 1;
      setSearchParams(
        { 
          page: String(newPage), 
          pageSize, 
          status: statusFilter, 
          q: searchText 
        },
        { replace: true }
      );
    }
    showToast("อัพเดทสถานะงานเรียบร้อย", true);
  };
  
  const handleConfirmChanges = async () => {
    if (!selectedJob) return;
    try {
      const updatePromises = Object.entries(pendingChanges).map(([id, date]) => {
        return updateRepairReceiptCheckedBoxStatus({ id, statusDate: date as string });
      });
      await Promise.all(updatePromises);
      await checkAndUpdateRepairStatus(selectedJob.id);
      setIsDialogOpen(false);
    } catch (updateError) {
      console.error("Error updating check status:", updateError);
      showToast("เกิดข้อผิดพลาดในการบันทึกข้อมูล", false);
    }
  };

  const handleUncheck = async (detail: any) => {
    if (!selectedJob) return;
    try {
      await updateRepairReceiptUncheckedBoxStatus({ id: detail.id });
      const updatedDetails = selectedJob.repairDetails.map((item: any) =>
        item.id === detail.id ? { ...item, status_date: null } : item
      );
      setSelectedJob({ ...selectedJob, repairDetails: updatedDetails });
      const newPendingChanges = { ...pendingChanges };
      delete newPendingChanges[detail.id];
      setPendingChanges(newPendingChanges);
    } catch (uncheckError) {
      console.error("Error updating uncheck status:", uncheckError);
      showToast("เกิดข้อผิดพลาดในการยกเลิกการตรวจสอบ", false);
    }
  };

  const handleCheckboxChange = (detail: any) => {
    if (detail.status_date || pendingChanges[detail.id]) {
      handleUncheck(detail);
      setCheckedItems((prev) => ({ ...prev, [detail.id]: false }));
    } else {
      const today = new Date().toISOString().split("T")[0];
      setCheckedItems((prev) => ({ ...prev, [detail.id]: true }));
      setPendingChanges((prev) => ({ ...prev, [detail.id]: today }));
    }
  };
  
  const headers = [
    { label: "ลำดับ", colSpan: 1, className: "w-10 text-center" },
    { label: "เลขที่ใบรับซ่อม", colSpan: 1, className: "w-30 text-center" },
    { label: "เลขทะเบียนรถ", colSpan: 1, className: "w-30 text-center" },
    { label: "ชื่อกิจการ", colSpan: 1, className: "w-40 text-center"},
    { label: "รุ่น", colSpan: 1, className: "w-30 text-center" },
    { label: "วันที่ปิดดีล", colSpan: 1, className: "w-30 text-center" },
    { label: "วันที่คาดว่าจะเสร็จ", colSpan: 1, className: "w-30 text-center" },
    { label: "กล่องซ่อม", colSpan: 1, className: "w-20 text-center" },
    { label: "สถานะ", colSpan: 1, className: "w-20 text-center" },
    { label: "เสร็จ / ไม่เสร็จ", colSpan: 1, className: "w-20 text-center" },
    { label: "ตรวจสอบ", colSpan: 1, className: "w-20 text-center" },
  ];

  const formatJobsForTable = (jobs: any[]) => {
    if (!jobs || jobs.length === 0) return [];
    
    return jobs.map((job, index) => {
      const customerName = job.master_quotation?.master_customer?.customer_name || "-";
      const brandmodelName = job.master_quotation?.master_brandmodel?.brandmodel_name || "-";
      const dealClosedDate = job.master_quotation?.deal_closed_date;
      const hasInsurance = job.master_quotation?.is_box_detail === true;

      const isComplete = job.total_repairs > 0 && job.completed_repairs === job.total_repairs;
      const completionStatus = `${job.completed_repairs}/${job.total_repairs}`;

      return {
        className: getJobRowClassName(job), 
        cells: [
          { value: (parseInt(page) - 1) * parseInt(pageSize) + index + 1, className: "text-center" },
          { value: job.repair_receipt_doc, className: "text-center" },
          { value: job.register || "-", className: "text-center" },
          { value: customerName, className: "text-left whitespace-nowrap overflow-y-auto max-w-[20vw] " },
          { value: brandmodelName, className: "text-left whitespace-nowrap overflow-y-auto max-w-[10vw]" },
          { value: formatDate(dealClosedDate) || "-", className: "text-center" },
          {
            value: formatDate(job.estimated_date_repair_completion) || "-",
            className: `text-center ${isComplete ? "" : isJobOverdue(job) ? "text-red-600 font-bold" : ""}`,
          },
          {
            value: hasInsurance ? "✔" : "✖",
            className: `text-center font-bold ${hasInsurance ? 'text-green-600' : 'text-red-500'}`
          },
          { value: completionStatus, className: "text-center" },
          { value: isComplete ? "เสร็จ" : "ไม่เสร็จ", className: "text-center" },
          {
            value: <FaEye className="cursor-pointer text-blue-500 hover:text-blue-700" onClick={() => handleViewDetails(job)} />,
            className: "flex justify-center items-center",
          },
        ],
        data: job,
      };
    });
  };

  return (
    <div className="h-full flex flex-col w-full min-w-0">
    {/* --- MODIFIED START: ปรับการ์ดให้แสดงผลแบบเดียวกันเสมอ --- */}
    <div className="grid grid-cols-2 gap-2 md:gap-4 p-2">
      <div className="bg-yellow-400 p-2 md:p-4 text-center rounded-lg shadow-md">
        <h2 className="text-base md:text-3xl font-bold">งานค้างทั้งหมด</h2>
        <p className="text-sm md:text-2xl font-bold">{totalPendingJobs} งาน</p>
      </div>
      <div className="bg-red-500 p-2 md:p-4 text-center text-white rounded-lg shadow-md">
        <h2 className="text-base md:text-3xl font-bold">งานที่เลยกำหนด</h2>
        <p className="text-sm md:text-2xl font-bold">{totalOverdueJobs} งาน</p>
      </div>
    </div>
    {/* --- MODIFIED END --- */}

      <div className="p-2">
        <MasterTableFeature
          classNameTableContent=" lg:max-w-full max-w-[1000px] "
          title="งาน"
          headers={headers}
          rowData={formatJobsForTable(jobsData?.responseObject?.data || [])}
          totalData={jobsData?.responseObject?.totalCount || 0}
          inputs={[
            {
              id: "search_input",
              placeholder: "ค้นหา เลขที่ใบรับซ่อม ทะเบียน ชื่อกิจการ รุ่น",
              value: searchText,
              onChange: (value: string) => setSearchText(value),
              size: "2",
              onAction: handleSearch,
            },
            {
              id: "status_select",
              inputType: "select",
              placeholder: "สถานะ",
              value: statusFilter,
              onChange: handleStatusChange,
              size: "1",
              className: "w-40",
              options: [
                { value: "all", label: "ทั้งหมด" },
                { value: "success", label: "เสร็จสิ้น" },
                { value: "pending", label: "กำลังดำเนินการ" },
              ],
            },
          ]}
          hideTitleBtn={true}
        />
      </div>

      <DialogComponent
        // ... (ส่วนของ Dialog ไม่มีการเปลี่ยนแปลง)
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedJob(null);
          setPendingChanges({});
          setCheckedItems({});
        }}
        title={`รายละเอียดใบรับซ่อม: ${selectedJob?.repair_receipt_doc || ""}`}
        onConfirm={handleConfirmChanges}
        confirmText="บันทึก"
        cancelText="ปิด"
      >
        {selectedJob && (
          <div className="space-y-2">
            <div className="p-2 border rounded-lg bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-600">ชื่อกิจการ:</span>
                  <span className="ml-2 text-gray-800">{selectedJob.contact_name || "-"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">เลขทะเบียนรถ:</span>
                  <span className="ml-2 text-gray-800">{selectedJob.register || "-"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">รุ่น:</span>
                  <span className="ml-2 text-gray-800">{selectedJob.brandmodel_name || "-"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">วันที่คาดว่าจะเสร็จ:</span>
                  <span className="ml-2 text-gray-800">{formatDate(selectedJob.estimated_date_repair_completion) || "-"}</span>
                </div>
              </div>
            </div>

            <div className="max-h-[200px]">
              {selectedJob.repairDetails?.length > 0 ? (
                <div className="max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg">
                  <table className=" whitespace-nowrap w-full text-base text-left text-gray-700">
                    <thead className="text-sm text-gray-800 uppercase bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th scope="col" className="px-6 py-4 font-bold">ชื่อการซ่อม</th>
                        <th scope="col" className="px-6 py-4 font-bold text-center">วันที่เสร็จ</th>
                        <th scope="col" className="px-6 py-4 font-bold text-center w-40">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedJob.repairDetails
                        .sort((a, b) => a.master_repair.master_repair_name.localeCompare(b.master_repair.master_repair_name, "th"))
                        .map((detail) => (
                          <tr
                            key={detail.id}
                            className="bg-white border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                            onClick={() => handleCheckboxChange(detail)}
                          >
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{detail.master_repair.master_repair_name}</td>
                            <td className="px-6 py-4 text-center">
                              {checkedItems[detail.id] && !detail.status_date
                                ? (<span className="font-semibold text-blue-600">{formatDate(pendingChanges[detail.id] || "")}</span>)
                                : detail.status_date
                                ? formatDate(detail.status_date)
                                : (<span className="text-gray-400">-</span>)
                              }
                            </td>
                            <td className="px-6 py-4 text-center align-middle">
                              <input
                                type="checkbox"
                                checked={!!detail.status_date || pendingChanges.hasOwnProperty(detail.id)}
                                onChange={() => {}}
                                className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <p className="text-gray-500">ไม่พบข้อมูลรายการซ่อม</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogComponent>
    </div>
  );
}