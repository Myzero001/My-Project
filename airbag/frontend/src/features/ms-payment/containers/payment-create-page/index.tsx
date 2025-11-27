import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import { generateCarYears } from "@/utils/generateCarYears";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { getDeliveryScheduleById } from "@/services/ms.delivery.service";
import {  
  deleteFile,
  fetchFileByURL,
  fetchImages,
  postFile,
} from "@/services/file.service";
import { Badge, Box, Flex, Text } from "@radix-ui/themes";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import Buttons from "@/components/customs/button/button.main.component";
import {
  getPaymentById,
  getPaymentByRepairReceiptId,
  getPaymentEditsByPaymentId,
  postPayment,
  updatePayment,
} from "@/services/ms.payment.service";
import { PAYMENTTYPE } from "@/types/response/response.payment";
import {
  OPTION_PAYMENT,
  PAYMENT_STATUS,
  TYPE_MONEY,
} from "@/types/requests/request.payment";
import { paymentUpdateType } from "../../types/craete";
import { PaymentUpdateSchema } from "../../schemas/quatationCreate";
import dayjs from "dayjs";
import { calculateTax } from "@/utils/calculateTax";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { DateShortTH } from "@/utils/formatDate";
import { DeliverySchedule } from "@/types/response/response.delivery-schedule";
import InputAction from "@/components/customs/input/input.main.component";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import UpdateFileField from "../../components/updateFileField";
import { blobToFile } from "@/types/file";
import { ImageUploadCompression } from "@/utils/ImageUploadCompression";
import AlertDialogComponent from "@/components/customs/alertDialogs/alertDialog";
import ListFileCardField from "../../components/listFileCardField";
import ApproveEditPaymentStatus from "@/components/customs/badges/approveEditPaymentStatus";
import DialogRequestEditPayment from "../../components/dialogRequestEdit";
import {
  PAYMENT_EDITS,
  PAYMENT_EDITS_STATUS,
} from "@/types/response/response.payment-edits";
import DialogHistoryPaymentLog from "@/features/ms-approve-edit-payment/components/dialog.historyRepairReceitListRepairLogStatus";
import DialogCancelEditPayment from "../../components/dialogCancelEditPayment";
import { set } from "date-fns";

type oldPaymentUpdateType = {
  option_payment: string;
  type_money: string;
  price: number;
  tax: number;
  remark: string;

  check_number?: string;
  check_date?: string;
  bank_name?: string;
};

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
  total_price?: number;
  tax_amount?: number;
  tax_status?: boolean;
};
export default function PaymentCreateFeature() {
  const [paymentData, setPaymentData] = useState<PAYMENTTYPE>();
  const [preData, setPreData] = useState<preDataType>();
  const [deliveryScheduleData, setDeliveryScheduleData] =
    useState<DeliverySchedule>();
  const [maxValuePrive, setMaxValuePrive] = useState<number>(0);
  const [fileDelete, setFileDelete] = useState<blobToFile[]>([]);

  const LIMITFILE = 20;
  const maxSizeFile = 5; // 20Mb
  const [isLoadingUploadFile, setIsLoadingUploadFile] =
    useState<boolean>(false);
  const [openAlertFileSize, setOpenAlertFileSize] = useState<boolean>(false);

  const [isloadPaymentData, setIsloadingPaymentData] = useState(true);

  const [isChangeFile, setIsChangeFile] = useState<boolean>(false);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false);
  const [isOpenModalConfirmCreate, setIsOpenModalConfirmCreate] =
    useState<boolean>(false);
  const [isOpenDialogConfirmRequestEdit, setIsOpenDialogConfirmRequestEdit] =
    useState<boolean>(false);

  const [isOpenDialogHistory, setIsOpenDialogHistory] =
    useState<boolean>(false);
  const [isOpenRejectEditPayment, setIsOpenRejectEditPayment] =
    useState<boolean>(false);

  const [disableFields, setDisableFields] = useState(false);

  const CAR_YEAR = generateCarYears();

  const { paymentId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const status = searchParams.get("status");

  const [originalValues, setOriginalValues] = useState<oldPaymentUpdateType>();

  const [changedValues, setChangedValues] = useState<{
    old_data: any;
    new_data: any;
  }>();

  const [hasEdit, setHasEdit] = useState<boolean>(false);
  const [paymentEditsByPaymentId, setPaymentEditsByPaymentId] = useState<
    PAYMENT_EDITS[] | undefined
  >();
  const [calculatedTaxData, setCalculatedTaxData] = useState({
    taxAmount: 0,
    totalPrice: 0,
    price: 0,
  });
  

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    register,
  } = useForm<paymentUpdateType>({
    defaultValues: {
      payment_image_url: [],
    },
    resolver: zodResolver(PaymentUpdateSchema),
  });
  const getChangedValues = () => {
    const old_data: any = {}; // Object to store old values
    const new_data: any = {}; // Object to store new values
    const formValues = watch();

    // ตรวจสอบแต่ละคีย์ใน formValues
    (Object.keys(formValues) as (keyof paymentUpdateType)[]).forEach((key) => {
      if (key === "payment_image_url") {
        return; // ข้ามคีย์ payment_image_url
      }

      const currentValue = formValues[key];
      const originalValue = originalValues ? originalValues[key] : undefined; // Check if originalValues is defined

      // ถ้าค่าของ formValues[key] เป็น undefined หรือไม่เท่ากับ originalValues, จะเพิ่มลงใน oldValues และ newValues
      if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
        old_data[key] = originalValue;
        new_data[key] = currentValue;
      }
    });

    return { old_data, new_data };
  };

  const onSubmitHandler = async (payload: paymentUpdateType) => {
    if (status === "create" && paymentId) {
      let filesURL = "";

      const formDataImage = new FormData();
      if (
        payload?.payment_image_url &&
        payload?.payment_image_url?.length > 0
      ) {
        Array.from(payload.payment_image_url).map((file) => {
          formDataImage.append("files", file);
        });

        const resImage_url = await postFile(formDataImage);

        if (resImage_url.responseObject?.file_url) {
          filesURL = resImage_url.responseObject?.file_url;
        }
      }

      postPayment({
        delivery_schedule_id: paymentId,
        option_payment: payload.option_payment,
        type_money: payload.type_money,
        price: payload.price,
        tax: payload.tax,
        tax_rate: payload.tax_rate,
        tax_status: payload.tax_status,
        total_price: payload.total_price,
        payment_image_url: filesURL,
        remark: payload.remark,

        check_date: payload.check_date,
        check_number: payload.check_number,
        bank_name: payload.bank_name,
      })
        .then((res) => {
          if (!res.success) {
            showToast(res.message, false);
          } else {
            showToast("ออกใบชำระเงินสำเร็จ", true);
            navigate(`/ms-payment/${res.responseObject?.id}?status=update`);
          }
        })
        .catch((res) => {
        });
    } else if (status === "update" && paymentData?.id) {
      let filesURL = paymentData.payment_image_url ?? "";
      if (isChangeFile) {
        if (filesURL) {
          await deleteFile(filesURL);
          filesURL = "";
        }

        const formDataImage = new FormData();
        if (
          payload?.payment_image_url &&
          payload?.payment_image_url?.length > 0
        ) {
          Array.from(payload.payment_image_url).map((file) => {
            formDataImage.append("files", file);
          });

          const resImage_url = await postFile(formDataImage);

          if (resImage_url.responseObject?.file_url) {
            filesURL = resImage_url.responseObject?.file_url;
          }
        }
      }

      updatePayment({
        id: paymentData.id,
        option_payment: paymentData.option_payment,
        type_money: paymentData.type_money,
        price: paymentData.price,
        tax: paymentData.tax,
        tax_rate: paymentData.tax_rate,
        tax_status: paymentData.tax_status,
        total_price: paymentData.total_price,
        payment_image_url: filesURL,
        remark: paymentData.remark,

        check_date: paymentData.check_date ?? "",
        check_number: paymentData?.check_number ?? "",
        bank_name: paymentData?.bank_name ?? "",
      })
        .then((res) => {
          if (!res.success) {
            showToast(res.message, false);
          } else {
            // showToast("บันทึกการชำระเงินสำเร็จ", true);
            fetchPaymentById();
            fetchCheckPaymentEdits();
          }
        })
        .catch(() => {
          // showToast("บันทึกการชำระเงินไม่สำเร็จ", false);
        });
    } else {
      showToast("บันทึกการชำระเงินไม่สำเร็จ", false);
    }
  };

  const handleRequestConfirmPayment = () => {
    handleSubmit(onSubmitHandler)();
  };

  const handleChangeTypeMoney = (value: string) => {
    setValue("type_money", value);
    setValue("check_number", "");
    setValue("check_date", dayjs().format());
    setValue("bank_name", "");
  };

  const handleChangeOptionPayment = (value: string) => {
    if (value === OPTION_PAYMENT.NOT_YET_PAID) {
      setValue("price", 0);
      setValue("total_price", 0);
      setValue("tax", 0);
    } else if (value === OPTION_PAYMENT.PARTIAL_PAYMENT) {
      setValue("price", paymentData?.price ?? 0);
      setValue("total_price", paymentData?.total_price ?? 0);
      setValue("tax", paymentData?.tax ?? 0);
    } else if (value === OPTION_PAYMENT.FULL_PAYMENT) {
      if (status === "create") {
        setValue("price", preData?.price ?? 0);
        setValue("total_price", preData?.total_price ?? 0);
        setValue("tax", preData?.tax_amount ?? 0);
      } else if (status === "update") {
        setValue("price", (preData?.price ?? 0));
        setValue("total_price", (preData?.total_price ?? 0));
        setValue("tax", (preData?.tax_amount ?? 0));
      }
    }
    setValue("option_payment", value);
  };

  const handleDeleteFileBox = (file: blobToFile) => {
    const oldFile: blobToFile[] = watch("payment_image_url");
    const oldFileDelete = fileDelete;
    const newFile = oldFile.filter((f) => {
      if (f?.id !== file?.id) {
        return f?.id !== file?.id;
      } else if (file?.status !== "new") {
        setFileDelete([...oldFileDelete, f]);
      }
    });
    setValue("payment_image_url", newFile);
    setIsChangeFile(true);
  };

  const onCheckFileUpload = async (
    uploadFiles: File[],
    currentFile: blobToFile[]
  ) => {
    const mockFiles = [];
    let isErrorFileSize = false;
    setIsLoadingUploadFile(true);

    for (const file of uploadFiles) {
      const fileCompress = await ImageUploadCompression(file);
      const NewFile = new File([fileCompress], fileCompress.name, {
        type: fileCompress?.type,
      });

      const blobToFile: blobToFile = Object.assign(NewFile, {
        index: Math.random().toString(36).slice(2),
        id: Math.random().toString(36).slice(2),
        status: "new",
        imageURL: "",
        url: "",
        file_url: "",
        error: false,
      });

      if ([...currentFile, ...mockFiles]?.length >= LIMITFILE) {
        break;
      }

      if (file.size > maxSizeFile * 1024 * 1024) {
        isErrorFileSize = true;
        blobToFile.error = true;
        mockFiles.push(blobToFile);
      } else {
        blobToFile.imageURL = URL.createObjectURL(file);
        mockFiles.push(blobToFile);
      }
    }

    setIsLoadingUploadFile(false);

    if (isErrorFileSize) {
      setOpenAlertFileSize(true);
      return [];
    } else {
      return [...currentFile, ...mockFiles];
    }
  };

  const fetchPaymentById = () => {
    if (paymentId) {
      setIsloadingPaymentData(true);
      getPaymentById(paymentId)
        .then(async (res) => {
          const item = res.responseObject;
          
          if (item) {
            getPaymentByRepairReceiptId(
              item.master_delivery_schedule.repair_receipt_id
            ).then((responsePaymentByRepairReceiptId) => {

              const totalPriceAll =
                item.master_delivery_schedule.master_repair_receipt
                  .total_price ?? 0;
              const totalPriceReceipt = responsePaymentByRepairReceiptId.responseObject?.reduce((sum, item) => {
                if (paymentId !== item.id) {
                  return sum + item.price;
                }
                return sum;
              }, 0);
              const totalPriceReceiptTax = responsePaymentByRepairReceiptId.responseObject?.reduce((sum, item) => {
                if (paymentId !== item.id) {
                  return sum + item.tax;
                }
                return sum;
              }, 0);
              const totalPriceReceiptTotal = responsePaymentByRepairReceiptId.responseObject?.reduce((sum, item) => {
                if (paymentId !== item.id) {
                  return sum + item.total_price;
                }
                return sum;
              }, 0);

              const resultFullCheckPrice = calculateTax(
                totalPriceAll,
                item.master_delivery_schedule.master_repair_receipt.tax ?? 0,
                item.companies.tax_status,
                "default"
              );
              let basePrice = 0;
              let beforePrice = 0;
              let beforeTax = 0;
              if(item.companies.tax_status === 'false'){
                beforePrice = resultFullCheckPrice.price - totalPriceReceipt;
              }else {
                beforePrice = totalPriceAll - totalPriceReceipt;
              }
              beforeTax = resultFullCheckPrice.taxAmount - totalPriceReceiptTax;
              beforeTax = Math.round(beforeTax * 100) / 100;
              basePrice = resultFullCheckPrice.totalPrice - totalPriceReceiptTotal;
              
              setMaxValuePrive(basePrice);

              const pre = {
                company_name: item?.companies.company_name,
                addr_alley:
                  item?.master_delivery_schedule.master_repair_receipt
                    .master_quotation.master_customer.addr_alley,
                addr_street:
                  item?.master_delivery_schedule.master_repair_receipt
                    .master_quotation.master_customer.addr_street,
                addr_subdistrict:
                  item?.master_delivery_schedule.master_repair_receipt
                    .master_quotation.master_customer.addr_subdistrict,
                addr_district:
                  item?.master_delivery_schedule.master_repair_receipt
                    .master_quotation.master_customer.addr_district,
                addr_province:
                  item?.master_delivery_schedule.master_repair_receipt
                    .master_quotation.master_customer.addr_province,
                addr_postcode:
                  item?.master_delivery_schedule.master_repair_receipt
                    .master_quotation.master_customer.addr_postcode,
                contact_number:
                  item?.master_delivery_schedule.master_repair_receipt
                    .master_quotation.master_customer.contact_number,
                brand_name:
                  item?.master_delivery_schedule.master_repair_receipt
                    .master_quotation.master_brand.brand_name,
                brandmodel_name:
                  item?.master_delivery_schedule.master_repair_receipt
                    .master_quotation.master_brandmodel.brandmodel_name,
                color_name:
                  item?.master_delivery_schedule.master_repair_receipt
                    .master_quotation.master_color.color_name,
                register:
                  item?.master_delivery_schedule.master_repair_receipt.register,
                car_year:
                  item?.master_delivery_schedule.master_repair_receipt
                    .master_quotation.car_year,
                payment_doc: item?.payment_doc,
                delivery_schedule_doc:
                  item?.master_delivery_schedule.delivery_schedule_doc,
                quotation_doc:
                  item?.master_delivery_schedule.master_repair_receipt
                    .master_quotation.quotation_doc,
                price: beforePrice,
                tax: item.master_delivery_schedule.master_repair_receipt.tax,
                total_price: basePrice,
                tax_amount:  beforeTax,

              };
              
              setPreData(pre);
          
            });
            
            setPaymentData(item);
            setDisableFields(item.status === PAYMENT_STATUS.SUCCESS);
           
            setValue("tax_rate", item.tax_rate);
            const taxStatus: boolean = item?.companies.tax_status === "true";
            setValue("tax_status", taxStatus);


            setValue("remark", item.remark ?? "");
            setValue("option_payment", item.option_payment);
            setValue("type_money", item.type_money);
            setValue("price", item.price);
            setValue("tax", item.tax);
            setValue("total_price", item.total_price);

            setValue("check_number", item.check_number ?? "");
            setValue("check_date", item.check_date ?? dayjs().format());
            setValue("bank_name", item.bank_name ?? "");

            setOriginalValues({
              option_payment: item.option_payment,
              type_money: item.type_money,
              price: item.price,
              tax: item.tax,
              remark: item.remark ?? "",
              check_number: item.check_number,
              check_date: item.check_date,
              bank_name: item.bank_name,
            });

            if (item.payment_image_url) {
              setIsLoadingUploadFile(true);
              const preData: {
                payment_image_url: blobToFile[];
              } = {
                payment_image_url: [],
              };
              const payment_image_url = item.payment_image_url.split(",");
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
              setValue("payment_image_url", preData.payment_image_url);
            }
            setIsLoadingUploadFile(false);
          }
        })
        .finally(() => {
          setIsloadingPaymentData(false);
        });
    }
  };
  const fetchCheckPaymentEdits = () => {
    if (paymentId) {
      getPaymentEditsByPaymentId(paymentId).then(async (res) => {
        const item = res.responseObject;
        setPaymentEditsByPaymentId(item);
        if (item && item.length > 0) {
          if (item[0].edit_status === PAYMENT_EDITS_STATUS.PENDING) {
            setHasEdit(true);
          } else {
            setHasEdit(false);
          }
        } else {
          setHasEdit(false);
        }
      });
    }
  };

  const fetchDeliveryScheduleById = () => {
    if (paymentId) {
      setIsloadingPaymentData(true);
      getDeliveryScheduleById(paymentId)
        .then((res) => {
          const item = res.responseObject;
          
          if (item) {
            setDeliveryScheduleData(item);
            getPaymentByRepairReceiptId(item.repair_receipt_id).then(
              (responsePaymentByRepairReceiptId) => {
                const totalPriceAll =
                  item.master_repair_receipt
                    .total_price ?? 0;
                const totalPriceReceipt = responsePaymentByRepairReceiptId.responseObject?.reduce((sum, item) => {
                  if (paymentId !== item.id) {
                    return sum + item.price;
                  }
                  return sum;
                }, 0);
                const totalPriceReceiptTax = responsePaymentByRepairReceiptId.responseObject?.reduce((sum, item) => {
                  if (paymentId !== item.id) {
                    return sum + item.tax;
                  }
                  return sum;
                }, 0);
                const totalPriceReceiptTotal = responsePaymentByRepairReceiptId.responseObject?.reduce((sum, item) => {
                  if (paymentId !== item.id) {
                    return sum + item.total_price;
                  }
                  return sum;
                }, 0);

                const resultFullCheckPrice = calculateTax(
                  totalPriceAll,
                  item.master_repair_receipt.tax ?? 0,
                  item.companies.tax_status,
                  "default"
                );
                let basePrice = 0;
                let beforePrice = 0;
                let beforeTax = 0;
                if(item.companies.tax_status === 'false'){
                  beforePrice = resultFullCheckPrice.price - totalPriceReceipt;
                }else {
                  beforePrice = totalPriceAll - totalPriceReceipt;
                }
                beforeTax = resultFullCheckPrice.taxAmount - totalPriceReceiptTax;
                beforeTax = Math.round(beforeTax * 100) / 100;
                basePrice = resultFullCheckPrice.totalPrice - totalPriceReceiptTotal;
                
                // const totalPriceAll =
                //   item.master_repair_receipt.total_price ?? 0;
                // const totalPriceReceipt =
                //   responsePaymentByRepairReceiptId.responseObject?.reduce(
                //     (sum, item) => sum + item.price,
                //     0
                //   ) ?? 0;
                // const totalPriceReceiptTotal =
                //   responsePaymentByRepairReceiptId.responseObject?.reduce(
                //     (sum, item) => sum + item.total_price,
                //     0
                //   ) ?? 0;
                  
                
                // let basePrice = 0;
                // if(item.companies.tax_status === 'false'){
                //   basePrice = resultCheckPrice.totalPrice - totalPriceReceiptTotal;
                // }else {
                //   basePrice = totalPriceAll - totalPriceReceipt;
                // }
                
                // const result = calculateTax(
                //   basePrice,
                //   item.master_repair_receipt.tax ?? 0,
                //   item.companies.tax_status,
                //   "default"
                // );
                // setCalculatedTaxData(result);
                
                setMaxValuePrive(beforePrice);
                setValue("price", beforePrice);
                setValue("tax", beforeTax);
                setValue("total_price", basePrice);

                const pre = {
                  company_name: item?.companies.company_name,
                  tax_status: item?.companies.tax_status,
                  addr_alley:
                    item.master_repair_receipt.master_quotation.master_customer
                      .addr_alley,
                  addr_street:
                    item.master_repair_receipt.master_quotation.master_customer
                      .addr_street,
                  addr_subdistrict:
                    item.master_repair_receipt.master_quotation.master_customer
                      .addr_subdistrict,
                  addr_district:
                    item.master_repair_receipt.master_quotation.master_customer
                      .addr_district,
                  addr_province:
                    item.master_repair_receipt.master_quotation.master_customer
                      .addr_province,
                  addr_postcode:
                    item.master_repair_receipt.master_quotation.master_customer
                      .addr_postcode,
                  contact_number:
                    item.master_repair_receipt.master_quotation.master_customer
                      .contact_number,
                  brand_name:
                    item.master_repair_receipt.master_quotation.master_brand
                      .brand_name,
                  brandmodel_name:
                    item.master_repair_receipt.master_quotation
                      .master_brandmodel.brandmodel_name,
                  color_name:
                    item.master_repair_receipt.master_quotation.master_color
                      .color_name,
                  register: item.master_repair_receipt.register,
                  car_year:
                    item.master_repair_receipt.master_quotation.car_year,
                  delivery_schedule_doc: item.delivery_schedule_doc,
                  quotation_doc:
                    item.master_repair_receipt.master_quotation.quotation_doc,
                  price: beforePrice,
                  tax: item.master_repair_receipt.tax,
                  tax_amount: beforeTax,
                  total_price: basePrice,
                };
                setValue("tax_rate", item.master_repair_receipt.tax ?? 0);
                const taxStatus: boolean = item?.companies.tax_status === "true";
                setValue("tax_status", taxStatus);
                // @ts-ignore
                setPreData(pre);
                
              }
            );

            setValue("remark", "");
            setValue("option_payment", OPTION_PAYMENT.FULL_PAYMENT);
            setValue("type_money", TYPE_MONEY.CASH);
          }
        })
        .finally(() => {
          setIsloadingPaymentData(false);
        });
    }
  };

  const handleRequestEditForm = () => {
    handleSubmit(onSubmitHandler)();
    setIsOpenDialogConfirmRequestEdit(false);
  };

  const onCancelPaymentEdit = () => {
    setIsOpenRejectEditPayment(false);
    fetchPaymentById();
    fetchCheckPaymentEdits();
  };

  useEffect(() => {
    if (paymentId) {
      if (status === "create") {
        fetchDeliveryScheduleById();
      } else if (status === "update") {
        fetchPaymentById();
        fetchCheckPaymentEdits();
      } else {
        navigate("/ms-payment");
      }
    }
  }, [paymentId]);

 

  if (isloadPaymentData) {
    return <BoxLoadingData height="100vh" />;
  }

  return (
    <div className="container w-full m-auto">
      <Flex gap={"3"} justify={"between"}>
        <Flex gap={"3"}>
          <Text size="6" weight="bold" className="text-center">
            ใบชำระเงิน
          </Text>
          {status === "update" && hasEdit && (
            <Badge variant="soft" color={"sky"} size={"3"}>
              รออนุมัติขอแก้ไขใบชำระเงิน
            </Badge>
          )}
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
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col items-center gap-3 mt-4  rounded-md p-6"
      >
        {isloadPaymentData ? (
          <BoxLoadingData minHeight="100vh" />
        ) : (
          <Flex
            justify={"center"}
            direction={"column"}
            gap={"4"}
            className=" w-full max-w-[430px] p-6 bg-white text-sm rounded-md"
          >
            <Text size="7" weight="bold" className="text-center">
              ชำระเงิน
            </Text>
            <Flex direction={"column"} gap={"1"}>
              <Text className="text-center">
                บริษัท {preData?.company_name}
              </Text>
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
              <Text className="text-center">
                เบอร์โทร {preData?.contact_number}
              </Text>
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
              <Text className="text-center">
                วันที่ {DateShortTH(new Date())}
              </Text>
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
                <RadioGroup
                  disabled={disableFields || hasEdit}
                  defaultValue={watch("option_payment")}
                  className="flex"
                  onValueChange={(value) => handleChangeOptionPayment(value)}
                >
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
                </RadioGroup>
              </Box>
              <Box className=" w-full flex ">
                <RadioGroup
                  disabled={disableFields || hasEdit}
                  defaultValue={watch("type_money")}
                  className=" flex "
                  onValueChange={(value) => handleChangeTypeMoney(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">เงินสด</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="transfer-money"
                      id="transfer-money"
                    />
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
              display={
                watch("type_money") === TYPE_MONEY.CHECK ? "flex" : "none"
              }
            >
              <InputAction
                id={"เลขที่เช็ค"}
                placeholder={"เลขที่เช็ค"}
                value={watch("check_number") ?? ""}
                onChange={(e) => setValue("check_number", e.target.value)}
                label={"เลขที่เช็ค"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("check_number") ?? ""}
                classNameInput=" w-full"
                disabled={disableFields || hasEdit}
              />
              <InputAction
                id={"ธนาคาร"}
                placeholder={"ธนาคาร"}
                value={watch("bank_name") ?? ""}
                onChange={(e) => setValue("bank_name", e.target.value)}
                label={"ธนาคาร"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("bank_name") ?? ""}
                classNameInput=" w-full"
                disabled={disableFields || hasEdit}
              />
              <InputDatePicker
                id="วันที่เช็ค"
                labelName={"วันที่เช็ค"}
                onchange={(date) =>
                  date &&
                  setValue("check_date", dayjs(date).format("YYYY-MM-DD"))
                }
                defaultDate={
                  watch("check_date")
                    ? new Date(watch("check_date") as string)
                    : new Date()
                }
              />
            </Flex>
            <UpdateFileField
              id="file-upload"
              isError={false}
              acceptDescription={".JPEG, .JPG, .PNG"}
              files={watch("payment_image_url")}
              onLoading={(loading) => setIsLoadingUploadFile(loading)}
              onCheckFileUpload={(f) => {
                onCheckFileUpload(f, watch("payment_image_url")).then(
                  (file) => {
                    setIsChangeFile(true);
                    setValue("payment_image_url", file);
                  }
                );
              }}
              acceptOption={{
                "image/png": [".png"],
                "image/jpeg": [".jpeg"],
                "image/webp": [".webp"],
              }}
              disabled={disableFields || hasEdit}
            />
            {watch("payment_image_url") &&
            watch("payment_image_url")?.length <= 0
              ? null
              : watch("payment_image_url") &&
                watch("payment_image_url")?.length > 0 && (
                  <ListFileCardField
                    files={watch("payment_image_url")}
                    setFiles={(f) => setValue("payment_image_url", f)}
                    onClickDelete={(f) => handleDeleteFileBox(f)}
                    disable={disableFields || hasEdit}
                  />
                )}
            <InputTextareaFormManage
              name={"หมายเหตุ"}
              placeholder="-"
              register={{ ...register("remark") }}
              rows={2}
              // msgError={errors.remark?.message}
              showLabel
              disabled={disableFields || hasEdit}
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
              {watch("option_payment") === OPTION_PAYMENT.FULL_PAYMENT && (
                <Flex justify={"between"} width={"220px"}>
                  <Text className="text-center">จำนวนเงิน </Text>
                  <Text className="text-center">
                    {watch("price")?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) + " บาท"}
                  </Text>
                </Flex>
              )}
              {watch("option_payment") === OPTION_PAYMENT.PARTIAL_PAYMENT && (
                <Flex
                  justify={"between"}
                  width={"220px"}
                  gap={"1"}
                  align={"center"}
                >
                  <InputAction
                    id={"จำนวนเงิน"}
                    placeholder={"จำนวนเงิน"}
                    value={watch("price").toString() ?? ""}
                    onChange={(e) => {
                      let price = parseFloat(e.target.value);
                      if (isNaN(price)) {
                        price = 0;
                      }

                      if (price > maxValuePrive && status === "create") {
                        setValue("price", maxValuePrive);
                        price = maxValuePrive;
                      } else if (

                        price > maxValuePrive + (paymentData?.price ?? 0) &&
                        status === "update"
                      ) {
                        const maxAllowed = maxValuePrive + (paymentData?.price ?? 0);
                        setValue("price", maxAllowed);
                        price = maxAllowed;
                      } else {
                        setValue("price", price);
                      }
                      if (preData) {
                        const result = calculateTax(price, preData.tax ?? 0, String(preData.tax_status), "edit");
                        
                        setCalculatedTaxData(result); // กำหนด state สำหรับแสดงผลรวม
                        setValue("tax", result.taxAmount);
                        setValue("total_price", result.totalPrice);
                      }
                    }}
                    label={"จำนวนเงิน"}
                    labelOrientation={"horizontal"}
                    size={"2"}
                    defaultValue={watch("price").toString() ?? ""}
                    classNameInput=" w-full text-right"
                    classNameLabel=" w-[100px]"
                    // className=" w-full"
                    disabled={disableFields || hasEdit}
                  />
                  <Text className="text-center"> บาท</Text>
                </Flex>
              )}
              {watch("option_payment") === OPTION_PAYMENT.NOT_YET_PAID && (
                <Flex justify={"between"} width={"220px"}>
                  <Text className="text-center">จำนวนเงิน </Text>
                  <Text className="text-center">
                    {watch("price").toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) + " บาท"}
                  </Text>
                </Flex>
              )}
              <Flex justify={"between"} width={"220px"}>
                <Text className="text-center">ภาษี {preData?.tax}% </Text>
                <Text className="text-center">
                  {/* {calculatedTaxData.taxAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) + " บาท"} */}
                  {(watch("tax") ?? 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) + " บาท"}
                </Text>
              </Flex>
              <Flex justify={"between"} width={"220px"}>
                <Text className="text-center">ราคารวมภาษี </Text>
                <Text className="text-center">
                  {(watch("total_price") ?? 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) + " บาท"}
                </Text>
              </Flex>
            </Flex>
            <Flex
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
              {status === "update" && hasEdit && (
                <Buttons
                  type="button"
                  btnType="delete"
                  onClick={() => setIsOpenRejectEditPayment(true)}
                  className=" min-w-[100px] max-sm:w-full"
                >
                  ยกเลิก
                </Buttons>
              )}
              <Buttons
                onClick={() =>
                  status === "create"
                    ? setIsOpenModalConfirmCreate(true)
                    : handleSubmit(() => {
                        setChangedValues(getChangedValues());
                        setIsOpenDialogConfirmRequestEdit(true);
                      })()
                }
                type="button"
                btnType="submit"
                className=" max-sm:w-full"
                disabled={status === "update" && hasEdit}
              >
                {status === "create" ? "ออกใบชำระเงิน" : "ขอแก้ไขใบชำระเงิน"}
              </Buttons>
            </Flex>
          </Flex>
        )}

        {/* <DialogAttachmentDeliverySchedule
          data={paymentData}
          isOpen={openDialogImages}
          onClose={handleCloseDialogImaage}
          defaultBoxImage={watch("delivery_schedule_image_url") ?? []}
          onChangeImage={(image) => {
            setIsChangeFile(true);
            setValue("delivery_schedule_image_url", image);
          }}
          isChangeFile={isChangeFile}
          disable={disableFields}
        /> */}

        <DialogRequestEditPayment
          statusPayment={
            paymentEditsByPaymentId && paymentEditsByPaymentId?.length > 0
              ? "update"
              : "create"
          }
          data={paymentData}
          changedValues={changedValues}
          isOpen={isOpenDialogConfirmRequestEdit}
          onClose={() => setIsOpenDialogConfirmRequestEdit(false)}
          onConfirm={handleRequestEditForm}
        />

        <DialogComponent
          isOpen={isOpenModalConfirmCreate}
          onClose={() => setIsOpenModalConfirmCreate(false)}
          title="ยืนยันการชำระเงิน"
          onConfirm={handleRequestConfirmPayment}
          confirmText="ยืนยัน"
          cancelText="ยกเลิก"
        >
          <p>คุณแน่ใจหรือไม่ว่าต้องการยืนยันการชำระเงินนี้?</p>
        </DialogComponent>

        <AlertDialogComponent
          id={"file-upload"}
          className="  max-w-md"
          handleClose={() => {
            setOpenAlertFileSize(false);
          }}
          handleSubmit={() => {
            setOpenAlertFileSize(false);
          }}
          isOpen={openAlertFileSize}
          title={"ไฟล์ใหญ่เกินไป"}
          description={
            <Box style={{ display: "flex", flexDirection: "column" }}>
              <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
                “ขนาดไฟล์เกินมาตรฐานที่กำหนด
              </Text>
              <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
                กรุณาเลือกไฟล์ใหม่และอัปโหลดอีกครั้ง
              </Text>
              <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
                [ขนาดไฟล์ใหญ่สุด: 5MB]”
              </Text>
            </Box>
          }
          btnSubmitName={"ลองอีกครั้ง"}
          btnCancelName={"ยกเลิก"}
        />

        <DialogHistoryPaymentLog
          id={paymentId}
          isOpen={isOpenDialogHistory}
          onClose={() => setIsOpenDialogHistory(false)}
          title={"ประวัติการขอแก้ไขใบชำระเงิน"}
        />

        <DialogCancelEditPayment
          data={paymentData}
          isOpen={isOpenRejectEditPayment}
          onClose={() => setIsOpenRejectEditPayment(false)}
          onConfirm={onCancelPaymentEdit}
        />
      </form>
    </div>
  );
}