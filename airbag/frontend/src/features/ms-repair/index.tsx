import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import { get_ms_repair_all, create_ms_repair, update_ms_repair, delete_ms_repair, getMasterGroupRepairSelect } from "@/services/msRepir.service";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { TypeRepairAll } from "@/types/response/response.ms-repair";
import { useSearchParams } from "react-router-dom";
import { useRepair } from "@/hooks/useRepair";
import { OptionType } from "@/components/customs/select/select.main.component";


type dataTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeRepairAll;
}[];
export default function MasterRepairFeature() {
    const [searchText, setSearchText] = useState("");
    const [repairName, setRepairName] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [data, setData] = useState<dataTableType>([]);


    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<TypeRepairAll | null>(null);


    const { showToast } = useToast();
    const [selectedGroupRepairOption, setSelectedGroupRepairOption] = useState<OptionType | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");
    const { data: RepairData, refetch: refetchRepair } = useRepair({
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce,
    });
    useEffect(() => {
        // console.log("RepairData", RepairData);
        // @ts-ignore
        if (RepairData?.responseObject?.data) {
            // @ts-ignore
            const formattedData = RepairData?.responseObject?.data.map((item: TypeRepairAll, index: number) => ({
                className: "",
                cells: [
                    { value: (parseInt(page) - 1) * parseInt(pageSize) + index + 1, className: "text-center" },
                    { value: item.master_group_repair?.group_repair_name, className: "text-left" },
                    { value: item.master_repair_name, className: "text-left" },
                ],
                data: item,
            }));
            setData(formattedData);
        }
    }, [RepairData]);

    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce("");
            setSearchParams({ page: "1", pageSize: pageSize });
            refetchRepair();
        }
    }, [searchText]);


    const handleSearch = () => {
        searchParams.set("pageSize", pageSize ?? "25");
        searchParams.set("page", "1");
        setSearchParams({ page: "1", pageSize: pageSize });
        if (searchText) {
            setSearchTextDebouce(searchText);
        }
        refetchRepair();
    };

    const handleEdit = (id: any) => {
        console.log("Edit:", id);
    };

    const handleDelete = (id: any) => {
        console.log("Delete:", id);
    };


    //ยืนยันไดอะล็อค
    const handleConfirm = async () => {
        // เช็ค state ใหม่
        if (!repairName || !selectedGroupRepairOption) {
            showToast("กรุณาระบุกลุ่มซ่อมและรายการซ่อมให้ครบถ้วน", false);
            return;
        }
        try {
            const response = await create_ms_repair({
                master_repair_name: repairName,
                // ดึง value ออกจาก object
                master_group_repair_id: String(selectedGroupRepairOption.value),
            });

            if (response.statusCode === 200) {
                setRepairName("");
                setSelectedGroupRepairOption(null); // << Reset state ใหม่
                handleCreateClose();
                showToast("สร้างรายการซ่อมเรียบร้อยแล้ว", true);
                refetchRepair();
            } else {
                if (response.message === "Repair already exists") {
                    showToast("รายการซ่อมนี้มีอยู่แล้ว", false);
                }
            }
        } catch {

            showToast("ไม่สามารถสร้างรายการซ่อมได้", false);
        }
    };
    const handleEditConfirm = async () => {
    // เช็ค state ใหม่
    if (!repairName || !selectedGroupRepairOption || !selectedItem) {
        showToast("กรุณาระบุกลุ่มซ่อมและรายการซ่อมให้ครบถ้วน", false);
        return;
    }

    try {
        const response = await update_ms_repair({
            master_repair_id: selectedItem.master_repair_id,
            master_repair_name: repairName,
            // ดึงค่า value ใหม่ล่าสุดจาก state
            master_group_repair_id: String(selectedGroupRepairOption.value),
        });

        if (response.statusCode === 200) {
            showToast("แก้ไขรายการซ่อมเรียบร้อยแล้ว", true);
            // ไม่ต้อง reset state ที่นี่ เพราะจะปิด dialog ไปเลย
            handleEditClose();
            refetchRepair();
        } else {
                if (response.message === "Repair already exists") {
                    showToast("รายการซ่อมนี้มีอยู่แล้ว", false);

                }
            }
        } catch {
            showToast("ไม่สามารถแก้ไขรายการซ่อมได้", false);
        }
    };
    const handleDeleteConfirm = async () => {
        if (!selectedItem || !selectedItem.master_repair_id) {
            showToast("กรุณาระบุรายการซ่อมที่ต้องการลบ", false);
            return;
        }

        try {
            const response = await delete_ms_repair(selectedItem.master_repair_id);

            if (response.statusCode === 200) {
                showToast("ลบรายการซ่อมเรียบร้อยแล้ว", true);
                setIsDeleteDialogOpen(false);
                refetchRepair();
            }
            else if (response.statusCode === 400) {
                showToast("ไม่สามารถลบได้ รายการซ่อมนี้มีอยู่ในใบเสนอราคา", false);
            }
            else {

                showToast("ไม่สามารถลบรายการซ่อมได้", false);
            }
        } catch (error) {
            showToast("ไม่สามารถลบรายการซ่อมได้", false);
        }
    };

    //เปิด
    const handleCreateOpen = () => {
        setRepairName("");
        setSelectedGroupRepairOption(null); // << Reset state ใหม่
        setIsCreateDialogOpen(true);
    };
    const handleEditOpen = (item: TypeRepairAll) => {
        setSelectedItem(item);
        setRepairName(item.master_repair_name);
        // สร้าง object ที่ถูกต้องสำหรับ state ใหม่
        setSelectedGroupRepairOption(item.master_group_repair ? {
            value: item.master_group_repair.master_group_repair_id,
            label: item.master_group_repair.group_repair_name,
        } : null);
        setIsEditDialogOpen(true);
    };
    const handleDeleteOpen = (item: TypeRepairAll) => {
        setSelectedItem(item);
        setIsDeleteDialogOpen(true);
    }


    //ปิด
    const handleCreateClose = () => {
        setIsCreateDialogOpen(false);
    };
    const handleEditClose = () => {
        setIsEditDialogOpen(false);
        setSelectedItem(null);
        setRepairName("");
        setSelectedGroupRepairOption(null);
    };
    const handleDeleteClose = () => {
        setIsDeleteDialogOpen(false);
    };

    const headers = [
        { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
        { label: "กลุ่มซ่อม", colSpan: 1, className: "w-3/12" },
        { label: "รายการซ่อม", colSpan: 1, className: "w-full" },
        { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
        { label: "ลบ", colSpan: 1, className: "min-w-14" },
    ];



    return (
        <div>
            <MasterTableFeature
                title="รายการซ่อม"
                titleBtnName="สร้างรายการซ่อม"
                inputs={[
                    {
                        id: "search_input",
                        value: searchText,
                        size: "3",
                        placeholder: "ค้นหา รายการซ่อม",
                        onChange: setSearchText,
                        onAction: handleSearch,
                    },
                ]}
                onSearch={handleSearch}
                headers={headers}
                rowData={data}
                // @ts-ignore
                totalData={RepairData?.responseObject?.totalCount}
                onEdit={handleEditOpen}
                onDelete={handleDeleteOpen}
                onPopCreate={handleCreateOpen}
            />

            {/* สร้าง */}
            <DialogComponent
                isOpen={isCreateDialogOpen}
                onClose={handleCreateClose}
                title="สร้างรายการซ่อม"
                onConfirm={handleConfirm}
                confirmText="บันทึกข้อมูล"
                cancelText="ยกเลิก"
            >
                <div className="flex flex-col gap-3 items-left">
                    <MasterSelectComponent
                        id="group_repair_name"
                        value={selectedGroupRepairOption}
                        onChange={(option) => setSelectedGroupRepairOption(option)}
                        fetchDataFromGetAPI={getMasterGroupRepairSelect}
                        valueKey="master_group_repair_id"
                        labelKey="group_repair_name"
                        placeholder="กรุณาเลือก..."
                        isClearable={true}
                        label="กลุ่มซ่อม"
                        labelOrientation="horizontal"
                        classNameLabel="w-20 min-w-20 flex justify-end"
                        classNameSelect="w-full"
                        nextFields={{down: "repair-create"}}
                    />
                    <InputAction
                        id="repair-create"
                        placeholder="ระบุรายการซ่อม"
                        onChange={(e) => setRepairName(e.target.value)}
                        label="รายการซ่อม"
                        value={repairName}
                        labelOrientation="horizontal"
                        onAction={handleConfirm}
                        classNameLabel=" w-[90px] flex justify-end"
                        classNameInput="w-9/12"
                        nextFields={{up: "group_repair_name"}}
                    />
                </div>
            </DialogComponent>
            {/* แก้ไข */}
            <DialogComponent
                isOpen={isEditDialogOpen}
                onClose={handleEditClose}
                title="แก้ไขรายการซ่อม"
                onConfirm={handleEditConfirm}
                confirmText="บันทึกข้อมูล"
                cancelText="ยกเลิก"
            >
                <div className="flex flex-col gap-3 items-left">
                    <MasterSelectComponent
                        id="group_repair_name"
                        value={selectedGroupRepairOption}
                        onChange={(option) => setSelectedGroupRepairOption(option)}
                        fetchDataFromGetAPI={getMasterGroupRepairSelect}
                        valueKey="master_group_repair_id"
                        labelKey="group_repair_name"
                        placeholder={selectedItem?.master_group_repair.group_repair_name || "กรุณาเลือก..."}
                        isClearable={true}
                        label="กลุ่มซ่อม"
                        labelOrientation="horizontal"
                        classNameLabel="w-20 min-w-20 flex justify-end"
                        classNameSelect="w-full"
                        defaultValue={
                            selectedItem?.master_group_repair
                                ? {
                                    value: selectedItem.master_group_repair.master_group_repair_id,
                                    label: selectedItem.master_group_repair.group_repair_name,
                                }
                                : null
                        }
                        nextFields={{down: "repair-edit"}}
                    />
                    <InputAction
                        id="repair-edit"
                        defaultValue={selectedItem ? selectedItem.master_repair_name : "ระบุรายการซ่อม"}
                        onChange={(e) => setRepairName(e.target.value)}
                        label="รายการซ่อม"
                        value={repairName}
                        placeholder="ระบุรายการซ่อม"
                        labelOrientation="horizontal"
                        onAction={handleEditConfirm}
                        classNameLabel=" w-3/12 flex justify-end"
                        classNameInput="w-9/12"
                        nextFields={{up: "group_repair_name"}}
                    />
                </div>
            </DialogComponent>
            {/* ลบ */}
            <DialogComponent
                isOpen={isDeleteDialogOpen}
                onClose={handleDeleteClose}
                title="ยืนยันการลบ"
                onConfirm={handleDeleteConfirm}
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
            >
                <p>คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? <br />
                    กลุ่มซ่อม : <span className="text-red-500">{selectedItem?.master_group_repair?.group_repair_name}</span><br />
                    รายการซ่อม : <span className="text-red-500">{selectedItem?.master_repair_name} </span></p>
            </DialogComponent>

        </div>

    );
}