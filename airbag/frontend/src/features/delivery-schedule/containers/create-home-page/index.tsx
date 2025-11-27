// src/features/delivery-schedule/pages/DeliveryScheduleHomeCreate.tsx

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
import { Flex, Grid, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom"; // ไม่ได้ใช้ navigate ใน handlePrintDocument แล้ว แต่ถ้าใช้อย่างอื่นในคอมโพเนนต์ก็คงไว้
import { DeliveryScheduleUpdateSchema } from "../../schemas/repairReceiptUpdate";
import { useToast } from "@/components/customs/alert/toast.main.component";
import {
  getDeliveryScheduleById,
  requestDelivery,
  updateDeliverySchedule,
} from "@/services/ms.delivery.service";
import { DeliverySchedule } from "@/types/response/response.delivery-schedule";
import DialogAttachmentDeliverySchedule from "../../components/dialogAttachmentDeliverySchedule";
import { deleteFile, postFile } from "@/services/file.service";
import { DeliveryScheduleUpdateType } from "../../types/update";
import { DOCUMENT_STATUS } from "@/types/documentStatus";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import dayjs from "dayjs";
import { permissionMap } from "@/utils/permissionMap";
import { useLocalProfileData } from "@/zustand/useProfile";
import { MyPDFDocument } from "@/features/delivery-schedule/containers/create-PDF-page"; // ยังคง import MyPDFDocument
import { pdf } from "@react-pdf/renderer"; // ยังคง import pdf
import { getRepairReceiptListRepairByRepairReceiptIdActive } from "@/services/repair.receipt.list.repair.service";
import { getQRcode } from "@/services/get_qrcode";
import QRCode from "qrcode"; // *** เพิ่ม import QRCode ที่นี่ ***

export default function DeliveryScheduleHomeCreate() {
  const [deliveryScheduleData, setDeliveryScheduleData] =
    useState<DeliverySchedule>();
  const [isloadDeliveryScheduleData, setIsloadingDeliveryScheduleData] =
    useState(false);

  const [openDialogImages, setOpenDialogImages] = useState<boolean>(false);
  const [isChangeFile, setIsChangeFile] = useState<boolean>(false);

  const [isOpenModalDeliveryConfirm, setIsOpenModalDeliveryConfirm] =
    useState<boolean>(false);

  const [disableFields, setDisableFields] = useState(false);
  const [disableFieldsPermission, setDisableFieldsPermission] = useState(false);

  const CAR_YEAR = generateCarYears();

  const { deliveryScheduleId } = useParams();
  const { showToast } = useToast();
  const { profile } = useLocalProfileData();
  const [isPrinting, setIsPrinting] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    register,
  } = useForm<DeliveryScheduleUpdateType>({
    defaultValues: {
      delivery_schedule_image_url: [],
    },
    resolver: zodResolver(DeliveryScheduleUpdateSchema),
  });

  const onSubmitHandler = async (payload: DeliveryScheduleUpdateType) => {
    if (deliveryScheduleData?.id) {
      let filesURL = deliveryScheduleData.delivery_schedule_image_url ?? "";
      if (isChangeFile) {
        if (filesURL) {
          await deleteFile(filesURL);
          filesURL = "";
        }

        const formDataImage = new FormData();
        if (
          payload?.delivery_schedule_image_url &&
          payload?.delivery_schedule_image_url?.length > 0
        ) {
          Array.from(payload.delivery_schedule_image_url).map((file) => {
            formDataImage.append("files", file);
          });

          const resImage_url = await postFile(formDataImage);

          if (resImage_url.responseObject?.file_url) {
            filesURL = resImage_url.responseObject?.file_url;
          }
        }
      }

      updateDeliverySchedule({
        id: deliveryScheduleData.id,
        delivery_date: payload.delivery_date,
        delivery_location: payload.delivery_location,
        addr_number: payload.addr_number,
        addr_alley: payload.addr_alley,
        addr_street: payload.addr_street,
        addr_subdistrict: payload.addr_subdistrict,
        addr_district: payload.addr_district,
        addr_province: payload.addr_province,
        addr_postcode: payload.addr_postcode,
        customer_name: payload.customer_name,
        position: payload.position,
        contact_number: payload.contact_number,
        line_id: payload.line_id,
        delivery_schedule_image_url: filesURL,
        remark: payload.remark,
      })
        .then((res) => {
          if (res.success) {
            showToast("บันทึกใบส่งมอบสำเร็จ", true);
            fetchDeliveryScheduleById();
          } else {
            showToast("บันทึกใบส่งมอบไม่สำเร็จ", false);
          }
        })
        .catch(() => {
          showToast("บันทึกใบส่งมอบไม่สำเร็จ", false);
        });
    } else {
      showToast("บันทึกใบส่งมอบไม่สำเร็จ", false);
    }
  };

  const handleCloseDialogImaage = () => {
    setOpenDialogImages(false);
  };

  const handleRequestConfirmDelivery = () => {
    if (deliveryScheduleData?.id) {
      requestDelivery(deliveryScheduleData?.id)
        .then((res) => {
          if (res.success) {
            window.location.reload();
            showToast("ส่งมอบบิลใบส่งมอบสำเร็จ", true);
          } else {
            showToast("ส่งมอบบิลใบส่งมอบไม่สำเร็จ", false);
          }
        })
        .catch(() => {
          showToast("ส่งมอบบิลใบส่งมอบไม่สำเร็จ", false);
        });
    }
  };

  const fetchDeliveryScheduleById = () => {
    if (deliveryScheduleId) {
      setIsloadingDeliveryScheduleData(true);
      getDeliveryScheduleById(deliveryScheduleId)
        .then((res) => {
          const item = res.responseObject;
          if (item) {
            setDeliveryScheduleData(item);
            setDisableFields(item.status !== DOCUMENT_STATUS.PENDING);
            checkPermission();

            setValue("id", deliveryScheduleId);
            setValue("addr_number", item.addr_number);
            setValue("addr_alley", item.addr_alley);
            setValue("addr_street", item.addr_street);
            setValue("addr_subdistrict", item.addr_subdistrict);
            setValue("addr_district", item.addr_district);
            setValue("addr_province", item.addr_province);
            setValue("addr_postcode", item.addr_postcode);
            setValue("customer_name", item.customer_name ?? "");
            setValue("position", item.position ?? "");
            setValue("contact_number", item.contact_number ?? "");
            setValue("line_id", item.line_id ?? "");

            setValue("delivery_date", item.delivery_date ?? "");
            setValue("delivery_location", item.delivery_location ?? "");
            setValue("remark", item.remark ?? "");
          }
        })
        .finally(() => {
          setIsloadingDeliveryScheduleData(false);
        });
    }
  };

  const checkPermission = () => {
    if (profile && profile.role?.role_name) {
      if (permissionMap["บิลใบส่งมอบ"][profile.role?.role_name] !== "A") {
        setDisableFields(true);
        setDisableFieldsPermission(true);
        return true;
      }
    }
  };

  useEffect(() => {
    checkPermission();
  }, [profile]);

  useEffect(() => {
    if (deliveryScheduleId) {
      fetchDeliveryScheduleById();
    }
  }, [deliveryScheduleId]);

  const handlePrintDocument = async () => {
    if (!deliveryScheduleData?.id) {
      showToast("ไม่พบข้อมูลสำหรับพิมพ์เอกสาร", false);
      return;
    }

    setIsPrinting(true);

    try {
      // 1. ดึงข้อมูลที่จำเป็นสำหรับการสร้าง PDF
      const repairReceiptId = deliveryScheduleData.master_repair_receipt?.id;
      if (!repairReceiptId) throw new Error("ไม่พบ ID ใบรับซ่อม");

      const repairResponse = await getRepairReceiptListRepairByRepairReceiptIdActive(repairReceiptId);
      const repairNames: string[] = (repairResponse.responseObject ?? [])
          .map((item) => item.master_repair?.master_repair_name)
          .filter(Boolean) as string[];
      repairNames.sort((a, b) => a.localeCompare(b));

      // 2. คำนวณราคาและภาษี
      const taxRate = Number(deliveryScheduleData.master_repair_receipt.tax) || 0;
      const taxStatus = deliveryScheduleData.companies?.tax_status;
      const totalPrice = Number(deliveryScheduleData.master_repair_receipt.total_price) || 0;

      let totalBeforeTax = 0;
      let taxAmount = 0;
      let totalWithTax = 0;

      if (taxStatus === "true") {
        totalBeforeTax = totalPrice;
        taxAmount = (totalBeforeTax * taxRate) / 100;
        totalWithTax = totalBeforeTax + taxAmount;
      } else {
        totalWithTax = totalPrice;
        totalBeforeTax = (totalWithTax * 100) / (100 + taxRate); // Re-calculate totalBeforeTax if tax is included
        taxAmount = totalWithTax - totalBeforeTax; // Recalculate taxAmount
      }

      const finalTotal = Number(totalBeforeTax.toFixed(2));
      const finalPriceTax = Number(taxAmount.toFixed(2));
      const finalTotalPriceWithTax = Number(totalWithTax.toFixed(2));

      // 3. ดึง QR Code PromptPay (ถ้ามี)
      let qrCodeBase64 = null;
      const promptpayId = deliveryScheduleData.companies?.promtpay_id;
      if (promptpayId && finalTotalPriceWithTax > 0) {
        try {
          qrCodeBase64 = await getQRcode(`${promptpayId}`, `${finalTotalPriceWithTax}`);
        } catch (qrErr) {
          // console.error("Error generating PromptPay QR Code:", qrErr);
          qrCodeBase64 = null; // Clear QR if error
        }
      } 
      // else {
      //   console.warn("PromptPay QR Code skipped: Missing promtpay_id or finalPrice is zero/negative.");
      // }

      // *** 4. สร้าง Payment Link QR Code ที่นี่ด้วย ***
      let paymentLinkQrCodeBase64 = null;
      // ตรวจสอบว่า deliveryScheduleData และ deliveryScheduleData.id มีค่าหรือไม่ ก่อนสร้าง Payment Link
      if (deliveryScheduleData && deliveryScheduleData.id) {
        const paymentLink = `${import.meta.env.VITE_FRONTEND_URL}/ms-payment/${deliveryScheduleData.id}?status=create`;
        // console.log("Attempting to generate Payment Link QR for URL:", paymentLink); // Debugging: Check the URL
        try {
          paymentLinkQrCodeBase64 = await QRCode.toDataURL(paymentLink);
          // console.log("Payment Link QR Code generated successfully.");
        } catch (linkQrErr) {
          // console.error("Error generating Payment Link QR Code. Check URL validity:", linkQrErr);
          paymentLinkQrCodeBase64 = null; // Clear QR if error
        }
      } 
      // else {
      //   console.warn("Payment Link QR Code skipped: deliveryData or ID is missing in handlePrintDocument.");
      // }


      // 5. สร้าง PDF เป็น Blob โดยส่งข้อมูลทั้งหมดผ่าน props
      const blob = await pdf(
        <MyPDFDocument
          deliveryData={deliveryScheduleData}
          repairItems={repairNames}
          price={finalTotalPriceWithTax} // ส่งราคาที่มีภาษี
          tax={taxRate}
          priceTax={finalPriceTax} // ส่งยอดภาษี
          total={finalTotal} // ส่งราคาก่อนภาษี (ถ้าต้องการ)
          qrCodeBase64={qrCodeBase64}
          paymentLinkQrCodeBase64={paymentLinkQrCodeBase64} // *** ส่ง Payment Link QR Code ไปด้วย ***
        />
      ).toBlob();

      // 6. สร้าง URL และเปิดในแท็บใหม่
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");

    } catch (error) {
      // console.error("เกิดข้อผิดพลาดในการสร้าง PDF:", error);
      showToast("เกิดข้อผิดพลาดในการสร้างเอกสาร", false);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="container w-full m-auto">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-3 w-full mt-4 bg-white rounded-md p-6"
      >
        {isloadDeliveryScheduleData ? (
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
                id="วันที่สร้าง"
                labelName={"วันที่สร้าง"}
                onchange={() => {}}
                defaultDate={
                  new Date(
                    dayjs(deliveryScheduleData?.created_at).format(
                      "YYYY-MM-DD"
                    ) as string
                  )
                }
                disabled
                nextFields={{down: "วันที่ส่งมอบ"}}
              />
              <InputAction
                id={"เลขที่ใบส่งมอบ"}
                placeholder={"เลขที่ใบส่งมอบ"}
                value={deliveryScheduleData?.delivery_schedule_doc ?? ""}
                onChange={() => {}}
                label={"เลขที่ใบส่งมอบ"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={deliveryScheduleData?.delivery_schedule_doc ?? ""}
                classNameInput=" w-full"
                disabled
              />
              <InputAction
                id={"เลขที่ใบรับซ่อม"}
                placeholder={"เลขที่ใบรับซ่อม"}
                value={
                  deliveryScheduleData?.master_repair_receipt
                    ?.repair_receipt_doc ?? ""
                }
                onChange={() => {}}
                label={"เลขที่ใบรับซ่อม"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  deliveryScheduleData?.master_repair_receipt
                    ?.repair_receipt_doc ?? ""
                }
                classNameInput=" w-full"
                disabled
              />
              <InputDatePicker
                id="วันที่ส่งมอบ"
                labelName={"วันที่ส่งมอบ"}
                onchange={(date) =>
                  date &&
                  setValue(
                    "delivery_date",
                    dayjs(date).format("YYYY-MM-DD")
                  )
                }
                defaultDate={
                  watch("delivery_date")
                    ? new Date(watch("delivery_date") as string)
                    : new Date()
                }
                disabled
                nextFields={{up: "วันที่สร้าง", down: "สถานที่ส่งมอบ"}}
              /> 

              <InputAction
                id={"ชื่อกิจการ"}
                placeholder={"ชื่อกิจการ"}
                value={
                  deliveryScheduleData?.master_repair_receipt?.master_quotation
                    ?.master_customer?.contact_name ?? ""
                }
                onChange={() => {}}
                label={"ชื่อกิจการ"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  deliveryScheduleData?.master_repair_receipt?.master_quotation
                    ?.master_customer?.contact_name ?? ""
                }
                classNameInput=" w-full"
                disabled
              />
            </Grid>
            <InputAction
              id={"สถานที่ส่งมอบ"}
              placeholder={"สถานที่ส่งมอบ"}
              value={watch("delivery_location")}
              onChange={(e) => setValue("delivery_location", e.target.value)}
              label={"สถานที่ส่งมอบ"}
              labelOrientation={"vertical"}
              size={"2"}
              defaultValue={watch("delivery_location")}
              classNameInput=" w-full"
              errorMessage={errors.delivery_location?.message}
              disabled={disableFields}
              nextFields={{up: "วันที่ส่งมอบ", down: "ที่อยู่ เลขที่"}}
            />
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
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
                disabled={disableFields}
                nextFields={{up: "สถานที่ส่งมอบ", down: "ซอย"}}
              />
              <InputAction
                id={"ซอย"}
                placeholder={"ซอย"}
                value={watch("addr_alley") ?? ""}
                onChange={(e) => setValue("addr_alley", e.target.value)}
                label={"ซอย"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("addr_alley") ?? ""}
                classNameInput=" w-full"
                disabled={disableFields}
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
                defaultValue={watch("addr_street") ?? ""}
                classNameInput=" w-full"
                disabled={disableFields}
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
                defaultValue={watch("addr_subdistrict") ?? ""}
                classNameInput=" w-full"
                disabled={disableFields}
                nextFields={{up: "ถนน", down: "เขต/อำเภอ"}}
              />
              <InputAction
                id={"เขต/อำเภอ"}
                placeholder={"เขต/อำเภอ"}
                value={watch("addr_district") ?? ""}
                onChange={(e) => setValue("addr_district", e.target.value)}
                label={"เขต/อำเภอ"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("addr_district") ?? ""}
                classNameInput=" w-full"
                disabled={disableFields}
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
                defaultValue={watch("addr_province") ?? ""}
                classNameInput=" w-full"
                disabled={disableFields}
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
                defaultValue={watch("addr_postcode") ?? ""}
                classNameInput=" w-full"
                disabled={disableFields}
                nextFields={{up: "จังหวัด", down: "ชื่อ บุคคล"}}
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
                value={watch("customer_name") ?? ""}
                onChange={(e) => setValue("customer_name", e.target.value)}
                label={"ชื่อ บุคคล"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("customer_name") ?? ""}
                classNameInput=" w-full"
                disabled={disableFields}
                nextFields={{up: "รหัสไปรษณีย์", down: "เบอร์โทร"}}
              />
              <InputAction
                id={"เบอร์โทร"}
                placeholder={"เบอร์โทร"}
                value={watch("contact_number") ?? ""}
                onChange={(e) => setValue("contact_number", e.target.value)}
                label={"เบอร์โทร"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("contact_number") ?? ""}
                classNameInput=" w-full"
                type="tel"
                maxLength={10}
                disabled={disableFields}
                nextFields={{up: "ชื่อ บุคคล", down: "Line ID"}}
              />
              <InputAction
                id={"Line ID"}
                placeholder={"ไอดี ไลน์"}
                value={watch("line_id") ?? ""}
                onChange={(e) => setValue("line_id", e.target.value)}
                label={"ไอดี ไลน์"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("line_id") ?? ""}
                classNameInput=" w-full"
                disabled={disableFields}
                nextFields={{up: "เบอร์โทร", down: "หมายเหตุ"}}
              />
            </Grid>

            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <MasterSelectComponent
                id="brand_name"
                label="แบบรถยนต์"
                onChange={() => {}}
                defaultValue={{
                  value:
                    deliveryScheduleData?.master_repair_receipt.master_quotation
                      .brand_id ?? "",
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
                id="brandmodel_name"
                label="รุ่น"
                onChange={() => {}}
                defaultValue={{
                  value:
                    deliveryScheduleData?.master_repair_receipt
                      ?.master_quotation.model_id ?? "",
                  label: "",
                }}
                valueKey="ms_brandmodel_id"
                labelKey="brandmodel_name"
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={async () => {
                  const brand_id =
                    deliveryScheduleData?.master_repair_receipt
                      ?.master_quotation.brand_id;
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
                id="type_issue_group_name"
                label="ปีรถยนต์"
                onChange={() => {}}
                defaultValue={{
                  value:
                    deliveryScheduleData?.master_repair_receipt
                      ?.master_quotation.car_year ?? "",
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
                  value:
                    deliveryScheduleData?.master_repair_receipt
                      ?.master_quotation.car_color_id ?? "",
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
                value={
                  deliveryScheduleData?.master_repair_receipt.register ?? ""
                }
                onChange={() => {}}
                label={"ทะเบียน"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  deliveryScheduleData?.master_repair_receipt.register ?? ""
                }
                classNameInput=" w-full"
                disabled
              />
              <InputAction
                id={"เบอร์กล่อง"}
                placeholder={"เบอร์กล่อง"}
                value={
                  deliveryScheduleData?.master_repair_receipt.box_number ?? ""
                }
                onChange={() => {}}
                label={"เบอร์กล่อง"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  deliveryScheduleData?.master_repair_receipt.box_number ?? ""
                }
                classNameInput=" w-full"
                // type="tel"
                maxLength={10}
                disabled
              />
              <InputAction
                id={"เลขสัญลักษณ์"}
                placeholder={"เลขสัญลักษณ์"}
                value={
                  deliveryScheduleData?.master_repair_receipt
                    .box_number_detail ?? ""
                }
                onChange={() => {}}
                label={"เลขสัญลักษณ์"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  deliveryScheduleData?.master_repair_receipt
                    .box_number_detail ?? ""
                }
                classNameInput=" w-full"
                // type="tel"
                maxLength={10}
                disabled
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
                value={
                  deliveryScheduleData?.master_repair_receipt.total_price?.toString() ??
                  "0"
                }
                onChange={() => {}}
                label={"ราคารวม"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  deliveryScheduleData?.master_repair_receipt.total_price?.toString() ??
                  "0"
                }
                classNameInput=" w-full"
                disabled
              />
              <InputAction
                id={"ภาษี"}
                placeholder={"ภาษี"}
                value={
                  deliveryScheduleData?.master_repair_receipt.tax?.toString() ??
                  "0"
                }
                onChange={() => {}}
                label={"ภาษี"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={
                  deliveryScheduleData?.master_repair_receipt.tax?.toString() ??
                  "0"
                }
                classNameInput=" w-full"
                disabled
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
              nextFields={{up: "Line ID", down: "general"}}
            />
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
                {deliveryScheduleData?.status === DOCUMENT_STATUS.PENDING && (
                  <Buttons
                    id="general"
                    type="button"
                    btnType="general"
                    onClick={() => setIsOpenModalDeliveryConfirm(true)}
                    className=" w-[100px] max-sm:w-full bg-blue-700 hover:bg-blue-700"
                    nextFields={{up: "หมายเหตุ", down: "submit"}}
                  >
                    ส่งมอบ
                  </Buttons>
                )}
                <Buttons
                  btnType="default"
                  variant="outline"
                  className="w-[100px] max-sm:w-full"
                  onClick={handlePrintDocument}
                >
                  พิมพ์เอกสาร
                </Buttons>
                {deliveryScheduleData?.status === DOCUMENT_STATUS.PENDING && (
                  <Buttons
                    id="submit"
                    type="submit"
                    btnType="default"
                    variant="outline"
                    className=" w-[100px] max-sm:w-full"
                    nextFields={{up: "general"}}
                  >
                    <Text>

                    บันทึกข้อมูล
                    </Text>
                  </Buttons>
                )}
              </Flex>
            )}
          </>
        )}

        <DialogAttachmentDeliverySchedule
          data={deliveryScheduleData}
          isOpen={openDialogImages}
          onClose={handleCloseDialogImaage}
          defaultBoxImage={watch("delivery_schedule_image_url") ?? []}
          onChangeImage={(image) => {
            setIsChangeFile(true);
            setValue("delivery_schedule_image_url", image);
          }}
          isChangeFile={isChangeFile}
          disable={disableFields}
        />

        <DialogComponent
          isOpen={isOpenModalDeliveryConfirm}
          onClose={() => setIsOpenModalDeliveryConfirm(false)}
          title="ยืนยันการส่งมอบ"
          onConfirm={handleRequestConfirmDelivery}
          confirmText="ยืนยัน"
          cancelText="ยกเลิก"
        >
          <p>คุณแน่ใจหรือไม่ว่าต้องการส่งมอบบิลใบส่งมอบนี้?</p>
        </DialogComponent>
      </form>
    </div>
  );
}