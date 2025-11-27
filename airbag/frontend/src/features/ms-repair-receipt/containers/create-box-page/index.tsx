import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import Buttons from "@/components/customs/button/button.main.component";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import ButtonAttactment from "@/features/quotation/components/ButtonAttactment";
import { Flex, Grid } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputAction from "@/components/customs/input/input.main.component";
import DialogAttachmentRepairReceiptBox from "../../components/dialogAttachmentRepairReceiptBox";
import { repairReceiptBoxUpdateType } from "../../types/update";
import { RepairReceiptBoxUpdateSchema } from "../../schemas/repairReceiptUpdate";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getRepairReceiptById,
  updateRepairReceiptBox,
} from "@/services/ms.repair.receipt";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { useParams } from "react-router-dom";
import { repairReceipt } from "@/types/response/response.repair-receipt";
import { getAllToolsData } from "@/services/tool.service";
import { getAllRoolingReasonData } from "@/services/ms.tooling.reason.service";
import { ToolSelectItem } from "@/types/response/response.tool";
import { getAllIssueReasonData } from "@/services/issueReason.service";
import {
  deleteFile,
  postFile,
  postFileRepairReceiptBoxAfter,
  postFileRepairReceiptBoxBefore,
} from "@/services/file.service";
import { useToolSelect } from "@/hooks/useSelect";
import { ToolingReasonSelectItem } from "@/types/response/response.ms-tooling-reason";
import { useToolingReasonSelect } from "@/hooks/useSelect";
import { useIssueReasonSelect } from "@/hooks/useSelect";
import { IssueReasonSelectItem } from "@/types/response/response.issueReason";

export default function RepairReceiptBoxCreate() {
  const [repairReceiptData, setRepairReceiptData] = useState<repairReceipt>();
  const [isloadRepairReceiptData, setIsloadRepairReceiptData] = useState(false);

  const [openDialogImages, setOpenDialogImages] = useState<boolean>(false);
  const [isChangeFile, setIsChangeFile] = useState<boolean>(false);

  const [disableFields, setDisableFields] = useState(false);

  const { repairReceiptId } = useParams();
  const { showToast } = useToast();
  const [searchTool, setSearchTool] = useState("");
  const [searchToolingReason, setSearchToolingReason] = useState("");
  const [searchIssueReason, setSearchIssueReason] = useState("");
  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    register,
  } = useForm<repairReceiptBoxUpdateType>({
    defaultValues: {
      box_chip_image_url: [],
      box_before_file_url: [],
      box_after_file_url: [],
    },
    resolver: zodResolver(RepairReceiptBoxUpdateSchema),
  });

  const onSubmitHandler = async (payload: repairReceiptBoxUpdateType) => {
    // return false;
    if (repairReceiptData?.id) {
      let boxChipImageUrl = repairReceiptData.box_chip_image_url ?? "";
      let boxBeforeFileUrl = repairReceiptData.box_before_file_url ?? "";
      let boxAfterFileUrl = repairReceiptData.box_after_file_url ?? "";

      if (isChangeFile) {
        if (boxChipImageUrl) {
          await deleteFile(boxChipImageUrl);
          boxChipImageUrl = "";
        }
        if (boxBeforeFileUrl) {
          await deleteFile(boxBeforeFileUrl);
          boxBeforeFileUrl = "";
        }
        if (boxAfterFileUrl) {
          await deleteFile(boxAfterFileUrl);
          boxAfterFileUrl = "";
        }

        const formDataBoxChipImageUrl = new FormData();
        if (
          payload?.box_chip_image_url &&
          payload?.box_chip_image_url?.length > 0
        ) {
          Array.from(payload.box_chip_image_url).map((file) => {
            formDataBoxChipImageUrl.append("files", file);
          });

          const resImage_url = await postFile(formDataBoxChipImageUrl);

          if (resImage_url.responseObject?.file_url) {
            boxChipImageUrl = resImage_url.responseObject?.file_url;
          }
        }

        const formDataBoxBeforeFileUrl = new FormData();

        if (
          payload?.box_before_file_url &&
          payload?.box_before_file_url?.length > 0
        ) {
          Array.from(payload.box_before_file_url).map((file) => {
            formDataBoxBeforeFileUrl.append("files", file);
          });

          const resImage_url = await postFileRepairReceiptBoxBefore(
            formDataBoxBeforeFileUrl
          );

          if (resImage_url.responseObject?.file_url) {
            boxBeforeFileUrl = resImage_url.responseObject?.file_url;
          }
        }

        const formDataBoxAfterFileUrl = new FormData();

        if (
          payload?.box_after_file_url &&
          payload?.box_after_file_url?.length > 0
        ) {
          Array.from(payload.box_after_file_url).map((file) => {
            formDataBoxAfterFileUrl.append("files", file);
          });

          const resImage_url = await postFileRepairReceiptBoxAfter(
            formDataBoxAfterFileUrl
          );

          if (resImage_url.responseObject?.file_url) {
            boxAfterFileUrl = resImage_url.responseObject?.file_url;
          }
        }
      }

      updateRepairReceiptBox({
        id: repairReceiptData.id,

        box_chip_image_url: boxChipImageUrl,
        box_before_file_url: boxBeforeFileUrl,
        box_after_file_url: boxAfterFileUrl,

        chip_type: payload.chip_type,
        chip_no: payload.chip_no,

        tool_one_id: payload.tool_one_id,
        for_tool_one_id: payload.for_tool_one_id,

        tool_two_id: payload.tool_two_id,
        for_tool_two_id: payload.for_tool_two_id,

        tool_three_id: payload.tool_three_id,
        for_tool_three_id: payload.for_tool_three_id,

        issue_reason_id: payload.issue_reason_id,
        not_repair: payload.not_repair,

        box_remark: payload.box_remark,
      })
        .then((res) => {
          if (res.success) {
            showToast("บันทึกใบรับซ่อมสำเร็จ", true);
            fetchRepairReceiptById();
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

  const fetchRepairReceiptById = () => {
    if (repairReceiptId) {
      setIsloadRepairReceiptData(true);
      getRepairReceiptById(repairReceiptId)
        .then((res) => {
          const item = res.responseObject;
          if (item) {
            setRepairReceiptData(item);

            setDisableFields(item.repair_receipt_status !== "pending");

            setValue("chip_type", item?.chip_type ?? "");
            setValue("chip_no", item.chip_no ?? "");
            setValue("box_remark", item.box_remark ?? "");
            setValue("tool_one_id", item.tool_one_id ?? "");
            setValue("for_tool_one_id", item.for_tool_one_id ?? "");
            setValue("tool_two_id", item.tool_two_id ?? "");
            setValue("for_tool_two_id", item.for_tool_two_id ?? "");
            setValue("tool_three_id", item.tool_three_id ?? "");
            setValue("for_tool_three_id", item.for_tool_three_id ?? "");
            setValue("issue_reason_id", item.issue_reason_id ?? "");

            setValue("not_repair", item.not_repair ?? "");
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

  const { data: dataTool, refetch: refetchTool } = useToolSelect({
        searchText: searchTool,
      });
  
    const fetchDataToolDropdown = async () => {
      const toolList = dataTool?.responseObject?.data ?? [];
      return {
        responseObject: toolList.map((item: ToolSelectItem) => ({
          tool_id: item.tool_id,
          tool: item.tool,
        })),
      };
    };
  
    const handleToolSearch = (searchText: string) => {
      setSearchTool(searchText);
      refetchTool();
    };

  // Tooling Reason
  const { data: dataToolingReason, refetch: refetchToolingReason } = useToolingReasonSelect({
        searchText: searchToolingReason,
      });
  
    const fetchDataToolingReasonDropdown = async () => {
      const toolingReasonList = dataToolingReason?.responseObject?.data ?? [];
      return {
        responseObject: toolingReasonList.map((item: ToolingReasonSelectItem) => ({
          master_tooling_reason_id: item.master_tooling_reason_id,
          tooling_reason_name: item.tooling_reason_name,
        })),
      };
    };
  
    const handleToolingReasonSearch = (searchText: string) => {
      setSearchToolingReason(searchText);
      refetchToolingReason();
    };

  const { data: dataIssueReason, refetch: refetchIssueReason } = useIssueReasonSelect({
      searchText: searchIssueReason,
    });

  const fetchDataIssueReasonDropdown = async () => {
    const issueReason = dataIssueReason?.responseObject?.data ?? [];
    return {
      responseObject: issueReason.map((item: IssueReasonSelectItem) => ({
        issue_reason_id: item.issue_reason_id,
        issue_reason_name: item.issue_reason_name,
      })),
    };
  };

  const handleIssueReasonSearch = (searchText: string) => {
    setSearchIssueReason(searchText);
    refetchIssueReason();
  };

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
            <label htmlFor="" className=" text-base font-bold">
              รายการเครื่องมือ
            </label>
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <InputAction
                id={"Chip Type"}
                placeholder={"Chip Type"}
                value={watch("chip_type") ?? ""}
                onChange={(e) => setValue("chip_type", e.target.value)}
                label={"Chip Type"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("chip_type")}
                classNameInput=" w-full"
                errorMessage={errors.chip_type?.message}
                disabled={disableFields}
                nextFields={{down: "Chip No"}}
              />
              <InputAction
                id={"Chip No"}
                placeholder={"Chip No"}
                value={watch("chip_no") ?? ""}
                onChange={(e) => setValue("chip_no", e.target.value)}
                label={"Chip No"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("chip_no")}
                classNameInput=" w-full"
                type="tel"
                maxLength={10}
                errorMessage={errors.chip_no?.message}
                disabled={disableFields}
                nextFields={{up: "Chip Type",down: "เครื่องมือที่ 1"}}
              />
            </Grid>
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <MasterSelectComponent
                id="เครื่องมือที่ 1"
                label="เครื่องมือที่ 1"
                onChange={(option) => {
                  const value = option ? String(option.value) : "";
                  setValue("tool_one_id", value);
                }}
                defaultValue={{
                  value: watch("tool_one_id") ?? "",
                  label: "",
                }}
                valueKey="tool_id"
                labelKey="tool"
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={fetchDataToolDropdown}
                onInputChange={handleToolSearch}
                isDisabled={disableFields}
                nextFields={{up: "Chip No",down: "เพื่อ"}}
              />
              <MasterSelectComponent
                id="เพื่อ"
                label="เพื่อ"
                onChange={(option) => {
                  const value = option ? String(option.value) : "";
                  setValue("for_tool_one_id", value);
                }}
                defaultValue={{
                  value: watch("for_tool_one_id") ?? "",
                  label: "",
                }}
                valueKey="master_tooling_reason_id"
                labelKey="tooling_reason_name"
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={fetchDataToolingReasonDropdown}
                onInputChange={handleToolingReasonSearch}
                isDisabled={disableFields}
                nextFields={{up: "เครื่องมือที่ 1",down: "เครื่องมือที่ 2"}}
              />
              {/* <MasterSelectComponent
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
              /> */}
            </Grid>
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <MasterSelectComponent
                id="เครื่องมือที่ 2"
                label="เครื่องมือที่ 2"
                onChange={(option) => {
                  const value = option ? String(option.value) : "";
                  setValue("tool_two_id", value);
                }}
                defaultValue={{
                  value: watch("tool_two_id") ?? "",
                  label: "",
                }}
                valueKey="tool_id"
                labelKey="tool"
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={fetchDataToolDropdown}
                onInputChange={handleToolSearch}
                isDisabled={disableFields}
                nextFields={{up: "เพื่อ",down: "เพื่อ 2"}}
              />
              <MasterSelectComponent
                id="เพื่อ 2"
                label="เพื่อ"
                onChange={(option) => {
                  const value = option ? String(option.value) : "";
                  setValue("for_tool_two_id", value);
                }}
                defaultValue={{
                  value: watch("for_tool_two_id") ?? "",
                  label: "",
                }}
                valueKey="master_tooling_reason_id"
                labelKey="tooling_reason_name"
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={fetchDataToolingReasonDropdown}
                onInputChange={handleToolingReasonSearch}
                isDisabled={disableFields}
                nextFields={{up: "เครื่องมือที่ 2",down: "เครื่องมือที่ 3"}}
              />
              {/* <MasterSelectComponent
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
              /> */}
            </Grid>
            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <MasterSelectComponent
                id="เครื่องมือที่ 3"
                label="เครื่องมือที่ 3"
                onChange={(option) => {
                  const value = option ? String(option.value) : "";
                  setValue("tool_three_id", value);
                }}
                defaultValue={{
                  value: watch("tool_three_id") ?? "",
                  label: "",
                }}
                valueKey="tool_id"
                labelKey="tool"
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={fetchDataToolDropdown}
                onInputChange={handleToolSearch}
                isDisabled={disableFields}
                nextFields={{up: "เพื่อ 2",down: "เพื่อ 3"}}
              />
              <MasterSelectComponent
                id="เพื่อ 3"
                label="เพื่อ"
                onChange={(option) => {
                  const value = option ? String(option.value) : "";
                  setValue("for_tool_three_id", value);
                }}
                defaultValue={{
                  value: watch("for_tool_three_id") ?? "",
                  label: "",
                }}
                valueKey="master_tooling_reason_id"
                labelKey="tooling_reason_name"
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={fetchDataToolingReasonDropdown}
                onInputChange={handleToolingReasonSearch}
                isDisabled={disableFields}
                nextFields={{up: "เครื่องมือที่ 3",down: "issue_reason_id"}}
              />
              {/* <MasterSelectComponent
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
              /> */}
            </Grid>

            <Grid
              columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
              gap="3"
              rows="repeat(2, auto)"
              width="auto"
            >
              <MasterSelectComponent
                id="issue_reason_id"
                label="แก้ไข สาเหตุ"
                onChange={(option) => {
                  const value = option ? String(option.value) : "";
                  setValue("issue_reason_id", value);
                }}
                defaultValue={{
                  value: watch("issue_reason_id") ?? "",
                  label: "",
                }}
                valueKey="issue_reason_id"
                labelKey="issue_reason_name"
                placeholder="กรุณาเลือก..."
                className=" text-left w-full"
                fetchDataFromGetAPI={fetchDataIssueReasonDropdown}
                onInputChange={handleIssueReasonSearch}
                isDisabled={disableFields}
                nextFields={{up: "เพื่อ 3",down: "ซ่อมไม่ได้"}}
              />

              <InputAction
                id={"ซ่อมไม่ได้"}
                placeholder={"ซ่อมไม่ได้"}
                value={watch("not_repair") ?? ""}
                onChange={(e) => setValue("not_repair", e.target.value)}
                label={"ซ่อมไม่ได้"}
                labelOrientation={"vertical"}
                size={"2"}
                defaultValue={watch("not_repair")}
                classNameInput=" w-full"
                errorMessage={errors.not_repair?.message}
                disabled={disableFields}
                nextFields={{up: "issue_reason_id",down: "หมายเหตุ"}}
              />
            </Grid>
            <ButtonAttactment
              label={"ไฟล์แนบ"}
              onClick={() => setOpenDialogImages(true)}
            />

            <InputTextareaFormManage
              id="หมายเหตุ"
              name={"หมายเหตุ"}
              placeholder="หมายเหตุ"
              register={{ ...register("box_remark") }}
              msgError={""}
              showLabel
              disabled={disableFields}
              nextFields={{up: "ซ่อมไม่ได้",down: "submit"}}
            />
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
                  id="submit"
                  type="submit"
                  btnType="default"
                  variant="outline"
                  className=" w-[100px] max-sm:w-full"
                  nextFields={{up: "หมายเหตุ"}}
                >
                  บันทึกข้อมูล
                </Buttons>
              </Flex>
            )}
          </>
        )}

        <DialogAttachmentRepairReceiptBox
          data={repairReceiptData}
          isOpen={openDialogImages}
          onClose={handleCloseDialogImaage}
          defaultFileCodeBefore={watch("box_before_file_url") ?? []}
          defaultFileCodeAfter={watch("box_after_file_url") ?? []}
          defaultImagesChip={watch("box_chip_image_url") ?? []}
          onChangeImage={(imagesChip, fileCodeBefore, fileCodeAfter) => {
            setIsChangeFile(true);
            setValue("box_chip_image_url", imagesChip);
            setValue("box_before_file_url", fileCodeBefore);
            setValue("box_after_file_url", fileCodeAfter);
          }}
          isChangeFile={isChangeFile}
          disable={disableFields}
        />
      </form>
    </div>
  );
}
