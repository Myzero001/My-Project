import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TypeCustomerVisitAll } from "@/types/response/response.customer-visit";
import { useState } from "react";
import { getMSSupplierById, updateMSSupplier } from "@/services/ms.Supplier";
import { getCustomerVisit, createCustomerVisit, updateCustomerVisit, deleteCustomerVisit, getCustomerVisitById } from "@/services/customer.visit"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
import { Card, Flex, Grid, Text, TextArea, TextField } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import Buttons from "@/components/customs/button/button.main.component";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import { useToast } from "@/components/customs/alert/toast.main.component";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, sub } from "date-fns";
import dayjs from "dayjs";
import { FaStar } from "react-icons/fa"; // ใช้ react-icons สำหรับไอคอนดาว
import { PayLoadCreateCustomerVisit } from "@/types/requests/request.customer-visit";
import { customerVisitCreateSchema } from "@/features/visiting-customer/schemas/customerVisitCreate";
const CreateVisitingCustomer = () => {

    const navigate = useNavigate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const { showToast } = useToast();
    const location = useLocation();
    const CusVisitId = location.state?.customer_visit_id;
    const [customerVisitData, setCustomerVisitData] = useState<TypeCustomerVisitAll | null>(null);

    const fetchCustomerVisitData = async () => {
        if (!CusVisitId) return;
        try {
            const res = await getCustomerVisitById(CusVisitId);
            setCustomerVisitData(res.responseObject);
        } catch (error) {
            console.error("Error fetching customer visit data:", error);
        }
    };
    useEffect(() => {
        fetchCustomerVisitData();
    }, [CusVisitId]);

    const handleClickToNavigate = () => {
        navigate(`/visiting-customers`);
    };
    //--------------------------------------------------------------------แก้ไขข้อมูลที่ช่อง
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number | null>(null); // เก็บค่าดาวที่ hover

    const [customerVisitId, setCustomerVisitId] = useState("");
    const [customerVisitDoc, setCustomerVisitDoc] = useState("");
    const [customerId, setcustomerId] = useState("");
    const [customerCode, setcustomerCode] = useState("");
    const [customerName, setcustomerName] = useState("");
    const [contactName, setcontactName] = useState("");
    const [contactNumber, setcontactNumber] = useState("");
    const [lineId, setlineId] = useState("");
    const [addrNumber, setaddrNumber] = useState("");
    const [addrAlley, setaddrAlley] = useState("");
    const [addrStreet, setaddrStreet] = useState("");
    const [addrSubdistrict, setaddrSubdistrict] = useState("");
    const [addrDistrict, setaddrDistrict] = useState("");
    const [addrProvince, setaddrProvince] = useState("");
    const [addrPostcode, setaddrPostcode] = useState("");
    // const [dateGo, setdateGo] = useState(null);
    const [topic, settopic] = useState("");
    const [nextTopic, setnextTopic] = useState("");
    // const [nextDate, setnextDate] = useState(null);

    const [dateGo, setDateGo] = useState<string | undefined>(dayjs().format("YYYY-MM-DD"));
    const [nextDate, setNextDate] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (customerVisitData) {
            setCustomerVisitId(CusVisitId || "");
            setCustomerVisitDoc(customerVisitData.customer_visit_doc || "");
            setcustomerId(customerVisitData.customer_id || "");
            setcustomerCode(customerVisitData.customer_code || "");
            setcustomerName(customerVisitData.customer_name || "");
            setcontactName(customerVisitData.contact_name || "");
            setcontactNumber(customerVisitData.contact_number || "");
            setlineId(customerVisitData.line_id || "");
            setaddrNumber(customerVisitData.addr_number || "");
            setaddrAlley(customerVisitData.addr_alley || "");
            setaddrStreet(customerVisitData.addr_street || "");
            setaddrSubdistrict(customerVisitData.addr_subdistrict || "");
            setaddrDistrict(customerVisitData.addr_district || "");
            setaddrProvince(customerVisitData.addr_province || "");
            setaddrPostcode(customerVisitData.addr_postcode || "");
            setDateGo(customerVisitData.date_go);
            settopic(customerVisitData.topic || "");
            setnextTopic(customerVisitData.next_topic || "");
            setNextDate(customerVisitData.next_date);
            setRating(customerVisitData.rating || 0);
            // setdateGo(formatDate(customerVisitData.date_go));  // แปลงวันที่
            // setnextDate(formatDate(customerVisitData.next_date));  // แปลงวันที่
        }
    }, [customerVisitData]);
    //----------------------------------------------บันทึกข้อมูล------update------------------------------------------
    // ฟังก์ชันที่จะเรียกใช้เมื่อกดปุ่มบันทึกข้อมูล
    const handleSave = async () => {

        // if (!msSupplierName) {
        //     showToast("กรุณาระบุชื่อร้านค้า", false);
        //     return;
        // } else if (!msSupplierContactName) {
        //     showToast("กรุณาระบุชื่อผู้ติดต่อ", false);
        //     return;
        // } else if (!msSupplierContactNumber) {
        //     showToast("กรุณาระบุเบอร์โทรศัพท์", false);
        //     return;
        // } else if (!msSupplierBusinessType) {
        //     showToast("กรุณาระบุประเภทกิจการ", false);
        //     return;
        // }
        const data = {
            customer_visit_id: CusVisitId,
            customer_visit_doc: customerVisitDoc,
            customer_id: customerId,
            customer_code: customerCode,
            customer_name: customerName,
            contact_name: contactName,
            contact_number: contactNumber,
            line_id: lineId,
            addr_number: addrNumber,
            addr_alley: addrAlley,
            addr_street: addrStreet,
            addr_subdistrict: addrSubdistrict,
            addr_district: addrDistrict,
            addr_province: addrProvince,
            addr_postcode: addrPostcode,
            date_go: dateGo,
            topic: topic,
            next_topic: nextTopic,
            // next_date: nextDate
            next_date: nextDate === null ? undefined : nextDate,
            rating: rating === null ? undefined : rating
        };

        try {
            // เรียก API เพื่อติดต่อ backend
            const response = await updateCustomerVisit(data);
            if (response) {
                console.log("ข้อมูลถูกบันทึกเรียบร้อยแล้ว:", response);
                showToast("บันทึกข้อมูลเรียบร้อยแล้ว", true);
                navigate('/visiting-customers');
            }
        } catch (error) {
            showToast("ไม่สามารถบันทึกข้อมูลได้", false);
        }
    };
    const handleDeleteConfirm = async () => {
        if (!CusVisitId) {
            showToast("กรุณาระบุรายการร้านค้าที่ต้องการลบ", false);
            return;
        }

        try {
            const response = await deleteCustomerVisit(CusVisitId);

            if (response.statusCode === 200) {
                showToast("ลบรายการร้านค้าเรียบร้อยแล้ว", true);
                setIsDeleteDialogOpen(false);
                fetchCustomerVisitData();
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
        setIsDeleteDialogOpen(true);
    };

    const {
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        register,
    } = useForm<PayLoadCreateCustomerVisit>({
        resolver: zodResolver(customerVisitCreateSchema),
    });
    useEffect(() => {
        // ตั้งค่าค่า nextDate เมื่อได้รับข้อมูลจากฐานข้อมูล
        if (customerVisitData?.next_date) {
            setNextDate(customerVisitData.next_date); // อัปเดตค่าใน state
        }
    }, [customerVisitData]);
    return (
        <Flex
            direction={"column"}
            gap={"3"}
            className="w-full mt-4 bg-white rounded-md p-6"

        >
            <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "2", xl: "2" }}
                gap="3"
                rows="repeat(1, 64px)"
                width="auto"
            >

                <InputDatePicker
                    id="วันที่เยี่ยม"
                    labelName={"วันที่เยี่ยม"}
                    onchange={(date) =>
                        date && setDateGo(dayjs(date).format("YYYY-MM-DD"))
                    }
                    defaultDate={
                        dateGo // หาก dateGo มีค่า
                            ? new Date(dateGo) // แปลง dateGo เป็น Date
                            : new Date() // ค่าเริ่มต้นเป็นวันที่ปัจจุบัน
                    }
                />
                <InputAction
                    id={"เลขที่เยี่ยม"}
                    label="เลขที่เยี่ยม"
                    defaultValue={customerVisitData?.customer_visit_doc ? customerVisitData.customer_visit_doc : "-"}
                    value={customerVisitData?.customer_visit_doc ? customerVisitData.customer_visit_doc : "-"}
                    // labelOrientation="horizontal"
                    // classNameLabel="min-w-[67px]"
                    classNameInput="w-full"
                    size="2"
                    disabled={true}
                />

            </Grid>
            <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "2", xl: "2" }}
                gap="3"
                rows="repeat(1, 64px)"
                width="auto"
            >
                <InputAction
                    id={"รหัสลูกค้า"}
                    label="รหัสลูกค้า"
                    defaultValue={customerCode}
                    placeholder={customerCode === "" ? "รหัสลูกค้า" : customerCode}
                    //labelOrientation="horizontal"
                    value={customerCode}
                    // classNameLabel="min-w-[71px] "
                    classNameInput="w-full"
                    onChange={(e) => setcustomerCode(e.target.value)}
                    size="2"
                    disabled={true}
                />
                <InputAction
                    id={"ชื่อกิจการ"}
                    label="ชื่อกิจการ"
                    placeholder={customerName === "" ? "ชื่อกิจการ" : customerName}
                    //labelOrientation="horizontal"
                    value={customerName}
                    defaultValue={customerName}
                    classNameInput="w-full "
                    // classNameLabel="min-w-[60px] "
                    onChange={(e) => setcustomerName(e.target.value)}
                    size="2"
                    disabled={true}
                />
            </Grid>
            <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
                gap="3"
                rows="repeat(1, 64px)"
                width="auto"
            >
                <InputAction
                    id={"ที่อยู่ เลขที่"}
                    label="ที่อยู่ เลขที่"
                    placeholder={addrNumber === "" ? "ที่อยู่ เลขที่" : addrNumber}
                    // type="number"
                    //labelOrientation="horizontal"
                    defaultValue={addrNumber}
                    value={addrNumber}
                    classNameInput="w-full"
                    // classNameLabel="min-w-[65px]"
                    onChange={(e) => { setaddrNumber(e.target.value); }}
                    size="2"
                />
                <InputAction
                    id={"ซอย"}
                    label="ซอย"
                    placeholder={addrAlley === "" ? "ซอย" : addrAlley}
                    defaultValue={addrAlley}
                    //labelOrientation="horizontal"
                    value={addrAlley}
                    classNameInput="w-full"
                    onChange={(e) => setaddrAlley(e.target.value)}
                    size="2"
                />
                <InputAction
                    id={"ถนน"}
                    label="ถนน"
                    placeholder={addrStreet === "" ? "ถนน" : addrStreet}
                    defaultValue={addrStreet}
                    //labelOrientation="horizontal"
                    value={addrStreet}
                    classNameInput="w-full"
                    onChange={(e) => setaddrStreet(e.target.value)}
                    size="2"
                />
                <InputAction
                    id={"ตําบล/แขวง"}
                    label="ตําบล/แขวง"
                    placeholder={addrSubdistrict === "" ? "ตําบล/แขวง" : addrSubdistrict}
                    defaultValue={addrSubdistrict}
                    //labelOrientation="horizontal"
                    value={addrSubdistrict}
                    classNameInput="w-full"
                    // classNameLabel="min-w-[76px]"
                    onChange={(e) => setaddrSubdistrict(e.target.value)}
                    size="2"
                />
            </Grid>
            <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
                gap="3"
                rows="repeat(1, 64px)"
                width="auto"
            >
                <InputAction
                    id={"อําเภอ/เขต"}
                    label="อําเภอ/เขต"
                    placeholder={addrDistrict === "" ? "อําเภอ/เขต" : addrDistrict}
                    defaultValue={addrDistrict}
                    //labelOrientation="horizontal"
                    value={addrDistrict}
                    classNameInput="w-full"
                    // classNameLabel="min-w-[69px]"
                    onChange={(e) => setaddrDistrict(e.target.value)}
                    size="2"
                />
                <InputAction
                    id={"จังหวัด"}
                    label="จังหวัด"
                    placeholder={addrProvince === "" ? "จังหวัด" : addrProvince}
                    defaultValue={addrProvince}
                    //labelOrientation="horizontal"
                    value={addrProvince}
                    // classNameInput="w-full"
                    onChange={(e) => setaddrProvince(e.target.value)}
                    size="2"
                />
                <InputAction
                    id={"รหัสไปรษณีย์"}
                    label="รหัสไปรษณีย์"
                    placeholder={addrPostcode === "" ? "รหัสไปรษณีย์" : addrPostcode}
                    defaultValue={addrPostcode}
                    type="number"
                    //labelOrientation="horizontal"
                    value={addrPostcode}
                    // classNameLabel="min-w-[83px]"
                    classNameInput="w-full"
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 5) {
                            setaddrPostcode(value);  // อัพเดตค่า
                        }
                    }}
                    size="2"
                />
            </Grid>

            <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                gap="3"
                rows="repeat(1, 64px)"
                width="auto"
            >
                <InputAction
                    label="ชื่อ บุคคล"
                    placeholder={contactName === "" ? "ชื่อบุคคล" : contactName}
                    defaultValue={contactName}
                    //labelOrientation="horizontal"
                    value={contactName}
                    // classNameLabel="min-w-[62px]"
                    classNameInput="w-full"
                    onChange={(e) => setcontactName(e.target.value)}
                    size="2"
                // require="true"
                />
                <InputAction
                    label="เบอร์โทรติดต่อ"
                    placeholder={contactNumber === "" ? "เบอร์โทรติดต่อ" : contactNumber}
                    defaultValue={contactNumber}
                    type="number"
                    //labelOrientation="horizontal"
                    value={contactNumber}
                    // classNameLabel="min-w-[94px]"
                    classNameInput="w-full"
                    onChange={(e) => setcontactNumber(e.target.value)}
                    size="2"
                // require="true"
                />
                <InputAction
                    label="ไอดี ไลน์"
                    placeholder={lineId === "" ? "ไอดี ไลน์" : lineId}
                    defaultValue={lineId}
                    //labelOrientation="horizontal"
                    value={lineId}
                    // classNameLabel="min-w-[53px]"
                    classNameInput="w-full"
                    onChange={(e) => setlineId(e.target.value)}
                    size="2"
                />
            </Grid>
            <InputTextareaFormManage
                register={{
                    value: topic, // ส่งค่า value
                    onChange: (e) => settopic(e.target.value), // ส่งฟังก์ชัน onChange
                }}
                name="หัวเรื่อง"
                placeholder="เรื่อง"
                // msgError={errors.note?.message}
                rows={4}
            />
            <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                gap="3"
                rows="repeat(1, 64px)"
                width="auto"
                className="items-center"
            >
                {/* <InputDatePicker
                    id="นัดครั้งถัดไป วันที่"
                    labelName={"นัดครั้งถัดไป วันที่"}
                    onchange={(date) =>
                        date && setnextDate(dayjs(date).format("YYYY-MM-DD"))
                    }
                    defaultDate={
                        nextDate
                            ? new Date(nextDate as string) 
                            : undefined
                    }
                /> */}
                <InputDatePicker
                    id="นัดหมายถอด"
                    labelName={"นัดหมายถอด"}
                    onchange={(date) => {
                        if (date) {
                            const formattedDate = dayjs(date).format("YYYY-MM-DD");
                            setNextDate(formattedDate); // อัปเดตสถานะของวันที่
                            console.log("Formatted Date:", formattedDate);
                        }
                    }}
                    defaultDate={
                        nextDate ? new Date(nextDate) : undefined // แสดงค่า nextDate ถ้ามี
                    }
                />
            </Grid>
            <InputTextareaFormManage
                register={{
                    value: nextTopic, // ส่งค่า value
                    onChange: (e) => setnextTopic(e.target.value), // ส่งฟังก์ชัน onChange
                }}
                name="หัวเรื่อง"
                placeholder="เรื่อง"
                // msgError={errors.note?.message}
                rows={4}
            />
            <Grid
                columns={{
                    initial: "1", md: "repeat(8, auto)", sm: "repeat(8, auto)", lg: "repeat(8, auto)", xl: "repeat(8, auto)"
                    // \md: "repeat(8, auto)", // หน้าจอขนาดกลางขึ้นไป: 8 คอลัมน์
                }}
                rows="repeat(1, 44px)"
                gap="3" // ระยะห่างระหว่างแต่ละคอลัมน์
                className="items-center "
                width="100%"
            >
                <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            size={24}
                            color={star <= (hover ?? 0) || star <= (rating ?? 0) ? "#ffc107" : "#e4e5e9"}  // ใช้ ?? เพื่อเช็ค null
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(null)}
                            onClick={() => setRating((prev) => (prev === star ? 0 : star))}
                        />
                    ))}
                </div>

                <p style={{ marginLeft: "8px", fontSize: "16px" }} className="text-center items-center">
                    คะแนนลูกค้า: {rating === 0 ? <span style={{ color: "red" }}>ไม่มีคะแนน</span> : rating} / 5
                </p>

            </Grid>

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
                    เลขที่เยี่ยม: <span className="text-red-500">{customerVisitData?.customer_visit_doc || "-"}</span> <br />
                    รหัสร้านค้า: <span className="text-red-500">{customerVisitData?.customer_code || "-"}</span>
                    <br />
                    ชื่อร้านค้า: <span className="text-red-500">{customerVisitData?.customer_name || "-"}</span>

                    {/* รหัสร้านค้า <span className="text-red-500">{customerVisitData?.supplier_code || "-"}</span>
                    <br />
                    ชื่อร้านค้า <span className="text-red-500">{customerVisitData?.supplier_name || "-"}</span>
                    <br />
                    ประเภทกิจการ <span className="text-red-500">{customerVisitData?.business_type || "-"}</span> */}
                </p>
            </DialogComponent>
            <Flex
                gap={"4"}
                justify={"end"}
                className=" f"
                direction={{
                    initial: "column",
                    xs: "column",
                    sm: "row",
                    md: "row",
                    lg: "row",
                    xl: "row",
                }}
            >
                <Buttons
                    btnType="delete"
                    onClick={handleDeleteOpen}
                    className=" w-[100px] max-sm:w-full"
                    >
                    ลบข้อมูล
                </Buttons>
                <Buttons
                    btnType="submit"
                    // variant="outline"
                    onClick={handleSave}
                    className=" w-[100px] max-sm:w-full"
                    >
                    บันทึกข้อมูล
                </Buttons>

            </Flex>

        </Flex>
    );
};

export default CreateVisitingCustomer;
