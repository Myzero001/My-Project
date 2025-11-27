import { Flex, Grid, Text } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MSsupplierCreateSchema } from "@/features/ms-supplier/schemas/MSsupplierCreate";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import InputAction from "@/components/customs/input/input.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import Buttons from "@/components/customs/button/button.main.component";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMSSupplierById, updateMSSupplier, deleteMSSupplier } from "@/services/ms.Supplier";
import { PayLoadCreateMSSupplier } from "@/types/requests/request.ms-supplier";
import { TypeMasterSupplierAll } from "@/types/response/response.ms-supplier";
import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import dayjs from "dayjs";
import { useToast } from "@/components/customs/alert/toast.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const FormCreate = () => {
    const [supplierData, setSuplierData] = useState<TypeMasterSupplierAll>();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const location = useLocation();
    const supplierId = location.state?.supplier_id;

    const {
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        register,
        control,
    } = useForm<PayLoadCreateMSSupplier>({
        resolver: zodResolver(MSsupplierCreateSchema), // ใช้ schema ตรวจสอบ
        defaultValues: {
            payment_terms: "เงินสด", // ค่าเริ่มต้น
            payment_terms_day: 0,
        },
    });


    const onSubmitHandler = async (payload: PayLoadCreateMSSupplier) => {
        if (!supplierId) {
            showToast("บันทึกข้อมูลร้านค้าไม่สำเร็จ: ไม่มีรหัสร้านค้า", false);
            return;
        }
        updateMSSupplier({
            supplier_id: supplierId,
            supplier_code: payload.supplier_code ?? "",
            supplier_name: payload.supplier_name ?? "",
            contact_name: payload.contact_name ?? "",
            contact_number: payload.contact_number ?? "",
            line_id: payload.line_id ?? "",
            addr_number: payload.addr_number ?? "",
            addr_alley: payload.addr_alley ?? "",
            addr_street: payload.addr_street ?? "",
            addr_subdistrict: payload.addr_subdistrict ?? "",
            addr_district: payload.addr_district ?? "",
            addr_province: payload.addr_province ?? "",
            addr_postcode: payload.addr_postcode ?? "",
            payment_terms: payload.payment_terms ?? "เงินสด",
            payment_terms_day: payload.payment_terms_day ?? 0,
            remark: payload.remark ?? "",
            business_type: payload.business_type ?? "",
        })
            .then(() => {
                showToast("บันทึกข้อมูลร้านค้าสำเร็จ", true);
                fetchMSSupplierById();
                // handleClickToNavigate();
            })
            .catch(() => {
                showToast("บันทึกข้อมูลร้านค้าไม่สำเร็จ", false);
            });
    };


    const fetchMSSupplierById = () => {
        if (supplierId) {
            getMSSupplierById(supplierId)
                .then((res) => {
                    if (res.responseObject) {
                        const supplier = res.responseObject;
                        setSuplierData(supplier);
                        setValue("supplier_code", supplier.supplier_code ?? "");
                        setValue("supplier_name", supplier.supplier_name ?? "");
                        setValue("contact_name", supplier.contact_name ?? "");
                        setValue("contact_number", supplier.contact_number ?? "");
                        setValue("line_id", supplier.line_id ?? "");
                        setValue("addr_number", supplier.addr_number ?? "");
                        setValue("addr_alley", supplier.addr_alley ?? "");
                        setValue("addr_street", supplier.addr_street ?? "");
                        setValue("addr_subdistrict", supplier.addr_subdistrict ?? "");
                        setValue("addr_district", supplier.addr_district ?? "");
                        setValue("addr_province", supplier.addr_province ?? "");
                        setValue("addr_postcode", supplier.addr_postcode ?? "");
                        setValue("payment_terms", supplier.payment_terms || "เงินสด");
                        setValue("payment_terms_day", supplier.payment_terms_day || 0);
                        setValue("remark", supplier.remark ?? "");
                        setValue("business_type", supplier.business_type ?? "");
                        setValue(
                            "created_at",
                            supplier.created_at
                                ? dayjs(supplier.created_at).toDate()
                                : dayjs().toDate()
                        );
                    } else {
                        console.error("No responseObject found in response:", res);
                    }
                })
                .catch((err) => {
                    showToast("Error fetching supplier: " + err.message, false);
                    console.error("Error fetching supplier by ID:", err);
                });
        }
    };


    const handleDeleteConfirm = async () => {
        if (!supplierId) {
            showToast("กรุณาระบุรายการร้านค้าที่ต้องการลบ", false);
            return;
        }
        const data = {
            supplier_id: supplierId,
        };
        try {

            const response = await deleteMSSupplier(supplierId);

            if (response.statusCode === 200) {
                showToast("ลบรายการร้านค้าเรียบร้อยแล้ว", true);
                setIsDeleteDialogOpen(false);  // ปิด Dialog ลบ
                fetchMSSupplierById();
            } else {
                showToast("ไม่สามารถลบรายการร้านค้าได้", false);
            }
        } catch (error) {
            showToast("ไม่สามารถลบรายการร้านค้าได้", false);
        }
    };

    useEffect(() => {
        fetchMSSupplierById();
    }, [supplierId]);
    const handleDeleteClose = () => {
        setIsDeleteDialogOpen(false);
        handleClickToNavigate();
    };
    const handleDeleteOpen = () => {
        // setCreateMasterSupplierCodeName("");
        setIsDeleteDialogOpen(true);
    };
    const handleClickToNavigate = () => {
        navigate(`/ms-supplier`);
    };


    return (
        <>
            <form onSubmit={handleSubmit(onSubmitHandler)}
                className="flex flex-col gap-3 w-full mt-4 bg-white rounded-md p-6"
            >
                {!supplierData ? (
                    <BoxLoadingData minHeight="100vh" />
                ) : (
                    <>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "2", xl: "2" }}
                            gap="3"
                            rows="repeat(2, auto)"

                            width="auto"
                        >
                            <InputAction
                                id={"รหัสร้านค้า"}
                                label="รหัสร้านค้า"
                                defaultValue={supplierData?.supplier_code ? supplierData.supplier_code : ""}
                                value={supplierData?.supplier_code ?? ""}
                                classNameInput="w-full"
                                size="2"
                                disabled={true}
                            />
                            <InputDatePicker
                                id="วันที่"
                                labelName={"วันที่"}
                                onchange={() => { }}
                                defaultDate={watch("created_at")} // ไม่ต้องแปลงเพิ่ม เพราะเป็น Date แล้ว
                                disabled
                            />
                        </Grid>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "3", lg: "3", xl: "3" }}
                            gap="3"
                            rows="repeat(2, auto)"
                            width="auto"
                        >
                            <InputAction
                                id={"ชื่อร้านค้า"}
                                label="ชื่อร้านค้า"
                                defaultValue={watch("supplier_name") ? watch("supplier_name") : ""}
                                placeholder="ชื่อร้านค้า"
                                value={watch("supplier_name") ?? ""}
                                className="col-span-2"
                                classNameInput="w-full"
                                onChange={(e) => { setValue("supplier_name", e.target.value) }}
                                size="2"
                                require="true"
                                errorMessage={errors.supplier_name?.message}
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
                            />
                        </Grid>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                            gap="3"
                            rows="repeat(2, auto)"
                            width="auto"
                        >
                            <InputAction
                                label="ชื่อผู้ติดต่อ"
                                defaultValue={watch("contact_name") ? watch("contact_name") : ""}
                                placeholder="ชื่อผู้ติดต่อ"
                                value={watch("contact_name") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("contact_name", e.target.value) }}
                                size="2"
                                require="true"
                                errorMessage={errors.contact_name?.message}
                            />
                            <InputAction
                                label="เบอร์โทรติดต่อ"
                                defaultValue={watch("contact_number") ? watch("contact_number") : ""}
                                placeholder="เบอร์โทรติดต่อ"
                                value={watch("contact_number") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("contact_number", e.target.value) }}
                                size="2"
                                require="true"
                                type="tel"
                                maxLength={10}
                                errorMessage={errors.contact_number?.message}
                            />
                        </Grid>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
                            gap="3"
                            rows="repeat(2, auto)"
                            width="auto"
                        >
                            <InputAction
                                label="ที่อยู่ เลขที่"
                                placeholder="เลขที่"
                                defaultValue={watch("addr_number") ? watch("addr_number") : ""}
                                value={watch("addr_number") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_number", e.target.value) }}
                                size="2"
                            />
                            <InputAction
                                label="ซอย"
                                placeholder="ซอย"
                                defaultValue={watch("addr_alley") ? watch("addr_alley") : ""}
                                // placeholder={watch("addr_alley") === "" ? "ซอย" : watch("addr_alley")}
                                value={watch("addr_alley") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_alley", e.target.value) }}
                                size="2"
                            />
                            <InputAction
                                label="ถนน"
                                placeholder="ถนน"
                                defaultValue={watch("addr_street") ? watch("addr_street") : ""}
                                // placeholder={watch("addr_street") === "" ? "ถนน" : watch("addr_street")}
                                value={watch("addr_street") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_street", e.target.value) }}
                                size="2"
                            />
                            <InputAction
                                label="ตําบล/แขวง"
                                placeholder="ตําบล/แขวง"
                                defaultValue={watch("addr_subdistrict") ? watch("addr_subdistrict") : ""}
                                // placeholder={watch("addr_subdistrict") === "" ? "ตําบล/แขวง" : watch("addr_subdistrict")}
                                value={watch("addr_subdistrict") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_subdistrict", e.target.value) }}
                                size="2"
                            />
                        </Grid>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
                            gap="3"
                            rows="repeat(2, auto)"

                            width="auto"
                        >
                            <InputAction
                                label="อําเภอ/เขต"
                                placeholder="อําเภอ/เขต"
                                defaultValue={watch("addr_district") ? watch("addr_district") : ""}
                                // placeholder={watch("addr_district") === "" ? "อําเภอ/เขต" : watch("addr_district")}
                                value={watch("addr_district") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_district", e.target.value) }}
                                size="2"
                            />
                            <InputAction
                                label="จังหวัด"
                                placeholder="จังหวัด"
                                defaultValue={watch("addr_province") ? watch("addr_province") : ""}
                                // placeholder={watch("addr_province") === "" ? "จังหวัด" : watch("addr_province")}
                                value={watch("addr_province") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_province", e.target.value) }}
                                size="2"
                            />
                            <InputAction
                                label="รหัสไปรษณีย์"
                                placeholder="รหัสไปรษณีย์"
                                defaultValue={watch("addr_postcode") ? watch("addr_postcode") : ""}
                                // placeholder={watch("addr_postcode") === "" ? "รหัสไปรษณีย์" : watch("addr_postcode")}
                                type="tel"
                                value={watch("addr_postcode") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_postcode", e.target.value) }}
                                size="2"
                                maxLength={5}
                            />
                        </Grid>
                        <Grid
                            columns={{
                                initial: "1", md: "repeat(8, auto)", sm: "repeat(8, auto)", lg: "repeat(8, auto)", xl: "repeat(8, auto)"
                                // \md: "repeat(8, auto)", // หน้าจอขนาดกลางขึ้นไป: 8 คอลัมน์
                            }}
                            rows="repeat( auto)"

                            gap="3" // ระยะห่างระหว่างแต่ละคอลัมน์
                            className="items-center"
                            width="100%"
                        >
                            {/* เงื่อนไขการชำระเงิน */}
                            <Text>เงื่อนไขการชำระเงิน</Text>

                            {/* เงินสด */}
                            <div className="flex items-center space-x-2 w-full">
                                <input
                                    type="radio"
                                    value="เงินสด"
                                    className="rounded"
                                    checked={watch("payment_terms") === "เงินสด"}
                                    {...register("payment_terms")}
                                    onChange={() => {
                                        setValue("payment_terms", "เงินสด");
                                        setValue("payment_terms_day", 0); // ตั้งค่าให้ว่างเมื่อเลือก "เงินสด"
                                    }}
                                />
                                <span>เงินสด</span>
                            </div>

                            {/* เครดิต */}
                            <div className="flex items-center space-x-2 w-full">
                                <input
                                    type="radio"
                                    value="เครดิต"
                                    className="rounded"
                                    checked={watch("payment_terms") === "เครดิต"}
                                    {...register("payment_terms")}
                                    onChange={() => {
                                        setValue("payment_terms", "เครดิต");
                                        setValue("payment_terms_day", 1); // ตั้งค่าเริ่มต้นเป็น 1 วันเมื่อเลือก "เครดิต"
                                    }}
                                />
                                <span>เครดิต</span>

                                <Controller
                                    name="payment_terms_day"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="number"
                                            placeholder={
                                                watch("payment_terms") === "เงินสด" || !field.value
                                                    ? "จำนวนวัน"
                                                    : String(field.value)
                                            }
                                            value={
                                                watch("payment_terms") === "เงินสด" ? "" : field.value ?? 0 // กำหนดค่าให้เหมาะสม
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, ""); // กรองเฉพาะตัวเลข
                                                const numericValue = value ? Number(value) : 0;
                                                if (numericValue <= 366) {
                                                    field.onChange(numericValue);
                                                } else {
                                                    field.onChange(366);
                                                }
                                            }}
                                            disabled={watch("payment_terms") === "เงินสด"}
                                            className="border w-24 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-sm"
                                        />
                                    )}
                                />

                                <span>วัน</span>
                            </div>



                        </Grid>
                        <InputTextareaFormManage
                            name={"หมายเหตุ"}
                            placeholder="หมายเหตุ"
                            register={{ ...register("remark") }}
                            msgError={errors.remark?.message}
                            showLabel
                        />

                        <Grid
                            columns={{ initial: "1", md: "1", sm: "1", lg: "1", xl: "1" }}
                            gap="3"
                            rows="repeat(2, auto)"
                            width="auto"
                        >
                            <InputAction
                                label={"ประเภทกิจการ"}
                                placeholder={"ประเภทกิจการ"}
                                // placeholder={supplierData?.business_type === "" ? "ประเภทกิจการ" : supplierData.business_type}
                                defaultValue={watch("business_type")}
                                value={watch("business_type") ?? ""}
                                onChange={(e) =>
                                    setValue("business_type", e.target.value)
                                }
                                labelOrientation={"vertical"}
                                classNameInput="w-full"
                                size={"2"}
                                require="true"
                                errorMessage={errors.business_type?.message}
                            />
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
                                รหัสร้านค้า <span className="text-red-500">{supplierData?.supplier_code || "-"}</span>
                                <br />
                                ชื่อร้านค้า <span className="text-red-500">{supplierData?.supplier_name || "-"}</span>
                                <br />
                                ประเภทกิจการ <span className="text-red-500">{supplierData?.business_type || "-"}</span>
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
                                type="button"
                                btnType="delete"
                                onClick={handleDeleteOpen}
                                className=" w-[100px] max-sm:w-full"
                            >
                                ลบข้อมูล
                            </Buttons>
                            <Buttons
                                type="submit"
                                btnType="submit"
                                // variant="outline"
                                // onClick={() => {
                                //     handleSubmit(onSubmitHandler)();
                                //     console.log("บันทึก");
                                // }}
                                className=" w-[100px] max-sm:w-full"
                            >
                                บันทึกข้อมูล
                            </Buttons>

                        </Flex>
                    </>
                )}
            </form>
        </>
    );
};

export default FormCreate;