import { TextField, Text, Flex, Button, Card } from "@radix-ui/themes";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Select from "react-select";
import { useLocation } from "react-router-dom";
import {
  getCustomerByID,
  updateCustomer,
  deleteCustomer,
  searchCustomer,
} from "@/services/ms.customer";
import { deleteFile, postFile } from "@/services/file.service";
import { PayLoadCreateCustomer } from "@/types/requests/request.ms-customer";
import InputAction from "@/components/customs/input/input.main.component";
import { useToast } from "@/components/customs/alert/toast.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { Grid } from "@radix-ui/themes";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import ButtonAttactment from "@/features/quotation/components/ButtonAttactment";
import DialogAttachment from "@/features/quotation/components/DialogAttachment";
import { MS_CUSTOMER_ALL } from "@/types/response/response.ms_customer";
import { CreateCustomerSchema } from "@/features/ms-customer/components/schemas/Zmod_Customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import Buttons from "@/components/customs/button/button.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import PaymentTermsForm from "./PaymentTermsForm";
import { permissionMap } from "@/utils/permissionMap";
import { useLocalProfileData } from "@/zustand/useProfile";
import { G } from "@react-pdf/renderer";

//เหลือวันที่ครบกำหนด
//เหลือคู่แข่งขัน
//เหลือภาษี
//เหลือรูป
//เหลือ * คำนำหน้า

export default function Create() {
  const [customerData, setCustomerData] = useState<MS_CUSTOMER_ALL>();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const location = useLocation();
  const CustomerId = location.state?.customer_id;
  const CustomerCode = location.state?.customer_code;
  const CreatedAt = location.state?.created_at;

  const [isChangeFile, setIsChangeFile] = useState<boolean>(false);
  const [openDialogImages, setOpenDialogImages] = useState<boolean>(false);

  const [paymentTerms, setPaymentTerms] = useState("เงินสด");
  const [paymentDays, setPaymentDays] = useState(0);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    register,
  } = useForm<PayLoadCreateCustomer>({
    defaultValues: {
      tax: 0,
      payment_terms: "เงินสด",
      payment_terms_day: 0,
      image_url: [],
      customer_tin: "",
    },
    resolver: zodResolver(CreateCustomerSchema),
  });
  const fetchCustomerById = () => {
    if (CustomerId) {
      getCustomerByID(CustomerId)
        .then((customer) => {
          if (customer.responseObject) {
            const customers = customer.responseObject;
            setCustomerData(customers);
            setValue("customer_code", CustomerCode ?? "");
            setValue("customer_prefix", customers.customer_prefix ?? "");
            setValue("customer_name", customers.customer_name ?? "");
            setValue("contact_name", customers.contact_name ?? "");
            setValue("customer_position", customers.customer_position ?? "");
            setValue("contact_number", customers.contact_number ?? "");
            setValue("line_id", customers.line_id ?? "");
            setValue("addr_number", customers.addr_number ?? "");
            setValue("addr_alley", customers.addr_alley ?? "");
            setValue("addr_street", customers.addr_street ?? "");
            setValue("addr_subdistrict", customers.addr_subdistrict ?? "");
            setValue("addr_district", customers.addr_district ?? "");
            setValue("addr_province", customers.addr_province ?? "");
            setValue("addr_postcode", customers.addr_postcode ?? "");
            setValue("payment_terms", customers.payment_terms || "เงินสด");
            setValue("payment_terms_day", customers.payment_terms_day || 0);
            setValue("tax", customers.tax || 0);
            setValue("comment_customer", customers.comment_customer ?? "");
            setValue("comment_sale", customers.comment_sale ?? "");
            setValue("competitor", customers.competitor ?? "");
            setValue("customer_tin", customers.customer_tin ?? "");

          } else {
            console.error("No responseObject found in response:", customer);
          }
        })
        .catch((err) => {
          showToast("Error fetching customer: " + err.message, false);
        });
    } else {
      console.log("CustomerId is missing!");
    }
  };
  useEffect(() => {

    fetchCustomerById();
  }, [CustomerId]);

    const onSubmitHandler = async (payload: PayLoadCreateCustomer) => {
    
    try {
      if (!CustomerId) {
        showToast("บันทึกข้อมูลลูกค้าไม่สำเร็จ: ไม่มีรหัสลูกค้า", false);
        return;
      }
      let filesURL = customerData?.image_url ?? "";
      if (isChangeFile) {
        if (customerData?.image_url) {
          filesURL = "";
          await deleteFile(customerData.image_url);
        }
        const formData = new FormData();
        if (payload?.image_url && payload.image_url?.length > 0) {
          Array.from(payload.image_url).map((file) => {
            formData.append("files", file);
          });

          const resImage_url = await postFile(formData);

          if (resImage_url.responseObject?.file_url) {
            filesURL = resImage_url.responseObject?.file_url;
          }
        }
      }
      if (payload.customer_tin && payload.customer_tin.length !== 13) {
        showToast("กรุณาระบุหมายเลขผู้เสียภาษีให้ครบ 13 หลัก", false);
        return;
      }   
      updateCustomer(CustomerId, {
        customer_code: payload.customer_code,
        customer_prefix: payload.customer_prefix ?? "",
        customer_name: payload.customer_name ?? "",
        contact_name: payload.contact_name ?? "",
        contact_number: payload.contact_number ?? "",
        customer_position: payload.customer_position ?? "",
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
        tax: payload.tax ?? 0,
        comment_customer: payload.comment_customer ?? "",
        comment_sale: payload.comment_sale ?? "",
        competitor: payload.competitor ?? "",
        image_url: filesURL,
        customer_tin: payload.customer_tin ?? "",
      }).then((res) => {
        if (res.success) {
          showToast("บันทึกข้อมูลลูกค้าสำเร็จ", true);
          fetchCustomerById();
          //navigate("/ms-customer");
        } else {
          showToast(res.message, false);
        }
      });
    } catch (error) {
      console.error("Error saving customer data:", error);
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteCustomer(CustomerId);
      if (response) {
        if (response.success) {
          showToast("ลบข้อมูลสําเร็จ", true);
          navigate("/ms-customer");
          fetchCustomerById();
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      console.error("Error saving customer data:", error);
      showToast("ลบข้อมูลไม่สําเร็จ ลูกค้ายังมีการถูกใช้งานในระบบ", false);
    }
  };
  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
    // navigate("/ms-customer");
  };
  const handleDeleteOpen = () => {
    setIsDeleteDialogOpen(true);
  };
  //---------------------------------------------------------------------------รูปภาพ

  const handleCloseDialogImaage = () => {
    setOpenDialogImages(false);
  };

  const { profile } = useLocalProfileData();

  const [disableFieldsPermission, setDisableFieldsPermission] =
    useState<boolean>(false);

  const checkPermission = () => {
    if (profile && profile.role?.role_name) {
      if (permissionMap["ลูกค้า"][profile.role?.role_name] !== "A") {
        setDisableFieldsPermission(true);
        return true;
      }
    }
  };

  useEffect(() => {
    checkPermission();
  }, [profile]);

  return (
    <>
      <Text size="6" weight="bold" className=" p-2 ">
        ข้อมูลลูกค้า
      </Text>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-3 w-full mt-4 bg-white rounded-md p-6"
      >
        {!customerData ? (
          <BoxLoadingData minHeight="100vh" />
        ) : (
          <>
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "2", xl: "2" }}
              gap="2"
              rows="repeat(2,auto)"
              width="auto"
            >
              <InputAction
                id={"รหัสลูกค้า"}
                label="รหัสลูกค้า"
                defaultValue={CustomerCode}
                value={CustomerCode}
                classNameInput="w-full"
                size="2"
                disabled={true}
              />
              <InputDatePicker
                id="วันที่"
                labelName={"วันที่"}
                onchange={() => {}}
                defaultDate={new Date(CreatedAt)}
                disabled
                nextFields={{down: "รหัสผู้เสียภาษี"}}
              />

           
<Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "2", xl: "2" }}
              gap="2"
              rows="repeat(2,auto)"
              width="auto"
            >
              <InputAction
                id="รหัสผู้เสียภาษี"
                label="รหัสผู้เสียภาษี"
                defaultValue={
                  watch("customer_tin") ? watch("customer_tin") : ""
                }
                placeholder="รหัสผู้เสียภาษี"
                value={watch("customer_tin") ?? ""}
                classNameInput="w-full"
                onChange={(e) => {
                  setValue("customer_tin", e.target.value);
                }}
                size="2"
                //require="true"
                type="tel"
                maxLength={13}
                
                //errorMessage={errors.customer_tin?.message}
                disabled={disableFieldsPermission}
                nextFields={{up: "วันที่", down: "คำนำหน้า"}}
              />
              <MasterSelectComponent
                id="คำนำหน้า"
                label="คำนำหน้า"
                onChange={(option) => {
                  const value = option ? String(option.value) : undefined;
                  setValue("customer_prefix", value);
                }}
                defaultValue={{
                  value: watch("customer_prefix") ?? "", // ใช้ค่า default จาก watch หรือ "" หากไม่มีค่า
                  label: watch("customer_prefix") ?? "", // ให้ label ตรงกับค่า customer_prefix
                }}
                valueKey="value" // ใช้ value จาก responseObject
                labelKey="label" // ใช้ label จาก responseObject
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={async () => {
                  return {
                    success: true,
                    message: "Get all success",
                    responseObject: [
                      { label: "บจก.", value: "บจก." },
                      { label: "หจก.", value: "หจก." },
                      { label: "บมจ.", value: "บมจ." },
                      { label: "ร้านค้า", value: "ร้านค้า" },
                      { label: "นามบุคคล", value: "นามบุคคล" },
                    ], // ใช้ข้อมูลในรูปแบบที่ถูกต้อง
                    statusCode: 200,
                  };
                }}
                require="true"
                errorMessage={errors.customer_prefix?.message}
                //isDisabled={disableField}
                //errorMessage={errors.car_year?.message}
                isDisabled={disableFieldsPermission}
                nextFields={{up: "รหัสผู้เสียภาษี", down: "ชื่อลูกค้า"}}
              />
              </Grid>

              <InputAction
                id={"ชื่อลูกค้า"}
                label="ชื่อลูกค้า"
                defaultValue={
                  watch("customer_name") ? watch("customer_name") : ""
                }
                placeholder="ชื่อลูกค้า"
                value={watch("customer_name") ?? ""}
                classNameInput="w-full"
                onChange={(e) => {
                  setValue("customer_name", e.target.value);
                }}
                size="2"
                require="true"
                errorMessage={errors.customer_name?.message}
                disabled={disableFieldsPermission}
                nextFields={{up: "คำนำหน้า", down: "ชื่อผู้ติดต่อ"}}
              />
            </Grid>
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "2", xl: "2" }}
              gap="2"
              rows="repeat(2,auto)"
              width="auto"
            >
              <InputAction
                id="ชื่อผู้ติดต่อ"
                label="ชื่อผู้ติดต่อ"
                defaultValue={
                  watch("contact_name") ? watch("contact_name") : ""
                }
                placeholder="ชื่อผู้ติดต่อ"
                value={watch("contact_name") ?? ""}
                classNameInput="w-full"
                onChange={(e) => {
                  setValue("contact_name", e.target.value);
                }}
                size="2"
                require="true"
                errorMessage={errors.contact_name?.message}
                disabled={disableFieldsPermission}
                nextFields={{up: "ชื่อลูกค้า", down: "ตำแหน่ง"}}
              />
              <InputAction
                id="ตำแหน่ง"
                label="ตำแหน่ง"
                defaultValue={
                  watch("customer_position") ? watch("customer_position") : ""
                }
                placeholder="ตำแหน่ง"
                value={watch("customer_position") ?? ""}
                classNameInput="w-full"
                onChange={(e) => {
                  setValue("customer_position", e.target.value);
                }}
                size="2"
                errorMessage={errors.customer_position?.message}
                disabled={disableFieldsPermission}
                nextFields={{up: "ชื่อผู้ติดต่อ", down: "เบอร์โทรติดต่อ"}}
              />

              <InputAction
                id="เบอร์โทรติดต่อ"
                label="เบอร์โทรติดต่อ"
                defaultValue={
                  watch("contact_number") ? watch("contact_number") : ""
                }
                placeholder="เบอร์โทรติดต่อ"
                value={watch("contact_number") ?? ""}
                classNameInput="w-full"
                onChange={(e) => {
                  setValue("contact_number", e.target.value);
                }}
                size="2"
                require="true"
                type="tel"
                maxLength={10}
                errorMessage={errors.contact_number?.message}
                disabled={disableFieldsPermission}
                nextFields={{up: "ตำแหน่ง", down: "Line ID"}}
              />
              <InputAction
                id={"Line ID"}
                label="ไอดี ไลน์"
                // placeholder={watch("line_id") === "" ? "Line ID" : watch("line_id")}
                placeholder="ไอดี ไลน์"
                value={watch("line_id") ?? ""}
                defaultValue={watch("line_id") ? watch("line_id") : ""}
                classNameInput="w-full "
                onChange={(e) => {
                  setValue("line_id", e.target.value);
                }}
                size="2"
                disabled={disableFieldsPermission}
                nextFields={{up: "เบอร์โทรติดต่อ", down: "ที่อยู่ เลขที่"}}
              />
            </Grid>
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <InputAction
                id="ที่อยู่ เลขที่"
                label="ที่อยู่ เลขที่"
                placeholder="เลขที่"
                defaultValue={watch("addr_number") ? watch("addr_number") : ""}
                value={watch("addr_number") ?? ""}
                classNameInput="w-full"
                onChange={(e) => {
                  setValue("addr_number", e.target.value);
                }}
                size="2"
                disabled={disableFieldsPermission}
                nextFields={{up: "Line ID", down: "ซอย"}}
              />
              <InputAction
                id="ซอย"
                label="ซอย"
                placeholder="ซอย"
                defaultValue={watch("addr_alley") ? watch("addr_alley") : ""}
                // placeholder={watch("addr_alley") === "" ? "ซอย" : watch("addr_alley")}
                value={watch("addr_alley") ?? ""}
                classNameInput="w-full"
                onChange={(e) => {
                  setValue("addr_alley", e.target.value);
                }}
                size="2"
                disabled={disableFieldsPermission}
                nextFields={{up: "ที่อยู่ เลขที่", down: "ถนน"}}
              />
              <InputAction
                id="ถนน"
                label="ถนน"
                placeholder="ถนน"
                defaultValue={watch("addr_street") ? watch("addr_street") : ""}
                // placeholder={watch("addr_street") === "" ? "ถนน" : watch("addr_street")}
                value={watch("addr_street") ?? ""}
                classNameInput="w-full"
                onChange={(e) => {
                  setValue("addr_street", e.target.value);
                }}
                size="2"
                disabled={disableFieldsPermission}
                nextFields={{up: "ซอย", down: "ตําบล/แขวง"}}
              />
              <InputAction
                id="ตําบล/แขวง"
                label="ตําบล/แขวง"
                placeholder="ตําบล/แขวง"
                defaultValue={
                  watch("addr_subdistrict") ? watch("addr_subdistrict") : ""
                }
                // placeholder={watch("addr_subdistrict") === "" ? "ตําบล/แขวง" : watch("addr_subdistrict")}
                value={watch("addr_subdistrict") ?? ""}
                classNameInput="w-full"
                onChange={(e) => {
                  setValue("addr_subdistrict", e.target.value);
                }}
                size="2"
                disabled={disableFieldsPermission}
                nextFields={{up: "ถนน", down: "อําเภอ/เขต"}}
              />
            </Grid>
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <InputAction
                id="อําเภอ/เขต"
                label="อําเภอ/เขต"
                placeholder="อําเภอ/เขต"
                defaultValue={
                  watch("addr_district") ? watch("addr_district") : ""
                }
                // placeholder={watch("addr_district") === "" ? "อําเภอ/เขต" : watch("addr_district")}
                value={watch("addr_district") ?? ""}
                classNameInput="w-full"
                onChange={(e) => {
                  setValue("addr_district", e.target.value);
                }}
                size="2"
                disabled={disableFieldsPermission}
                nextFields={{up: "ตําบล/แขวง", down: "จังหวัด"}}
              />
              <InputAction
                id="จังหวัด"
                label="จังหวัด"
                placeholder="จังหวัด"
                defaultValue={
                  watch("addr_province") ? watch("addr_province") : ""
                }
                // placeholder={watch("addr_province") === "" ? "จังหวัด" : watch("addr_province")}
                value={watch("addr_province") ?? ""}
                classNameInput="w-full"
                onChange={(e) => {
                  setValue("addr_province", e.target.value);
                }}
                size="2"
                disabled={disableFieldsPermission}
                nextFields={{up: "อําเภอ/เขต", down: "รหัสไปรษณีย์"}}
              />
              <InputAction
                id="รหัสไปรษณีย์"
                label="รหัสไปรษณีย์"
                placeholder="รหัสไปรษณีย์"
                defaultValue={
                  watch("addr_postcode") ? watch("addr_postcode") : ""
                }
                // placeholder={watch("addr_postcode") === "" ? "รหัสไปรษณีย์" : watch("addr_postcode")}
                type="tel"
                value={watch("addr_postcode") ?? ""}
                classNameInput="w-full"
                onChange={(e) => {
                  setValue("addr_postcode", e.target.value);
                }}
                size="2"
                maxLength={5}
                disabled={disableFieldsPermission}
                nextFields={{up: "จังหวัด", down: "ความคิดเห็นจากลูกค้า"}}
              />
            </Grid>
            <Grid
              columns={{ initial: "1", md: "1", sm: "1", lg: "1", xl: "1" }}
              rows="repeat(auto)"
              gap="3" // ระยะห่างระหว่างแต่ละคอลัมน์
              className="items-center"
              width="100%"
            >
              <PaymentTermsForm
                paymentTerms={paymentTerms}
                paymentDays={paymentDays}
                createdAt={CreatedAt}
                // ส่งค่าเริ่มต้นจาก customerData
                defaultPaymentTerms={customerData?.payment_terms}
                defaultPaymentDays={customerData?.payment_terms_day}
                onTermsChange={(terms) => {
                  setPaymentTerms(terms);
                  setValue("payment_terms", terms);
                }}
                onDaysChange={(days) => {
                  setPaymentDays(days);
                  setValue("payment_terms_day", days);
                }}
                disabled={disableFieldsPermission}
              />
            </Grid>
            <Text size="6" weight="bold" className="">
              ความคิดเห็น
            </Text>
            <Grid
              columns={{ initial: "1", sm: "1", md: "2", lg: "2", xl: "2" }}
              rows={"repeat(auto)"}
              gap={"3"}
            >
              <InputTextareaFormManage
                id="ความคิดเห็นจากลูกค้า"
                name={"ความคิดเห็นจากลูกค้า"}
                placeholder="ความคิดเห็นจากลูกค้า"
                register={{ ...register("comment_customer") }}
                msgError={errors.comment_customer?.message}
                showLabel
                disabled={disableFieldsPermission}
                nextFields={{up: "รหัสไปรษณีย์", down: "ความคิดเห็นจากผู้ขาย"}}
              />

              <InputTextareaFormManage
                id="ความคิดเห็นจากผู้ขาย"
                name={"ความคิดเห็นจากผู้ขาย"}
                placeholder="ความคิดเห็นจากผู้ขาย"
                register={{ ...register("comment_sale") }}
                msgError={errors.comment_sale?.message}
                showLabel
                disabled={disableFieldsPermission}
                nextFields={{up: "ความคิดเห็นจากลูกค้า", down: "คู่แข่งขัน"}}
              />
            </Grid>
            <Grid
              columns={{ initial: "1", sm: "1", md: "2", lg: "3", xl: "3" }}
              rows={"repeat(auto)"}
              gap={"3"}
            >
              {/* ปุ่ม */}
              <ButtonAttactment
                label={"ไฟล์แนบ"}
                onClick={() => setOpenDialogImages(true)}
              />

              {/* อินพุต */}
              <InputAction
                id={"คู่แข่งขัน"}
                placeholder={"คู่แข่งขัน"}
                value={watch("competitor")?.toString() ?? ""}
                onChange={(e) => {
                  setValue("competitor", e.target.value);
                }}
                label={"คู่แข่งขัน"}
                size={"2"}
                defaultValue={customerData?.competitor ?? ""}
                classNameInput=" w-full"
                disabled={disableFieldsPermission}
                nextFields={{up: "ความคิดเห็นจากผู้ขาย", down: "ภาษี"}}
              />
              <InputAction
                id={"ภาษี"}
                placeholder={"ภาษี"}
                value={watch("tax")?.toString() ?? "0"}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const parsedValue = parseInt(inputValue);
                  setValue("tax", isNaN(parsedValue) ? 0 : parsedValue);
                }}
                label={"ภาษี"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("tax")?.toString()}
                classNameInput=" w-full"
                disabled={disableFieldsPermission}
                nextFields={{up: "คู่แข่งขัน", down: "del"}}
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
                รหัสลูกค้า <span className="text-red-500">{CustomerCode}</span>
                <br />
                ชื่อลูกค้า{" "}
                <span className="text-red-500">
                  {customerData?.customer_name || "-"}
                </span>
                <br />
                {/* ประเภท <span className="text-red-500">{customerData?. || "-"}</span> */}
              </p>
            </DialogComponent>
            {/* ปุ่ม */}

            {!disableFieldsPermission && (
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
                  nextFields={{up: "ภาษี", down: "submit"}}
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
            )}
          </>
        )}

        <DialogAttachment
          quotationData={customerData}
          isOpen={openDialogImages}
          onClose={handleCloseDialogImaage}
          title={"ภาพลูกค้า"}
          defaultImage={watch("image_url") ?? []}
          onChangeImage={(i) => {
            setIsChangeFile(true);
            setValue("image_url", i);
          }}
          isChangeFile={isChangeFile}
          disable={disableFieldsPermission} // Added disable prop
        />
      </form>
    </>
  );
}
