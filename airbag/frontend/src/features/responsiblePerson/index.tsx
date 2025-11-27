import { useState, useEffect } from "react";
import Buttons from "@/components/customs/button/button.main.component";
import { Tabs } from "@radix-ui/themes";
import {
  getResponsiblePersonsTypes,
  createResponsiblePerson,
  updateResponsiblePerson,
  getResponsiblePersons,
  getRepairReceiptDocuments,
  getSupplierDeliveryNoteDocuments, 
  getSupplierRepairReceiptDocuments,
  getSendForClaimDocuments,        
  getReceiveForClaimDocuments,   
  getRepairReceiptResponsibleUser,
  getSupplierDeliveryNoteResponsibleUser,
  getSupplierRepairReceiptResponsibleUser,
  getSendForClaimResponsibleUser,
  getReceiveForClaimResponsibleUser,
  updateMasterRepairReceiptResponsiblePerson,
  updateSupplierDeliveryNoteResponsiblePerson,
  updateSupplierRepairReceiptResponsiblePerson,
  updateSendForClaimResponsiblePerson,
  updateReceiveForClaimResponsiblePerson,
 } from "@/services/responsible-person.service";
import {
  getQuotationDoc,
  getQuotationResponsible_by,
  updateQuotation,
 } from "@/services/ms.quotation.service";
import {
  PayLoadCreateResponsiblePerson,
  PayLoadUpdateResponsiblePerson,
  ResponsiblePersonType,
 } from "@/types/requests/request.responsible-person";
import { getUsernamesAndIds  } from "@/services/user.service";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { TypeResponsiblePersonAll } from "@/types/response/response.responsible-person";
import { DocumentIdDocItem } from "@/types/response/response.responsible-person";

// --- 1. สร้าง Mapping Object ---
const jobTypeLabels: { [key: string]: string } = {
  [ResponsiblePersonType.QUOTATION]: "ใบเสนอราคา",
  [ResponsiblePersonType.REPAIR]: "ใบรับซ่อม",
  [ResponsiblePersonType.SUBMIT_SUB]: "ใบส่งซับพลายเออร์",
  [ResponsiblePersonType.RECEIVE_SUB]: "ใบรับซับพลายเออร์",
  [ResponsiblePersonType.SUBMIT_CLAIM]: "ใบส่งเคลม",
  [ResponsiblePersonType.RECEIVE_CLAIM]: "ใบรับเคลม",
};

// --- 2. สร้าง Helper Function ---
const getJobTypeLabel = (type: string): string => {
  return jobTypeLabels[type] || type; 
};


export default function TopCenteredTabsWithInput() {
  const [activeTab, setActiveTab] = useState("jobType");
  const [jobType, setJobType] = useState<ResponsiblePersonType | "">("");
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [documentNumber, setDocumentNumber] = useState("");
  const [assignee, setAssignee] = useState("");
  const [previousAssignee, setPreviousAssignee] = useState("");
  const [quotationsDocNumbers, setQuotationsDocNumbers] = useState<string[]>([]);
  const [usernames, setUsernames] = useState<User[]>([]);
  const [previousAssigneeId, setPreviousAssigneeId] = useState("");
  const [newAssigneeId, setNewAssigneeId] = useState("");
  const [quotationDocs, setQuotationDocs] = useState<QuotationDoc[]>([]);
  const [existingResponsiblePersonLog, setExistingResponsiblePersonLog] =
    useState<TypeResponsiblePersonAll | null>(null);
  const [documentList, setDocumentList] = useState<DocumentIdDocItem[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  

  const { showToast } = useToast();

  interface QuotationDoc {
    quotationId: string;
    quotationDoc: string;
  }

  interface User {
    id: string;
    username: string;
  }

  const handleSubmit = async () => {

    if (!jobType) {
      console.error("Validation Failed! JobType is missing.");
      showToast("กรุณาเลือกประเภทงาน", false);
      return;
    }

    try {
      if (
        !previousAssigneeId ||
        !newAssigneeId ||
        !selectedDocumentId ||
        !documentNumber
      ) {
        console.error(
          "Validation Failed! One or more required fields are missing."
        );
        showToast("กรุณาระบุข้อมูลให้ครบถ้วน", false);
        return;
      }

      const documentSpecificLogPayload: any = {};
      switch (jobType) {
        case ResponsiblePersonType.QUOTATION:
          documentSpecificLogPayload.quotation_id = selectedDocumentId;
          break;
        case ResponsiblePersonType.REPAIR:
          documentSpecificLogPayload.master_repair_receipt_id = selectedDocumentId;
          break;
        case ResponsiblePersonType.SUBMIT_SUB:
          documentSpecificLogPayload.supplier_delivery_note_id = selectedDocumentId;
          break;
        case ResponsiblePersonType.RECEIVE_SUB:
          documentSpecificLogPayload.supplier_repair_receipt_id = selectedDocumentId;
          break;
        case ResponsiblePersonType.SUBMIT_CLAIM:
          documentSpecificLogPayload.send_for_a_claim_id = selectedDocumentId;
          break;
        case ResponsiblePersonType.RECEIVE_CLAIM:
          documentSpecificLogPayload.receive_for_a_claim_id = selectedDocumentId;
          break;
      }

      if (!existingResponsiblePersonLog?.log_id) {
        const createPayload: PayLoadCreateResponsiblePerson = {
          type: jobType,
          docno: documentNumber,
          change_date: new Date(),
          before_by_id: previousAssigneeId,
          after_by_id: newAssigneeId,
          ...documentSpecificLogPayload,
        };
        await createResponsiblePerson(createPayload);
        showToast("บันทึกข้อมูลการเปลี่ยนแปลงผู้รับผิดชอบ (Log) สำเร็จ", true);
      } else {
        const updateLogPayload: PayLoadUpdateResponsiblePerson = {
          log_id: existingResponsiblePersonLog.log_id,
          docno: documentNumber,
          before_by_id: previousAssigneeId,
          after_by_id: newAssigneeId,
        };
        await updateResponsiblePerson(updateLogPayload); 
        showToast("อัพเดตข้อมูลการเปลี่ยนแปลงผู้รับผิดชอบ (Log) สำเร็จ", true);
      }

      switch (jobType) {
        case ResponsiblePersonType.QUOTATION:
          await updateQuotation(selectedDocumentId, {
            responsible_by: newAssigneeId,
          });
          showToast("ปรับปรุงผู้รับผิดชอบในใบเสนอราคาสำเร็จ", true);
          break;
        case ResponsiblePersonType.REPAIR:
          await updateMasterRepairReceiptResponsiblePerson(
            selectedDocumentId,
            newAssigneeId
          );
          showToast("ปรับปรุงผู้รับผิดชอบในใบรับซ่อมสำเร็จ", true);
          break;
        case ResponsiblePersonType.SUBMIT_SUB:
          await updateSupplierDeliveryNoteResponsiblePerson(
            selectedDocumentId,
            newAssigneeId
          );
          showToast("ปรับปรุงผู้รับผิดชอบในใบส่งซับพลายเออร์สำเร็จ", true);
          break;
        case ResponsiblePersonType.RECEIVE_SUB:
          await updateSupplierRepairReceiptResponsiblePerson(
            selectedDocumentId,
            newAssigneeId
          );
          showToast("ปรับปรุงผู้รับผิดชอบในใบรับซับพลายเออร์สำเร็จ", true);
          break;
        case ResponsiblePersonType.SUBMIT_CLAIM:
          await updateSendForClaimResponsiblePerson(
            selectedDocumentId,
            newAssigneeId
          );
          showToast("ปรับปรุงผู้รับผิดชอบในใบส่งเคลมสำเร็จ", true);
          break;
        case ResponsiblePersonType.RECEIVE_CLAIM:
          await updateReceiveForClaimResponsiblePerson(
            selectedDocumentId,
            newAssigneeId
          );
          showToast("ปรับปรุงผู้รับผิดชอบในใบรับเคลมสำเร็จ", true);
          break;
        default:
          console.warn(
            `Update responsible person logic for source document type "${getJobTypeLabel(
              jobType
            )}" not handled in handleSubmit's source document update section.`
          );
          showToast(`ยังไม่ได้ตั้งค่าการอัปเดตผู้รับผิดชอบสำหรับ ${getJobTypeLabel(jobType)}`, false);
          break;
      }

      // Reset form
      setActiveTab("jobType");
      setJobType("");
      setDocumentNumber("");
      setSelectedDocumentId("");
      setAssignee("");
      setPreviousAssignee("");
      setPreviousAssigneeId("");
      setNewAssigneeId("");
      setExistingResponsiblePersonLog(null);
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      const apiErrorMessage =
        error?.response?.data?.message || error?.data?.message;
      const generalErrorMessage =
        error?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
      showToast(apiErrorMessage || generalErrorMessage, false);
    }
  };


  const handleNext = () => {
    if (activeTab === "jobType") setActiveTab("documentNumber");
    else if (activeTab === "documentNumber") setActiveTab("changeAssignee");
  };

  const handlePrevious = () => {
    if (activeTab === "documentNumber") setActiveTab("jobType");
    else if (activeTab === "changeAssignee") setActiveTab("documentNumber");
  };

  const checkExistingResponsiblePerson = async (docIdToCheck: string, currentJobType: ResponsiblePersonType | "") => {
    if (!currentJobType || !docIdToCheck) {
      setExistingResponsiblePersonLog(null);
      return null;
    }
    try {
      const response = await getResponsiblePersons();
      const existingLog = response.data.find(logEntry => {
        if (logEntry.type !== currentJobType) return false;

        switch (currentJobType) {
          case ResponsiblePersonType.QUOTATION:
            return logEntry.quotation_id === docIdToCheck;
          case ResponsiblePersonType.REPAIR:
            return (logEntry as any).master_repair_receipt_id === docIdToCheck; 
          case ResponsiblePersonType.SUBMIT_SUB:
            return (logEntry as any).supplier_delivery_note_id === docIdToCheck;
          case ResponsiblePersonType.RECEIVE_SUB:
            return (logEntry as any).supplier_repair_receipt_id === docIdToCheck;
          case ResponsiblePersonType.SUBMIT_CLAIM:
            return (logEntry as any).send_for_a_claim_id === docIdToCheck;
          case ResponsiblePersonType.RECEIVE_CLAIM:
            return (logEntry as any).receive_for_a_claim_id === docIdToCheck;
          default:
            return false;
        }
      });
      setExistingResponsiblePersonLog(existingLog || null);
      return existingLog || null;
    } catch (error) {
      console.error("Error in checkExistingResponsiblePerson:", error);
      setExistingResponsiblePersonLog(null);
      return null;
    }
  };

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const response = await getUsernamesAndIds();
        const usernameList = response.map(
          (item: { employee_id: string; username: string }) => ({
            id: item.employee_id,
            username: item.username,
          })
        );
        setUsernames(usernameList);
      } catch (error) {
        console.error("Error fetching usernames and IDs:", error);
      }
    };

    fetchUsernames();
  }, []);

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUsername = e.target.value;
    setAssignee(selectedUsername);
    const selectedUser = usernames.find(
      (user) => user.username === selectedUsername
    );
    if (selectedUser) {
      setNewAssigneeId(selectedUser.id);
    } else {
      console.warn("No user found for the selected username");
      setNewAssigneeId("");
    }
  };

  const handleDocumentNumberChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDocNumber = e.target.value;
    setDocumentNumber(selectedDocNumber);

    let foundId: string | undefined = undefined;

    if (jobType === ResponsiblePersonType.QUOTATION) {
      const selectedQuotationObject = quotationDocs.find(
        (doc) => doc.quotationDoc === selectedDocNumber
      );
      if (selectedQuotationObject) {
        foundId = selectedQuotationObject.quotationId;
      }
    } else {
      const selectedDocObject = documentList.find(
        (docItem) => docItem.doc === selectedDocNumber
      );
      if (selectedDocObject) {
        foundId = selectedDocObject.id;
      }
    }

    if (foundId) {
      setSelectedDocumentId(foundId); 
    } else {
      setSelectedDocumentId("");
      console.warn(
        `No document ID found for doc number: ${selectedDocNumber} of type ${getJobTypeLabel(
          jobType
        )}`
      );
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const typesData: string[] = await getResponsiblePersonsTypes(
          1,
          50
        );
        setJobTypes([...new Set(typesData)]);
      } catch (error) {
        console.error("Error fetching job types:", error);
        setJobTypes([]);
      }

      try {
        const response = await getQuotationDoc();
        if (response.success && response.data) {
          setQuotationDocs(response.data); // เก็บ object { quotationId, quotationDoc }
          const docs = response.data.map((item) => item.quotationDoc);
          setQuotationsDocNumbers(docs);
        } else {
          console.error(
            "Failed to fetch quotation docs or data is missing:",
            response.message
          );
          setQuotationDocs([]);
          setQuotationsDocNumbers([]);
        }
      } catch (error) {
        console.error("Error fetching initial quotation docs:", error);
        setQuotationDocs([]);
        setQuotationsDocNumbers([]);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchDocumentsForSelectedJobType = async () => {
      if (!jobType) return;
      setDocumentList([]); // Clear list เก่า
      setDocumentNumber(""); // Clear เลขที่เอกสารที่เลือก
      setSelectedDocumentId(""); // Clear ID เอกสารที่เลือก

      if (jobType === ResponsiblePersonType.QUOTATION) {
        // Quotations ถูก fetch ไปแล้วใน initial data, ไม่ต้องทำอะไรที่นี่อีก
        // ถ้า quotationsDocNumbers ว่าง ก็แสดงว่าไม่มีข้อมูล
        if (quotationsDocNumbers.length === 0) {
            showToast(`ไม่พบข้อมูล${getJobTypeLabel(jobType)}`, true);
        }
        return;
      }

      try {
        let docs: DocumentIdDocItem[] = [];
        switch (jobType) {
          case ResponsiblePersonType.REPAIR:
            docs = await getRepairReceiptDocuments();
            break;
          case ResponsiblePersonType.SUBMIT_SUB:
            docs = await getSupplierDeliveryNoteDocuments();
            break;
          case ResponsiblePersonType.RECEIVE_SUB:
            docs = await getSupplierRepairReceiptDocuments();
            break;
          case ResponsiblePersonType.SUBMIT_CLAIM:
            docs = await getSendForClaimDocuments();
            break;
          case ResponsiblePersonType.RECEIVE_CLAIM:
            docs = await getReceiveForClaimDocuments();
            break;
          default:
            console.warn("Unknown job type for fetching documents:", jobType);
            docs = [];
        }
        setDocumentList(docs);
        if (docs.length === 0) {
          showToast(`ไม่พบข้อมูล${getJobTypeLabel(jobType)}`, true);
        }
      } catch (error) {
        console.error(
          `Error fetching documents for job type ${getJobTypeLabel(jobType)}:`,
          error
        );
        showToast(
          `เกิดข้อผิดพลาดในการดึงรายการ${getJobTypeLabel(jobType)}`,
          false
        );
        setDocumentList([]);
      }
    };

    fetchDocumentsForSelectedJobType();
  }, [jobType, showToast, quotationsDocNumbers]);

  useEffect(() => {
    const fetchResponsibleByAndCheckExistingLog = async () => {
      if (!jobType || !selectedDocumentId) { // ตรวจสอบว่า jobType ไม่ใช่ ""
        setPreviousAssignee("");
        setPreviousAssigneeId("");
        setExistingResponsiblePersonLog(null);
        return;
      }
      try {
        let fetchedResponsibleInfo: {
          employee_id: string;
          username: string;
        } | null = null;

        // การดึงผู้รับผิดชอบคนปัจจุบันจาก "เอกสารต้นทาง"
        switch (jobType) {
          case ResponsiblePersonType.QUOTATION:
            // getQuotationResponsible_by อาจจะรับ ID หรือ doc number, ต้องดู implementation
            // ถ้า getQuotationResponsible_by รับ doc number, ต้องหา doc number จาก selectedDocumentId ก่อน
            const qtnDoc = quotationDocs.find(q => q.quotationId === selectedDocumentId);
            if (qtnDoc) {
                const response = await getQuotationResponsible_by(qtnDoc.quotationDoc); // สมมติว่ารับ doc number
                const quotationResponsibleData = Array.isArray(response)
                ? response.find((item) => item.responsible_by)
                : response;
                if (quotationResponsibleData && quotationResponsibleData.responsible_by) {
                    fetchedResponsibleInfo = {
                    employee_id: quotationResponsibleData.responsible_by,
                    username: quotationResponsibleData.username || "ไม่พบชื่อผู้ใช้",
                    };
                }
            }
            break;
          case ResponsiblePersonType.REPAIR:
            fetchedResponsibleInfo = await getRepairReceiptResponsibleUser(selectedDocumentId);
            break;
          case ResponsiblePersonType.SUBMIT_SUB:
            fetchedResponsibleInfo = await getSupplierDeliveryNoteResponsibleUser(selectedDocumentId);
            break;
          case ResponsiblePersonType.RECEIVE_SUB:
            fetchedResponsibleInfo = await getSupplierRepairReceiptResponsibleUser(selectedDocumentId);
            break;
          case ResponsiblePersonType.SUBMIT_CLAIM:
            fetchedResponsibleInfo = await getSendForClaimResponsibleUser(selectedDocumentId);
            break;
          case ResponsiblePersonType.RECEIVE_CLAIM:
            fetchedResponsibleInfo = await getReceiveForClaimResponsibleUser(selectedDocumentId);
            break;
          default:
            console.warn(
              `FETCH_RESPONSIBLE_USER_EFFECT: No specific responsible person fetch logic implemented for job type: ${getJobTypeLabel(
                jobType
              )}`
            );
        }

        if (fetchedResponsibleInfo && fetchedResponsibleInfo.employee_id) {
          setPreviousAssignee(
            fetchedResponsibleInfo.username || "ไม่พบชื่อผู้ใช้"
          );
          setPreviousAssigneeId(fetchedResponsibleInfo.employee_id);
        } else {
          setPreviousAssignee("ยังไม่มีข้อมูล"); // หรือ "N/A"
          setPreviousAssigneeId("");
        }

        // ตรวจสอบ log ที่มีอยู่สำหรับเอกสารนี้
        await checkExistingResponsiblePerson(selectedDocumentId, jobType);

      } catch (error) {
        console.error(
          "FETCH_RESPONSIBLE_USER_EFFECT: Error fetching previous responsible person data:",
          error
        );
        setPreviousAssignee("เกิดข้อผิดพลาด");
        setPreviousAssigneeId("");
        setExistingResponsiblePersonLog(null);
      }
    };

    if (documentNumber && selectedDocumentId && jobType) {
      fetchResponsibleByAndCheckExistingLog();
    } else {
      setPreviousAssignee("");
      setPreviousAssigneeId("");
      setExistingResponsiblePersonLog(null);
    }
  }, [jobType, documentNumber, selectedDocumentId, quotationDocs]); 

  useEffect(() => {
    const testAllDocumentFetchFunctions = async () => {

      try {
        const repairs = await getRepairReceiptDocuments();
      } catch (e) { console.error("Error fetching Repair Receipts:", e); }

      try {
        const submitSub = await getSupplierDeliveryNoteDocuments();
      } catch (e) { console.error("Error fetching Supplier Delivery Notes:", e); }

      try {
        const receiveSub = await getSupplierRepairReceiptDocuments();
      } catch (e) { console.error("Error fetching Supplier Repair Receipts:", e); }

      try {
        const submitClaim = await getSendForClaimDocuments();
      } catch (e) { console.error("Error fetching Send For Claims:", e); }

      try {
        const receiveClaim = await getReceiveForClaimDocuments();
      } catch (e) { console.error("Error fetching Receive For Claims:", e); }
    };

    testAllDocumentFetchFunctions();

  }, []);

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-6 p-0 bg-white w-full h-screen" // Consider removing h-screen for better layout flow
    >
      <Tabs.List className="flex justify-center space-x-4 border-b-2 pb-2">
        <Tabs.Trigger
          value="jobType"
          className={`px-6 py-2 text-lg font-semibold transition-all ${
            activeTab === "jobType"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-700 hover:text-blue-600"
          }`}
        >
          ประเภทงาน
        </Tabs.Trigger>
        <Tabs.Trigger
          value="documentNumber"
          disabled={!jobType}
          className={`px-6 py-2 text-lg font-semibold transition-all ${
            activeTab === "documentNumber"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-700 hover:text-blue-600"
          } ${!jobType ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          เลขที่เอกสาร
        </Tabs.Trigger>
        <Tabs.Trigger
          value="changeAssignee"
          disabled={!jobType || !documentNumber || !selectedDocumentId}
          className={`px-6 py-2 text-lg font-semibold transition-all ${
            activeTab === "changeAssignee"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-700 hover:text-blue-600"
          } ${
            !jobType || !documentNumber || !selectedDocumentId
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          เปลี่ยนผู้รับผิดชอบ
        </Tabs.Trigger>
      </Tabs.List>

      {/* Tab Content: Job Type */}
      <Tabs.Content value="jobType" className="text-center text-lg">
        <div className="space-y-4 p-6 flex flex-col items-center">
          <label
            htmlFor="jobTypeSelect"
            className="font-semibold text-gray-700 mb-2"
          >
            เลือกประเภทงาน
          </label>
          <select
            id="jobTypeSelect"
            value={jobType}
            onChange={(e) => setJobType(e.target.value as ResponsiblePersonType | "")}
            className="w-full max-w-xs p-2 border rounded-md text-gray-700"
          >
            <option value="" disabled>
              -- กรุณาเลือกประเภทงาน --
            </option>
            {jobTypes.map((type, index) => (
              <option key={index} value={type}>
                {getJobTypeLabel(type)}
              </option>
            ))}
          </select>
          <div className="flex justify-end w-full max-w-md mt-6">
            <Buttons btnType="submit" onClick={handleNext} disabled={!jobType}>
              ถัดไป
            </Buttons>
          </div>
        </div>
      </Tabs.Content>

      {/* Tab Content: Document Number */}
      <Tabs.Content value="documentNumber" className="text-center text-lg">
        {jobType && (
          <div className="space-y-4 p-6 flex flex-col items-center">
            <p className="text-gray-600">
              ประเภทงาน:{" "}
              <span className="font-semibold text-black">
                {getJobTypeLabel(jobType)}
              </span>
            </p>
            <label
              htmlFor="documentNumberSelect"
              className="font-semibold text-gray-700 mb-2"
            >
              เลือกเลขที่{getJobTypeLabel(jobType)}
            </label>
            <select
              id="documentNumberSelect"
              value={documentNumber}
              onChange={handleDocumentNumberChange}
              className="w-full max-w-xs p-2 border rounded-md text-gray-700"
              disabled={
                (jobType === ResponsiblePersonType.QUOTATION &&
                  quotationsDocNumbers.length === 0) ||
                (jobType !== ResponsiblePersonType.QUOTATION &&
                  documentList.length === 0)
              }
            >
              <option value="" disabled>
                -- กรุณาเลือกเลขที่{getJobTypeLabel(jobType)} --
              </option>
              {(jobType === ResponsiblePersonType.QUOTATION && quotationsDocNumbers.length === 0 && (<option disabled>กำลังโหลด หรือ ไม่มีข้อมูล...</option>))}
              {(jobType !== ResponsiblePersonType.QUOTATION && documentList.length === 0 && (<option disabled>กำลังโหลด หรือ ไม่มีข้อมูล...</option>))}

              {jobType === ResponsiblePersonType.QUOTATION &&
                quotationsDocNumbers.map((docString, index) => (
                  <option key={index} value={docString}>
                    {docString}
                  </option>
                ))}

              {jobType !== ResponsiblePersonType.QUOTATION &&
                documentList.map((docItem) => (
                  <option key={docItem.id} value={docItem.doc}>
                    {docItem.doc}
                  </option>
                ))}
            </select>
            <div className="flex justify-between w-full max-w-md mt-6">
              <Buttons btnType="default" onClick={handlePrevious}>
                ย้อนกลับ
              </Buttons>
              <Buttons
                btnType="submit"
                onClick={handleNext}
                disabled={!documentNumber || !selectedDocumentId}
              >
                ถัดไป
              </Buttons>
            </div>
          </div>
        )}
      </Tabs.Content>

      {/* Tab Content: Change Assignee */}
      <Tabs.Content value="changeAssignee" className="text-lg p-6">
        {jobType && documentNumber && selectedDocumentId && (
          <div className="space-y-6">
            <div className="space-y-2 bg-gray-50 p-4 rounded-md shadow-sm">
              <p className="text-gray-700 font-medium">
                ประเภทงาน:{" "}
                <span className="text-black font-semibold">
                  {getJobTypeLabel(jobType)}
                </span>
              </p>
              <p className="text-gray-700 font-medium">
                เลขที่{getJobTypeLabel(jobType)}:{" "}
                <span className="text-black font-semibold">
                  {documentNumber}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-white p-4 border rounded-md">
                <p className="text-gray-800 font-bold mb-2 border-b pb-1">
                  ผู้รับผิดชอบคนก่อน
                </p>
                <p className="text-gray-700 text-lg pt-2">
                  {previousAssignee || "ยังไม่มีข้อมูล"}
                </p>
              </div>

              <div className="bg-white p-4 border rounded-md">
                <label
                  htmlFor="assigneeSelect"
                  className="block text-gray-800 font-bold mb-2 border-b pb-1"
                >
                  ผู้รับผิดชอบคนใหม่
                </label>
                <select
                  id="assigneeSelect"
                  value={assignee}
                  onChange={handleAssigneeChange}
                  className="w-full p-2 border rounded-md text-gray-700 mt-2"
                >
                  <option value="" disabled>
                    -- กรุณาเลือกชื่อผู้รับผิดชอบ --
                  </option>
                  {usernames
                    .filter((user) => user.id !== previousAssigneeId) // Filter out the previous assignee
                    .map((user) => (
                      <option key={user.id} value={user.username}>
                        {user.username}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Buttons btnType="default" onClick={handlePrevious}>
                ย้อนกลับ
              </Buttons>
              <Buttons
                btnType="submit"
                disabled={
                  !assignee ||
                  !newAssigneeId ||
                  newAssigneeId === previousAssigneeId
                }
                onClick={handleSubmit}
              >
                บันทึกการเปลี่ยนแปลง
              </Buttons>
            </div>
          </div>
        )}
      </Tabs.Content>
    </Tabs.Root>
  );
}