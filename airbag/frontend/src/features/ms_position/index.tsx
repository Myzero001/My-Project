import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import { getMasterPosition, postMasterPosition, updateMasterPosition, deleteMasterPosition } from "@/services/msPosition.service"
import { useToast } from "@/components/customs/alert/toast.main.component";
import { TypeMasterPositionAll } from "@/types/response/response.ms_position";
import { useSearchParams } from "react-router-dom";
import { usePosition } from "@/hooks/usePosition";

type dataTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeMasterPositionAll;
}[];
export default function MasterPositionFeature() {
    const [searchText, setSearchText] = useState("");
    const [positionName, setPositionName] = useState("");
    const [data, setData] = useState<dataTableType>([]);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<TypeMasterPositionAll | null>(null);


    const { showToast } = useToast();


    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");
    const { data: positionData, refetch: refetchPosition } = usePosition({
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce,
    });

    useEffect(() => {
        // console.log("refetchPosition", positionData);
        if (positionData?.responseObject?.data) {

            const formattedData = positionData?.responseObject?.data.map((item: TypeMasterPositionAll, index: number) => ({
                className: "",
                cells: [
                    {value: (parseInt(page) - 1) * parseInt(pageSize) + index + 1,className: "text-center"},
                    { value: item.position_name, className: "text-left" },
                ],
                data: item,
            }));
            setData(formattedData);
        }
    }, [positionData]);

    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce("");
            setSearchParams({ page: "1", pageSize: pageSize });
            refetchPosition();
        }
    }, [searchText]);


    const handleSearch = () => {
        searchParams.set("pageSize", pageSize ?? "25");
        searchParams.set("page", "1");
        setSearchParams({ page: "1", pageSize: pageSize });
        if (searchText) {
            setSearchTextDebouce(searchText);
        }
        refetchPosition();
    };



    const headers = [
        { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
        { label: "ตำแหน่ง", colSpan: 1, className: "w-full" },
        { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
        { label: "ลบ", colSpan: 1, className: "min-w-14" },
    ];

    //handle
    // const handleSearch = () => {
    //     setSearchTextDebouce(searchText);
    //     refetchPosition();
    //     console.log("Search:", { searchText });
    // };

    const handleEdit = (id: any) => {
        console.log("Edit:", id);
    };

    const handleDelete = (id: any) => {
        console.log("Delete:", id);
    };


    //เปิด
    const handleCreateOpen = () => {
        setPositionName("");
        setIsCreateDialogOpen(true);
    };
    const handleEditOpen = (item: TypeMasterPositionAll) => {
        setSelectedItem(item);
        setPositionName(item.position_name);
        setIsEditDialogOpen(true);
    };
    const handleDeleteOpen = (item: TypeMasterPositionAll) => {
        setSelectedItem(item);
        setIsDeleteDialogOpen(true);
    }


    //ปิด
    const handleCreateClose = () => {
        setIsCreateDialogOpen(false);
    };
    const handleEditClose = () => {
        setIsEditDialogOpen(false);
    };
    const handleDeleteClose = () => {
        setIsDeleteDialogOpen(false);
    };

    //ยืนยันไดอะล็อค
    const handleConfirm = async () => {
        if (!positionName) {
            showToast("กรุณาระบุชื่อตำแหน่ง", false);
            return;
        }
        try {
            const response = await postMasterPosition({
                position_name: positionName,
            });

            if (response.statusCode === 200) {
                setPositionName("");
                handleCreateClose();
                showToast("สร้างรายการตำแหน่งเรียบร้อยแล้ว", true);
                refetchPosition();

            } else {
                if (response.message === "Position already taken") {
                    showToast("รายการตำแหน่งนี้มีอยู่แล้ว", false);
                }
            }
        } catch {
            showToast("ไม่สามารถสร้างรายการตำแหน่งได้", false);
        }
    };
    const handleEditConfirm = async () => {
        if (!positionName) {
            showToast("กรุณาระบุชื่อตำแหน่ง", false);
            return;
        }
        if (!selectedItem) {
            showToast("กรุณาระบุชื่อตำแหน่ง", false);
            return;
        }
        try {
            const response = await updateMasterPosition({
                position_id: selectedItem?.position_id,
                position_name: positionName,
            });

            if (response.statusCode === 200) {
                showToast("แก้ไขรายการตำแหน่งเรียบร้อยแล้ว", true);
                setPositionName("");
                setIsEditDialogOpen(false);
                refetchPosition();
            } else {
                if (response.message === "Position already taken") {
                    showToast("รายการตำแหน่งนี้มีอยู่แล้ว", false);
                }
            }
        } catch {
            showToast("ไม่สามารถแก้ไขรายการตำแหน่งได้", false);
        }
    };
    const handleDeleteConfirm = async () => {
        if (!selectedItem || !selectedItem.position_id) {
            showToast("กรุณาระบุรายการตำแหน่งที่ต้องการลบ", false);
            return;
        }

        try {
            const response = await deleteMasterPosition(selectedItem.position_id);

            if (response.statusCode === 200) {
                showToast("ลบรายการตำแหน่งเรียบร้อยแล้ว", true);
                setIsDeleteDialogOpen(false);
                refetchPosition();
            } else {
                showToast("ไม่สามารถลบรายการตำแหน่งได้", false);
            }
        } catch (error) {
            showToast("ไม่สามารถลบรายการตำแหน่งได้", false);
        }
    };

    return (
        <div>
            <MasterTableFeature
                title="ตำแหน่ง"
                titleBtnName="สร้างตำแหน่ง"
                inputs={[
                    {
                        id: "search_input",
                        value: searchText,
                        size: "3",
                        placeholder: "ค้นหา ตำแหน่ง",
                        onChange: setSearchText,
                        onAction: handleSearch,
                    },
                ]}
                onSearch={handleSearch}
                headers={headers}
                rowData={data}
                totalData={positionData?.responseObject?.totalCount}
                onEdit={handleEditOpen}
                onDelete={handleDeleteOpen}
                onPopCreate={handleCreateOpen}
            />

            {/* สร้าง */}
            <DialogComponent
                isOpen={isCreateDialogOpen}
                onClose={handleCreateClose}
                title="สร้างตำแหน่ง"
                onConfirm={handleConfirm}
                confirmText="บันทึกข้อมูล"
                cancelText="ยกเลิก"
            >
                <div className="flex flex-col gap-3 items-left">
                    <InputAction
                        id="position-create"
                        placeholder="ระบุตำแหน่ง"
                        onChange={(e) => setPositionName(e.target.value)}
                        label="ชื่อตำแหน่ง"
                        value={positionName}
                        labelOrientation="horizontal"
                        onAction={handleConfirm}
                        classNameLabel="w-20 min-w-20 flex justify-end"
                        classNameInput="w-full"
                    />
                </div>
            </DialogComponent>

            {/* แก้ไข */}
            <DialogComponent
                isOpen={isEditDialogOpen}
                onClose={handleEditClose}
                title="แก้ไขตำแหน่ง"
                onConfirm={handleEditConfirm}
                confirmText="บันทึกข้อมูล"
                cancelText="ยกเลิก"
            >
                <div className="flex flex-col gap-3 items-left">
                    <InputAction
                        id="position-edit"
                        placeholder="ระบุตำแหน่ง"
                        defaultValue={positionName}
                        onChange={(e) => setPositionName(e.target.value)}
                        label="ชื่อตำแหน่ง"
                        value={positionName}
                        labelOrientation="horizontal"
                        onAction={handleEditConfirm}
                        classNameLabel="w-20 min-w-20 flex justify-end"
                        classNameInput="w-full"
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
                    ชื่อตำแหน่ง : <span className="text-red-500">{selectedItem?.position_name} </span></p>
            </DialogComponent>
        </div>
    )
}
