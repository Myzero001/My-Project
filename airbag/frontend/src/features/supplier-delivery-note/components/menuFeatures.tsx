import RepairCeiptStatus from "@/components/customs/badges/repairReceiptStatus";
import { Flex, Text } from "@radix-ui/themes";
import { useParams, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { getSupplierDeliveryNoteById } from "@/services/supplier-delivery-note.service.";
import SupplierDeliveryNoteCreateFeatures from "@/features/supplier-delivery-note/components/createFeatures"
import SupplierDeliveryNoteAddListFeatures from "@/features/supplier-delivery-note/components/addListFeatures";
import SupplierDeliveryNoteListFeatures from "@/features/supplier-delivery-note/components/listFeatures";
import { useLocation } from "react-router-dom";


enum TABNAME {
    home = "home",
    addList = "addSupplier",
    list = "addSupplierListItem",
}
export default function RepairReceiptCreatePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [statusForm, setStatusForm] = useState("pending");
    const { sndId } = useParams();
    const location = useLocation();
    const repairReceiptId = searchParams.get('repairReceiptId');

    const [activeTab, setActiveTab] = useState<TABNAME>(TABNAME.home);

    useEffect(() => {
        const tabParam = searchParams.get("tab") as TABNAME;
        if (tabParam && Object.values(TABNAME).includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    const handleChangeTab = (value: string) => {
        setSearchParams({ tab: value });
        setActiveTab(value as TABNAME);
    };

    useEffect(() => {
        if (sndId) {
            getSupplierDeliveryNoteById(sndId).then((res) => {
                const item = res.responseObject;
                setStatusForm(item.status || "");
            });
        }
    }, [sndId]);

    const handleSubmitSuccess = () => {
        setSearchParams({ tab: TABNAME.list }); // เปลี่ยน query param
        setActiveTab(TABNAME.list); // เปลี่ยน state
    };

    return (
        <div className="container w-full m-auto">
            <Flex gap={"3"}>
                <Text size="6" weight="bold" className="text-center">
                    ใบส่งซับพลายเออร์
                </Text>
                <RepairCeiptStatus value={statusForm} />
            </Flex>

            {/* ✅ ใช้ value={activeTab} เพื่อให้แท็บเปลี่ยนจริง */}
            <Tabs value={activeTab} onValueChange={handleChangeTab} className="mt-4">
                <TabsList>
                    <TabsTrigger value={TABNAME.home}>หน้าหลัก</TabsTrigger>
                    <TabsTrigger value={TABNAME.addList}>เพิ่มรายการส่งซับพลายเออร์</TabsTrigger>
                    <TabsTrigger value={TABNAME.list}>รายการส่งซับพลายเออร์</TabsTrigger>
                </TabsList>
                <TabsContent value={TABNAME.home}>
                    <SupplierDeliveryNoteCreateFeatures />
                </TabsContent>
                <TabsContent value={TABNAME.addList}>
                    <SupplierDeliveryNoteAddListFeatures
                        repairReceiptId={repairReceiptId}
                        onSubmitSuccess={handleSubmitSuccess} 
                    />
                </TabsContent>
                <TabsContent value={TABNAME.list}>
                    <SupplierDeliveryNoteListFeatures />
                </TabsContent>
            </Tabs>
        </div>
    );
}
