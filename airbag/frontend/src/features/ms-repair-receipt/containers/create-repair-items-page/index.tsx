import Buttons from "@/components/customs/button/button.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import { getRepairReceiptById } from "@/services/ms.repair.receipt";
import { getAllRepairData } from "@/services/msRepir.service";
import {
  createRepairReceiptListRepair,
  getRepairReceiptListRepairByRepairReceiptId,
  updateRepairReceiptIsActiveStatus,
} from "@/services/repair.receipt.list.repair.service";
import { TypeRepair } from "@/types/response/response.ms-repair";
import { repairReceipt } from "@/types/response/response.repair-receipt";
import { repairReceiptListRepair } from "@/types/response/response.repair_receipt_list_repair";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DialogHistoryRepairReceitListRepairLogStatus from "../../components/dialog.historyRepairReceitListRepairLogStatus";
import { Flex } from "@radix-ui/themes";
import { useLocalProfileData } from "@/zustand/useProfile";
import { permissionMap } from "@/utils/permissionMap";
import { useToast } from "@/components/customs/alert/toast.main.component";
import BarcodeFeature from "@/features/__barcode/component/index";
import { FaBarcode } from "react-icons/fa";
type dataTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
    type?: string;
    data?: repairReceiptListRepair | TypeRepair;
    disable?: boolean;
  }[];
  data: TypeRepair;
}[];

export default function RepairReceiptItemCreate() {
  const [data, setData] = useState<dataTableType>([]);

  const [isConfirmChangeStatusDialogOpen, setIsConfirmChangeStatusDialogOpen] =
    useState(false);
  const [activeData, setActiveData] = useState<repairReceiptListRepair>();
  const [repairReceiptData, setRepairReceiptData] = useState<repairReceipt>();

  const [disableFieldsPermission, setDisableFieldsPermission] = useState(false);

  const [isOpenDialogHistory, setIsOpenDialogHistory] =
    useState<boolean>(false);


    const [dataBarcode, setDataBarcode] = useState<any>(null);
    const [barcode, setbarcode] = useState(false);
    const brand_name = repairReceiptData?.master_quotation?.master_brand?.brand_name;
    const brand_model = repairReceiptData?.master_quotation?.master_brandmodel?.brandmodel_name;
    const customer = repairReceiptData?.master_quotation?.master_customer?.customer_name;
    const carregister = repairReceiptData?.register;
    const code = repairReceiptData?.repair_receipt_doc; //โค้ดซ้ายบน
    const datetime = repairReceiptData?.created_at;
    const doc = repairReceiptData?.master_quotation?.quotation_doc;
    const formattedDate = new Date(datetime);
    const [barcodeData, setBarcodeData] = useState<string>("");
    const formattedDateString = `${formattedDate.getDate().toString().padStart(2, '0')}/${(formattedDate.getMonth() + 1).toString().padStart(2, '0')}/${formattedDate.getFullYear()}`;
  

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (barcode) {
          setbarcode(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [barcode]);
  
    const Showbarcode = (item: TypeRepair, barcodeData: string) => {
      setbarcode(true);
      setActiveData(item as repairReceiptListRepair);
      
      setBarcodeData(barcodeData);
      // สมมติว่า item มีข้อมูลที่ต้องใช้สร้าง barcode
      setDataBarcode(item); // หรืออาจใช้ API ดึงข้อมูล barcode เพิ่มเติม
    };







  // const [repairDatas, setRepairDatas] = useState<TypeRepair[]>();
  const { showToast } = useToast();
  const { profile } = useLocalProfileData();

  const headers = [
    { label: "รายการซ่อม", colSpan: 1, className: "" },
    { label: "รายการซ่อมใบเสนอราคา", colSpan: 1, className: "" },
    { label: "สถานะการซ่อม", colSpan: 1, className: "" },
    { label: "สถานะการดำเนินการ", colSpan: 1, className: "" },
    // { label: "ส่ง Supplier", colSpan: 1, className: "" },
    { label: "บาร์โค้ด", colSpan: 1, className: "" },
  ];

  const { repairReceiptId } = useParams();

  const handleCancelConfirm = () => {
    setIsConfirmChangeStatusDialogOpen(false);
  };

  const handleSubmitConfirm = () => {
    if (activeData?.id) {
      updateRepairReceiptIsActiveStatus({
        id: activeData.id,
        is_active: !activeData.is_active,
      })
        .then((res) => {
          if (res.success) {
            fetchData();
            showToast("เปลี่ยนสถานะการซ่อมสำเร็จ", true);
          } else {
            showToast("เปลี่ยนสถานะการซ่อมไม่สำเร็จ", false);
          }
        })
        .catch(() => {
          showToast("เปลี่ยนสถานะการซ่อมไม่สำเร็จ", false);
        });
    } else {
      if (
        repairReceiptData?.quotation_id &&
        activeData?.master_repair_id &&
        repairReceiptData.id
      ) {
        const payload = {
          quotation_id: repairReceiptData?.quotation_id,
          master_repair_id: activeData?.master_repair_id,
          master_repair_receipt_id: repairReceiptData.id,
          price: activeData?.price ?? 0,
          status: "pending",
        };
        createRepairReceiptListRepair(payload).then(() => {
          fetchData();
        });
      }
    }
    setIsConfirmChangeStatusDialogOpen(false);
  };

  const fetchData = () => {
    if (repairReceiptId) {
      getRepairReceiptListRepairByRepairReceiptId(repairReceiptId).then(
        (resRepairReceiptList) => {
          const RepairReceiptListRepair = resRepairReceiptList.responseObject;
          getRepairReceiptById(repairReceiptId).then((res) => {
            const resGetRepairReceiptById = res.responseObject;
            if (resGetRepairReceiptById) {

              const disableFields =
                resGetRepairReceiptById.repair_receipt_status !== "pending" ||
                disableFieldsPermission ||
                checkPermission();
              setRepairReceiptData(resGetRepairReceiptById);
              const quotationRepair =
                resGetRepairReceiptById.master_quotation.quotationRepair;

              getAllRepairData().then((res) => {
                const dataRepairReceiptListRepair = res.responseObject;
                if (dataRepairReceiptListRepair) {
                  const formattedData = dataRepairReceiptListRepair?.map(
                    (item) => {
                      let barcodeData = "";
                      const dataCellStatus = () => {
                        if (
                          RepairReceiptListRepair &&
                          RepairReceiptListRepair?.length > 0
                        ) {
                          const filterData = RepairReceiptListRepair.filter(
                            (d) => d.master_repair_id === item.master_repair_id
                          );
                          if (filterData?.length > 0) {
                            return filterData[0];
                          } else {
                            return item;
                          }
                        } else {
                          return item;
                        }
                      };
                      const valueCellStatusOperation = () => {
                        if (
                          RepairReceiptListRepair &&
                          RepairReceiptListRepair?.length > 0
                        ) {
                          const filterData = RepairReceiptListRepair.filter(
                            (d) =>
                              d.master_repair_id === item.master_repair_id &&
                              d.is_active
                          );
                          if (filterData?.length > 0) {
                            barcodeData = filterData[0].barcode;
                            return filterData[0].status;
                          } else {
                            return undefined;
                          }
                        } else {
                          return undefined;
                        }
                      };
                      return {
                        className: "",
                        cells: [
                          {
                            value: item.master_repair_name,
                            className: "text-center",
                            data: item,
                          },
                          {
                            value:
                              quotationRepair && quotationRepair?.length > 0
                                ? quotationRepair.some(
                                    (d) =>
                                      d.master_repair_id ===
                                      item.master_repair_id
                                  )
                                : false,
                            className: "text-center",
                            type: "checkbox",
                            data: item,
                            disable: true,
                          },
                          {
                            value:
                              RepairReceiptListRepair &&
                              RepairReceiptListRepair?.length > 0
                                ? RepairReceiptListRepair.some(
                                    (d) =>
                                      d.master_repair_id ===
                                        item.master_repair_id && d.is_active
                                  )
                                : false,
                            className: "text-center",
                            type: "checkbox",
                            data: dataCellStatus(),
                            disable: disableFields,
                          },
                          {
                            value: valueCellStatusOperation(),
                            className: "text-center",
                            type: "badge-status",
                            data: item,
                          },
                          // {
                          //   value: "ส่งเคลม",
                          //   className: "text-center",
                          //   data: item,
                          // },
                          {
                            value:  
                            <button className='' onClick={() => Showbarcode(item, barcodeData)}>
                            <FaBarcode className="text-2xl font-bold" />
                            </button>,
                            className: "text-center",
                            data: item,
                          },
                        ],
                        data: item,
                      };
                    }
                  );
                  setData(formattedData);
                }
              });
            }
          });
        }
      );
    }
  };

  const checkPermission = () => {
    if (profile && profile.role?.role_name) {
      if (
        permissionMap["ใบรับซ่อมหน้าแรกหน้ารายการซ่อม"][
          profile.role?.role_name
        ] !== "A"
      ) {
        setDisableFieldsPermission(true);
        return true;
      }
    }
  };

  useEffect(() => {
    checkPermission();
  }, [profile]);

  useEffect(() => {
    if (repairReceiptId) {
      fetchData();
    }
  }, [repairReceiptId]);


  





  return (
    <div className="container w-full m-auto">
      <MasterTableFeature
        title="รายการรับซ่อม"
        hideTitleBtn
        inputs={[]}
        headers={headers}
        rowData={data}
        totalData={0}
        hideTitle
        hidePagination
        onChangeValueCellItem={(c, item) => {
          setActiveData(item);
          setIsConfirmChangeStatusDialogOpen(true);
        }}
        headersContent={
          <Flex justify={"end"}>
            <Buttons
              type="button"
              btnType="default"
              variant="outline"
              className=" "
              onClick={() => setIsOpenDialogHistory(true)}
            >
              ประวัติรายการซ่อม
            </Buttons>
          </Flex>
        }
      />

      <DialogComponent
        isOpen={isConfirmChangeStatusDialogOpen}
        onClose={handleCancelConfirm}
        title="ยืนยันการเปลี่ยนสถานะ"
        onConfirm={handleSubmitConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>
          คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนสถานะการซ่อมนี้? <br />
          รายการซ่อม:{" "}
          <span className="text-red-500">
            {activeData?.master_repair_name ??
              activeData?.master_repair?.master_repair_name}
          </span>
        </p>
      </DialogComponent>

      <DialogHistoryRepairReceitListRepairLogStatus
        id={repairReceiptId}
        isOpen={isOpenDialogHistory}
        onClose={() => setIsOpenDialogHistory(false)}
        title={"ประวัติรายการซ่อม"}
      />
      {barcode && dataBarcode && (
        <BarcodeFeature
          brand_name={brand_name}
          brand_model={brand_model}
          customer={customer}
          code={code}
          formattedDateString={formattedDateString}
          doc={doc}
          barcode={barcodeData}
          master_repair_name={
            activeData?.master_repair_name ??
            activeData?.master_repair?.master_repair_name
          }
          carregister={carregister}
        />
      )}
    </div>
  );
}
