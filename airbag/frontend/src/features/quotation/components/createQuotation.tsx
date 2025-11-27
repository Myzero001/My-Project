import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { QUOTATION_ALL } from "@/types/response/response.quotation";
import { useState } from "react";
import { getQuotationById, updateQuotation, deleteQuotation } from "@/services/ms.quotation.service";
import { ToastProvider } from "@/components/customs/alert/ToastContext";
import { Card, Flex, Button, Text, TextArea, TextField } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

const CreateQuotation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const customerCode = location.state?.customer_code;
    const quotationId = location.state?.quotation_id;
    const quotationDoc = location.state?.quotation_doc;

    const [quotationData, setQuotationData] = useState<QUOTATION_ALL | null>(null);

    useEffect(() => {
        const fetchQuotationData = async () => {
            if (!quotationId || !quotationDoc) return;
            try {
                const res = await getQuotationById(quotationId); 
                // @ts-ignore
                setQuotationData(res);
            } catch (error) {
                console.error("Error fetching quotation data:", error);
            }
        };
        fetchQuotationData();
    }, [quotationId, quotationDoc]);

    //--------------------------------------------------------------------แก้ไขข้อมูลที่ช่อง

const [quotationDate, setQuotationDate] = useState("");
const [customerPrefix, setCustomerPrefix] = useState("");
const [customerName, setCustomerName] = useState("");
const [contactName, setContactName] = useState("");
const [contactNumber, setContactNumber] = useState("");
const [lineId, setLineId] = useState("");
const [position, setPosition] = useState("");
const [addrNumber, setAddrNumber] = useState("");
const [addrAlley, setAddrAlley] = useState("");
const [addrStreet, setAddrStreet] = useState("");
const [addrSubdistrict, setAddrSubdistrict] = useState("");
const [addrDistrict, setAddrDistrict] = useState("");
const [addrProvince, setAddrProvince] = useState("");
const [addrPostcode, setAddrPostcode] = useState("");
const [brandName, setBrandName] = useState("");
const [modelName, setModelName] = useState("");
const [carYear, setCarYear] = useState("");
const [colorName, setColorName] = useState("");
const [totalPrice, setTotalPrice] = useState(0);
const [tax, setTax] = useState(0);
const [deadlineDay, setDeadlineDay] = useState(0);
const [deadlineDate, setDeadlineDate] = useState("");
const [appointmentDate, setAppointmentDate] = useState("");
const [remark, setRemark] = useState("");
const [responsiblePerson, setResponsiblePerson] = useState("");
const [responsiblePersonDate, setResponsiblePersonDate] = useState("");
const [lock, setLock] = useState(false);
const [reviseAt, setReviseAt] = useState("");
const [reviseBy, setReviseBy] = useState("");
const [approvalRequest, setApprovalRequest] = useState(false);
const [approvalRequestDate, setApprovalRequestDate] = useState("");
const [approvalRequestBy, setApprovalRequestBy] = useState("");
const [approvalStatus, setApprovalStatus] = useState("");
const [approvalDate, setApprovalDate] = useState("");
const [approvalBy, setApprovalBy] = useState("");
const [approvalNotes, setApprovalNotes] = useState("");
const [dealClosedStatus, setDealClosedStatus] = useState(false);
const [dealClosedAt, setDealClosedAt] = useState("");
const [dealClosedBy, setDealClosedBy] = useState("");
const [createdAt, setCreatedAt] = useState("");
const [createdBy, setCreatedBy] = useState("");
const [updatedAt, setUpdatedAt] = useState("");
const [updatedBy, setUpdatedBy] = useState("");

useEffect(() => {
    if (quotationData) {
        setQuotationDate(quotationData.quotation_date || ""); 
        // @ts-ignore
        setCustomerPrefix(quotationData.customer_prefix || "");
        setCustomerName(quotationData.customer_name || "");
        // @ts-ignore
        setContactName(quotationData.contact_name || "");
        setContactNumber(quotationData.contact_number || "");
        setLineId(quotationData.line_id || "");
        setPosition(quotationData.position || "");
        setAddrNumber(quotationData.addr_number || "");
        setAddrAlley(quotationData.addr_alley || "");
        setAddrStreet(quotationData.addr_street || "");
        setAddrSubdistrict(quotationData.addr_subdistrict || "");
        setAddrDistrict(quotationData.addr_district || "");
        setAddrProvince(quotationData.addr_province || "");
        setAddrPostcode(quotationData.addr_postcode || "");
        // @ts-ignore
        setBrandName(quotationData.brand_name || "");
        // @ts-ignore
        setModelName(quotationData.model_name || "");
        setCarYear(quotationData.car_year || "");
        // @ts-ignore
        setColorName(quotationData.color_name || "");
        // @ts-ignore
        setTotalPrice(quotationData.total_price || 0);
        setTax(quotationData.tax || 0);
        setDeadlineDay(quotationData.deadline_day || 0);
        // @ts-ignore
        setDeadlineDate(quotationData.deadline_date || "");
        setAppointmentDate(quotationData.appointment_date || "");
        setRemark(quotationData.remark || "");
        // @ts-ignore
        setResponsiblePerson(quotationData.responsible_person || "");
        // @ts-ignore
        setResponsiblePersonDate(quotationData.responsible_person_date || "");
        setLock(quotationData.lock || false);
        // @ts-ignore
        setReviseAt(quotationData.revise_at || "");
        // @ts-ignore
        setReviseBy(quotationData.revise_by || "");
        // @ts-ignore
        setApprovalRequest(quotationData.approval_request || false);
        // @ts-ignore
        setApprovalRequestDate(quotationData.approval_request_date || "");
        // @ts-ignore
        setApprovalRequestBy(quotationData.approval_request_by || "");
        // @ts-ignore
        setApprovalStatus(quotationData.approval_status || "");
        setApprovalDate(quotationData.approval_date || "");
        setApprovalBy(quotationData.approval_by || "");
        setApprovalNotes(quotationData.approval_notes || "");
        // @ts-ignore
        setDealClosedStatus(quotationData.deal_closed_status || false);
        // @ts-ignore
        setDealClosedAt(quotationData.deal_closed_at || "");
        setDealClosedBy(quotationData.deal_closed_by || "");
        setCreatedAt(quotationData.created_at || "");
        setCreatedBy(quotationData.created_by || "");
        setUpdatedAt(quotationData.updated_at || "");
        setUpdatedBy(quotationData.updated_by || "");
    }
}, [quotationData]);

//----------------------------------------------บันทึกข้อมูล------update------------------------------------------
// ฟังก์ชันที่จะเรียกใช้เมื่อกดปุ่มบันทึกข้อมูล

const handleSave = async () => {
    const data = {
        quotation_id: quotationId,
        quotation_doc: quotationDoc,
        quotation_date: quotationDate,
        customer_code: customerCode,
        customer_prefix: customerPrefix,
        customer_name: customerName,
        contact_name: contactName,
        contact_number: contactNumber,
        line_id: lineId,
        position: position,
        addr_number: addrNumber,
        addr_alley: addrAlley,
        addr_street: addrStreet,
        addr_subdistrict: addrSubdistrict,
        addr_district: addrDistrict,
        addr_province: addrProvince,
        addr_postcode: addrPostcode,
        brand_name: brandName,
        model_name: modelName,
        car_year: carYear,
        color_name: colorName,
        total_price: totalPrice,
        tax: tax,
        deadline_day: deadlineDay,
        deadline_date: deadlineDate,
        appointment_date: appointmentDate,
        remark: remark,
        responsible_person: responsiblePerson,
        responsible_person_date: responsiblePersonDate,
        lock: lock,
        revise_at: reviseAt,
        revise_by: reviseBy,
        approval_request: approvalRequest,
        approval_request_date: approvalRequestDate,
        approval_request_by: approvalRequestBy,
        approval_status: approvalStatus,
        approval_date: approvalDate,
        approval_by: approvalBy,
        approval_notes: approvalNotes,
        deal_closed_status: dealClosedStatus,
        deal_closed_at: dealClosedAt,
        deal_closed_by: dealClosedBy,
        created_at: createdAt,
        created_by: createdBy,
        updated_at: updatedAt,
        updated_by: updatedBy,
    };

    try {
        // เรียก API เพื่อติดต่อ backend
        const response = await updateQuotation(data.quotation_id ,data); // ฟังก์ชันที่ใช้ติดต่อ backend
        if (response) {
            console.log("ข้อมูล quotation ถูกบันทึกเรียบร้อยแล้ว:", response);
            // อาจจะแสดงข้อความแจ้งเตือน หรือเปลี่ยนหน้าไปที่หน้าอื่น
            navigate('/quotations'); // เปลี่ยนเส้นทางเมื่อบันทึกเสร็จ
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล quotation:", error);
        // อาจแสดงข้อความข้อผิดพลาด
    }
};

const handleDelete = async (quotationId: string, quotationDoc: string) => {
    try {
        if (!quotationId || !quotationDoc) {
            console.warn("Quotation ID หรือ Quotation Doc ไม่ครบถ้วน");
            return;
        }

        const response = await deleteQuotation(quotationId);

        if (response) {
            console.log("ลบข้อมูล quotation สำเร็จ:", response);

            alert("ลบข้อมูลสำเร็จ");
            navigate('/quotations');
        } else {
            console.error("ไม่สามารถลบข้อมูลได้");
            alert("ไม่สามารถลบข้อมูลได้");
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
};

return (
    <div>
        <ToastProvider>
            <div className="container w-full m-auto">
                <Text size="6" weight="bold" className="text-center">
                    ข้อมูลใบเสนอราคา
                </Text>
                <Card variant="surface" className="w-full mt-2 rounded-none bg-white relative overflow-visible px-6 space-y-4">
                    {/* บรรทัดที่ 1 */}
                    <Flex className="justify-between space-x-2 w-full">
                        <div className="flex items-center gap-2 w-8/12">
                            <Text>รหัสลูกค้า</Text>
                            <TextField.Root
                                disabled
                                className=" rounded px-2 py-1 w-9/12"
                                value={customerCode}
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-2 ">
                            <Text>วันที่</Text>
                            <TextField.Root
                                type="date"
                                disabled
                                className=" rounded px-2 py-1 text-center"
                                value={
                                    quotationData?.created_at
                                        ? new Date(quotationData.created_at).toISOString().split("T")[0]
                                        : ""
                                }
                            />
                        </div>
                    </Flex>
                    {/* บรรทัดที่ 2 */}
                    <Flex className="justify-start space-x-2">
                        <div className="flex items-center gap-2 w-full">
                            <Text>ชื่อลูกค้า</Text> &nbsp;
                            <TextField.Root
                                className=" rounded px-2 py-1 w-7/12"
                                value={customerName}
                                type="text"
                                autoFocus
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                            <Text>Line ID</Text>
                            <TextField.Root
                                className=" rounded px-2 py-1 w-3/12"
                                value={lineId}
                                type="text"
                                onChange={(e) => setLineId(e.target.value)}
                            />
                        </div>
                    </Flex>
                    {/* บรรทัดที่ 3 */}
                    <Flex className="justify-start space-x-2">
                        <div className="flex items-center gap-2 w-full">
                            <Text>ชื่อผู้ติดต่อ</Text>
                            <TextField.Root
                                className=" rounded px-2 py-1 w-7/12"
                                value={customerName}
                                type="text"
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                            <Text>เบอร์โทรติดต่อ</Text>
                            <TextField.Root
                                className="rounded px-2 py-1 w-2/12"
                                value={contactNumber}
                                type="tel"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    if (value.length <= 10) {
                                        setContactNumber(value);
                                    }
                                }}
                            />

                        </div>
                    </Flex>
                    {/* บรรทัดที่ 4 */}
                    <Flex className="justify-start space-x-2">
                        <div className="flex items-center gap-2 w-full">
                            <Text>ที่อยู่</Text>
                            <Text>เลขที่</Text>
                            <TextField.Root
                                className=" rounded px-2 py-1 w-1/12 min-w-[40px]"
                                value={addrNumber}
                                type="text"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); // เอาเฉพาะตัวเลข
                                    if (value.length <= 10) {
                                        setAddrNumber(value);
                                    }
                                }}
                            />
                            <Text>ซอย</Text>
                            <TextField.Root
                                className=" rounded px-2 py-1 min-w-[50px]"
                                value={addrAlley}
                                type="text"
                                onChange={(e) => setAddrAlley(e.target.value)}
                            />
                            <Text>ถนน</Text>
                            <TextField.Root
                                className=" rounded px-2 py-1 w-3/12 min-w-[50px]"
                                value={addrStreet}
                                type="text"
                                onChange={(e) => setAddrStreet(e.target.value)}
                            />
                            <Text>ตำบล/แขวง</Text>
                            <TextField.Root
                                className=" rounded px-2 py-1 w-3/12 min-w-[50px]"
                                value={addrSubdistrict}
                                type="text"
                                onChange={(e) => setAddrSubdistrict(e.target.value)}
                            />
                        </div>
                    </Flex>
                    {/* บรรทัดที่ 5 */}
                    <Flex className="justify-start space-x-2">
                        <div className="flex items-center gap-2 w-full">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Text>อําเภอ/เขต</Text>
                            <TextField.Root
                                className=" rounded px-2 py-1 w-3/12 min-w-[60px]"
                                value={addrDistrict}
                                type="text"
                                onChange={(e) => setAddrDistrict(e.target.value)}
                            />
                            <Text>จังหวัด</Text>
                            <TextField.Root
                                className=" rounded px-2 py-1 w-3/12 min-w-[60px]"
                                value={addrProvince}
                                type="text"
                                onChange={(e) => setAddrProvince(e.target.value)}
                            />
                            <Text>รหัสไปรษณีย์</Text>
                            <TextField.Root
                                className=" rounded px-2 py-1 w-2/12 min-w-[60px]"
                                value={addrPostcode}
                                type="text"
                                maxLength={5}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); // เอาเฉพาะตัวเลข
                                    if (value.length <= 10) {
                                        setAddrPostcode(value);
                                    }
                                }}

                            />
                        </div>
                    </Flex>
                    {/* บรรทัดที่ 7 */}
                    <Flex className="justify-start space-x-2">
                        <div className="flex flex-col items-left gap-2 w-full">
                            <Text>หมายเหตุ</Text>
                            <TextArea
                                className=" rounded px-2 py-1 w-full min-h-[100px] focus:-blue-500 focus:outline-none"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </div>
                    </Flex>
                    <Flex gap="3" justify="end" className="ml-5 mr-5 mb-5 pt-3 mt-5">
                        <Button
                            size="2"
                            className="px-4 py-4 text-white bg-red-700 hover:bg-red-600 rounded-lg"
                            onClick={() => handleDelete(quotationId, quotationDoc)}
                        >
                            ลบข้อมูล
                        </Button>
                        <Button
                            size="2"
                            className="px-4 py-4 text-white bg-save rounded-lg hover:bg-[#28a745]"
                            onClick={handleSave}

                        >
                            บันทึกข้อมูล
                        </Button>
                    </Flex>
                </Card>
            </div>
        </ToastProvider>
    </div>
);
};

export default CreateQuotation;