import { useEffect, useState } from "react";
import {
    Table,
    Flex,
    Box,
    Text,
    IconButton,
    Badge,
    Select,
    Grid,
    TextField,
} from "@radix-ui/themes";
import { HiPlus } from "react-icons/hi";
import { useForm, Controller } from "react-hook-form";
import Buttons from "@/components/customs/button/button.main.component";
import { useParams } from "react-router-dom";
import { TypeSupplierDeliveryNoteListAll } from "@/types/response/response.supplier-delivery-note-list";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/customs/alert/toast.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import { useSearchParams } from "react-router-dom";
import { useSDNList } from "@/hooks/useSNDList";
import { useLocation } from "react-router-dom";
import { PayLoadCreatSupplierDeliveryNote } from "@/types/requests/request.supplier-delivery-note";
// import { getSupplierDeliveryNoteListAll } from "@/services/supplier-delivery-note.service.";
import { LuPencil } from "react-icons/lu";
import BadgeStatus from "@/components/customs/badges/badgeStatus";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import SupplierDeliveryNoteCreateFeatures from "./createFeatures";

type dataTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeSupplierDeliveryNoteListAll;
}[];


export default function SupplierDeliveryNoteListFeatures() {
    const [data, setData] = useState<dataTableType>([]);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { sndId } = useParams();
    const supplier_delivery_note_id = sndId ?? "";

    const headers = [
        { label: "แก้ไข", colSpan: 1, className: "w-1/12" },
        { label: "ใบรับซ่อม", colSpan: 1, className: "w-2/12" },
        { label: "รายการซ่อม", colSpan: 1, className: "w-4/12" },
        { label: "ราคา", colSpan: 1, className: "w-1/12" },
        { label: "จำนวน", colSpan: 1, className: "w-1/12" },
        { label: "รวม", colSpan: 1, className: "w-1/12" },
        { label: "สถานะ", colSpan: 1, className: "w-1/12" },
    ];

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");
    const { data: SDNListData, refetch: refetchSDNList } = useSDNList({
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce,
        supplier_delivery_note_id: supplier_delivery_note_id
    });


    const handleNavigate = (repairReceiptId: string) => {
        const currentTab = searchParams.get("tab") || "home";
        navigate(`/supplier-delivery-note/${sndId}?tab=addSupplier&repairReceiptId=${repairReceiptId}`);
    };
    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce("");
            setSearchParams({ page: "1", pageSize: pageSize });
            refetchSDNList();
        } else {
            setSearchTextDebouce(searchText);
        }
    }, [searchText]);


    useEffect(() => {
        if (SDNListData?.responseObject?.data) {
            const formattedData = SDNListData.responseObject?.data.flatMap((note: any, noteIndex: number) => {
                let displayedSupplierNote = false;
                return note.repair_receipts.flatMap((receipt: any, receiptIndex: number) => {
                    let displayedReceiptDoc = false;
                    return receipt.repair_receipts.map((detail: any, detailIndex: number) => {
                        const row = {
                            className: "",
                            cells: [
                                {
                                    value: !displayedReceiptDoc
                                        ? receipt.repair_receipt_doc
                                            ? (
                                                <IconButton
                                                    variant="ghost"
                                                    aria-label="Edit"
                                                    onClick={() => setSearchParams({ tab: "addSupplier", repairReceiptId: receipt.repair_receipt_id })}
                                                    >
                                                    <LuPencil style={{ fontSize: "18px" }} />
                                                </IconButton>
                                            )
                                            : ""
                                        : "",
                                    className: "text-center",
                                },
                                {
                                    value: !displayedReceiptDoc ? receipt.repair_receipt_doc ?? "-" : "",
                                    className: "text-center",
                                },
                                { value: detail.master_repair_name ?? "-", className: "text-left" },
                                {
                                    value: detail.price !== undefined ? parseFloat(detail.price).toFixed(2) : "-",
                                    className: "text-right"
                                },
                                { value: detail.quantity ?? "-", className: "text-center" },
                                {
                                    value: detail.total_price !== undefined ? parseFloat(detail.total_price).toFixed(2) : "-",
                                    className: "text-right"
                                },
                                {
                                    value: (
                                        <>
                                            {(() => {
                                                switch (detail.status) {
                                                    case 'pending':
                                                        return <BadgeStatus value={detail.status} />;
                                                    case 'success':
                                                        return <BadgeStatus value={detail.status} />;
                                                    case 'claim':
                                                        return <BadgeStatus value={detail.status} />;
                                                    default:
                                                        return <Text>-</Text>;
                                                }
                                            })()}
                                        </>
                                    ),
                                    className: "text-center",
                                    type: "badge-status"
                                }
                            ],
                            data: detail,
                        };
                        if (!displayedReceiptDoc) {
                            displayedReceiptDoc = true;
                        }
                        return row;
                    });
                });
            });
            setData(formattedData);
        }
    }, [SDNListData]);

    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce("");
            setSearchParams({ page: "1", pageSize: pageSize });
            refetchSDNList();
        }
    }, [searchText]);

    const handleSearch = () => {
        if (searchText.trim() !== "") {
            setSearchTextDebouce(searchText); // อัปเดตค่าที่จะใช้ค้นหา
            setSearchParams({ page: "1", pageSize: pageSize }); // รีเซ็ตหน้าเพจ
            refetchSDNList(); // เรียก API เพื่อค้นหาใหม่
        } else {
            showToast("warning", false);
        }
    };
    const {
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        register,
        control,
    } = useForm<PayLoadCreatSupplierDeliveryNote>({
    });

    return (
        <Box
            className={`w-full mt-4 bg-white border-0 rounded-md relative overflow-visible p-6 `}
        >
            {/* <Flex className="w-full" justify={"between"} gap="2" wrap="wrap">
                <InputAction
                    placeholder={"ค้นหา รายการส่งซ่อม"}
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    onAction={handleSearch}
                    labelOrientation={"horizontal"}
                    size={"2"}
                    defaultValue={""}
                    classNameInput="w-full"
                    iconLeft={<MagnifyingGlassIcon height="16" width="16" />}
                />
                <Buttons
                    btnType="default"
                    variant="outline"
                    onClick={handleSearch}
                    className="w-28"
                >
                    ค้นหา
                </Buttons>
            </Flex> */}
            <Flex className="w-full" justify={"between"} gap="2" wrap="wrap">
                <Text size="4" className="text-center mt-3">
                    รายการส่งซ่อม
                </Text>
            </Flex>
            <Table.Root className="mt-3 bg-[#fefffe] rounded-md overflow-hidden">
                <Table.Header className="sticky top-0 z-0 rounded-t-md">
                    <Table.Row className="text-center bg-main text-white sticky top-0 z-10">
                        {headers.map((header, index) => (
                            <Table.ColumnHeaderCell
                                key={index}
                                colSpan={header.colSpan}
                                className={`${index === 0 ? "rounded-tl-md" : ""}${index === headers.length - 1 ? "rounded-tr-md" : ""} h-7`}
                            >
                                {header.label}
                            </Table.ColumnHeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data.length > 0 ? (
                        <>
                            {data.map((row, rowIndex) => (
                                <Table.Row
                                    key={rowIndex}
                                    className={`hover:bg-gray-100 ${row.className || ""}`}
                                >
                                    {row.cells.map((cell, cellIndex) => (
                                        <Table.Cell
                                            key={cellIndex}
                                            className={cell.className}
                                        >
                                            {cell.value}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))}
                            {/* แถวสำหรับแสดง จำนวน + ราคารวม */}
                            <Table.Row className="bg-gray-200 font-bold">
                                <Table.Cell colSpan={4} className="text-center"></Table.Cell>
                                <Table.Cell className="text-center">
                                    {data.reduce((total, row) => {
                                        const quantityCell = row.cells[4];
                                        return total + (quantityCell && !isNaN(parseFloat(quantityCell.value)) ? parseFloat(quantityCell.value) : 0);
                                    }, 0).toLocaleString("th-TH")}
                                </Table.Cell>

                                <Table.Cell className="text-right">
                                    {data.reduce((total, row) => {
                                        const quantityCell = row.cells[5];
                                        return total + (quantityCell && !isNaN(parseFloat(quantityCell.value)) ? parseFloat(quantityCell.value) : 0);
                                    }, 0).toFixed(2)}
                                </Table.Cell>
                                <Table.Cell />
                            </Table.Row>
                        </>
                    ) : (
                        <Table.Row>
                            <Table.Cell
                                colSpan={headers.length}
                                className="text-center h-64 align-middle"
                            >
                                No Data Found
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
            <Box className="w-full mt-2">
                <PaginationWithLinks
                    page={parseInt(page)}
                    pageSize={parseInt(pageSize)}
                    totalCount={SDNListData?.responseObject?.totalCount ?? 0}
                    pageSizeSelectOptions={{
                        pageSizeOptions: [15, 25, 35, 50],
                    }}
                />
            </Box>

        </Box >
    );
}