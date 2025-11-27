import MasterTableFeature from "@/components/customs/display/master.main.component";
import { getDeliveryScheduleById } from "@/services/ms.delivery.service";
import { getRepairReceiptListRepairByRepairReceiptId } from "@/services/repair.receipt.list.repair.service";
import { TypeRepair } from "@/types/response/response.ms-repair";
import { repairReceiptListRepair } from "@/types/response/response.repair_receipt_list_repair";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

  const headers = [
    { label: "ลำดับ", colSpan: 1, className: " w-[80px]" },
    { label: "รายการซ่อม", colSpan: 1, className: "" },
    // { label: "รายการซ่อมใบเสนอราคา", colSpan: 1, className: "" },
    // { label: "สถานะการซ่อม", colSpan: 1, className: "" },
    { label: "สถานะการดำเนินการ", colSpan: 1, className: "  w-[160px]" },
  ];

  const { deliveryScheduleId } = useParams();

  const fetchData = () => {
    if (deliveryScheduleId) {
      getDeliveryScheduleById(deliveryScheduleId).then((res) => {
        const item = res.responseObject;

        getRepairReceiptListRepairByRepairReceiptId(
          item.repair_receipt_id
        ).then((resRepairReceiptList) => {
          const RepairReceiptListRepair = resRepairReceiptList.responseObject;

          const formattedData = RepairReceiptListRepair?.map((item, index) => {
            const valueCellStatusOperation = () => {
              if (
                RepairReceiptListRepair &&
                RepairReceiptListRepair?.length > 0
              ) {
                const filterData = RepairReceiptListRepair.filter(
                  (d) =>
                    d.master_repair_id === item.master_repair_id && d.is_active
                );

                if (filterData?.length > 0) {
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
                  value: index + 1,
                  className: "text-center",
                  data: item,
                },
                {
                  value: item.master_repair.master_repair_name,
                  className: "text-center",
                  data: item,
                },

                {
                  value: valueCellStatusOperation(),
                  className: "text-center",
                  type: "badge-status",
                  data: item,
                },
              ],
              data: {
                ...item,
                master_repair_name: item.master_repair.master_repair_name,
              },
            };
          });
          setData(formattedData);
        });
      });
    }
  };

  useEffect(() => {
    if (deliveryScheduleId) {
      fetchData();
    }
  }, [deliveryScheduleId]);

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
      />
    </div>
  );
}
