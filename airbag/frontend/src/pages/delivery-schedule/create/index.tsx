import DeliveryScheduleHomeCreate from "@/features/delivery-schedule/containers/create-home-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useSearchParams } from "react-router-dom";
import { Flex, Text } from "@radix-ui/themes";
import RepairReceiptItemCreate from "@/features/delivery-schedule/containers/create-repair-items-page";
import BadgeStatus from "@/components/customs/badges/badgeStatus";
import { useEffect, useState } from "react";
import { getDeliveryScheduleById } from "@/services/ms.delivery.service";
import { DOCUMENT_STATUS } from "@/types/documentStatus";

enum TABNAME {
  home = "home",
  repairItems = "repair-items",
}

export default function DeliveryScheduleCreatePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusForm, setStatusForm] = useState("pending");
  const { deliveryScheduleId } = useParams();
  let containerName = "";

  switch (searchParams.get("tab")) {
    case TABNAME.home:
      containerName = TABNAME.home;
      break;
    case TABNAME.repairItems:
      containerName = TABNAME.repairItems;
      break;
    default:
      containerName = TABNAME.home;
      break;
  }

  const handleChangeTab = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", value);
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    if (deliveryScheduleId) {
      getDeliveryScheduleById(deliveryScheduleId).then((res) => {
        const item = res.responseObject;
        setStatusForm(item?.status ?? DOCUMENT_STATUS.PENDING);
      });
    }
  }, [deliveryScheduleId]);

  return (
    <div className="container w-full m-auto">
      <Flex gap={"3"}>
        <Text size="6" weight="bold" className="text-center">
          ออกบิลใบส่งมอบ
        </Text>
        <BadgeStatus value={statusForm} />
      </Flex>
      <Tabs
        defaultValue={containerName}
        onValueChange={handleChangeTab}
        className=" mt-4"
      >
        <TabsList>
          <TabsTrigger value={TABNAME.home}>หน้าหลัก</TabsTrigger>
          <TabsTrigger value={TABNAME.repairItems}>รายการซ่อม</TabsTrigger>
        </TabsList>
        <TabsContent value={TABNAME.home}>
          <DeliveryScheduleHomeCreate />
        </TabsContent>
        <TabsContent value={TABNAME.repairItems}>
          <RepairReceiptItemCreate />
        </TabsContent>
      </Tabs>
    </div>
  );
}
