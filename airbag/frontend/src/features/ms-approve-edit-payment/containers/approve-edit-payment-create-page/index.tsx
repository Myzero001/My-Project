import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import { generateCarYears } from "@/utils/generateCarYears";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFileByURL, fetchImages } from "@/services/file.service";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Buttons from "@/components/customs/button/button.main.component";
import {
  getPaymentByRepairReceiptId,
  getPaymentEditsById,
} from "@/services/ms.payment.service";
import { PAYMENTTYPE } from "@/types/response/response.payment";
import { OPTION_PAYMENT, TYPE_MONEY } from "@/types/requests/request.payment";
import dayjs from "dayjs";
import { calculateTax } from "@/utils/calculateTax";
import { DateShortTH } from "@/utils/formatDate";
import InputAction from "@/components/customs/input/input.main.component";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import UpdateFileField from "../../components/updateFileField";
import { blobToFile } from "@/types/file";
import ListFileCardField from "../../components/listFileCardField";
import InputTextareaManage from "@/components/customs/input/inputTextareaManage";
import ApproveEditPaymentStatus from "@/components/customs/badges/approveEditPaymentStatus";
import DialogApproveEditPayment from "../../components/dialogApproveEditPayment";
import DialogRejectEditPayment from "../../components/dialogRejectEditPayment";
import {
  PAYMENT_EDITS,
  PAYMENT_EDITS_STATUS,
} from "@/types/response/response.payment-edits";
import DialogHistoryPaymentLog from "../../components/dialog.historyRepairReceitListRepairLogStatus";

type preDataType = {
  company_name: string;
  addr_alley: string | null;
  addr_street: string | null;
  addr_subdistrict: string | null;
  addr_district: string | null;
  addr_province: string | null;
  addr_postcode: string | null;
  contact_number: string | null;
  brand_name: string | null;
  brandmodel_name: string | null;
  color_name: string | null;
  register: string | undefined;
  car_year: string | null;
  payment_doc?: string | undefined;
  delivery_schedule_doc: string;
  quotation_doc: string;
  price?: number;
  tax?: number;
};
export default function ApproveEditPaymentCreateFeature() {
  const [paymentEditsData, setPaymentEditsData] = useState<PAYMENT_EDITS>();
  const [paymentDataOld, setPaymentDataOld] = useState<PAYMENTTYPE>();
  const [paymentDataNew, setPaymentDataNew] = useState<PAYMENTTYPE>();
  const [preData, setPreData] = useState<preDataType>();
  const [maxValuePrive, setMaxValuePrive] = useState<number>(0);
  const [isloadPaymentData, setIsloadingPaymentData] = useState(false);

  const [isOpenDialogHistory, setIsOpenDialogHistory] =
    useState<boolean>(false);
  const [isOpenApproveEditPayment, setIsOpenApproveEditPayment] =
    useState<boolean>(false);
  const [isOpenRejectEditPayment, setIsOpenRejectEditPayment] =
    useState<boolean>(false);

  const [isLoadingUploadFile, setIsLoadingUploadFile] = useState(false);
  const [paymentImageUrl, setPaymentImageUrl] = useState<blobToFile[]>();

  const CAR_YEAR = generateCarYears();

  const { paymentEditsId } = useParams();

  const { taxAmount, totalPrice } = calculateTax(0, preData?.tax);

  const handleApproveEditPayment = () => {
    setIsOpenApproveEditPayment(true);
  };

  const handleRejectEditPayment = () => {
    setIsOpenRejectEditPayment(true);
  };

  const onConfirmEditPayment = () => {
    setIsOpenApproveEditPayment(false);
    setIsOpenRejectEditPayment(false);
    
    if (paymentEditsId) {
      fetchPaymentById();
    }
  };

  const fetchPaymentById = () => {
    if (paymentEditsId) {
      setIsloadingPaymentData(true);
      getPaymentEditsById(paymentEditsId)
        .then(async (res) => {
          const item = res.responseObject;
          setPaymentEditsData(item);
          if (item) {
            getPaymentByRepairReceiptId(
              item.master_payment.master_delivery_schedule.repair_receipt_id
            ).then((responsePaymentByRepairReceiptId) => {
             

              const totalPriceAll =
                item.master_payment.master_delivery_schedule
                  .master_repair_receipt.total_price ?? 0;
              const totalPriceReceipt =
                responsePaymentByRepairReceiptId.responseObject?.reduce(
                  (sum, item) => sum + item.price,
                  0
                ) ?? 0;
              setMaxValuePrive(totalPriceAll - totalPriceReceipt);
              const pre = {
                company_name: item?.master_payment.companies.company_name,
                addr_alley:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.master_quotation.master_customer
                    .addr_alley,
                addr_street:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.master_quotation.master_customer
                    .addr_street,
                addr_subdistrict:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.master_quotation.master_customer
                    .addr_subdistrict,
                addr_district:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.master_quotation.master_customer
                    .addr_district,
                addr_province:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.master_quotation.master_customer
                    .addr_province,
                addr_postcode:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.master_quotation.master_customer
                    .addr_postcode,
                contact_number:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.master_quotation.master_customer
                    .contact_number,
                brand_name:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.master_quotation.master_brand
                    .brand_name,
                brandmodel_name:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.master_quotation.master_brandmodel
                    .brandmodel_name,
                color_name:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.master_quotation.master_color
                    .color_name,
                register:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.register,
                car_year:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.master_quotation.car_year,
                payment_doc: item?.master_payment.payment_doc,
                delivery_schedule_doc:
                  item?.master_payment.master_delivery_schedule
                    .delivery_schedule_doc,
                quotation_doc:
                  item?.master_payment.master_delivery_schedule
                    .master_repair_receipt.master_quotation.quotation_doc,
                price: totalPriceAll - totalPriceReceipt,
                tax: item.master_payment.master_delivery_schedule
                  .master_repair_receipt.tax,
              };
              setPreData(pre);
            });

            const newPaymentOld: PAYMENTTYPE = {
              ...item.master_payment,
              check_date: item.master_payment.check_date ?? dayjs().format(),
            };
            const newPaymentNew: PAYMENTTYPE = {
              ...item.master_payment,
              check_date: item.master_payment.check_date ?? dayjs().format(),
            };
            

            const oldData: any = JSON.parse(item.old_data);
            if (oldData?.remark) {
              newPaymentOld.remark = oldData.remark;
            }
            if (oldData?.option_payment) {
              newPaymentOld.option_payment = oldData.option_payment;
            }
            if (oldData?.type_money) {
              newPaymentOld.type_money = oldData.type_money;
            }
            if (oldData?.price) {
              newPaymentOld.price = oldData.price;
            }
            if (oldData?.tax){
              newPaymentOld.tax = oldData.tax;
            }
            if (oldData?.check_number) {
              newPaymentOld.check_number = oldData.check_number;
            }
            if (oldData?.check_date) {
              newPaymentOld.check_date = oldData.check_date;
            }
            if (oldData?.bank_name) {
              newPaymentOld.bank_name = oldData.bank_name;
            }

            const newData: any = JSON.parse(item.new_data);
            if (newData?.remark) {
              newPaymentNew.remark = newData.remark;
            }
            if (newData?.option_payment) {
              newPaymentNew.option_payment = newData.option_payment;
            }
            if (newData?.type_money) {
              newPaymentNew.type_money = newData.type_money;
            }
            if (newData?.price) {
              newPaymentNew.price = newData.price;
            }
            if (newData?.tax){
              newPaymentNew.tax = newData.tax;
            }
            if (newData?.check_number) {
              newPaymentNew.check_number = newData.check_number;
            }
            if (newData?.check_date) {
              newPaymentNew.check_date = newData.check_date;
            }
            if (newData?.bank_name) {
              newPaymentNew.bank_name = newData.bank_name;
            }

            setPaymentDataOld(newPaymentOld);
            setPaymentDataNew(newPaymentNew);

            // setValue("remark", item.remark ?? "");
            // setValue("option_payment", item.option_payment);
            // setValue("type_money", item.type_money);
            // setValue("price", item.price);
            // setValue("remark", item.remark ?? "");

            // setValue("check_number", item.check_number ?? "");
            // setValue("check_date", item.check_date ?? dayjs().format());
            // setValue("bank_name", item.bank_name ?? "");

            if (item.master_payment.payment_image_url) {
              setIsLoadingUploadFile(true);
              const preData: {
                payment_image_url: blobToFile[];
              } = {
                payment_image_url: [],
              };
              const payment_image_url =
                item.master_payment.payment_image_url.split(",");
              if (payment_image_url && payment_image_url.length > 0) {
                preData.payment_image_url = await Promise.all(
                  payment_image_url.map(async (image) => {
                    const response = await fetchFileByURL(image);
                    if (response.responseObject) {
                      const response_image_urls = await fetchImages(
                        response.responseObject
                      );
                      return response_image_urls[0];
                    }
                  })
                );
              }
              setPaymentImageUrl(preData.payment_image_url);
            }

            setIsLoadingUploadFile(false);
          }
        })
        .finally(() => {
          setIsloadingPaymentData(false);
        });
    }
  };

  useEffect(() => {
    if (paymentEditsId) {
      fetchPaymentById();
    }
  }, [paymentEditsId]);

  if (isloadPaymentData) {
    return <BoxLoadingData height="100vh" />;
  }
  return (
    <div className="container w-full m-auto">
      <Flex gap={"3"} justify={"between"}>
        <Flex gap={"3"} className=" max-md:flex-wrap">
          <Text size="6" weight="bold" className="text-center">
            แก้ไขใบชำระเงิน
          </Text>
          <ApproveEditPaymentStatus
            value={paymentEditsData?.edit_status ?? "pending"}
          />
        </Flex>

        <Buttons
          type="button"
          btnType="default"
          variant="outline"
          onClick={() => setIsOpenDialogHistory(true)}
        >
          ประวัติการแก้ไขใบชำระเงิน
        </Buttons>
      </Flex>
      <div className="flex flex-col items-center mt-4 p-6">
        {isloadPaymentData ? (
          <BoxLoadingData minHeight="100vh" />
        ) : (
          <div className="flex flex-col items-end gap-2">
            <div className="flex max-md:flex-col justify-center gap-6">
              <PaymentFormComponent
                className=" opacity-75 "
                titlePayment={"ใบชำระเงินเก่า"}
                preData={preData}
                option_payment={paymentDataOld?.option_payment ?? ""}
                type_money={paymentDataOld?.type_money ?? ""}
                check_number={paymentDataOld?.check_number}
                bank_name={paymentDataOld?.bank_name}
                check_date={paymentDataOld?.check_date}
                payment_image_url={paymentImageUrl ?? []}
                remark={paymentDataOld?.remark ?? ""}
                price={paymentDataOld?.price ?? 0}
                // tax={paymentDataOld?.tax ?? 0}
                taxAmount={paymentDataOld?.tax ?? 0}
                totalPrice={(paymentDataOld?.price ?? 0) + (paymentDataOld?.tax ?? 0)}
              />
              <PaymentFormComponent
                className=""
                titlePayment={"ใบชำระเงินใหม่"}
                preData={preData}
                option_payment={paymentDataNew?.option_payment ?? ""}
                type_money={paymentDataNew?.type_money ?? ""}
                check_number={paymentDataNew?.check_number}
                bank_name={paymentDataNew?.bank_name}
                check_date={paymentDataNew?.check_date}
                payment_image_url={paymentImageUrl ?? []}
                remark={paymentDataNew?.remark ?? ""}
                price={paymentDataNew?.price ?? 0}
                taxAmount={paymentDataNew?.tax ?? 0}
                totalPrice={(paymentDataNew?.price ?? 0) + (paymentDataNew?.tax ?? 0)}
              />
            </div>
            {paymentEditsData?.edit_status === PAYMENT_EDITS_STATUS.PENDING && (
              <Flex
                gap={"4"}
                justify={"end"}
                className=" w-full"
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
                  btnType="general"
                  onClick={handleRejectEditPayment}
                  className=" w-[100px] max-md:w-full bg-red-700 hover:bg-red-700"
                >
                  ไม่อนุมัติ
                </Buttons>
                <Buttons
                  btnType="submit"
                  onClick={handleApproveEditPayment}
                  className=" w-[100px] max-md:w-full"
                >
                  อนุมัติ
                </Buttons>
              </Flex>
            )}
          </div>
        )}
      </div>

      <DialogApproveEditPayment
        data={paymentDataOld}
        isOpen={isOpenApproveEditPayment}
        onClose={() => setIsOpenApproveEditPayment(false)}
        onConfirm={onConfirmEditPayment}
      />

      <DialogRejectEditPayment
        data={paymentDataOld}
        isOpen={isOpenRejectEditPayment}
        onClose={() => setIsOpenRejectEditPayment(false)}
        onConfirm={onConfirmEditPayment}
      />

      <DialogHistoryPaymentLog
        id={paymentDataOld?.id}
        isOpen={isOpenDialogHistory}
        onClose={() => setIsOpenDialogHistory(false)}
        title={"ประวัติการขอแก้ไขใบชำระเงิน"}
      />
    </div>
  );
}

type PaymentFormComponentProps = {
  titlePayment: string;
  preData: preDataType | undefined;
  option_payment: string;
  type_money: string;
  check_number?: string;
  bank_name?: string;
  check_date?: string;
  payment_image_url: blobToFile[];
  remark: string;
  price: number;
  taxAmount: number;
  totalPrice: number;
  className?: string | undefined;
};
const PaymentFormComponent = ({
  titlePayment,
  preData,
  option_payment,
  type_money,
  check_number,
  bank_name,
  check_date,
  payment_image_url,
  remark,
  price,
  taxAmount,
  totalPrice,
  className,
}: PaymentFormComponentProps) => {
  return (
    <Flex
      direction={"column"}
      gap={"4"}
      className={` w-full max-w-[430px] p-6 bg-white text-sm rounded-md ${className}`}
    >
      <Text size="7" weight="bold" className="text-center">
        {titlePayment}
      </Text>
      <Flex direction={"column"} gap={"1"}>
        <Text className="text-center">บริษัท {preData?.company_name}</Text>
        <Text className="text-center">
          {preData?.addr_alley}
          {preData?.addr_street}
          {preData?.addr_subdistrict}
        </Text>
        <Text className="text-center">
          {preData?.addr_district}
          {preData?.addr_province}
          {preData?.addr_postcode}
        </Text>
        <Text className="text-center">เบอร์โทร {preData?.contact_number}</Text>
      </Flex>
      <Flex direction={"column"}>
        <Text className="text-center">
          {preData?.brand_name} รุ่น {preData?.brandmodel_name} สี{" "}
          {preData?.color_name}
        </Text>
        <Text className="text-center">
          ทะเบียน {preData?.register} ปีรถยนต์ {preData?.car_year}{" "}
        </Text>
      </Flex>
      <Flex direction={"column"} width={"100%"} align={"start"} gap={"1"}>
        <Text className="text-center">วันที่ {DateShortTH(new Date())}</Text>
        {/* <Text className="text-center">วันที่ 13 กันยายน 2567</Text> */}
        <Text className="text-center">
          เลขที่ใบชำระเงิน {preData?.payment_doc ?? "-"}
        </Text>
        <Text className="text-center">
          เลขที่ใบส่งมอบ {preData?.delivery_schedule_doc}
        </Text>
        <Text className="text-center">
          เลขที่ใบรับซ่อม {preData?.quotation_doc}
        </Text>
      </Flex>
      <Flex direction={"column"} gap={"2"}>
        <Text
          style={{
            fontWeight: "600",
            fontSize: "16px",
            lineHeight: "28px",
          }}
        >
          เลือกการชำระเงิน
        </Text>
        <Box className=" w-full flex  ">
          {/* <RadioGroup defaultValue="full-payment" className=" flex ">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="full-payment" id="full-payment" />
          <Label htmlFor="full-payment">ชำระเต็มจำนวน</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="partial-payment"
            id="partial-payment"
          />
          <Label htmlFor="partial-payment">ชำระบางส่วน</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="not-yet-paid" id="not-yet-paid" />
          <Label htmlFor="not-yet-paid">ยังไม่ชำระ</Label>
        </div>
      </RadioGroup> */}
          <RadioGroup defaultValue={option_payment} className="flex" disabled>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full-payment" id="full-payment" />
              <Label htmlFor="full-payment">ชำระเต็มจำนวน</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partial-payment" id="partial-payment" />
              <Label htmlFor="partial-payment">ชำระบางส่วน</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not-yet-paid" id="not-yet-paid" />
              <Label htmlFor="not-yet-paid">ยังไม่ชำระ</Label>
            </div>
          </RadioGroup>
        </Box>
        <Box className=" w-full flex ">
          <RadioGroup defaultValue={type_money} className=" flex " disabled>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">เงินสด</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="transfer-money" id="transfer-money" />
              <Label htmlFor="transfer-money">เงินโอน</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="check" id="check" />
              <Label htmlFor="check">เช็ค</Label>
            </div>
          </RadioGroup>
        </Box>
      </Flex>
      <Flex
        direction={"column"}
        gap={"2"}
        display={type_money === TYPE_MONEY.CHECK ? "flex" : "none"}
      >
        <InputAction
          id={"เลขที่เช็ค"}
          placeholder={"เลขที่เช็ค"}
          value={check_number ?? ""}
          label={"เลขที่เช็ค"}
          labelOrientation={"vertical"}
          size={"2"}
          defaultValue={check_number ?? ""}
          classNameInput=" w-full"
          disabled
        />
        <InputAction
          id={"ธนาคาร"}
          placeholder={"ธนาคาร"}
          value={bank_name ?? ""}
          label={"ธนาคาร"}
          labelOrientation={"vertical"}
          size={"2"}
          defaultValue={bank_name ?? ""}
          classNameInput=" w-full"
          disabled
        />
        <InputDatePicker
          id="วันที่เช็ค"
          labelName={"วันที่เช็ค"}
          onchange={() => {}}
          defaultDate={check_date ? new Date(check_date as string) : new Date()}
          disabled
        />
      </Flex>
      <UpdateFileField
        id="file-upload"
        isError={false}
        acceptDescription={".JPEG, .JPG, .PNG"}
        files={payment_image_url}
        onLoading={() => {}}
        onCheckFileUpload={() => {}}
        acceptOption={{
          "image/png": [".png"],
          "image/jpeg": [".jpeg"],
          "image/webp": [".webp"],
        }}
        disabled
      />
      {payment_image_url && payment_image_url?.length <= 0
        ? null
        : payment_image_url &&
          payment_image_url?.length > 0 && (
            <ListFileCardField
              files={payment_image_url}
              setFiles={() => {}}
              onClickDelete={() => {}}
            />
          )}
      <InputTextareaManage
        name={"หมายเหตุ"}
        placeholder="-"
        value={remark}
        rows={2}
        // msgError={errors.remark?.message}
        showLabel
        disabled
      />
      <Flex
        direction={"column"}
        width={"100%"}
        align={"end"}
        gap={"1"}
        style={{
          fontWeight: "600",
          fontSize: "14px",
          lineHeight: "28px",
        }}
      >
        {option_payment === OPTION_PAYMENT.FULL_PAYMENT && (
          <Flex justify={"between"} width={"220px"}>
            <Text className="text-center">จำนวนเงิน </Text>
            <Text className="text-center">
              {price?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) + " บาท"}
            </Text>
          </Flex>
        )}
        {option_payment === OPTION_PAYMENT.PARTIAL_PAYMENT && (
          <Flex justify={"between"} width={"220px"} gap={"1"} align={"center"}>
            <InputAction
              id={"จำนวนเงิน"}
              placeholder={"จำนวนเงิน"}
              value={price.toString() ?? ""}
              onChange={() => {}}
              label={"จำนวนเงิน"}
              labelOrientation={"horizontal"}
              size={"2"}
              defaultValue={price.toString() ?? ""}
              classNameInput=" w-full text-right"
              classNameLabel=" w-[100px]"
              // className=" w-full"
              disabled
            />
            <Text className="text-center"> บาท</Text>
          </Flex>
        )}
        {option_payment === OPTION_PAYMENT.NOT_YET_PAID && (
          <Flex justify={"between"} width={"220px"}>
            <Text className="text-center">จำนวนเงิน </Text>
            <Text className="text-center">
              {price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) + " บาท"}
            </Text>
          </Flex>
        )}
        <Flex justify={"between"} width={"220px"}>
          <Text className="text-center">ภาษี {preData?.tax}% </Text>
          <Text className="text-center">
            {taxAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) + " บาท"}
          </Text>
        </Flex>
        <Flex justify={"between"} width={"220px"}>
          <Text className="text-center">ราคารวมภาษี </Text>
          <Text className="text-center">
            {totalPrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) + " บาท"}
          </Text>
        </Flex>
      </Flex>
      {/* <Flex
        gap={"4"}
        justify={"between"}
        className=" mt-4"
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
          onClick={() => navigate("/ms-payment")}
          btnType="default"
          variant="outline"
          className=" max-sm:w-full"
        >
          กลับไปหน้าหลัก
        </Buttons>
        <Buttons
          onClick={() => setIsOpenModalDeliveryConfirm(true)}
          type="button"
          btnType="submit"
          className=" max-sm:w-full"
        >
          ยืนยัน
        </Buttons>
      </Flex> */}
    </Flex>
  );
};
