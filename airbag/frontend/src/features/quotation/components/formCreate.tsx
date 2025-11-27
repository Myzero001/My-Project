import { Flex, Grid, Text, Button } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuatationCreateSchema } from "../schemas/quatationCreate";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import InputAction from "@/components/customs/input/input.main.component";
import CheckboxWithInput from "./CheckboxWithInput";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import Buttons from "@/components/customs/button/button.main.component";
import { useEffect, useState, useMemo } from "react";
import DialogAttachment from "./DialogAttachment";
import ButtonAttactment from "./ButtonAttactment";
import { useParams } from "react-router-dom";
import {
  getQuotationById,
  requestApproveQuotation,
  requestCloseDealQuotation,
  updateQuotation,
} from "@/services/ms.quotation.service";
import { PayLoadCreateQuotation } from "@/types/requests/request.quotation";
import { QUOTATION_ALL } from "@/types/response/response.quotation";
import { getAllBrandsData } from "@/services/ms.brand";
import { getByBrand , getByBrandWithSearchText } from "@/services/ms.brandmodel";
import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import { generateCarYears } from "@/utils/generateCarYears";
import { getAllColors , selectColor } from "@/services/color.service";
import dayjs from "dayjs";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { getAllRepairData, create_ms_repair } from "@/services/msRepir.service";
import { TypeRepair } from "@/types/response/response.ms-repair";
import QuotationStatus from "@/components/customs/badges/quotationStatus";
import { QUOTATION_STATUS } from "@/types/quotationStatus";
import { deleteFile, postFile } from "@/services/file.service";
import CheckboxMainComponent from "@/components/customs/checkboxs/checkbox.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import DialogHistoryQuotation from "@/components/customs/dialog/dialog.historyQuotation";
import HistoryActivity from "@/components/customs/history/historyActivity";
import { getQuotationLogStatusByQuotationId } from "@/services/ms-quotation.log.status.service";
import { QUOTATION_LOG_STATUS } from "@/types/response/response.quotation-log-status";
import DialogRequestEdit from "./dialogRequestEdit";
import { useLocalProfileData } from "@/zustand/useProfile";
import DialogCancel from "./dialogCancel";
import { useBrandModelSelect } from "@/hooks/useSelect";
import { BrandModelSelectItem } from "@/types/response/response.ms-brandmodel";
import { ColorSelectItem } from "@/types/response/response.color";
import { useColorSelect } from "@/hooks/useSelect";
import { pdf } from "@react-pdf/renderer";
import MyPDFDocumentQuotation from "@/features/quotation/components/MyPDFDocumentQuotation";
import { getQuotationRepairByQuotationId } from '@/services/ms.quotation.repair.service';
import { useSearchParams } from "react-router-dom";
import { useBrand } from "@/hooks/useBrand";
import {
  postMasterBrand,
  updateMasterBrand,
  deleteMasterBrand,
} from "@/services/ms.brand";
import MasterSelectComponent, { OptionType } from "@/components/customs/select/select.main.component";
import { postMasterBrandModel } from "@/services/ms.brandmodel";
import { useSelectBrand } from "@/hooks/useSelect";
import { BrandSelectItem } from "@/types/response/response.ms-brand";

type GroupedRepairData = {
  id: string;
  name: string;
  items: TypeRepair[];
};
import {

  postColor,
  updateColor,
  deleteColor,
} from "@/services/color.service";

const FormCreate = () => {
  const [openDialogImages, setOpenDialogImages] = useState<boolean>(false);
  const [quotationData, setQuotationData] = useState<QUOTATION_ALL>();
  const [repairDatas, setRepairDatas] = useState<TypeRepair[]>();
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [isChangeFile, setIsChangeFile] = useState<boolean>(false);
  const [isCreateRepairDialogOpen, setIsCreateRepairDialogOpen] = useState<boolean>(false);
  const [newRepairName, setNewRepairName] = useState<string>("");
  const [selectedGroupForCreation, setSelectedGroupForCreation] = useState<GroupedRepairData | null>(null);
  const [isCreateModelDialogOpen, setIsCreateModelDialogOpen] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [selectedBrandInDialog, setSelectedBrandInDialog] = useState<OptionType | null>(null);
  const [searchBrandInDialog, setSearchBrandInDialog] = useState("");

  const { data: dataBrandForDialog, refetch: refetchBrandForDialog } = useSelectBrand({
    searchText: searchBrandInDialog,
  });

  const [
    isOpenDialogConfirmRequestApprove,
    setIsOpenDialogConfirmRequestApprove,
  ] = useState<boolean>(false);
  const [isOpenDialogConfirmRequestEdit, setIsOpenDialogConfirmRequestEdit] =
    useState<boolean>(false);
  const [isOpenDialogConfirmCloseDeal, setIsOpenDialogConfirmCloseDeal] =
    useState<boolean>(false);
  const [isOpenDialogHistory, setIsOpenDialogHistory] =
    useState<boolean>(false);
  const [quotationLogStatus, setQuotationLogStatus] =
    useState<QUOTATION_LOG_STATUS[]>();
  const [isOpenDialogConfirmCancel, setIsOpenDialogConfirmCancel] =
    useState<boolean>(false);

  const CAR_YEAR = generateCarYears();

  const [disableField, setDisableField] = useState<boolean>(false);

  const [searchBrandModel, setSearchBrandModel] = useState("");
  const [searchColor, setSearchColor] = useState("");


  const [disableFieldPermission, setDisableFieldPermission] =
    useState<boolean>(false);

  const { quotationId } = useParams();
  const { showToast } = useToast();
  const { profile } = useLocalProfileData();

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    register,
  } = useForm<PayLoadCreateQuotation>({
    defaultValues: {
      brand_id: "",
      image_url: [],
      addr_map: "",
      insurance: false,
      insurance_date: "",
    },
    resolver: zodResolver(QuatationCreateSchema),
  });
  const isInsuranceChecked = watch("insurance");
  const groupedRepairs = useMemo(() => {
    if (!repairDatas) return {};
  
    return repairDatas.reduce((acc, repair) => {
      const groupName = repair.master_group_repair?.group_repair_name || "รายการซ่อมอื่นๆ";
      const groupId = repair.master_group_repair?.master_group_repair_id || 'uncategorized';
  
      if (!acc[groupName]) {
        acc[groupName] = { 
          id: groupId, 
          name: groupName, 
          items: [] 
        };
      }
      acc[groupName].items.push(repair);
  
      return acc;
    }, {} as Record<string, GroupedRepairData>);
  }, [repairDatas]);
  const fetchAllRepairs = () => {
    getAllRepairData().then((data) => {
      if (data.success) {
        setRepairDatas(data.responseObject);
      }
    });
  };
  const handleOpenCreateRepairDialog = (groupData: GroupedRepairData) => {
    if (groupData.id === 'uncategorized') {
      showToast("ไม่สามารถเพิ่มรายการใน 'รายการซ่อมอื่นๆ' ได้", false);
      return;
    }
    setSelectedGroupForCreation(groupData);
    setIsCreateRepairDialogOpen(true);
  };
  
  const handleCloseCreateRepairDialog = () => {
    setIsCreateRepairDialogOpen(false);
    setNewRepairName("");
    setSelectedGroupForCreation(null);
  };

  const handleConfirmCreateRepair = async () => {
    if (!newRepairName.trim() || !selectedGroupForCreation) {
      showToast("กรุณากรอกชื่อรายการซ่อม", false);
      return;
    }
    try {
      const response = await create_ms_repair({
        master_repair_name: newRepairName,
        master_group_repair_id: selectedGroupForCreation.id,
      });

      if (response.statusCode === 200) {
        showToast("สร้างรายการซ่อมสำเร็จ", true);
        handleCloseCreateRepairDialog();
        fetchAllRepairs(); 
      } else {
        showToast(response.message || "สร้างรายการซ่อมไม่สำเร็จ", false);
      }
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการสร้างรายการซ่อม", false);
    }
  };


  const onSubmitHandler = async (payload: PayLoadCreateQuotation): Promise<boolean> => {
    if (!quotationData?.quotation_id) {
      showToast("ไม่พบข้อมูลใบเสนอราคา", false);
      return false;
    }

    try {
      let filesURL = quotationData.image_url ?? "";
      if (isChangeFile) {
        if (quotationData.image_url) {
          filesURL = "";
          await deleteFile(quotationData.image_url);
        }

        const formData = new FormData();
        if (payload?.image_url && payload?.image_url?.length > 0) {
          Array.from(payload.image_url).map((file) => {
            formData.append("files", file);
          });

          const resImage_url = await postFile(formData);
          if (resImage_url.responseObject?.file_url) {
            filesURL = resImage_url.responseObject?.file_url;
          }
        }
      }

      const res = await updateQuotation(quotationData.quotation_id, {
        addr_map: payload.addr_map ?? "",
        addr_number: payload.addr_number ?? "",
        addr_alley: payload.addr_alley ?? "",
        addr_street: payload.addr_street ?? "",
        addr_subdistrict: payload.addr_subdistrict ?? "",
        addr_district: payload.addr_district ?? "",
        addr_province: payload.addr_province ?? "",
        addr_postcode: payload.addr_postcode ?? "",
        customer_name: payload.customer_name ?? "",
        position: payload.position ?? "",
        contact_number: payload.contact_number ?? "",
        line_id: payload.line_id ?? "",
        brand_id: payload.brand_id ?? "",
        model_id: payload.model_id ?? "",
        car_year: payload.car_year ?? "",
        car_color_id: payload.car_color_id ?? "",
        total_price: payload.total_price ?? 0,
        tax: payload.tax ?? 0,
        deadline_day: payload.deadline_day ?? 0,
        appointment_date: payload.appointment_date ?? "",
        remark: payload.remark ?? "",
        insurance: payload.insurance ?? false,
        insurance_date: payload.insurance_date ?? "",
        repair_summary: payload.repair_summary,
        image_url: filesURL,
        is_box_detail: payload.is_box_detail,
      });

      if (res.success) {
        showToast("บันทึกใบเสนอราคาสำเร็จ", true);
        await fetchQuotationById(); 
        return true; 
      } else {
        showToast(res.message || "บันทึกใบเสนอราคาไม่สำเร็จ", false);
        return false; 
      }
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการบันทึกใบเสนอราคา", false);
      return false; 
    }
  };

  const handleSaveThenApprove = async (data: PayLoadCreateQuotation) => {
    const isSaveSuccess = await onSubmitHandler(data);
    if (isSaveSuccess) {
      setIsOpenDialogConfirmRequestApprove(true);
    }
  };

  const handleRequestApprove = () => {
    if (quotationData?.quotation_id) {
      requestApproveQuotation(quotationData?.quotation_id)
        .then((res) => {
          if (res.success) {
            fetchQuotationById();
            if (quotationId) {
              getQuotationLogStatusByQuotationId(quotationId).then(
                (response) => {
                  setQuotationLogStatus(response.responseObject);
                }
              );
            }
            showToast("ขออนุมัติใบเสนอราคาสำเร็จ", true);
          } else {
            showToast("ขออนุมัติใบเสนอราคาไม่สำเร็จ", false);
          }
        })
        .catch(() => {
          showToast("ขออนุมัติใบเสนอราคาไม่สำเร็จ", false);
        });
    }
  };

  const handleRequestEditForm = () => {
    setIsOpenDialogConfirmRequestEdit(false);
    fetchQuotationById();
    if (quotationId) {
      getQuotationLogStatusByQuotationId(quotationId).then((response) => {
        setQuotationLogStatus(response.responseObject);
      });
    }
  };

  const handleRequestCloseDeal = () => {
    const repair_sumary = watch("repair_summary");
    if (quotationData?.quotation_id && repair_sumary) {
      requestCloseDealQuotation(quotationData?.quotation_id, repair_sumary)
        .then((res) => {
          if (res.success) {
            fetchQuotationById();
            if (quotationId) {
              getQuotationLogStatusByQuotationId(quotationId).then(
                (response) => {
                  setQuotationLogStatus(response.responseObject);
                }
              );
            }
            showToast("ปิดดีลใบเสนอราคาสำเร็จ", true);
          } else {
            showToast("ปิดดีลใบเสนอราคาไม่สำเร็จ", false);
          }
        })
        .catch(() => {
          showToast("ปิดดีลใบเสนอราคาไม่สำเร็จ", false);
        });
    }
  };

  const handleCloseDialogImaage = () => {
    setOpenDialogImages(false);
  };

  const handleCancel = () => {
    setIsOpenDialogConfirmCancel(false);
    fetchQuotationById();
    if (quotationId) {
      getQuotationLogStatusByQuotationId(quotationId).then((response) => {
        setQuotationLogStatus(response.responseObject);
      });
    }
  };

  const updateJsonStringRepairs = (
    jsonString: string,
    master_repair_id: string,
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
      (item: { master_repair_id: string }) =>
        item.master_repair_id === master_repair_id
    );

    if (isChecked) {
      // ถ้า checkbox = true
      if (existingIndex !== -1) {
        // ถ้ามีข้อมูลอยู่แล้ว ให้แก้ไขข้อมูล
        dataArray[existingIndex].price = price;
      } else {
        // ถ้าไม่มีข้อมูล ให้เพิ่มใหม่
        dataArray.push({ master_repair_id, price });
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

  const canRequestApprove = () => {
    if (
      quotationData?.brand_id &&
      quotationData.model_id &&
      quotationData.car_year &&
      quotationData.car_color_id
    ) {
      return true;
    } else {
      return false;
    }
  };

  const { data: dataBrandModel, refetch: refetchBrandModel } = useBrandModelSelect({
    brand_id: watch("brand_id") ?? "", 
    searchText: searchBrandModel,
    });
  
    const handleBrandModelSearch = (searchText: string) => {
      setSearchBrandModel(searchText);
      refetchBrandModel();
    };

  const { data: dataColor, refetch: refetchColor } = useColorSelect({
        searchText: searchColor,
      });
  
    const fetchDataColorDropdown = async () => {
      const colorList = dataColor?.responseObject?.data ?? [];
      return {
        responseObject: colorList.map((item: ColorSelectItem) => ({
          color_id: item.color_id,
          color_name: item.color_name,
        })),
      };
    };
  
    const handleColorSearch = (searchText: string) => {
      setSearchColor(searchText);
      refetchColor();
    };

  const fetchQuotationById = () => {
    if (quotationId) {
      setIsChangeFile(false);

      getQuotationById(quotationId).then((quotation) => {
        setQuotationData(quotation.responseObject);

        setValue("addr_map", quotation.responseObject?.addr_map);
        setValue("addr_number", quotation.responseObject?.addr_number);
        setValue("addr_alley", quotation.responseObject?.addr_alley);
        setValue("addr_street", quotation.responseObject?.addr_street);
        setValue(
          "addr_subdistrict",
          quotation.responseObject?.addr_subdistrict
        );
        setValue("addr_district", quotation.responseObject?.addr_district);
        setValue("addr_province", quotation.responseObject?.addr_province);
        setValue("addr_postcode", quotation.responseObject?.addr_postcode);
        setValue(
          "customer_name",
          quotation.responseObject?.customer_name ?? ""
        );
        setValue("position", quotation.responseObject?.position ?? "");
        setValue("quotation_doc", quotation.responseObject?.quotation_doc);
        setValue(
          "contact_number",
          quotation.responseObject?.contact_number ?? ""
        );
        setValue("line_id", quotation.responseObject?.line_id ?? "");
        setValue("brand_id", quotation.responseObject?.brand_id ?? "");
        setValue("model_id", quotation.responseObject?.model_id ?? "");
        setValue("car_year", quotation.responseObject?.car_year ?? "");
        setValue("car_color_id", quotation.responseObject?.car_color_id ?? "");
        setValue(
                    "total_price",
                    parseFloat(quotation.responseObject?.total_price ?? "0") || 0
                );
        setValue(
            "tax",
            parseFloat(quotation.responseObject?.tax?.toString() ?? "0") || 0
        );
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
        setValue("insurance", quotation.responseObject?.insurance ?? false);
        setValue("insurance_date", quotation.responseObject?.insurance_date ?? "");
        setValue(
          "is_box_detail",
          quotation.responseObject?.is_box_detail ?? false
        );
      });
    }
  };

  const repairSummaryJSON = watch("repair_summary");

  useEffect(() => {
    if (repairSummaryJSON === undefined) {
      return;
    }

    let total = 0;
    try {
      const repairs = JSON.parse(repairSummaryJSON || "[]");
      if (Array.isArray(repairs)) {
        repairs.forEach((item: { price: string }) => {
          total += parseFloat(item.price) || 0;
        });
      }
    } catch (e) {
      console.error("Failed to parse repair_summary JSON:", e);
      setValue("total_price", 0);
      return;
    }
    setValue("total_price", parseFloat(total.toFixed(2)), { shouldValidate: true });

  }, [repairSummaryJSON, setValue]); 

  useEffect(() => {
    fetchQuotationById();
    fetchAllRepairs();
  }, [quotationId]);

  useEffect(() => {
    if (quotationId) {
      getQuotationLogStatusByQuotationId(quotationId).then((response) => {
        setQuotationLogStatus(response.responseObject);
      });
    }
  }, [quotationId]);

  useEffect(() => {
    setDisableField(
      quotationData?.quotation_status === QUOTATION_STATUS.APPROVED ||
        quotationData?.quotation_status === QUOTATION_STATUS.CLOSE_DEAL ||
        quotationData?.quotation_status ===
          QUOTATION_STATUS.WAITING_FOR_APPROVE ||
        quotationData?.quotation_status === QUOTATION_STATUS.CANCEL
    );
    if (quotationData && profile && profile.role?.role_name === "Sale") {
      if (quotationData.responsible_by !== profile.employee_id) {
        setDisableFieldPermission(true);
        setDisableField(true);
      }
    }
  }, [profile, quotationData]);

  const brandSelectLeftTargetId = 
    repairDatas && repairDatas.length > 0
      ? repairDatas[repairDatas.length - 1].master_repair_id // ถ้าไม่มี, ให้ไปที่ checkbox "กล่อง"
      : "กล่อง";
  const handlePrintDocument = async () => {
        if (!quotationData?.quotation_id) {
            showToast("ไม่พบข้อมูลสำหรับพิมพ์เอกสาร", false);
            return;
        }

        setIsPrinting(true);

        try {
            // 1. ดึงข้อมูลรายการซ่อม
            const repairResponse = await getQuotationRepairByQuotationId(quotationData.quotation_id);
            const repairArray = Array.isArray(repairResponse.responseObject) ? repairResponse.responseObject : [];
            const repairNames: string[] = repairArray
                .map((item: { master_repair?: { master_repair_name?: string } }) => item.master_repair?.master_repair_name)
                .filter(Boolean) as string[];
            
            repairNames.sort((a, b) => a.localeCompare(b, 'th'));
            const finalRepairNames = repairNames.length > 0 ? repairNames : ["ยังไม่มีข้อมูล"];

            // 2. คำนวณราคาและภาษี
            const taxRate = Number(quotationData?.tax) || 0;
            const taxStatus = quotationData?.companies?.tax_status;
            const totalPrice = Number(quotationData?.total_price) || 0;

            let totalBeforeTax = 0;
            let taxAmount = 0;
            let totalWithTax = 0;

            if (taxStatus === "true") {
                totalBeforeTax = totalPrice;
                taxAmount = (totalBeforeTax * taxRate) / 100;
                totalWithTax = totalBeforeTax + taxAmount;
            } else {
                totalWithTax = totalPrice;
                totalBeforeTax = totalWithTax / (1 + taxRate / 100);
                taxAmount = totalWithTax - totalBeforeTax;
            }

            // 3. สร้าง PDF เป็น Blob
            const blob = await pdf(
                <MyPDFDocumentQuotation
                    quotationData={quotationData}
                    repairItems={finalRepairNames}
                    price={totalWithTax}
                    tax={taxRate}
                    priceTax={taxAmount}
                    total={totalBeforeTax}
                />
            ).toBlob();

            // 4. สร้าง URL และเปิดในแท็บใหม่
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, "_blank");

        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการสร้าง PDF ใบเสนอราคา:", error);
            showToast("เกิดข้อผิดพลาดในการสร้างเอกสาร", false);
        } finally {
            setIsPrinting(false);
        }
    };
    const [brandName, setBrandName] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");


    const handleCreateOpen = () => {
      setBrandName("");
      setIsCreateDialogOpen(true);
    };

    const handleCreateClose = () => {
      setIsCreateDialogOpen(false);
    };
     const { data: dataBrand, refetch: refetchBrand } = useBrand({
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce,
      });
    const handleConfirm = async () => {
      if (!brandName) {
        showToast("กรุณาระบุชื่อแบรนด์", false);
        return;
      }
      try {
        const response = await postMasterBrand({ brand_name: brandName });
        if (response.statusCode === 200) {
          setBrandName("");
          handleCreateClose();
          showToast("สร้างแบรนด์เรียบร้อยแล้ว", true);
          refetchBrand();
        } else {
          showToast("แบรนด์นี้มีอยู่แล้ว", false);
        }
      } catch {
        showToast("ไม่สามารถสร้างแบรนด์ได้", false);
      }
    };

    const [isCreateColorDialogOpen, setIsCreateColorDialogOpen] = useState<boolean>(false);
    // const [selectedItem, setSelectedItem] = useState<TypeColorAllResponse | null>(null);
    const [colorsName, setColorsName] = useState("");


      
    //เปิด
    const handleCreateColorOpen = () => {
      setColorsName("");
      setIsCreateColorDialogOpen(true);
    };

  
    //ปิด
    const handleCreateColorClose = () => {
      setIsCreateColorDialogOpen(false);
    };

  
    //ยืนยันไดอะล็อค
    const handleConfirmColor = async () => {
      if (!colorsName) {
        showToast("กรุณาระบุสี", false);
        return;
      }
      try {
        const response = await postColor({
          color_name: colorsName, // ใช้ชื่อ field ที่ตรงกับ type
        });
  
        if (response.statusCode === 200) {
          setColorsName("");
          handleCreateColorClose();
          showToast("สร้างรายการสีเรียบร้อยแล้ว", true);
          refetchColor();
        } else {
          showToast("รายการสีนี้มีอยู่แล้ว", false);
        }
      } catch {
        showToast("ไม่สามารถสร้างรายการสีได้", false);
      }
    };
    const fetchDataBrandForDialogDropdown = async () => {
    const brandList = dataBrandForDialog?.responseObject?.data ?? [];
    return {
      responseObject: brandList.map((item: BrandSelectItem) => ({
        master_brand_id: item.master_brand_id,
        brand_name: item.brand_name,
      })),
    };
  };

  const handleBrandSearchInDialog = (searchText: string) => {
    setSearchBrandInDialog(searchText);
    refetchBrandForDialog();
  };

  const handleOpenCreateModelDialog = () => {
    setIsCreateModelDialogOpen(true);
  };

  const handleCloseCreateModelDialog = () => {
    setIsCreateModelDialogOpen(false);
    setNewModelName("");
    setSelectedBrandInDialog(null);
    setSearchBrandInDialog("");
  };

  const handleConfirmCreateModel = async () => {
    const brandIdFromForm = watch("brand_id");
    const finalBrandId = brandIdFromForm || selectedBrandInDialog?.value;

    if (!finalBrandId || !newModelName.trim()) {
      showToast("กรุณาระบุแบรนด์และชื่อรุ่นรถให้ครบถ้วน", false);
      return;
    }

    try {
      const response = await postMasterBrandModel({
        master_brand_id: String(finalBrandId),
        brandmodel_name: newModelName.trim(),
      });

      if (response.success && response.responseObject) {
        showToast("สร้างรุ่นรถสำเร็จ", true);
        handleCloseCreateModelDialog();
        
        if (!brandIdFromForm) {
            setValue("brand_id", String(finalBrandId));
        }

        await refetchBrandModel();
        setValue("model_id", response.responseObject.ms_brandmodel_id);

      } else {
        showToast(response.message || "สร้างรุ่นรถไม่สำเร็จ", false);
      }
    } catch (error) {
      showToast("เกิดข้อผิดพลาดในการสร้างรุ่นรถ", false);
    }
  };

  return (
    <>
      <Flex gap={"3"} justify={"between"} className="p-2">
        <Flex gap={"3"} className=" max-md:flex-wrap">
          <Text  weight="bold" className="text-center text-lg sm:text-2xl">
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
          className="text-[12px] xs:text-md  lg:hidden"
          onClick={() => setIsOpenDialogHistory(true)}
        >
          ประวัติใบเสนอราคา
        </Buttons>
      </Flex>
      <div className="flex gap-4">
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="flex flex-col gap-3 w-full mt-4 bg-white rounded-md p-6 "
        >
          {!quotationData ? (
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
                  id="วันที่"
                  labelName={"วันที่"}
                  onchange={() => {}}
                  defaultDate={new Date(watch("appointment_date") as string)}
                  disabled
                  nextFields={{ down: "ตำแหน่งแผนที่"}}
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
                columns={{ initial: "1", md: "1", sm: "1", lg: "1", xl: "1" }}
                gap="3"
                rows="repeat(2, auto)"
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
                  disabled={disableField}
                  nextFields={{up:"วันที่", down:"ที่อยู่ เลขที่"}}
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
                  value={watch("addr_number") ?? ""}
                  onChange={(e) => setValue("addr_number", e.target.value)}
                  label={"ที่อยู่ เลขที่"}
                  labelOrientation={"vertical"}
                  size={"2"}
                  defaultValue={watch("addr_number")}
                  classNameInput=" w-full"
                  disabled={disableField}
                  nextFields={{ down:"ซอย" , up:"ตำแหน่งแผนที่"}}
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
                  disabled={disableField}
                  nextFields={{up:"ที่อยู่ เลขที่" ,down:"ถนน"}}
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
                  disabled={disableField}
                  nextFields={{up:"ซอย",down:"ตำบล/แขวง"}}
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
                  disabled={disableField}
                  nextFields={{up:"ถนน",down:"เขต/อำเภอ"}}
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
                  disabled={disableField}
                  nextFields={{up:"ตำบล/แขวง",down:"จังหวัด"}}
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
                  disabled={disableField}
                  nextFields={{up:"เขต/อำเภอ",down:"รหัสไปรษณีย์"}}
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
                  disabled={disableField}
                  nextFields={{up:"จังหวัด",down:"ชื่อ บุคคล"}}
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
                  defaultValue={watch("customer_name")}
                  classNameInput=" w-full"
                  disabled={disableField}
                  nextFields={{up:"รหัสไปรษณีย์",down:"ตำแหน่ง"}}
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
                  disabled={disableField}
                  nextFields={{up:"ชื่อ บุคคล",down:"เบอร์โทร"}}
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
                  disabled={disableField}
                  nextFields={{up:"ตำแหน่ง",down:"Line ID"}}
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
                  disabled={disableField}
                  nextFields={{up:"เบอร์โทร",down:"ไฟล์แนบ"}}
                />
              </Grid>
              <ButtonAttactment
                id={"ไฟล์แนบ"}
                label={"ไฟล์แนบ"}
                onClick={() => setOpenDialogImages(true)}
                nextFields={{up:"Line ID",down:"ประกันภัย"}}
              />
              <label htmlFor="" className=" text-base">
                รายละเอียดประกันภัย
              </label>
              <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                gap="3"
                rows="repeat(auto, 64px)"
                width="auto"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[90px] flex-shrink-0">
                    <CheckboxMainComponent
                      id={"ประกันภัย"}
                      labelName={"ประกันภัย"}
                      defaultChecked={watch("insurance")}
                      checked={watch("insurance")}
                      onChange={(c) => {
                        setValue("insurance", c);
                      }}
                      disabled={disableField}
                      nextFields={{down:"วันที่ประกันหมดอายุ", up:"ไฟล์แนบ"}}
                    />
                  </div>
                  <div className="w-full">
                    <InputDatePicker
                      id="วันที่ประกันหมดอายุ"
                      labelName={""}
                      onchange={(date) =>
                        date &&
                        setValue("insurance_date", dayjs(date).format("YYYY-MM-DD"))
                      }
                      defaultDate={
                        watch("insurance_date")
                          ? new Date(watch("insurance_date") as string)
                          : new Date()
                      }
                      disabled={!isInsuranceChecked || disableField}
                      nextFields={{down:"กล่อง", up:"ประกันภัย"}}
                    />
                  </div>
                </div>
              </Grid>
              <label htmlFor="" className=" text-base">
                มีการซ่อมกล่องหรือไม่มี
              </label>
              <CheckboxMainComponent
                id={"กล่อง"}
                labelName={"กล่อง"}
                defaultChecked={watch("is_box_detail")}
                checked={watch("is_box_detail")}
                onChange={(c) => {
                  setValue("is_box_detail", c);
                }}
                disabled={disableField}
                nextFields={{
                  down: repairDatas && repairDatas.length > 0 ? repairDatas[0].master_repair_id : "brand_id",
                  up: "วันที่ประกันหมดอายุ"
                }}
              />
              <label htmlFor="" className=" text-base">
                รายละเอียดรถที่เข้าซ่อม
              </label>
              <div className="flex flex-col gap-3">
                {Object.values(groupedRepairs).map((group) => (
                  <div key={group.id}>
                    <Flex align="center" justify="between" mb="2">
                      <Flex align="center" gap="2">
                        <Text weight="bold" className="text-gray-700">{group.name}</Text>
                        <Button 
                          size="1" 
                          variant="soft"
                          type="button" 
                          onClick={() => handleOpenCreateRepairDialog(group)}
                          disabled={disableField}
                          className="cursor-pointer"
                        >
                          +
                        </Button>
                      </Flex>
                    </Flex>
                    <hr />
                    <Grid
                      columns={{ initial: "1", sm: "2", md: "2", lg: "2", xl: "2" }}
                      gap="3"
                      width="auto"
                      className="mt-2"
                    >
                      {group.items.map((item, index) => {
                        const leftId = index > 0 ? group.items[index - 1].master_repair_id : "กล่อง";
                        const rightId = index < group.items.length - 1 ? group.items[index + 1].master_repair_id : "แบรนด์รถยนต์";
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
                            disabled={disableField}
                            nextFields={{
                              up: leftId,
                              down: rightId,
                            }}
                          />
                        );
                      })}
                    </Grid>
                  </div>
                ))}
              </div>
              <Grid
                columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                gap="3"
                rows="repeat(2, auto)"
                width="auto"
              >
                {/* Dialog create brand */}
                <div className="flex flex-col gap-1 mb-1 w-full">
                  <div className="flex flex-row">
                    <label htmlFor="brand-select" className="text-md font-medium flex items-center gap-1">
                      แบรนด์รถยนต์
                      <span className="text-red-500">*</span>
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="inline-flex items-center rounded bg-blue-500 ml-2 px-2 py-1 text-xs font-medium text-white hover:bg-blue-600 " 
                      >
                        + เพิ่ม
                    </button>
                  </div>

                  <div className="flex gap-2 w-full">
                    <MasterSelectComponent
                      id="แบรนด์รถยนต์"
                      label=""
                      require="*"
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
                      className="text-left w-full"
                      fetchDataFromGetAPI={getAllBrandsData}
                      isDisabled={disableField}
                      errorMessage={errors.brand_id?.message}
                      nextFields={{ up: brandSelectLeftTargetId, down: "รุ่น" }}
                    />

                    
                  </div>
                </div>

                <DialogComponent
                  isOpen={isCreateDialogOpen}
                  onClose={handleCreateClose}
                  title="สร้างแบรนด์"
                  onConfirm={handleConfirm}
                  confirmText="บันทึกข้อมูล"
                  cancelText="ยกเลิก"
                >
                  <div className="flex flex-col gap-3 items-left">
                    <InputAction
                      id="brand-create"
                      placeholder="ระบุชื่อแบรนด์"
                      onChange={(e) => setBrandName(e.target.value)}
                      value={brandName}
                      label="ชื่อแบรนด์"
                      labelOrientation="horizontal"
                      onAction={handleConfirm}
                      classNameLabel="w-20 min-w-20 flex justify-end"
                      classNameInput="w-full"
                    />
                  </div>
                </DialogComponent>

                
                <div className="flex flex-col gap-1 mb-1 w-full">
                  <div className="flex flex-row items-center">
                    <label htmlFor="รุ่น" className="text-md font-medium flex items-center gap-1">
                      รุ่น
                      <span className="text-red-500">*</span>
                    </label>
                    <button
                        type="button"
                        onClick={handleOpenCreateModelDialog}
                        disabled={disableField}
                        className="inline-flex items-center rounded bg-blue-500 ml-2 px-2 py-1 text-xs font-medium text-white hover:bg-blue-600 disabled:bg-gray-400" 
                      >
                        + เพิ่ม
                    </button>
                  </div>
                  <MasterSelectComponent
                  id="รุ่น"
                  label=""
                  require="*"
                  onChange={(option) => {
                    const value = option ? String(option.value) : undefined;
                    setValue("model_id", value);
                  }}
                  onInputChange={handleBrandModelSearch}
                  defaultValue={{
                    value: watch("model_id") ?? "",
                    label: "",
                  }}
                  valueKey="ms_brandmodel_id"
                  labelKey="brandmodel_name"
                  placeholder="กรุณาเลือก..."
                  className=" text-left w-full"
                  fetchDataFromGetAPI={async () => {
                  return {
                      success: dataBrandModel?.success ?? true,
                      message: dataBrandModel?.message ?? "OK",
                      responseObject: dataBrandModel?.responseObject?.data ?? [],
                  }
                }}
                  isServerSideSearch={true}
                  // ปรับปรุง: ปิดการใช้งานถ้ายังไม่เลือกแบรนด์
                  isDisabled={disableField || !watch("brand_id")}
                  errorMessage={errors.model_id?.message}
                  nextFields={{up: "แบรนด์รถยนต์", down: "ปีรถยนต์"}}
                  // เพิ่ม key prop:
                  key={watch("brand_id")}
                />
                </div>

                <MasterSelectComponent
                  id="ปีรถยนต์"
                  label="ปีรถยนต์"
                  require="*"
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
                  isDisabled={disableField}
                  errorMessage={errors.car_year?.message}
                  nextFields={{up: "รุ่น", down: "สี"}}
                />
                {/* Dialog create color */}
                <div className="flex flex-col gap-1 mb-1 w-full">
                  <div className="flex flex-row">
                    <label htmlFor="brand-select" className="text-md font-medium flex items-center gap-1">
                      สี
                      <span className="text-red-500">*</span>
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsCreateColorDialogOpen(true)}
                        className="inline-flex items-center rounded bg-blue-500 ml-2 px-2 py-1 text-xs font-medium text-white hover:bg-blue-600 " 
                      >
                        + เพิ่ม
                    </button>
                  </div>

                  <div className="flex gap-2 w-full">
                    <MasterSelectComponent
                      id="สี"
                      label=""
                      require="*"
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
                      fetchDataFromGetAPI={fetchDataColorDropdown}
                      onInputChange={handleColorSearch}
                      isDisabled={disableField}
                      errorMessage={errors.car_color_id?.message}
                      nextFields={{up:"ปีรถยนต์",down:"ราคารวม"}}
                    />

                    
                  </div>
                </div>
                <DialogComponent
                  isOpen={isCreateColorDialogOpen}
                  onClose={handleCreateColorClose}
                  title="สร้างสี"
                  onConfirm={handleConfirm}
                  confirmText="บันทึกข้อมูล"
                  cancelText="ยกเลิก"
                >
                  <div className="flex flex-col gap-3 items-left">
                    <InputAction
                      id="issue-reason-create"
                      placeholder="ระบุสี"
                      onChange={(e) => setColorsName(e.target.value)}
                      value={colorsName}
                      label="สี"
                      labelOrientation="horizontal"
                      onAction={handleConfirmColor}
                      classNameLabel="w-20 min-w-20 flex justify-end"
                      classNameInput="w-full"
                    />
                  </div>
                </DialogComponent>
                
              </Grid>
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
                    onChange={() => {}} 
                    label={"ราคารวม"}
                    labelOrientation={"vertical"}
                    size={"2"}
                    classNameInput="w-full bg-gray-100"
                    disabled={true} 
                    type="number"
                    nextFields={{ up: "สี", down: "ภาษี" }}
                />
                
                <InputAction
                    id={"ภาษี"}
                    placeholder={"ภาษี"}
                    value={watch("tax")?.toString() ?? "0"}
                    onChange={(e) => {
                      const val = e.target.value;
                      const number = val === "" ? 0 : parseFloat(val) || 0;
                      setValue("tax", number);
                    }}
                    label={"ภาษี"}
                    labelOrientation={"vertical"}
                    size={"2"}
                    defaultValue={watch("tax")?.toString()}
                    classNameInput=" w-full"
                    disabled={disableField}
                    type="number"
                    nextFields={{up:"ราคารวม" , down:"นัดหมายถอด"}}
                />
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
                  disabled={disableField}
                  nextFields={{up:"ภาษี",down:"หมายเหตุ"}}
                />
              </Grid>

              <InputTextareaFormManage
                id="หมายเหตุ"
                name={"หมายเหตุ"}
                placeholder="หมายเหตุ"
                register={{ ...register("remark") }}
                msgError={errors.remark?.message}
                showLabel
                disabled={disableField}
                nextFields={{up:"นัดหมายถอด" , down: "approve"}}
              />
              {!disableFieldPermission && (
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
                  {(quotationData.quotation_status ===
                    QUOTATION_STATUS.PENDING ||
                    quotationData.quotation_status ===
                      QUOTATION_STATUS.REJECT_APPROVED) && (
                    <Buttons
                      id="approve"
                      type="button" 
                      btnType="submit"
                      onClick={handleSubmit(handleSaveThenApprove)}
                      className=" w-[100px] max-sm:w-full"
                      disabled={[
                        QUOTATION_STATUS.APPROVED,
                        QUOTATION_STATUS.CLOSE_DEAL,
                        QUOTATION_STATUS.WAITING_FOR_APPROVE,
                      ].includes(quotationData.quotation_status)}
                      nextFields={{up:"หมายเหตุ" , down: "submit"}}
                    >
                      ขออนุมัติ
                    </Buttons>
                  )}
                  {(quotationData.quotation_status ===
                    QUOTATION_STATUS.APPROVED ||
                    quotationData.quotation_status ===
                      QUOTATION_STATUS.WAITING_FOR_APPROVE) && (
                    <Buttons
                      type="button"
                      btnType="submit"
                      onClick={() => setIsOpenDialogConfirmRequestEdit(true)}
                      className=" w-[180px] max-sm:w-full"
                    >
                      ขอแก้ไขใบเสนอราคา
                    </Buttons>
                  )}
                  <Buttons
                    btnType="default"
                    variant="outline"
                    className="w-[100px] max-sm:w-full"
                    onClick={handlePrintDocument}
                    type="button"
                  >
                    พิมพ์เอกสาร
                  </Buttons>
                  {(quotationData.quotation_status ===
                    QUOTATION_STATUS.APPROVED ||
                    quotationData.quotation_status ===
                      QUOTATION_STATUS.WAITING_FOR_APPROVE) && (
                    <Buttons
                      type="button"
                      btnType="general"
                      onClick={() => setIsOpenDialogConfirmCloseDeal(true)}
                      className=" w-[100px] max-sm:w-full bg-blue-700 hover:bg-blue-700"
                      disabled={
                        quotationData.quotation_status !==
                        QUOTATION_STATUS.APPROVED
                      }
                    >
                      ปิดดีล
                    </Buttons>
                  )}
                  {(quotationData.quotation_status ===
                    QUOTATION_STATUS.APPROVED ||
                    quotationData.quotation_status ===
                      QUOTATION_STATUS.PENDING ||
                    quotationData.quotation_status ===
                      QUOTATION_STATUS.REJECT_APPROVED ||
                    quotationData.quotation_status ===
                      QUOTATION_STATUS.WAITING_FOR_APPROVE) && (
                    <Buttons
                      type="button"
                      btnType="delete"
                      onClick={() => setIsOpenDialogConfirmCancel(true)}
                      className=" w-[100px] max-sm:w-full"
                    >
                      ยกเลิก
                    </Buttons>
                  )}
                  {(quotationData.quotation_status ===
                    QUOTATION_STATUS.PENDING ||
                    quotationData.quotation_status ===
                      QUOTATION_STATUS.REJECT_APPROVED) && (
                    <Buttons
                      id="submit"
                      type="submit"
                      btnType="default"
                      variant="outline"
                      className=" w-[100px] max-sm:w-full"
                      disabled={[
                        QUOTATION_STATUS.APPROVED,
                        QUOTATION_STATUS.CLOSE_DEAL,
                        QUOTATION_STATUS.WAITING_FOR_APPROVE,
                      ].includes(quotationData.quotation_status)}
                    >
                      บันทึกข้อมูล
                    </Buttons>
                  )}
                </Flex>
              )}
            </>
          )}
        </form>

        <Flex className=" flex flex-col gap-3  mt-4 bg-white rounded-md p-6 min-w-[380px] max-w-[380px]  overflow-auto max-h-[1318px] max-lg:hidden">
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
        title={"รูปภาพรถยนต์ที่เกิดอุบัติเหตุ"}
        defaultImage={watch("image_url") ?? []}
        onChangeImage={(i) => {
          setIsChangeFile(true);
          setValue("image_url", i);
        }}
        isChangeFile={isChangeFile}
        disable={disableField}
      />

      <DialogComponent
        isOpen={isOpenDialogConfirmRequestApprove}
        onClose={() => setIsOpenDialogConfirmRequestApprove(false)}
        title="ยืนยันการขออนุมัติ"
        onConfirm={handleRequestApprove}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>คุณแน่ใจหรือไม่ว่าต้องการขออนุมัติใบเสนอราคานี้?</p>
      </DialogComponent>

      <DialogRequestEdit
        data={quotationData}
        isOpen={isOpenDialogConfirmRequestEdit}
        onClose={() => setIsOpenDialogConfirmRequestEdit(false)}
        onConfirm={handleRequestEditForm}
      />

      <DialogCancel
        data={quotationData}
        isOpen={isOpenDialogConfirmCancel}
        onClose={() => setIsOpenDialogConfirmCancel(false)}
        onConfirm={handleCancel}
      />

      <DialogComponent
        isOpen={isOpenDialogConfirmCloseDeal}
        onClose={() => setIsOpenDialogConfirmCloseDeal(false)}
        title="ยืนยันการดิล"
        onConfirm={handleRequestCloseDeal}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>คุณแน่ใจหรือไม่ว่าต้องการปิดดีลใบเสนอราคานี้?</p>
      </DialogComponent>
      
      <DialogHistoryQuotation
        quotationId={quotationId}
        isOpen={isOpenDialogHistory}
        onClose={() => setIsOpenDialogHistory(false)}
        title={"ประวัติใบเสนอราคา"}
      />
      
      <DialogComponent
      isOpen={isCreateRepairDialogOpen}
      onClose={handleCloseCreateRepairDialog}
      title="สร้างรายการซ่อมใหม่"
      onConfirm={handleConfirmCreateRepair}
      confirmText="บันทึก"
      cancelText="ยกเลิก"
    >
      <Flex direction="column" gap="3" className="w-[350px] sm:w-[350px]">
        <Text>
          กลุ่มซ่อม: <Text weight="bold">{selectedGroupForCreation?.name}</Text>
        </Text>
        
        <InputAction
          id="new-repair-name-input"
          label="ชื่อรายการซ่อม: "
          placeholder="กรอกชื่อรายการซ่อมใหม่"
          value={newRepairName}
          onChange={(e) => setNewRepairName(e.target.value)}
          onAction={handleConfirmCreateRepair}
          labelOrientation="horizontal" 
          classNameLabel="w-25 flex-shrink-0 flex justify-end pr-2" 
          classNameInput="w-full"
        />
      </Flex>
    </DialogComponent>
      <DialogComponent
      isOpen={isCreateModelDialogOpen}
      onClose={handleCloseCreateModelDialog}
      title="สร้างรุ่นรถ"
      onConfirm={handleConfirmCreateModel}
      confirmText="บันทึกข้อมูล"
      cancelText="ยกเลิก"
    >
      <div className="flex flex-col gap-3 items-left w-[350px]">
        {/* กรณีที่ 1: ยังไม่ได้เลือกแบรนด์ในฟอร์มหลัก */}
        {!watch("brand_id") && (
          <MasterSelectComponent
            id="brand-select-in-dialog"
            value={selectedBrandInDialog}
            onChange={(option) => setSelectedBrandInDialog(option)}
            fetchDataFromGetAPI={fetchDataBrandForDialogDropdown}
            onInputChange={handleBrandSearchInDialog}
            valueKey="master_brand_id"
            labelKey="brand_name"
            placeholder="กรุณาเลือกแบรนด์..."
            isClearable
            label="แบรนด์"
            labelOrientation="horizontal"
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameSelect="w-full"
            nextFields={{down: "new-model-name-input"}}
          />
        )}

        {/* กรณีที่ 2: เลือกแบรนด์แล้ว จะแสดงชื่อแบรนด์ แต่แก้ไขไม่ได้ */}
        {watch("brand_id") && dataBrand?.responseObject?.data?.find(b => b.master_brand_id === watch("brand_id")) && (
            <Flex align="center" gap="3">
              <Text as="label" htmlFor="brand-display" className="w-20 min-w-20 text-right font-medium">แบรนด์</Text>
              <Text id="brand-display" className="w-full font-semibold">
                  {dataBrand?.responseObject?.data?.find(b => b.master_brand_id === watch("brand_id"))?.brand_name}
              </Text>
          </Flex>
        )}
        
        <InputAction
          id="new-model-name-input"
          placeholder="ระบุรุ่นรถ"
          onChange={(e) => setNewModelName(e.target.value)}
          value={newModelName}
          label="ชื่อรุ่นรถ"
          labelOrientation="horizontal"
          onAction={handleConfirmCreateModel}
          classNameLabel="w-20 min-w-20 flex justify-end"
          classNameInput="w-full"
          nextFields={{ up: "brand-select-in-dialog" }}
        />
      </div>
    </DialogComponent>
    </>
  );
};

export default FormCreate;