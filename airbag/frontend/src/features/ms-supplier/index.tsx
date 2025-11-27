import { useState, useEffect } from "react";
import { TypeMasterSupplierAll } from "@/types/response/response.ms-supplier";
import { getMSSupplierall, createMSSupplier } from "@/services/ms.Supplier";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/customs/alert/toast.main.component";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { useSearchParams } from "react-router-dom";
import { useSupplier } from "@/hooks/useSupplier";



type dataTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeMasterSupplierAll;
}[];
const MasterSupplierFeature = () => {
    const [data, setData] = useState<dataTableType>([]);
    const [searchText, setSearchText] = useState("");

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<TypeMasterSupplierAll | null>(null);
    const { showToast } = useToast();

    const navigate = useNavigate();


    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");
    const { data: SupplierData, refetch: refetchSupplier } = useSupplier({
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce,
    });
    useEffect(() => {
        // console.log("SupplierData", SupplierData);
        if (SupplierData?.responseObject?.data) {
            const formattedData = SupplierData?.responseObject?.data.map((item: TypeMasterSupplierAll, index: number) => ({
                className: "",
                cells: [
                    { value: (parseInt(page) - 1) * parseInt(pageSize) + index + 1, className: "text-center" },
                    { value: item.supplier_code ?? "-", className: "text-left" },
                    { value: item.supplier_name ?? "-", className: "text-left" },
                    { value: item.contact_name ?? "-", className: "text-left" },
                    { value: item.business_type ?? "-", className: "text-left" },
                ],
                data: item,
            }));
            setData(formattedData);
        }
    }, [SupplierData]);
    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce("");
            setSearchParams({ page: "1", pageSize: pageSize });
            refetchSupplier();
        }
    }, [searchText]);


    const handleSearch = () => {
        searchParams.set("pageSize", pageSize ?? "25");
        searchParams.set("page", "1");
        setSearchParams({ page: "1", pageSize: pageSize });
        if (searchText) {
            setSearchTextDebouce(searchText);
        }
        refetchSupplier();
    };

    const [createMasterSupplierCodeName, setCreateMasterSupplierCodeName] = useState("");
    const headers = [
        { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
        { label: "รหัสร้านค้า", colSpan: 1, className: "w-3/12" },
        { label: "ชื่อร้านค้า", colSpan: 1, className: "w-3/12" },
        { label: "ชื่อผู้ติดต่อ", colSpan: 1, className: "w-3/12" },
        { label: "ประเภทกิจการ", colSpan: 1, className: "w-3/12" },
        { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
        // { label: "ลบ", colSpan: 1, className: "min-w-14" },
    ];

    const handleClickToNavigate = (supplier_id: any) => {
        navigate(`/ms-supplier/create`, { state: { supplier_id } });
        // console.log("Supplier id ที่ส่งให้:", supplier_id);
    };

    // const handleSearch = () => {
    //     setSearchTextDebouce(searchText);
    //     refetchSupplier();
    //     console.log("Search:", { searchText });
    // };


    //ยืนยันไดอะล็อค
    const handleConfirm = async () => {
        if (!createMasterSupplierCodeName) {
            showToast("กรุณาระบุรหัสร้านค้า", false);
            return;
        }
        try {
            const response = await createMSSupplier({
                supplier_code: createMasterSupplierCodeName,
            });

            if (response.statusCode === 200 ) {
                const supplierId = response.responseObject?.supplier_id;
                setCreateMasterSupplierCodeName("");
                handleCreateClose();
                showToast("สร้างรหัสร้านค้าเรียบร้อยแล้ว", true);
                refetchSupplier();

                handleClickToNavigate(supplierId);

            } else {

                showToast("รหัสร้านค้านี้มีอยู่แล้ว", false);
            }
        } catch {
            showToast("ไม่สามารถสร้างรหัสร้านค้าได้", false);
        }
    };


    //เปิด
    const handleCreateOpen = () => {
        setCreateMasterSupplierCodeName("");
        setIsCreateDialogOpen(true);
    };
    const handleEditOpen = (item: TypeMasterSupplierAll) => {
        setSelectedItem(item);
        setCreateMasterSupplierCodeName(item.supplier_code);
        setIsEditDialogOpen(true);
        handleClickToNavigate(item.supplier_id);
    };



    //ปิด
    const handleCreateClose = () => {
        setIsCreateDialogOpen(false);
    };

    return (
        <div>
            <MasterTableFeature
                title="ร้านค้า"
                titleBtnName="สร้างร้านค้า"
                inputs={[
                    {
                        id: "search_input",
                        value: searchText,
                        size: "3",
                        placeholder: "ค้นหา รหัสร้านค้า ชื่อร้านค้า ชื่อผู้ติดต่อ ประเภทกิจการ ",
                        onChange: setSearchText,
                        onAction: handleSearch,
                    },
                ]}
                onSearch={handleSearch}
                headers={headers}
                rowData={data}
                totalData={SupplierData?.responseObject?.totalCount}
                onEdit={handleEditOpen}
                // onDelete={handleClickToNavigate}
                onPopCreate={handleCreateOpen}
            />
            <DialogComponent
                isOpen={isCreateDialogOpen}
                onClose={handleCreateClose}
                title="สร้างร้านค้า"
                onConfirm={handleConfirm}
                confirmText="บันทึกข้อมูล"
                cancelText="ยกเลิก"
            >
                <div className="flex flex-col gap-3 items-left">

                    <InputAction
                        id="issue-reason-create"
                        placeholder="ระบุชื่อร้านค้า"
                        onChange={(e) => setCreateMasterSupplierCodeName(e.target.value)}
                        label="รหัสร้านค้า"
                        value={createMasterSupplierCodeName}
                        labelOrientation="horizontal"
                        onAction={handleConfirm}
                        classNameLabel="w-20 min-w-20 flex justify-end"
                        classNameInput="w-full"
                    />
                </div>
            </DialogComponent>

        </div>

    );
};

export default MasterSupplierFeature;

