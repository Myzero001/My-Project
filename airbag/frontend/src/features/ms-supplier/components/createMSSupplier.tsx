import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TypeMasterSupplierAll } from "@/types/response/response.ms-supplier";
import { useState } from "react";
// @ts-ignore
import { getMSSupplierById, updateMSSupplier, updateIsDeletedMSSupplier } from "@/services/ms.Supplier";
import { ToastProvider } from "@/components/customs/alert/ToastContext";
import { Card, Flex, Text, TextArea, TextField } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import Buttons from "@/components/customs/button/button.main.component";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import { useToast } from "@/components/customs/alert/toast.main.component";

const CreateSupplier = () => {

    const navigate = useNavigate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const { showToast } = useToast();
    const location = useLocation();
    const supplierCode = location.state?.supplier_code;
    const [supplierData, setSupplierData] = useState<TypeMasterSupplierAll | null>(null);


    const fetchSupplierData = async () => {
        if (!supplierCode) return;
        try {
            const res = await getMSSupplierById(supplierCode);
            setSupplierData(res.responseObject);
        } catch (error) {
            console.error("Error fetching supplier data:", error);
        }
    };
    useEffect(() => {
        fetchSupplierData();
    }, [supplierCode]);

    const handleClickToNavigate = () => {
        navigate(`/ms-supplier`);
    };
    //--------------------------------------------------------------------แก้ไขข้อมูลที่ช่อง

    const [msSupplierName, setMsSupplierName] = useState("");
    const [msSupplierContactName, setMsSupplierContactName] = useState("");
    const [msSupplierContactNumber, setMsSupplierContactNumber] = useState("");
    const [msSupplierLineId, setMsSupplierLineId] = useState("");
    const [msSupplierAddrNumber, setMsSupplierAddrNumber] = useState("");
    const [msSupplierAddrAlley, setMsSupplierAddrAlley] = useState("");
    const [msSupplierAddrStreet, setMsSupplierAddrStreet] = useState("");
    const [msSupplierAddrSubdistrict, setMsSupplierAddrSubdistrict] = useState("");
    const [msSupplierAddrDistrict, setMsSupplierAddrDistrict] = useState("");
    const [msSupplierAddrProvince, setMsSupplierAddrProvince] = useState("");
    const [msSupplierAddrPcode, setMsSupplierAddrPcode] = useState("");
    const [msSupplierPaymentTerm, setMsSupplierPaymentTerm] = useState("");
    const [msSupplierPaymentTermDay, setMsSupplierPaymentTermDay] = useState(0);
    const [msSupplierRemark, setMsSupplierRemark] = useState("");
    const [msSupplierBusinessType, setMsSupplierBusinessType] = useState("");

    useEffect(() => {
        if (supplierData) {
            setMsSupplierName(supplierData.supplier_name || "");
            setMsSupplierContactName(supplierData.contact_name || "");
            setMsSupplierContactNumber(supplierData.contact_number || "");
            setMsSupplierLineId(supplierData.line_id || "");
            setMsSupplierAddrNumber(supplierData.addr_number || "");
            setMsSupplierAddrAlley(supplierData.addr_alley || "");
            setMsSupplierAddrStreet(supplierData.addr_street || "");
            setMsSupplierAddrSubdistrict(supplierData.addr_subdistrict || "");
            setMsSupplierAddrDistrict(supplierData.addr_district || "");
            setMsSupplierAddrProvince(supplierData.addr_province || "");
            setMsSupplierAddrPcode(supplierData.addr_postcode || "");
            setMsSupplierPaymentTerm(supplierData.payment_terms || "");
            setMsSupplierPaymentTermDay(supplierData.payment_terms_day || 0);
            setMsSupplierRemark(supplierData.remark || "");
            setMsSupplierBusinessType(supplierData.business_type || "");
        }
    }, [supplierData]);
    //----------------------------------------------บันทึกข้อมูล------update------------------------------------------
    // ฟังก์ชันที่จะเรียกใช้เมื่อกดปุ่มบันทึกข้อมูล
    const handleSave = async () => {

        if (!msSupplierName) {
            showToast("กรุณาระบุชื่อร้านค้า", false);
            return;
        } else if (!msSupplierContactName) {
            showToast("กรุณาระบุชื่อผู้ติดต่อ", false);
            return;
        } else if (!msSupplierContactNumber) {
            showToast("กรุณาระบุเบอร์โทรศัพท์", false);
            return;
        } else if (!msSupplierBusinessType) {
            showToast("กรุณาระบุประเภทกิจการ", false);
            return;
        }
        const data = {
            supplier_code: supplierCode,
            supplier_name: msSupplierName,
            contact_name: msSupplierContactName,
            contact_number: msSupplierContactNumber,
            line_id: msSupplierLineId,
            addr_number: msSupplierAddrNumber,
            addr_alley: msSupplierAddrAlley,
            addr_street: msSupplierAddrStreet,
            addr_subdistrict: msSupplierAddrSubdistrict,
            addr_district: msSupplierAddrDistrict,
            addr_province: msSupplierAddrProvince,
            addr_postcode: msSupplierAddrPcode,
            payment_terms: msSupplierPaymentTerm,  // "เงินสด" หรือ "เครดิต"
            payment_terms_day: msSupplierPaymentTermDay, // จำนวนวัน
            remark: msSupplierRemark,
            business_type: msSupplierBusinessType,
        };

        try {
            // เรียก API เพื่อติดต่อ backend
            const response = await updateMSSupplier(data);
            if (response) {
                console.log("ข้อมูลถูกบันทึกเรียบร้อยแล้ว:", response);
                showToast("บันทึกข้อมูลเรียบร้อยแล้ว", true);
                navigate('/ms-supplier');
            }
        } catch (error) {
            showToast("ไม่สามารถบันทึกข้อมูลได้", false);
        }
    };
    const handleDeleteConfirm = async () => {
        if (!supplierCode) {
            showToast("กรุณาระบุรายการร้านค้าที่ต้องการลบ", false);
            return;
        }

        try {
            const response = await updateIsDeletedMSSupplier({ supplier_code: supplierCode });  // ส่ง issue_reason_id ที่ถูกต้อง

            if (response.statusCode === 200) {
                showToast("ลบรายการร้านค้าเรียบร้อยแล้ว", true);
                setIsDeleteDialogOpen(false);  // ปิด Dialog ลบ
                fetchSupplierData  // รีเฟรชรายการ
            } else {
                showToast("ไม่สามารถลบรายการร้านค้าได้", false);
            }
        } catch (error) {
            showToast("ไม่สามารถลบรายการร้านค้าได้", false);
        }
    };

    const handleDeleteClose = () => {
        setIsDeleteDialogOpen(false);
        handleClickToNavigate();
    };
    const handleDeleteOpen = () => {
        // setCreateMasterSupplierCodeName("");
        setIsDeleteDialogOpen(true);
    };
    const formatThaiDate = (dateString: string): string => {
        const date = new Date(dateString);
        const thaiMonths = [
            "มกราคม",
            "กุมภาพันธ์",
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม",
            "มิถุนายน",
            "กรกฎาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม",
        ];
        const day = date.getDate();
        const month = thaiMonths[date.getMonth()];
        const year = date.getFullYear() + 543; // เพิ่ม 543 ให้ตรงกับปี พ.ศ.
        return `${day} ${month} ${year}`;
    };

    useEffect(() => {
        if (msSupplierPaymentTermDay === 0) {
            setMsSupplierPaymentTerm("เงินสด");
        }
    }, [msSupplierPaymentTermDay]);


    return (
        <div>
            <ToastProvider>
                <div className="container w-full m-auto">
                    <Text size="6" weight="bold" className="text-center ">
                        ข้อมูลร้านค้า
                    </Text>
                    <Card variant="surface" className="w-full mt-2 rounded-none bg-white relative overflow-visible px-6 space-y-4">
                        {/* บรรทัดที่ 1 */}
                        <Flex className="justify-between space-x-2 w-full">
                            <InputAction
                                label="รหัสร้านค้า"
                                defaultValue={supplierCode ? supplierCode : "-"}
                                value={supplierCode}
                                labelOrientation="horizontal"
                                className="flex flex-row items-center space-x-2 rounded w-5/12 "
                                classNameInput="w-full"
                                classNameLabel="min-w-[67px]"
                                size="2"
                                disabled={true}
                            />
                            <div className="flex items-center gap-2">
                                <InputAction
                                    label="วันที่"
                                    labelOrientation="horizontal"
                                    // defaultValue=""
                                    placeholder={supplierData?.created_at ? formatThaiDate(supplierData.created_at) : ""}
                                    value={supplierData?.created_at ? formatThaiDate(supplierData.created_at) : ""}
                                    className="rounded  text-center"
                                    size="2"
                                    disabled={true}

                                />
                            </div>
                        </Flex>
                        {/* บรรทัดที่ 2 */}
                        <Flex className="justify-start space-x-2">
                            <div className="flex items-center gap-2 w-full">
                                <InputAction
                                    id={"ชื่อร้านค้า"}
                                    label="ชื่อร้านค้า"
                                    defaultValue={msSupplierName}
                                    placeholder={msSupplierName === "" ? "กรุณาระบุชื่อร้านค้า" : msSupplierName}
                                    labelOrientation="horizontal"
                                    value={msSupplierName}
                                    classNameInput="w-full"
                                    onChange={(e) => setMsSupplierName(e.target.value)}
                                    size="2"
                                    require="true"
                                />
                                <InputAction
                                    id={"Line ID"}
                                    label="ไอดี ไลน์"
                                    placeholder={msSupplierLineId === "" ? "กรุณาระบุไอดี ไลน์" : msSupplierLineId}
                                    labelOrientation="horizontal"
                                    value={msSupplierLineId}
                                    defaultValue={msSupplierLineId}
                                    classNameInput="w-full"
                                    onChange={(e) => setMsSupplierLineId(e.target.value)}
                                    size="2"
                                />
                            </div>
                        </Flex>
                        {/* บรรทัดที่ 3 */}
                        <Flex className="justify-start space-x-2">
                            <div className="flex items-center gap-2 w-full">
                                <InputAction
                                    label="ชื่อผู้ติดต่อ"
                                    placeholder={msSupplierContactName === "" ? "กรุณาระบุชื่อผู้ติดต่อ" : msSupplierContactName}
                                    labelOrientation="horizontal"
                                    value={msSupplierContactName}
                                    className="rounded  w-5/12"
                                    classNameLabel="min-w-[77px]"
                                    classNameInput="w-full"
                                    onChange={(e) => setMsSupplierContactName(e.target.value)}
                                    size="2"
                                    require="true"
                                />
                                <InputAction
                                    label="เบอร์โทรติดต่อ"
                                    placeholder={msSupplierContactNumber === "" ? "กรุณาระบุเบอร์โทรติดต่อ" : msSupplierContactNumber}
                                    type="number"
                                    labelOrientation="horizontal"
                                    value={msSupplierContactNumber}
                                    className="rounded  "
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        if (value.length <= 10) {
                                            setMsSupplierContactNumber(value);
                                        }
                                    }}
                                    size="2"
                                    require="true"
                                />
                            </div>
                        </Flex>
                        {/* บรรทัดที่ 4 */}
                        <Flex className="justify-start space-x-2">
                            <div className="flex items-center gap-2 w-full">
                                <InputAction
                                    label="ที่อยู่ เลขที่"
                                    placeholder={msSupplierAddrNumber === "" ? "ระบุเลขที่อยู่" : msSupplierAddrNumber}
                                    type="number"
                                    labelOrientation="horizontal"
                                    value={msSupplierAddrNumber}
                                    className="rounded   min-w-[40px]"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        if (value.length <= 10) {
                                            setMsSupplierAddrNumber(value);
                                        }
                                    }}
                                    size="2"
                                />
                                <InputAction
                                    label="ซอย"
                                    placeholder={msSupplierAddrAlley === "" ? "ระบุซอย" : msSupplierAddrAlley}
                                    labelOrientation="horizontal"
                                    value={msSupplierAddrAlley}
                                    className="rounded  min-w-[50px]"
                                    onChange={(e) => setMsSupplierAddrAlley(e.target.value)}
                                    size="2"
                                />
                                <InputAction
                                    label="ถนน"
                                    placeholder={msSupplierAddrStreet === "" ? "ระบุถนน" : msSupplierAddrStreet}
                                    labelOrientation="horizontal"
                                    value={msSupplierAddrStreet}
                                    className="rounded  min-w-[50px]"
                                    onChange={(e) => setMsSupplierAddrStreet(e.target.value)}
                                    size="2"
                                />
                                <InputAction
                                    label="ตําบล/แขวง"
                                    placeholder={msSupplierAddrSubdistrict === "" ? "ระบุตําบล/แขวง" : msSupplierAddrSubdistrict}
                                    labelOrientation="horizontal"
                                    value={msSupplierAddrSubdistrict}
                                    className="rounded  min-w-[50px]"
                                    onChange={(e) => setMsSupplierAddrSubdistrict(e.target.value)}
                                    size="2"
                                />
                            </div>
                        </Flex>
                        {/* บรรทัดที่ 5 */}
                        <Flex className="justify-start space-x-2">
                            <div className="flex items-center gap-2 w-full ml-8">
                                <InputAction
                                    label="อําเภอ/เขต"
                                    placeholder={msSupplierAddrDistrict === "" ? "ระบุอําเภอ/เขต" : msSupplierAddrDistrict}
                                    labelOrientation="horizontal"
                                    value={msSupplierAddrDistrict}
                                    className="rounded   min-w-[60px]"
                                    onChange={(e) => setMsSupplierAddrDistrict(e.target.value)}
                                    size="2"
                                />
                                <InputAction
                                    label="จังหวัด"
                                    placeholder={msSupplierAddrProvince === "" ? "ระบุจังหวัด" : msSupplierAddrProvince}
                                    labelOrientation="horizontal"
                                    value={msSupplierAddrProvince}
                                    className="rounded  min-w-[60px]"
                                    onChange={(e) => setMsSupplierAddrProvince(e.target.value)}
                                    size="2"
                                />
                                <InputAction
                                    label="รหัสไปรษณีย์"
                                    placeholder={msSupplierAddrPcode === "" ? "ระบุรหัสไปรษณีย์" : msSupplierAddrPcode}
                                    type="number"
                                    labelOrientation="horizontal"
                                    value={msSupplierAddrPcode}
                                    className="rounded min-w-[60px]"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        if (value.length <= 5) {
                                            setMsSupplierAddrPcode(value);  // อัพเดตค่า
                                        }
                                    }}
                                    size="2"
                                />
                            </div>
                        </Flex>
                        {/* บรรทัดที่ 6 */}
                        <Flex className="justify-start space-x-2">
                            <div className="flex items-center gap-2">
                                <Text>เงื่อนไขการชำระเงิน</Text>
                                <input
                                    type="radio"
                                    name="PaymentTerms"
                                    value="เงินสด"
                                    className="rounded "
                                    checked={msSupplierPaymentTerm === "เงินสด" || msSupplierPaymentTermDay === 0}
                                    onChange={() => {
                                        if (msSupplierPaymentTermDay === 0) {
                                            setMsSupplierPaymentTerm("เงินสด");
                                        }
                                    }}
                                    disabled={msSupplierPaymentTermDay > 0}
                                />
                                <Text>เงินสด</Text>
                                <input
                                    type="radio"
                                    name="PaymentTerms"
                                    value="เครดิต"
                                    className="rounded "
                                    checked={msSupplierPaymentTerm === "เครดิต" || msSupplierPaymentTermDay > 0}
                                    onChange={() => setMsSupplierPaymentTerm("เครดิต")}
                                />
                                <Text>เครดิต</Text>
                                {/* <InputAction
                                    type="number"
                                    value={String(msSupplierPaymentTermDay)}  // แปลงค่าจาก number เป็น string
                                    className="rounded  w-2/12"
                                    onChange={(e) => setMsSupplierPaymentTermDay(Number(e.target.value))}
                                    disabled={msSupplierPaymentTerm === "เงินสด"}
                                    size="2"
                                /> */}
                                <InputAction
                                    type="number"
                                    placeholder={msSupplierPaymentTermDay === 0 ? "จํานวนวัน" : String(msSupplierPaymentTermDay)}
                                    value={String(msSupplierPaymentTermDay)}
                                    className="rounded  w-2/12"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setMsSupplierPaymentTermDay(value ? Number(value) : 0);
                                    }}
                                    disabled={msSupplierPaymentTerm === "เงินสด"}
                                    size="2"
                                />
                                <Text>วัน</Text>
                            </div>
                        </Flex>
                        {/* บรรทัดที่ 7 */}
                        <Flex className="justify-start space-x-2">
                            <div className="flex flex-col items-left gap-2 w-full">
                                <Text>หมายเหตุ</Text>
                                <TextArea
                                    placeholder={msSupplierRemark === "" ? "ระบุหมายเหตุ" : msSupplierRemark}
                                    className="rounded  w-full min-h-[100px] focus:outline-none"
                                    value={msSupplierRemark}
                                    onChange={(e) => setMsSupplierRemark(e.target.value)}
                                />
                            </div>
                        </Flex>
                        {/* บรรทัดที่ 8 */}
                        <Flex className="justify-start space-x-2">
                            <div className="flex items-center gap-2 w-full">
                                <InputAction
                                    label="ประเภทกิจการ"
                                    placeholder={msSupplierBusinessType === "" ? "กรุณาระบุประเภทกิจการ" : msSupplierBusinessType}
                                    labelOrientation="horizontal"
                                    // defaultValue={msSupplierBusinessType}
                                    value={msSupplierBusinessType}
                                    className="flex items-center w-full"  // ทำให้ทั้ง label และ input อยู่ในแถวเดียวกัน
                                    // classNameLabel="w-2/12"  // ขนาดของ label
                                    classNameInput="w-6/12" // ขนาดของ input (เหลือพื้นที่ที่เหลือให้ input)
                                    onChange={(e) => setMsSupplierBusinessType(e.target.value)}
                                    size="2"
                                    require="true"
                                />

                            </div>
                        </Flex>
                        <Flex gap="3" justify="end" className="ml-5 mr-5 mb-5 pt-3 mt-5">
                            <Buttons btnType="delete"
                                onClick={handleDeleteOpen}
                            >
                                ลบข้อมูล
                            </Buttons>
                            <Buttons btnType="submit" onClick={handleSave}>
                                บันทึกข้อมูล
                            </Buttons>
                        </Flex>
                    </Card>
                    <DialogComponent
                        isOpen={isDeleteDialogOpen}
                        onClose={handleDeleteClose}
                        title="ยืนยันการลบ"
                        onConfirm={handleDeleteConfirm}
                        confirmText="ยืนยัน"
                        cancelText="ยกเลิก"
                    >
                        <p>
                            คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? <br />
                            รหัสร้านค้า <span className="text-red-500">{supplierData?.supplier_code || "-"}</span>
                            <br />
                            ชื่อร้านค้า <span className="text-red-500">{supplierData?.supplier_name || "-"}</span>
                            <br />
                            ประเภทกิจการ <span className="text-red-500">{supplierData?.business_type || "-"}</span>
                        </p>
                    </DialogComponent>
                </div>
            </ToastProvider>
        </div>
    );
};

export default CreateSupplier;
