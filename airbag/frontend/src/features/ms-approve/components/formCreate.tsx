import { Flex, Grid, Text } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuatationCreateSchema } from "../schemas/quatationCreate";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import InputAction from "@/components/customs/input/input.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import Buttons from "@/components/customs/button/button.main.component";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuotationById } from "@/services/ms.quotation.service";
import { QUOTATION_ALL } from "@/types/response/response.quotation";
import { getAllBrandsData } from "@/services/ms.brand";
import { getByBrand } from "@/services/ms.brandmodel";
import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import { generateCarYears } from "@/utils/generateCarYears";
import { getAllColors } from "@/services/color.service";
import dayjs from "dayjs";
import { getAllRepairData } from "@/services/msRepir.service";
import { TypeRepair } from "@/types/response/response.ms-repair";
import QuotationStatus from "@/components/customs/badges/quotationStatus";
import DialogApproveQuotation from "./dialogApproveQuotation";
import { QUOTATION_STATUS } from "@/types/quotationStatus";
import DialogRejectQuotation from "./dialogRejectQuotation";
import ButtonAttactment from "@/features/quotation/components/ButtonAttactment";
import CheckboxWithInput from "@/features/quotation/components/CheckboxWithInput";
import DialogAttachment from "@/features/quotation/components/DialogAttachment";
import { PayLoadCreateQuotation } from "@/types/requests/request.quotation";
import CheckboxMainComponent from "@/components/customs/checkboxs/checkbox.main.component";
import DialogHistory from "@/components/customs/dialog/dialog.historyQuotation";
import HistoryActivity from "@/components/customs/history/historyActivity";
import { QUOTATION_LOG_STATUS } from "@/types/response/response.quotation-log-status";
import { getQuotationLogStatusByQuotationId } from "@/services/ms-quotation.log.status.service";

const FormCreate = () => {
  const [openDialogImages, setOpenDialogImages] = useState<boolean>(false);
  const [quotationData, setQuotationData] = useState<QUOTATION_ALL>();
  const [repairDatas, setRepairDatas] = useState<TypeRepair[]>();

  const [isOpenApproveQuotation, setIsOpenApproveQuotation] =
    useState<boolean>(false);
  const [isOpenRejectQuotation, setIsOpenRejectQuotation] =
    useState<boolean>(false);
  const [isOpenDialogHistory, setIsOpenDialogHistory] =
    useState<boolean>(false);
  const [quotationLogStatus, setQuotationLogStatus] =
    useState<QUOTATION_LOG_STATUS[]>();

  const CAR_YEAR = generateCarYears();

  const { quotationId } = useParams();

  const {
    formState: { errors },
    watch,
    setValue,
    register,
  } = useForm<PayLoadCreateQuotation>({
    defaultValues: {
      image_url: [],
    },
    resolver: zodResolver(QuatationCreateSchema),
  });
  const handleCloseDialogImaage = () => {
    setOpenDialogImages(false);
  };
  const updateJsonStringRepairs = (
    jsonString: string,
    id: string,
    price: string,
    isChecked: boolean
  ) => {
    // แปลง JSON string เป็น array
    let dataArray = [];
    try {
      dataArray = JSON.parse(jsonString);
    } catch {
      dataArray = [];
    }

    // ตรวจสอบว่าข้อมูลนี้มีอยู่แล้วหรือไม่
    const existingIndex = dataArray.findIndex(
      (item: { id: string }) => item.id === id
    );

    if (isChecked) {
      // ถ้า checkbox = true
      if (existingIndex !== -1) {
        // ถ้ามีข้อมูลอยู่แล้ว ให้แก้ไขข้อมูล
        dataArray[existingIndex].price = price;
      } else {
        // ถ้าไม่มีข้อมูล ให้เพิ่มใหม่
        dataArray.push({ id, price });
      }
    } else {
      // ถ้า checkbox = false
      if (existingIndex !== -1) {
        // ลบข้อมูลออก
        dataArray.splice(existingIndex, 1);
      }
    }

    // แปลง array กลับเป็น JSON string
    return JSON.stringify(dataArray);
  };

  const handleApproveQuotation = () => {
    setIsOpenApproveQuotation(true);
  };

  const handleRejectQuotation = () => {
    setIsOpenRejectQuotation(true);
  };

  const onConfirmApproveQuotation = () => {
    setIsOpenApproveQuotation(false);
    setIsOpenRejectQuotation(false);
    fetchQuotationById();

    if (quotationId) {
      getQuotationLogStatusByQuotationId(quotationId).then((response) => {
        setQuotationLogStatus(response.responseObject);
      });
    }
  };

  const fetchQuotationById = () => {
    if (quotationId) {
      getQuotationById(quotationId).then((quotation) => {
        setQuotationData(quotation.responseObject);

        setValue("addr_number", quotation.responseObject?.addr_number);
        setValue("addr_alley", quotation.responseObject?.addr_alley);
        setValue("addr_street", quotation.responseObject?.addr_street);
        setValue("addr_subdistrict", quotation.responseObject?.addr_subdistrict);
        setValue("addr_district", quotation.responseObject?.addr_district);
        setValue("addr_province", quotation.responseObject?.addr_province);
        setValue("addr_postcode", quotation.responseObject?.addr_postcode);
        setValue("customer_name", quotation.responseObject?.customer_name ?? "");
        setValue("position", quotation.responseObject?.position ?? "");
        setValue("quotation_doc", quotation.responseObject?.quotation_doc);
        setValue(
          "contact_number",
          quotation.responseObject?.contact_number ?? ""
        );
        setValue("line_id", quotation.responseObject?.line_id ?? "");
        setValue("brand_id", quotation.responseObject?.brand_id ?? undefined);
        setValue("model_id", quotation.responseObject?.model_id ?? undefined);
        setValue("car_year", quotation.responseObject?.car_year ?? undefined);
        setValue(
          "car_color_id",
          quotation.responseObject?.car_color_id ?? undefined
        );
        setValue(
          "total_price",
          parseInt(quotation.responseObject?.total_price ?? "0", 10)
        );
        setValue("tax", quotation.responseObject?.tax ?? 0);
        setValue("deadline_day", quotation.responseObject?.deadline_day ?? 0);
        setValue(
          "appointment_date",
          quotation.responseObject?.appointment_date ??
            dayjs().format("YYYY-MM-DD")
        );
        setValue(
          "repair_summary",
          JSON.stringify(quotation.responseObject?.quotationRepair) ?? undefined
        );
        setValue("remark", quotation.responseObject?.remark ?? "");
        setValue(
          "is_box_detail",
          quotation.responseObject?.is_box_detail ?? false
        );
      });
    }
  };

  useEffect(() => {
    fetchQuotationById();

    getAllRepairData().then((data) => {
      setRepairDatas(data.responseObject);
    });
  }, [quotationId]);

  useEffect(() => {
    if (quotationId) {
      getQuotationLogStatusByQuotationId(quotationId).then((response) => {
        setQuotationLogStatus(response.responseObject);
      });
    }
  }, [quotationId]);

  return (
    <>
      <Flex gap={"3"} justify={"between"}>
        <Flex gap={"3"}>
          <Text size="6" weight="bold" className="text-center">
            ใบเสนอราคา
          </Text>
          <QuotationStatus
            value={quotationData?.quotation_status ?? "pending"}
          />
        </Flex>

        <Buttons
          type="button"
          btnType="default"
          variant="outline"
          className="  lg:hidden"
          onClick={() => setIsOpenDialogHistory(true)}
        >
          ประวัติใบเสนอราคา
        </Buttons>
      </Flex>
      <div className=" flex gap-4">
        <div className="flex flex-col gap-3 w-full mt-4 bg-white rounded-md p-6">
          {!quotationData ? (
            <BoxLoadingData minHeight="100vh" />
          ) : (
            <>
              <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                gap="3"
                rows="repeat(2, 64px)"
                width="auto"
              >
                <InputDatePicker
                  id="วันที่"
                  labelName={"วันที่"}
                  onchange={() => {}}
                  defaultDate={new Date(watch("appointment_date") as string)}
                  disabled
                />

                <InputAction
                  id={"เลขที่ใบเสนอราคา"}
                  placeholder={"เลขที่ใบเสนอราคา"}
                  value={quotationData?.quotation_doc ?? ""}
                  onChange={() => {}}
                  label={"เลขที่ใบเสนอราคา"}
                  labelOrientation={"vertical"}
                  size={"2"}
                  defaultValue={quotationData?.quotation_doc ?? ""}
                  classNameInput=" w-full"
                  disabled
                />
                {}
                <InputAction
                  id={"รหัสลูกค้า"}
                  placeholder={"รหัสลูกค้า"}
                  value={quotationData?.master_customer.customer_code}
                  onChange={() => {}}
                  label={"รหัสลูกค้า"}
                  labelOrientation={"vertical"}
                  size={"2"}
                  defaultValue={quotationData?.master_customer.customer_code}
                  classNameInput=" w-full"
                  disabled
                />
                <InputAction
                  id={"คำนำหน้ากิจการ "}
                  placeholder={"คำนำหน้ากิจการ "}
                  value={quotationData?.master_customer.customer_prefix ?? ""}
                  onChange={() => {}}
                  label={"คำนำหน้ากิจการ "}
                  labelOrientation={"vertical"}
                  size={"2"}
                  defaultValue={
                    quotationData?.master_customer.customer_prefix ?? ""
                  }
                  classNameInput=" w-full"
                  disabled
                />
                <InputAction
                  id={"ชื่อกิจการ"}
                  placeholder={"ชื่อกิจการ"}
                  value={quotationData?.master_customer.contact_name ?? ""}
                  onChange={() => {}}
                  label={"ชื่อกิจการ"}
                  labelOrientation={"vertical"}
                  size={"2"}
                  defaultValue={
                    quotationData?.master_customer.contact_name ?? ""
                  }
                  classNameInput=" w-full"
                  disabled
                />
              </Grid>
              <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                gap="3"
                rows="repeat(2, 64px)"
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
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
                />
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
                  disabled
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
                  disabled
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
                  disabled
                />
              </Grid>
              <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                gap="3"
                rows="repeat(2, 64px)"
                width="auto"
              >
                <InputAction
                  id={"ชื่อ บุคคล"}
                  placeholder={"ชื่อ บุคคล"}
                  value={watch("customer_name") ?? ""}
                  onChange={(e) => setValue("customer_name", e.target.value)}
                  label={"ชื่อ บุคคล"}
                  labelOrientation={"vertical"}
                  size={"2"}
                  defaultValue={watch("customer_name")}
                  classNameInput=" w-full"
                  disabled
                />
                <InputAction
                  id={"ตำแหน่ง"}
                  placeholder={"ตำแหน่ง"}
                  value={watch("position") ?? ""}
                  onChange={(e) => setValue("position", e.target.value)}
                  label={"ตำแหน่ง"}
                  labelOrientation={"vertical"}
                  size={"2"}
                  defaultValue={watch("position")}
                  classNameInput=" w-full"
                  disabled
                />
                <InputAction
                  id={"เบอร์โทร"}
                  placeholder={"เบอร์โทร"}
                  value={watch("contact_number") ?? ""}
                  onChange={(e) => setValue("contact_number", e.target.value)}
                  label={"เบอร์โทร"}
                  labelOrientation={"vertical"}
                  size={"2"}
                  defaultValue={watch("contact_number")}
                  classNameInput=" w-full"
                  type="tel"
                  maxLength={10}
                  disabled
                />
                <InputAction
                  id={"Line ID"}
                  placeholder={"ไอดี ไลน์"}
                  value={watch("line_id") ?? ""}
                  onChange={(e) => setValue("line_id", e.target.value)}
                  label={"ไอดี ไลน์"}
                  labelOrientation={"vertical"}
                  size={"2"}
                  defaultValue={watch("line_id")}
                  classNameInput=" w-full"
                  disabled
                />
              </Grid>
              <ButtonAttactment
                label={"ไฟล์แนบ"}
                onClick={() => setOpenDialogImages(true)}
              />
              <label htmlFor="" className=" text-base">
                มีการซ่อมกล่องหรือไม่มี
              </label>

              <CheckboxMainComponent
                labelName={"กล่อง"}
                defaultChecked={watch("is_box_detail")}
                onChange={(c) => {
                  setValue("is_box_detail", c);
                }}
                disabled
              />
              <label htmlFor="" className=" text-base">
                รายละเอียดรถที่เข้าซ่อม{" "}
              </label>
              <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                gap="3"
                rows="repeat(auto, 64px)"
                width="auto"
              >
                {repairDatas &&
                  repairDatas?.map((item) => {
                    return (
                      <CheckboxWithInput
                        key={item.master_repair_id}
                        id={item.master_repair_id}
                        labelName={item.master_repair_name}
                        labelInputName={"ราคา"}
                        placeholder={"ราคา"}
                        onChangeCheckBox={(checked, numberValue) => {
                          const json = updateJsonStringRepairs(
                            watch("repair_summary") ?? "",
                            item.master_repair_id,
                            numberValue ?? "0",
                            checked
                          );
                          setValue("repair_summary", json);
                        }}
                        onChange={(checked, numberValue) => {
                          const json = updateJsonStringRepairs(
                            watch("repair_summary") ?? "",
                            item.master_repair_id,
                            numberValue ?? "0",
                            checked
                          );
                          setValue("repair_summary", json);
                        }}
                        isChecked={JSON.parse(
                          watch("repair_summary") ?? "[]"
                        ).some(
                          (data: { master_repair_id: string; price: string }) =>
                            data.master_repair_id === item.master_repair_id
                        )}
                        inputValue={
                          JSON.parse(watch("repair_summary") ?? "[]").find(
                            (data: {
                              master_repair_id: string;
                              price: string;
                            }) =>
                              data.master_repair_id === item.master_repair_id
                          )?.price || "0"
                        }
                        disabled
                      />
                    );
                  })}
              </Grid>
              <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                gap="3"
                rows="repeat(2, 64px)"
                width="auto"
              >
                <MasterSelectComponent
                  label="แบบรถยนต์"
                  onChange={(option) => {
                    const value = option ? String(option.value) : undefined;
                    setValue("brand_id", value);
                    setValue("model_id", undefined);
                  }}
                  defaultValue={{
                    value: watch("brand_id") ?? "",
                    label: "",
                  }}
                  valueKey="master_brand_id"
                  labelKey="brand_name"
                  placeholder="กรุณาเลือก..."
                  className=" text-left w-full"
                  fetchDataFromGetAPI={getAllBrandsData}
                  isDisabled
                />
                <MasterSelectComponent
                  label="รุ่น"
                  onChange={(option) => {
                    const value = option ? String(option.value) : undefined;
                    setValue("model_id", value);
                  }}
                  defaultValue={{
                    value: watch("model_id") ?? "",
                    label: "",
                  }}
                  valueKey="ms_brandmodel_id"
                  labelKey="brandmodel_name"
                  placeholder="กรุณาเลือก..."
                  className=" text-left w-full"
                  fetchDataFromGetAPI={async () => {
                    const brand_id = watch("brand_id");
                    if (brand_id) {
                      return getByBrand(brand_id);
                    } else {
                      return async () => {
                        return {
                          success: true,
                          message: "Get all success",
                          responseObject: [],
                          statusCode: 200,
                        };
                      };
                    }
                  }}
                  isDisabled
                />
                <MasterSelectComponent
                  label="ปีรถยนต์"
                  onChange={(option) => {
                    const value = option ? String(option.value) : undefined;
                    setValue("car_year", value);
                  }}
                  defaultValue={{
                    value: watch("car_year") ?? "",
                    label: "",
                  }}
                  valueKey="type_issue_group_id"
                  labelKey="type_issue_group_name"
                  placeholder="กรุณาเลือก..."
                  className=" text-left w-full"
                  fetchDataFromGetAPI={async () => {
                    return {
                      success: true,
                      message: "Get all success",
                      responseObject: CAR_YEAR,
                      statusCode: 200,
                    };
                  }}
                  isDisabled
                />
                <MasterSelectComponent
                  label="สี"
                  onChange={(option) => {
                    const value = option ? String(option.value) : undefined;
                    setValue("car_color_id", value);
                  }}
                  defaultValue={{
                    value: watch("car_color_id") ?? "",
                    label: "",
                  }}
                  valueKey="color_id"
                  labelKey="color_name"
                  placeholder="กรุณาเลือก..."
                  className=" text-left w-full"
                  fetchDataFromGetAPI={getAllColors}
                  isDisabled
                />
              </Grid>
              <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                gap="3"
                rows="repeat(2, 64px)"
                width="auto"
              >
                <InputAction
                  id={"ราคารวม"}
                  placeholder={"ราคารวม"}
                  value={watch("total_price")?.toString() ?? "0"}
                  onChange={(e) => {
                    setValue("total_price", parseInt(e.target.value));
                  }}
                  label={"ราคารวม"}
                  labelOrientation={"vertical"}
                  size={"2"}
                  defaultValue={watch("total_price")?.toString()}
                  classNameInput=" w-full"
                  disabled
                />
                <InputAction
                  id={"ภาษี"}
                  placeholder={"ภาษี"}
                  value={watch("tax")?.toString() ?? "0"}
                  onChange={(e) => setValue("tax", parseInt(e.target.value))}
                  label={"ภาษี"}
                  labelOrientation={"vertical"}
                  size={"2"}
                  defaultValue={watch("tax")?.toString()}
                  classNameInput=" w-full"
                  disabled
                />
                {/* <InputAction
                id={"ระยะเวลา "}
                placeholder={"ระยะเวลา "}
                value={watch("deadline_day")?.toString() ?? ""}
                onChange={(e) =>
                  setValue("deadline_day", parseInt(e.target.value))
                }
                label={"ระยะเวลา "}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("deadline_day")?.toString()}
                classNameInput=" w-full"
                type="number"
                disabled
              /> */}
                <InputDatePicker
                  id="นัดหมายถอด"
                  labelName={"นัดหมายถอด"}
                  onchange={(date) =>
                    date &&
                    setValue(
                      "appointment_date",
                      dayjs(date).format("YYYY-MM-DD")
                    )
                  }
                  defaultDate={
                    watch("appointment_date")
                      ? new Date(watch("appointment_date") as string)
                      : new Date()
                  }
                  disabled
                />
              </Grid>

              <InputTextareaFormManage
                name={"หมายเหตุ"}
                placeholder="หมายเหตุ"
                register={{ ...register("remark") }}
                msgError={errors.remark?.message}
                showLabel
                disabled
              />
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
                {quotationData.quotation_status ===
                  QUOTATION_STATUS.WAITING_FOR_APPROVE && (
                  <>
                    <Buttons
                      btnType="general"
                      onClick={handleRejectQuotation}
                      className=" w-[100px] max-sm:w-full bg-red-700 hover:bg-red-700"
                    >
                      ไม่อนุมัติ
                    </Buttons>
                    <Buttons
                      btnType="submit"
                      onClick={handleApproveQuotation}
                      className=" w-[100px] max-sm:w-full"
                    >
                      อนุมัติ
                    </Buttons>
                  </>
                )}
              </Flex>
            </>
          )}
        </div>

        <Flex className=" flex flex-col gap-3  mt-4 bg-white rounded-md p-6 min-w-[380px]  max-w-[380px]   overflow-auto max-h-[1318px] max-lg:hidden">
          <Text className=" font-bold text-lg">ประวัติใบเสนอราคา</Text>
          <HistoryActivity
            items={quotationLogStatus}
            isFetchingHistoryEditPostById={false}
          />
        </Flex>
      </div>

      <DialogAttachment
        quotationData={quotationData}
        isOpen={openDialogImages}
        onClose={handleCloseDialogImaage}
        title={"ภาพกล่อง"}
        defaultImage={watch("image_url") ?? []}
        onChangeImage={() => {}}
        isChangeFile={false}
        disable
      />

      <DialogApproveQuotation
        data={quotationData}
        isOpen={isOpenApproveQuotation}
        onClose={() => setIsOpenApproveQuotation(false)}
        onConfirm={onConfirmApproveQuotation}
      />

      <DialogRejectQuotation
        data={quotationData}
        isOpen={isOpenRejectQuotation}
        onClose={() => setIsOpenRejectQuotation(false)}
        onConfirm={onConfirmApproveQuotation}
      />

      <DialogHistory
        quotationId={quotationId}
        isOpen={isOpenDialogHistory}
        onClose={() => setIsOpenDialogHistory(false)}
        title={"ประวัติใบเสนอราคา"}
      />
    </>
  );
};

export default FormCreate;
