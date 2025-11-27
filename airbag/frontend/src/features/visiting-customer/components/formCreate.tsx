import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import { TypeCustomerVisitAll } from "@/types/response/response.customer-visit";
import { useState } from "react";
import { getCustomerVisit, createCustomerVisit, updateCustomerVisit, deleteCustomerVisit, getCustomerVisitById } from "@/services/customer.visit"
import { Card, Flex, Grid, Text, TextArea, TextField } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import Buttons from "@/components/customs/button/button.main.component";
import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import { useToast } from "@/components/customs/alert/toast.main.component";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
    const [hover, setHover] = React.useState<number | null>(null);
    const [customerVisitData, setCustomerVisitData] = useState<TypeCustomerVisitAll>();
    const {
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue,
        register,
    } = useForm<PayLoadCreateCustomerVisit>({
        resolver: zodResolver(customerVisitCreateSchema),
    });
    const rating = watch("rating");

    const fetchCustomerVisitById = () => {
        if (CusVisitId) {
            getCustomerVisitById(CusVisitId).then((res) => {
                const responseObject = res.responseObject;
                if (!responseObject) {
                    console.error("responseObject is null or undefined");
                    return;
                }
                setCustomerVisitData(res.responseObject);
                setValue("customer_visit_doc", res.responseObject?.customer_visit_doc);
                setValue("customer_id", res.responseObject?.customer_id);
                setValue("customer_code", res.responseObject?.customer_code ?? "");
                setValue("customer_name", res.responseObject?.customer_name ?? "");
                setValue("contact_name", res.responseObject?.contact_name ?? "");
                setValue("contact_number", res.responseObject?.contact_number ?? "");
                setValue("line_id", res.responseObject?.line_id ?? "");
                setValue("addr_map", res.responseObject?.addr_map ?? "");
                setValue("addr_number", res.responseObject?.addr_number ?? "");
                setValue("addr_alley", res.responseObject?.addr_alley ?? "");
                setValue("addr_street", res.responseObject?.addr_street ?? "");
                setValue("addr_subdistrict", res.responseObject?.addr_subdistrict ?? "");
                setValue("addr_district", res.responseObject?.addr_district ?? "");
                setValue("addr_province", res.responseObject?.addr_province ?? "");
                setValue("addr_postcode", res.responseObject?.addr_postcode ?? "");
                setValue("next_date", res.responseObject?.next_date
                    ? dayjs(res.responseObject?.next_date).format("YYYY-MM-DD")
                    : undefined);
                setValue("date_go", res.responseObject?.date_go
                    ? dayjs(res.responseObject?.date_go).format("YYYY-MM-DD")
                    : undefined);
                setValue("topic", res.responseObject?.topic ?? "");
                setValue("next_topic", res.responseObject?.next_topic ?? "");
                setValue("rating", res.responseObject?.rating); 
            })
                .catch((err) => {
                    showToast("error" + err, false);
                });
        }
    };

    const onSubmitHandler = async (payload: PayLoadCreateCustomerVisit) => {
        if (!CusVisitId) {
            showToast("บันทึกข้อมูลร้านค้าไม่สำเร็จ: ไม่มีรหัสร้านค้า", false);
            return;
        }
        updateCustomerVisit({
            customer_visit_id: CusVisitId,
            customer_visit_doc: payload.customer_visit_doc,
            customer_id: payload.customer_id ?? "",
            customer_code: payload.customer_code ?? "",
            customer_name: payload.customer_name ?? "",
            contact_name: payload.contact_name ?? "",
            contact_number: payload.contact_number ?? "",
            line_id: payload.line_id ?? "",
            addr_map: payload.addr_map ?? "",
            addr_number: payload.addr_number ?? "",
            addr_alley: payload.addr_alley ?? "",
            addr_street: payload.addr_street ?? "",
            addr_subdistrict: payload.addr_subdistrict ?? "",
            addr_district: payload.addr_district ?? "",
            addr_province: payload.addr_province ?? "",
            addr_postcode: payload.addr_postcode ?? "",
            date_go: payload.date_go,
            topic: payload.topic ?? "",
            next_topic: payload.next_topic ?? "",
            next_date: payload.next_date ?? undefined,
            rating: payload.rating ?? 0,
        })
            .then(() => {
                showToast("บันทึกข้อมูลรายการเยี่ยมลูกค้าสำเร็จ", true);
                fetchCustomerVisitById();
                // handleClickToNavigate();
            })
            .catch(() => {
                showToast("บันทึกข้อมูลรายการเยี่ยมลูกค้าไม่สำเร็จ", false);
            });
    };

    const handleClickToNavigate = () => {
        navigate(`/visiting-customers`);
    };

    useEffect(() => {
        fetchCustomerVisitById();
    }, [CusVisitId]);

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
                fetchCustomerVisitById();
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

    return (
        <>
            <form onSubmit={handleSubmit(onSubmitHandler)}
            >
                {!customerVisitData ? (
                    <BoxLoadingData minHeight="100vh" />
                ) : (
                    <>
                        <Flex
                            direction={"column"}
                            gap={"3"}
                            className="w-full mt-4 bg-white rounded-md p-6"
                        >
                            <Grid
                                columns={{ initial: "1", md: "2", sm: "2", lg: "2", xl: "2" }}
                                gap="3"
                                rows="repeat(1, auto)"
                                width="auto"
                            >
                                <InputDatePicker
                                    id="วันที่เยี่ยม"
                                    labelName={"วันที่เยี่ยม"}
                                    onchange={(date) => {
                                        if (date) {
                                            const formattedDate = dayjs(date).format("YYYY-MM-DD");
                                            setValue("date_go", formattedDate);
                                        }
                                    }}
                                    defaultDate={
                                        watch("date_go")
                                            ? new Date(watch("date_go") as string)
                                            : new Date()
                                    }
                                    nextFields={{ down: "ที่อยู่ เลขที่"}}
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
                                rows="repeat(1, auto)"
                                width="auto"
                            >
                                <InputAction
                                    id={"รหัสลูกค้า"}
                                    label="รหัสลูกค้า"
                                    defaultValue={watch("customer_code")?.toString()}
                                    placeholder={"รหัสลูกค้า"}
                                    value={watch("customer_code")?.toString() ?? "0"}
                                    classNameInput="w-full"
                                    onChange={(e) => setValue("customer_code", e.target.value)}
                                    size="2"
                                    disabled={true}
                                />
                                <InputAction
                                    id={"ชื่อกิจการ"}
                                    label="ชื่อกิจการ"
                                    defaultValue={watch("customer_name")?.toString()}
                                    placeholder={"ชื่อกิจการ"}
                                    value={watch("customer_name")?.toString() ?? "0"}
                                    classNameInput="w-full"
                                    onChange={(e) => setValue("customer_name", e.target.value)}
                                    size="2"
                                    disabled={true}
                                />
                            </Grid>
                            <Grid
                                columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
                                gap="3"
                                rows="repeat(1, auto)"
                                width="auto"
                            >
                                <InputAction
                                    id={"ที่อยู่ เลขที่"}
                                    placeholder={"ที่อยู่ เลขที่"}
                                    value={watch("addr_number") ?? ""}
                                    onChange={(e) => setValue("addr_number", e.target.value)}
                                    label={"ที่อยู่ เลขที่"}
                                    labelOrientation={"vertical"}
                                    size={"2"}
                                    defaultValue={watch("addr_number")}
                                    classNameInput=" w-full"
                                    nextFields={{up: "วันที่เยี่ยม", down: "ซอย"}}
                                />
                                <InputAction
                                    id={"ซอย"}
                                    placeholder={"ซอย"}
                                    value={watch("addr_alley") ?? ""}
                                    onChange={(e) => setValue("addr_alley", e.target.value)}
                                    label={"ซอย"}
                                    labelOrientation={"vertical"}
                                    size={"2"}
                                    defaultValue={watch("addr_alley")}
                                    classNameInput=" w-full"
                                    nextFields={{up: "ที่อยู่ เลขที่", down: "ถนน"}}
                                />
                                <InputAction
                                    id={"ถนน"}
                                    placeholder={"ถนน"}
                                    value={watch("addr_street") ?? ""}
                                    onChange={(e) => setValue("addr_street", e.target.value)}
                                    label={"ถนน"}
                                    labelOrientation={"vertical"}
                                    size={"2"}
                                    defaultValue={watch("addr_street")}
                                    classNameInput=" w-full"
                                    nextFields={{up: "ซอย", down: "ตำบล/แขวง"}}
                                />
                                <InputAction
                                    id={"ตำบล/แขวง"}
                                    placeholder={"ตำบล/แขวง"}
                                    value={watch("addr_subdistrict") ?? ""}
                                    onChange={(e) => setValue("addr_subdistrict", e.target.value)}
                                    label={"ตำบล/แขวง"}
                                    labelOrientation={"vertical"}
                                    size={"2"}
                                    defaultValue={watch("addr_subdistrict")}
                                    classNameInput=" w-full"
                                    nextFields={{up: "ถนน", down: "เขต/อำเภอ"}}
                                />
                            </Grid>
                            <Grid
                                columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
                                gap="3"
                                rows="repeat(1, auto)"
                                width="auto"
                            >
                                <InputAction
                                    id={"เขต/อำเภอ"}
                                    placeholder={"เขต/อำเภอ"}
                                    value={watch("addr_district") ?? ""}
                                    onChange={(e) => setValue("addr_district", e.target.value)}
                                    label={"เขต/อำเภอ"}
                                    labelOrientation={"vertical"}
                                    size={"2"}
                                    defaultValue={watch("addr_district")}
                                    classNameInput=" w-full"
                                    nextFields={{up: "ตำบล/แขวง", down: "จังหวัด"}}
                                />
                                <InputAction
                                    id={"จังหวัด"}
                                    placeholder={"จังหวัด"}
                                    value={watch("addr_province") ?? ""}
                                    onChange={(e) => setValue("addr_province", e.target.value)}
                                    label={"จังหวัด"}
                                    labelOrientation={"vertical"}
                                    size={"2"}
                                    defaultValue={watch("addr_province")}
                                    classNameInput=" w-full"
                                    nextFields={{up: "เขต/อำเภอ", down: "รหัสไปรษณีย์"}}
                                />
                                <InputAction
                                    id={"รหัสไปรษณีย์"}
                                    placeholder={"รหัสไปรษณีย์"}
                                    value={watch("addr_postcode") ?? ""}
                                    onChange={(e) => setValue("addr_postcode", e.target.value)}
                                    label={"รหัสไปรษณีย์"}
                                    labelOrientation={"vertical"}
                                    size={"2"}
                                    defaultValue={watch("addr_postcode")}
                                    classNameInput=" w-full"
                                    type="tel"
                                    maxLength={5}
                                    nextFields={{up: "จังหวัด", down: "ตำแหน่งแผนที่"}}
                                />
                            </Grid>
                            <Grid
                                columns={{ initial: "1", md: "1", sm: "1", lg: "1", xl: "1" }}
                                gap="3"
                                rows="repeat(1, auto)"
                                width="auto"
                            >
                                <InputAction
                                    id={"ตำแหน่งแผนที่"}
                                    placeholder={"ตำแหน่งแผนที่"}
                                    value={watch("addr_map") ?? ""}
                                    onChange={(e) => setValue("addr_map", e.target.value)}
                                    label={"ตำแหน่งแผนที่"}
                                    labelOrientation={"vertical"}
                                    size={"2"}
                                    defaultValue={watch("addr_map")}
                                    classNameInput=" w-full"
                                    errorMessage={errors.addr_map?.message}
                                    // require="true"
                                    nextFields={{up: "รหัสไปรษณีย์", down: "ชื่อ บุคคล"}}
                                />
                            </Grid>
                            <Grid
                                columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                                gap="3"
                                rows="repeat(1, auto)"
                                width="auto"
                            >
                                <InputAction
                                    id={"ชื่อ บุคคล"}
                                    placeholder={"ชื่อ บุคคล"}
                                    value={watch("contact_name") ?? ""}
                                    onChange={(e) => setValue("contact_name", e.target.value)}
                                    label={"ชื่อ บุคคล"}
                                    labelOrientation={"vertical"}
                                    size={"2"}
                                    defaultValue={watch("contact_name")}
                                    classNameInput=" w-full"
                                    errorMessage={errors.contact_name?.message}
                                    require="true"
                                    nextFields={{up: "ตำแหน่งแผนที่", down: "เบอร์โทรติดต่อ"}}
                                />
                                <InputAction
                                    id="เบอร์โทรติดต่อ"
                                    label="เบอร์โทรติดต่อ"
                                    defaultValue={watch("contact_number") ? watch("contact_number") : ""}
                                    placeholder="เบอร์โทรติดต่อ"
                                    // placeholder={watch("contact_number") === "" ? "เบอร์โทรติดต่อ" : watch("contact_number")}
                                    value={watch("contact_number") ?? ""}
                                    classNameInput="w-full"
                                    onChange={(e) => { setValue("contact_number", e.target.value) }}
                                    size="2"
                                    require="true"
                                    type="tel"
                                    maxLength={10}
                                    errorMessage={errors.contact_number?.message}
                                    nextFields={{up: "ชื่อ บุคคล", down: "Line ID"}}
                                />
                                <InputAction
                                    id={"Line ID"}
                                    label="ไอดี ไลน์"
                                    // placeholder={watch("line_id") === "" ? "Line ID" : watch("line_id")}
                                    placeholder="ไอดี ไลน์"
                                    value={watch("line_id") ?? ""}
                                    defaultValue={watch("line_id") ? watch("line_id") : ""}
                                    classNameInput="w-full "
                                    onChange={(e) => { setValue("line_id", e.target.value) }}
                                    size="2"
                                    nextFields={{up: "เบอร์โทรติดต่อ", down: "หัวข้อ"}}
                                />
                            </Grid>
                            <InputTextareaFormManage
                                id="หัวข้อ"
                                name="หัวข้อ"
                                placeholder="หัวข้อ"
                                register={register("topic")}
                                showLabel
                                msgError={errors.topic?.message}
                                required={true}
                            // rows={1}
                            // disabled={true}
                            // type=
                                nextFields={{up: "Line ID", down: "วันที่นัดถัดไป"}}
                            />
                            <Grid
                                columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                                gap="3"
                                rows="repeat(1, auto)"
                                width="auto"
                                className="items-center"
                            >
                                <InputDatePicker
                                    id="วันที่นัดถัดไป"
                                    labelName={"วันที่นัดถัดไป"}
                                    onchange={(date) =>
                                        date &&
                                        setValue("next_date", dayjs(date).format("YYYY-MM-DD"))
                                    }
                                    defaultDate={
                                        watch("next_date")
                                            ? new Date(watch("next_date") as string)
                                            : undefined
                                    }
                                    nextFields={{up: "หัวข้อ", down: "หัวข้อในครั้งถัดไป"}}

                                />
                            </Grid>
                            <InputTextareaFormManage
                                id="หัวข้อในครั้งถัดไป"
                                name="หัวข้อในครั้งถัดไป"
                                placeholder="หัวข้อในครั้งถัดไป"
                                register={register("next_topic")}
                                showLabel
                                msgError={errors.next_topic?.message}
                                nextFields={{up: "วันที่นัดถัดไป", down: "del"}}
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
                                <div>
                                    {/* ตัวเลือกการให้คะแนน */}
                                    <Controller
                                        name="rating"
                                        control={control}
                                        render={({ field }) => (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FaStar
                                                        key={star}
                                                        size={24}
                                                        color={
                                                            star <= (hover ?? 0) || star <= (field.value ?? 0)
                                                                ? "#ffc107"
                                                                : "#e4e5e9"
                                                        } // ใช้ ?? เพื่อเช็ค null
                                                        style={{ cursor: "pointer" }}
                                                        onMouseEnter={() => setHover(star)}
                                                        onMouseLeave={() => setHover(null)}
                                                        onClick={() =>
                                                            setValue("rating", field.value === star ? 0 : star)
                                                        } // อัพเดตค่าด้วย setValue
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    />
                                </div>
                                {/* แสดงคะแนน */}
                                <p
                                    style={{ marginLeft: "8px", fontSize: "16px" }}
                                    className="text-center items-center"
                                >
                                    คะแนนลูกค้า{" "}
                                    {rating === 0 ? (
                                        <>
                                            {/* <span style={{ color: "red" }}>*</span>  */}
                                            : <span style={{ color: "red" }}>ยังไม่มีคะแนน</span>
                                        </>
                                    ) : (
                                        `: ${rating}`
                                    )}{" "}
                                    / 5
                                </p>
                            </Grid>
                            {rating === 0 && errors.rating && (
                                <div className="text-require mt-[-12px]">{errors.rating.message}</div>
                            )}
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
                                    id="del"
                                    type="button"
                                    btnType="delete"
                                    onClick={handleDeleteOpen}
                                    className=" w-[100px] max-sm:w-full"
                                    nextFields={{up: "หัวข้อในครั้งถัดไป", down: "submit"}}
                                >
                                    ลบข้อมูล
                                </Buttons>
                                <Buttons
                                    id="submit"
                                    type="submit"
                                    btnType="submit"
                                    className=" w-[100px] max-sm:w-full"
                                    nextFields={{up: "del"}}
                                >
                                    บันทึกข้อมูล
                                </Buttons>

                            </Flex>

                        </Flex>
                    </>
                )}
            </form>
        </>
    );
};

export default CreateVisitingCustomer;
