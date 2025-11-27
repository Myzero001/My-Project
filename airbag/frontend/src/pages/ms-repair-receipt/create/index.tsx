import RepairCeiptStatus from "@/components/customs/badges/repairReceiptStatus";
import RepairReceiptBoxCreate from "@/features/ms-repair-receipt/containers/create-box-page";
import RepairReceiptHomeCreate from "@/features/ms-repair-receipt/containers/create-home-page";
import RepairReceiptPaymentSummaryCreate from "@/features/ms-repair-receipt/containers/create-payment-summary-page";
import RepairReceiptItemCreate from "@/features/ms-repair-receipt/containers/create-repair-items-page";
import { Flex, Text } from "@radix-ui/themes";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { getRepairReceiptById } from "@/services/ms.repair.receipt";
import RepairReceiptBoxClearByCreate from "@/features/ms-repair-receipt/containers/create-box-cleay-by";
import { useLocalProfileData } from "@/zustand/useProfile";
import { permissionMap } from "@/utils/permissionMap";

enum TABNAME {
  home = "home",
  box = "box",
  clearBy = "clear-by",
  repairItems = "repair-items",
  paymentSummary = "payment-summary",
}
export default function RepairReceiptCreatePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusForm, setStatusForm] = useState("pending");
  const [isloadingPage, setIsloadingPage] = useState(true);
  const { repairReceiptId } = useParams();
  const navigate = useNavigate();
  const { profile } = useLocalProfileData();
  const [defaultTab, setDefaultTab] = useState<string>("");

  const handleChangeTab = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", value);
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    if (repairReceiptId) {
      getRepairReceiptById(repairReceiptId).then((res) => {
        const item = res.responseObject;
        setStatusForm(item.repair_receipt_status);
      });
    }
  }, [repairReceiptId]);

  useEffect(() => {
    if (profile.role?.role_name) {
      setIsloadingPage(true);
      let currentTab = searchParams.get("tab") ?? undefined;

      if (!currentTab) {
        // หา Tab แรกที่มีสิทธิ์แสดง
        const availableTabs = [
          { key: TABNAME.home, label: "ใบรับซ่อมหน้าแรกหน้ารายการซ่อม" },
          { key: TABNAME.box, label: "ใบรับซ่อมหน้ากล่อง" },
          { key: TABNAME.clearBy, label: "ใบรับซ่อมหน้ากล่อง clear by" },
          { key: TABNAME.repairItems, label: "ใบรับซ่อมหน้าแรกหน้ารายการซ่อม" },
          { key: TABNAME.paymentSummary, label: "ใบรับซ่อมหน้าการชำระเงิน" },
        ];

        for (const tab of availableTabs) {
          if (permissionMap[tab.label]?.[profile.role?.role_name] !== "N") {
            currentTab = tab.key;
            break;
          }
        }
      }

      if (currentTab) {
        setDefaultTab(currentTab);

        let permissionName = undefined;
        switch (currentTab) {
          case TABNAME.home:
            permissionName = "ใบรับซ่อมหน้าแรกหน้ารายการซ่อม";
            break;
          case TABNAME.box:
            permissionName = "ใบรับซ่อมหน้ากล่อง";
            break;
          case TABNAME.clearBy:
            permissionName = "ใบรับซ่อมหน้ากล่อง clear by";
            break;
          case TABNAME.repairItems:
            permissionName = "ใบรับซ่อมหน้าแรกหน้ารายการซ่อม";
            break;
          case TABNAME.paymentSummary:
            permissionName = "ใบรับซ่อมหน้าการชำระเงิน";
            break;
        }

        if (permissionName) {
          const permission =
            permissionMap[permissionName][profile.role?.role_name];

          if (permission === "N") {
            navigate("/");
          }
        }
      } else {
        navigate("/");
      }
      setIsloadingPage(false);
    }
  }, [searchParams, profile]);

  if (!profile.role?.role_name || isloadingPage) return;

  return (
    <div className="container w-full m-auto">
      <Flex gap={"3"}>
        <Text size="6" weight="bold" className="text-center ">
          ใบรับซ่อม
        </Text>
        <RepairCeiptStatus value={statusForm} />
      </Flex>
      <Tabs
        defaultValue={defaultTab}
        onValueChange={handleChangeTab}
        className=" mt-4"
      >
        <TabsList>
          {permissionMap["ใบรับซ่อมหน้าแรกหน้ารายการซ่อม"][
            profile.role?.role_name
          ] !== "N" && <TabsTrigger value={TABNAME.home}>หน้าหลัก</TabsTrigger>}
          {permissionMap["ใบรับซ่อมหน้ากล่อง"][profile.role?.role_name] !==
            "N" && <TabsTrigger value={TABNAME.box}>กล่อง</TabsTrigger>}
          {permissionMap["ใบรับซ่อมหน้ากล่อง clear by"][
            profile.role?.role_name
          ] !== "N" && (
            <TabsTrigger value={TABNAME.clearBy}>Clear by</TabsTrigger>
          )}
          {permissionMap["ใบรับซ่อมหน้าแรกหน้ารายการซ่อม"][
            profile.role?.role_name
          ] !== "N" && (
            <TabsTrigger value={TABNAME.repairItems}>รายการรับซ่อม</TabsTrigger>
          )}
          {permissionMap["ใบรับซ่อมหน้าการชำระเงิน"][
            profile.role?.role_name
          ] !== "N" && (
            <TabsTrigger value={TABNAME.paymentSummary}>
              สรุปการชำระ
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value={TABNAME.home}>
          <RepairReceiptHomeCreate />
        </TabsContent>
        <TabsContent value={TABNAME.box}>
          <RepairReceiptBoxCreate />
        </TabsContent>
        <TabsContent value={TABNAME.clearBy}>
          <RepairReceiptBoxClearByCreate />
        </TabsContent>
        <TabsContent value={TABNAME.repairItems}>
          <RepairReceiptItemCreate />
        </TabsContent>
        <TabsContent value={TABNAME.paymentSummary}>
          <RepairReceiptPaymentSummaryCreate />
        </TabsContent>
      </Tabs>
    </div>
  );
}
