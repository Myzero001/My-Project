import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import Buttons from "@/components/customs/button/button.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { Flex, Grid } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { repairReceiptBoxClearByUpdateType } from "../../types/update";
import { RepairReceiptBoxClearByUpdateType } from "../../schemas/repairReceiptUpdate";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getRepairReceiptById,
  updateRepairReceiptBoxClearBy,
} from "@/services/ms.repair.receipt";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { useParams } from "react-router-dom";
import { repairReceipt } from "@/types/response/response.repair-receipt";
import { getAllClearbyData } from "@/services/ms.clearby";

export default function RepairReceiptBoxClearByCreate() {
  const [repairReceiptData, setRepairReceiptData] = useState<repairReceipt>();
  const [isloadRepairReceiptData, setIsloadRepairReceiptData] = useState(false);

  const [disableFields, setDisableFields] = useState(false);

  const { repairReceiptId } = useParams();
  const { showToast } = useToast();

  const { handleSubmit, watch, setValue } =
    useForm<repairReceiptBoxClearByUpdateType>({
      resolver: zodResolver(RepairReceiptBoxClearByUpdateType),
    });

  const onSubmitHandler = async (
    payload: repairReceiptBoxClearByUpdateType
  ) => {

    if (repairReceiptData?.id) {
      updateRepairReceiptBoxClearBy({
        id: repairReceiptData.id,
        clear_by_tool_one_id: payload.clear_by_tool_one_id,
        clear_by_tool_two_id: payload.clear_by_tool_two_id,
        clear_by_tool_three_id: payload.clear_by_tool_three_id,
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

  const fetchRepairReceiptById = () => {
    if (repairReceiptId) {
      setIsloadRepairReceiptData(true);
      getRepairReceiptById(repairReceiptId)
        .then((res) => {
          const item = res.responseObject;
          if (item) {
            setRepairReceiptData(item);

            setDisableFields(item.repair_receipt_status !== "pending");


            setValue("clear_by_tool_one_id", item.clear_by_tool_one_id ?? "");
            setValue("clear_by_tool_two_id", item.clear_by_tool_two_id ?? "");
            setValue(
              "clear_by_tool_three_id",
              item.clear_by_tool_three_id ?? ""
            );
          }
        })
        .finally(() => {
          setIsloadRepairReceiptData(false);
        });
    }
  };

  useEffect(() => {
    if (repairReceiptId) {
      fetchRepairReceiptById();
    }
  }, [repairReceiptId]);

  return (
    <div className="container w-full m-auto relative">
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
              <MasterSelectComponent
                label="Clear by 1"
                onChange={(option) => {
                  const value = option ? String(option.value) : undefined;
                  setValue("clear_by_tool_one_id", value);
                }}
                defaultValue={{
                  value: watch("clear_by_tool_one_id") ?? "",
                  label: "",
                }}
                valueKey="clear_by_id"
                labelKey="clear_by_name"
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={getAllClearbyData}
                isDisabled={disableFields}
              />
            </Grid>
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <MasterSelectComponent
                label="Clear by 2"
                onChange={(option) => {
                  const value = option ? String(option.value) : undefined;
                  setValue("clear_by_tool_two_id", value);
                }}
                defaultValue={{
                  value: watch("clear_by_tool_two_id") ?? "",
                  label: "",
                }}
                valueKey="clear_by_id"
                labelKey="clear_by_name"
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={getAllClearbyData}
                isDisabled={disableFields}
              />
            </Grid>
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <MasterSelectComponent
                label="Clear by 3"
                onChange={(option) => {
                  const value = option ? String(option.value) : undefined;
                  setValue("clear_by_tool_three_id", value);
                }}
                defaultValue={{
                  value: watch("clear_by_tool_three_id") ?? "",
                  label: "",
                }}
                valueKey="clear_by_id"
                labelKey="clear_by_name"
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={getAllClearbyData}
                isDisabled={disableFields}
              />
            </Grid>

            {!disableFields && (
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
                  type="submit"
                  btnType="default"
                  variant="outline"
                  className=" w-[100px] max-sm:w-full"
                >
                  บันทึกข้อมูล
                </Buttons>
              </Flex>
            )}
          </>
        )}
      </form>
    </div>
  );
}
