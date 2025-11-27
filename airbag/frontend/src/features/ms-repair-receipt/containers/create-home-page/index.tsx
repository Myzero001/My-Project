import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import Buttons from "@/components/customs/button/button.main.component";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import InputAction from "@/components/customs/input/input.main.component";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import ButtonAttactment from "@/features/quotation/components/ButtonAttactment";
import { getAllColors } from "@/services/color.service";
import { getAllBrandsData } from "@/services/ms.brand";
import { getByBrand } from "@/services/ms.brandmodel";
import { generateCarYears } from "@/utils/generateCarYears";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Grid } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DialogAttachmentRepairReceipt from "../../components/dialogAttachmentRepairReceipt";
import {
  cancelRepairReceipt,
  getRepairReceiptById,
  updateRepairReceipt,
} from "@/services/ms.repair.receipt";
import { useNavigate, useParams } from "react-router-dom";
import { repairReceipt } from "@/types/response/response.repair-receipt";
import { repairReceiptUpdateType } from "../../types/update";
import { RepairReceiptCreateSchema } from "../../schemas/repairReceiptUpdate";
import { deleteFile, postFile } from "@/services/file.service";
import { useToast } from "@/components/customs/alert/toast.main.component";
import dayjs from "dayjs";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { permissionMap } from "@/utils/permissionMap";
import { useLocalProfileData } from "@/zustand/useProfile";

export default function RepairReceiptHomeCreate() {
  const [repairReceiptData, setRepairReceiptData] = useState<repairReceipt>();
  const [isloadRepairReceiptData, setIsloadRepairReceiptData] = useState(false);

  const [openDialogImages, setOpenDialogImages] = useState<boolean>(false);
  const [isChangeFile, setIsChangeFile] = useState<boolean>(false);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false);

  const CAR_YEAR = generateCarYears();

  const [disableFields, setDisableFields] = useState(false);

  const { repairReceiptId } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { profile } = useLocalProfileData();

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    register,
  } = useForm<repairReceiptUpdateType>({
    defaultValues: {
      repair_receipt_image_url: [],
      repair_receipt_box_image_url: [],
    },
    resolver: zodResolver(RepairReceiptCreateSchema),
  });

  const onSubmitHandler = async (payload: repairReceiptUpdateType) => {

    if (repairReceiptData?.id) {
      let filesRepairURL = repairReceiptData.repair_receipt_image_url ?? "";
      let filesBoxURL = repairReceiptData.repair_receipt_box_image_url ?? "";
      if (isChangeFile) {
        if (filesRepairURL) {
          await deleteFile(filesRepairURL);
          filesRepairURL = "";
        }
        if (filesBoxURL) {
          await deleteFile(filesBoxURL);
          filesBoxURL = "";
        }

        const formDataRepairImage = new FormData();
        if (
          payload?.repair_receipt_image_url &&
          payload?.repair_receipt_image_url?.length > 0
        ) {
          Array.from(payload.repair_receipt_image_url).map((file) => {
            formDataRepairImage.append("files", file);
          });

          const resImage_url = await postFile(formDataRepairImage);

          if (resImage_url.responseObject?.file_url) {
            filesRepairURL = resImage_url.responseObject?.file_url;
          }
        }

        const formDataBoxImage = new FormData();

        if (
          payload?.repair_receipt_box_image_url &&
          payload?.repair_receipt_box_image_url?.length > 0
        ) {
          Array.from(payload.repair_receipt_box_image_url).map((file) => {
            formDataBoxImage.append("files", file);
          });

          const resImage_url = await postFile(formDataBoxImage);
          if (resImage_url.responseObject?.file_url) {
            filesBoxURL = resImage_url.responseObject?.file_url;
          }
        }
      }

      updateRepairReceipt({
        id: repairReceiptData.id,
        register: payload.register ?? "",
        box_number: payload.box_number ?? "",
        box_number_detail: payload.box_number_detail ?? "",
        remark: payload.remark ?? "",
        repair_receipt_image_url: filesRepairURL,
        repair_receipt_box_image_url: filesBoxURL,
        total_price: payload.total_price,
        tax: payload.tax,
        repair_receipt_at: payload.repair_receipt_at,
        estimated_date_repair_completion:
          payload.estimated_date_repair_completion,
        expected_delivery_date: payload.expected_delivery_date,
      })
        .then((res) => {
          if (res.success) {
            fetchRepairReceiptById();
            showToast("บันทึกใบรับซ่อมสำเร็จ", true);
          } else {
            showToast("บันทึกใบรับซ่อมไม่สำเร็จ", false);
          }
        })
        .catch(() => {
          showToast("บันทึกใบรับซ่อมไม่สำเร็จ", false);
        });
    } else {
      showToast("บันทึกใบรับซ่อมไม่สำเร็จ", false);
    }
  };

  const handleCloseDialogImaage = () => {
    setOpenDialogImages(false);
  };

  const handleCancel = () => {
    setIsCancelDialogOpen(true);
  };
  const handleCancelClose = () => {
    setIsCancelDialogOpen(false);
  };

  const handleCancelConfirm = () => {
    if (repairReceiptId) {
      cancelRepairReceipt(repairReceiptId)
        .then(() => {
          navigate("/ms-repair-receipt");
          showToast("ยกเลิกใบรับซ่อมสำเร็จ", true);
        })
        .catch(() => {
          showToast("ยกเลิกใบรับซ่อมไม่สำเร็จ", false);
        });
    }
  };

  const fetchRepairReceiptById = () => {
    if (repairReceiptId) {
      setIsloadRepairReceiptData(true);
      getRepairReceiptById(repairReceiptId)
        .then((res) => {
          const item = res.responseObject;
          if (item) {
            setRepairReceiptData(item);
            setDisableFields(item.repair_receipt_status !== "pending");
            checkPermission();

            setValue("register", item?.register ?? "");
            setValue("box_number", item.box_number ?? "");
            setValue("box_number_detail", item.box_number_detail ?? "");
            setValue("remark", item.remark ?? "");
            setValue("total_price", item.total_price ?? 0);
            setValue("tax", item.tax ?? 0);
            setValue(
              "repair_receipt_at",
              item.repair_receipt_at ?? dayjs().format("YYYY-MM-DD")
            );
            setValue(
              "estimated_date_repair_completion",
              item.estimated_date_repair_completion ??
                dayjs().format("YYYY-MM-DD")
            );
            setValue(
              "expected_delivery_date",
              item.expected_delivery_date ?? dayjs().format("YYYY-MM-DD")
            );
          }
        })
        .finally(() => {
          setIsloadRepairReceiptData(false);
        });
    }
  };

  const checkPermission = () => {
    if (profile && profile.role?.role_name) {
      if (
        permissionMap["ใบรับซ่อมหน้าแรกหน้ารายการซ่อม"][
          profile.role?.role_name
        ] !== "A"
      ) {
        setDisableFields(true);
      }
    }
  };

  useEffect(() => {
    if (repairReceiptId) {
      fetchRepairReceiptById();
    }
  }, [repairReceiptId]);

  useEffect(() => {
    checkPermission();
  }, [profile]);

  return (
    <div className="container w-full m-auto">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-3 w-full mt-4 bg-white rounded-md p-6"
      >
        {isloadRepairReceiptData ? (
          <BoxLoadingData minHeight="100vh" />
        ) : (
          <>
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <InputDatePicker
                id="วันที่รับซ่อม"
                labelName={"วันที่รับซ่อม"}
                onchange={(date) =>
                  date &&
                  setValue(
                    "repair_receipt_at",
                    dayjs(date).format("YYYY-MM-DD")
                  )
                }
                defaultDate={
                  watch("repair_receipt_at")
                    ? new Date(
                        dayjs(watch("repair_receipt_at")).format(
                          "YYYY-MM-DD"
                        ) as string
                      )
                    : new Date()
                }
                disabled={disableFields}
                nextFields={{down: "วันที่คาดว่าจะซ่อมเสร็จ"}}
              />
              <InputDatePicker
                id="วันที่คาดว่าจะซ่อมเสร็จ"
                labelName={"วันที่คาดว่าจะซ่อมเสร็จ"}
                onchange={(date) =>
                  date &&
                  setValue(
                    "estimated_date_repair_completion",
                    dayjs(date).format("YYYY-MM-DD")
                  )
                }
                defaultDate={
                  watch("estimated_date_repair_completion")
                    ? new Date(
                        dayjs(watch("estimated_date_repair_completion")).format(
                          "YYYY-MM-DD"
                        ) as string
                      )
                    : new Date()
                }
                disabled={disableFields}
                nextFields={{up: "วันที่รับซ่อม",down: "วันที่คาดว่าจะส่งมอบ"}}
              />
              <InputDatePicker
                id="วันที่คาดว่าจะส่งมอบ"
                labelName={"วันที่คาดว่าจะส่งมอบ"}
                onchange={(date) =>
                  date &&
                  setValue(
                    "expected_delivery_date",
                    dayjs(date).format("YYYY-MM-DD")
                  )
                }
                defaultDate={
                  watch("expected_delivery_date")
                    ? new Date(
                        dayjs(watch("expected_delivery_date")).format(
                          "YYYY-MM-DD"
                        ) as string
                      )
                    : new Date()
                }
                disabled={disableFields}
                nextFields={{up: "วันที่คาดว่าจะซ่อมเสร็จ",down: "ทะเบียน"}}
              />

              <InputAction
                id={"เลขที่ใบรับซ่อม"}
                placeholder={"เลขที่ใบรับซ่อม"}
                value={repairReceiptData?.repair_receipt_doc ?? ""}
                onChange={() => {}}
                label={"เลขที่ใบรับซ่อม"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={""}
                classNameInput=" w-full"
                disabled
              />
              <InputAction
                id={"เลขที่ใบเสนอราคา"}
                placeholder={"เลขที่ใบเสนอราคา"}
                value={repairReceiptData?.master_quotation.quotation_doc ?? ""}
                onChange={() => {}}
                label={"เลขที่ใบเสนอราคา"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={""}
                classNameInput=" w-full"
                disabled
              />
              <InputAction
                id={"ชื่อกิจการ"}
                placeholder={"ชื่อกิจการ"}
                value={
                  repairReceiptData?.master_quotation.master_customer
                    .contact_name ?? ""
                }
                onChange={() => {}}
                label={"ชื่อกิจการ"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={""}
                classNameInput=" w-full"
                disabled
              />
            </Grid>
            <Grid
              columns={{ initial: "1", md: "1", sm: "1", lg: "1", xl: "1" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <InputAction
                id={"ตำแหน่งแผนที่"}
                placeholder={"ตำแหน่งแผนที่"}
                value={repairReceiptData?.master_quotation.addr_map ?? ""}
                onChange={() => {}}
                label={"ตำแหน่งแผนที่"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  repairReceiptData?.master_quotation.addr_map ?? ""
                }
                classNameInput=" w-full"
                disabled
              />
            </Grid>
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <InputAction
                id={"ที่อยู่ เลขที่"}
                placeholder={"ที่อยู่ เลขที่"}
                value={repairReceiptData?.master_quotation.addr_number ?? ""}
                onChange={() => {}}
                label={"ที่อยู่ เลขที่"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  repairReceiptData?.master_quotation.addr_number ?? ""
                }
                classNameInput=" w-full"
                disabled
              />
              <InputAction
                id={"ซอย"}
                placeholder={"ซอย"}
                value={repairReceiptData?.master_quotation.addr_alley ?? ""}
                onChange={() => {}}
                label={"ซอย"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  repairReceiptData?.master_quotation.addr_alley ?? ""
                }
                classNameInput=" w-full"
                disabled
              />
              <InputAction
                id={"ถนน"}
                placeholder={"ถนน"}
                value={repairReceiptData?.master_quotation.addr_street ?? ""}
                onChange={() => {}}
                label={"ถนน"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  repairReceiptData?.master_quotation.addr_street ?? ""
                }
                classNameInput=" w-full"
                disabled
              />
              <InputAction
                id={"ตำบล/แขวง"}
                placeholder={"ตำบล/แขวง"}
                value={
                  repairReceiptData?.master_quotation.addr_subdistrict ?? ""
                }
                onChange={() => {}}
                label={"ตำบล/แขวง"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  repairReceiptData?.master_quotation.addr_subdistrict ?? ""
                }
                classNameInput=" w-full"
                disabled
              />
              <InputAction
                id={"เขต/อำเภอ"}
                placeholder={"เขต/อำเภอ"}
                value={repairReceiptData?.master_quotation.addr_district ?? ""}
                onChange={() => {}}
                label={"เขต/อำเภอ"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  repairReceiptData?.master_quotation.addr_subdistrict ?? ""
                }
                classNameInput=" w-full"
                disabled
              />
              <InputAction
                id={"จังหวัด"}
                placeholder={"จังหวัด"}
                value={repairReceiptData?.master_quotation.addr_province ?? ""}
                onChange={() => {}}
                label={"จังหวัด"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  repairReceiptData?.master_quotation.addr_province ?? ""
                }
                classNameInput=" w-full"
                disabled
              />
              <InputAction
                id={"รหัสไปรษณีย์"}
                placeholder={"รหัสไปรษณีย์"}
                value={repairReceiptData?.master_quotation.addr_postcode ?? ""}
                onChange={() => {}}
                label={"รหัสไปรษณีย์"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  repairReceiptData?.master_quotation.addr_postcode ?? ""
                }
                classNameInput=" w-full"
                disabled
              />
            </Grid>
            
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <InputAction
                id={"ชื่อ บุคคล"}
                placeholder={"ชื่อ บุคคล"}
                value={
                  repairReceiptData?.master_quotation.master_customer
                    .customer_name ?? ""
                }
                onChange={() => {}}
                label={"ชื่อ บุคคล"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  repairReceiptData?.master_quotation.master_customer
                    .customer_name ?? ""
                }
                classNameInput=" w-full"
                disabled
              />
              <InputAction
                id={"เบอร์โทร"}
                placeholder={"เบอร์โทร"}
                value={
                  repairReceiptData?.master_quotation.master_customer
                    .contact_number ?? ""
                }
                onChange={() => {}}
                label={"เบอร์โทร"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  repairReceiptData?.master_quotation.master_customer
                    .contact_number ?? ""
                }
                classNameInput=" w-full"
                type="tel"
                maxLength={10}
                disabled
              />
              <InputAction
                id={"Line ID"}
                placeholder={"ไอดี ไลน์"}
                value={
                  repairReceiptData?.master_quotation.master_customer.line_id ??
                  ""
                }
                onChange={() => {}}
                label={"ไอดี ไลน์"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  repairReceiptData?.master_quotation.master_customer.line_id ??
                  ""
                }
                classNameInput=" w-full"
                disabled
              />
            </Grid>

            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <MasterSelectComponent
                label="แบบรถยนต์"
                onChange={() => {}}
                defaultValue={{
                  value: repairReceiptData?.master_quotation.brand_id ?? "",
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
                onChange={() => {}}
                defaultValue={{
                  value: repairReceiptData?.master_quotation.model_id ?? "",
                  label: "",
                }}
                valueKey="ms_brandmodel_id"
                labelKey="brandmodel_name"
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={async () => {
                  const brand_id = repairReceiptData?.master_quotation.brand_id;
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
                onChange={() => {}}
                defaultValue={{
                  value: repairReceiptData?.master_quotation.car_year ?? "",
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
                onChange={() => {}}
                defaultValue={{
                  value: repairReceiptData?.master_quotation.car_color_id ?? "",
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
              rows="repeat(2, auto)"
              width="auto"
            >
              <InputAction
                id={"ทะเบียน"}
                placeholder={"ทะเบียน"}
                value={watch("register") ?? ""}
                onChange={(e) => setValue("register", e.target.value)}
                label={"ทะเบียน"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("register")}
                classNameInput=" w-full"
                errorMessage={errors.register?.message}
                disabled={disableFields}
                nextFields={{up: "วันที่คาดว่าจะส่งมอบ",down: "เบอร์กล่อง"}}
              />
              <InputAction
                id={"เบอร์กล่อง"}
                placeholder={"เบอร์กล่อง"}
                value={watch("box_number") ?? ""}
                onChange={(e) => setValue("box_number", e.target.value)}
                label={"เบอร์กล่อง"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("box_number")}
                classNameInput=" w-full"
                // type="tel"
                maxLength={10}
                errorMessage={errors.box_number?.message}
                disabled={disableFields}
                nextFields={{up: "ทะเบียน",down: "เลขสัญลักษณ์"}}
              />
              <InputAction
                id={"เลขสัญลักษณ์"}
                placeholder={"เลขสัญลักษณ์"}
                value={watch("box_number_detail") ?? ""}
                onChange={(e) => setValue("box_number_detail", e.target.value)}
                label={"เลขสัญลักษณ์"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("box_number_detail")}
                classNameInput=" w-full"
                // type="tel"
                maxLength={10}
                errorMessage={errors.box_number_detail?.message}
                disabled={disableFields}
                nextFields={{up: "เบอร์กล่อง",down: "ราคารวม"}}
              />
            </Grid>
            <ButtonAttactment
              label={"ไฟล์แนบ"}
              onClick={() => setOpenDialogImages(true)}
            />
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <InputAction
                id={"ราคารวม"}
                placeholder={"ราคารวม"}
                value={watch("total_price")?.toString() ?? "0"}
                // onChange={(e) => {
                //   setValue("total_price", parseInt(e.target.value));
                // }}
                onChange={(e) => {
                  const val = e.target.value;
                  const number = parseInt(val, 10);
                  setValue("total_price", isNaN(number) ? 0 : number);
                }}
                label={"ราคารวม"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("total_price")?.toString()}
                classNameInput=" w-full"
                disabled={disableFields}
                nextFields={{up: "เลขสัญลักษณ์",down: "ภาษี"}}
              />
              <InputAction
                id={"ภาษี"}
                placeholder={"ภาษี"}
                value={watch("tax")?.toString() ?? "0"}
                // onChange={(e) => setValue("tax", parseInt(e.target.value))}
                onChange={(e) => {
                  const val = e.target.value;
                  const number = parseInt(val, 10);
                  setValue("tax", isNaN(number) ? 0 : number);
                }}
                label={"ภาษี"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("tax")?.toString()}
                classNameInput=" w-full"
                disabled={disableFields}
                nextFields={{up: "ราคารวม",down: "หมายเหตุ"}}
              />
              {/* <InputAction
                id={"ระยะเวลา "}
                placeholder={"ระยะเวลา "}
                value={watch("deadline_day")?.toString() ?? "0"}
                onChange={(e) =>
                  setValue("deadline_day", parseInt(e.target.value))
                }
                label={"ระยะเวลา "}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("deadline_day")?.toString()}
                classNameInput=" w-full"
                type="number"
                disabled={disableField}
              /> */}
            </Grid>
            <InputTextareaFormManage
              id="หมายเหตุ"
              name={"หมายเหตุ"}
              placeholder="หมายเหตุ"
              register={{ ...register("remark") }}
              msgError={errors.remark?.message}
              showLabel
              disabled={disableFields}
              nextFields={{up: "ภาษี",down: "del"}}
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
              {!disableFields && (
                <>
                  <Buttons
                    id="del"
                    type="button"
                    btnType="delete"
                    onClick={handleCancel}
                    className=" w-[100px] max-sm:w-full bg-blue-700 hover:bg-blue-700"
                    nextFields={{up: "หมายเหตุ",down: "submit"}}
                  >
                    ยกเลิก
                  </Buttons>
                  <Buttons
                    id="submit"
                    type="submit"
                    btnType="default"
                    variant="outline"
                    className=" w-[100px] max-sm:w-full"
                    nextFields={{up: "del"}}
                  >
                    บันทึกข้อมูล
                  </Buttons>
                </>
              )}
            </Flex>
          </>
        )}

        <DialogAttachmentRepairReceipt
          data={repairReceiptData}
          isOpen={openDialogImages}
          onClose={handleCloseDialogImaage}
          defaultRepairImage={watch("repair_receipt_image_url") ?? []}
          defaultBoxImage={watch("repair_receipt_box_image_url") ?? []}
          onChangeImage={(repairImage, boxImage) => {
            setIsChangeFile(true);
            setValue("repair_receipt_image_url", repairImage);
            setValue("repair_receipt_box_image_url", boxImage);
          }}
          isChangeFile={isChangeFile}
          disable={disableFields}
        />

        <DialogComponent
          isOpen={isCancelDialogOpen}
          onClose={handleCancelClose}
          title="ยืนยันการยกเลิก"
          onConfirm={handleCancelConfirm}
          confirmText="ยืนยัน"
          cancelText="ปิด"
        >
          <p>
            คุณแน่ใจหรือไม่ว่าต้องการยกเลิกใบรับซ่อมนี้? <br />
            เลขที่ใบรับซ่อม:{" "}
            <span className="text-red-500">
              {repairReceiptData?.repair_receipt_doc}
            </span>
          </p>
        </DialogComponent>
      </form>
    </div>
  );
}
