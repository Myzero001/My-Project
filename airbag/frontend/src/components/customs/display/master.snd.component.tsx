import React, { useEffect, useState } from "react";
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
import InputDatePicker from "@/components/customs/input/input.datePicker";
import CheckboxMainComponent from "../checkboxs/checkbox.main.component";
import BadgeStatus from "../badges/badgeStatus";
import { LuPencil } from "react-icons/lu";
import Buttons from "@/components/customs/button/button.main.component";
import QuotationStatus from "../badges/quotationStatus";//******** */
import InputAction from "@/components/customs/input/input.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { HiPlus } from "react-icons/hi";
import { getRepairReciptSelect } from "@/services/supplier-delivery-note.service.";


interface ExtendedInputProps {
    inputType?: "text" | "select" | "date";  //select for selectRepairRecipt


    id: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    labelOrientation?: "horizontal" | "vertical";
    className?: string;
    classNameInput?: string;
    classNameLabel?: string;
    size?: "1" | "2" | "3";
    defaultValue?: string;
    nextFields?: Record<string, string>;
    onAction?: () => void;
    options?: Array<{ value: string; label: string }>;
    require?: string;
    disabled?: boolean;
    type?:
    | "number"
    | "search"
    | "text"
    | "time"
    | "hidden"
    | "date"
    | "datetime-local"
    | "email"
    | "month"
    | "password"
    | "tel"
    | "url"
    | "week"
    | undefined;
    maxLength?: number;



}
interface SDNComponentProps {
    title: string; // Title of the feature
    titleBtnName?: string; // title button name of the feature
    hideTitleBtn?: boolean;
    hideTitle?: boolean;

    //inputs + select
    hideInput?: boolean;
    inputs: Array<{
        id: string; // Unique input ID
        placeholder?: string; // Input placeholder
        value: string; // Controlled value
        require?: string;
        disabled?: boolean;
        className?: string;
        classNameInput?: string;
        classNameLabel?: string;
        maxLength?: number;
        type?:
        | "number"
        | "search"
        | "text"
        | "time"
        | "hidden"
        | "date"
        | "datetime-local"
        | "email"
        | "month"
        | "password"
        | "tel"
        | "url"
        | "week"
        | undefined; onChange: (value: string) => void; // Change handler
        label?: string; // Input label
        labelOrientation?: "horizontal" | "vertical"; // Orientation
        size?: "1" | "2" | "3"; // Size of the input
        defaultValue?: string; // Default value
        nextFields?: Record<string, string>; // Navigation fields
        onAction?: () => void; // Action when pressing Enter
        inputType?: "text" | "select" | "date"; // Add this new property
        options?: Array<{ value: string; label: string }>; // Add this for select options
    }>;
    //table
    headers: Array<{ label: string; colSpan?: number; className?: string }>; // Table header configuration (supports nested headers and custom classes)
    rowData: Array<{
        className?: string; // Custom class for the row
        cells: Array<{
            value: any; // Cell content
            className?: string; // Custom class for the cell
            type?: "text" | "badge" | string;
            data?: any; //
            disable?: boolean; //
            openEdit?: boolean;
        }>;
        data: any;
    }>; // Row data with cell-level customization
    classNameTable?: string;
    onChangeValueCellItem?: (c: boolean, item: any) => void;
    onChangeValueCellItemInput?: (item: any) => void;
    onEdit?: (item: any) => void;
    buttonAllHidden?: boolean;
    buttonDeleteHidden?: boolean;
    onSubmit?: () => void;
    onDelete?: () => void;

}
const SDNComponent: React.FC<SDNComponentProps> = ({
    title,
    titleBtnName,
    hideTitleBtn,
    hideTitle,
    inputs,
    headers,
    rowData,
    classNameTable,
    onChangeValueCellItem,
    onChangeValueCellItemInput,
    buttonAllHidden,
    buttonDeleteHidden,
    onSubmit,
    onDelete,

}) => {

    const RowDataByType = ({
        cell,
        openEdit,
    }: {
        cell: {
            value: any;
            className?: string;
            type?: "text" | "badge" | string;
            data?: any;
            disable?: boolean;
        };
        openEdit?: boolean;
    }) => {
        if (cell.type === "badge-quotation-status") {
            return <QuotationStatus value={cell.value} />;
        }
        if (cell.type === "badge-status") {
            return <BadgeStatus value={cell.value} />;
        }
        if (cell.type === "checkbox") {
            return (
                <Box className=" w-full flex justify-center">
                    <CheckboxMainComponent
                        defaultChecked={cell.value}
                        onChange={(c) =>
                            onChangeValueCellItem && onChangeValueCellItem(c, cell.data)
                        }
                        disabled={cell.disable}
                    />
                </Box>
            );
        }
        if (cell.type === "edit" && !openEdit) {
            return (
                <IconButton
                    variant="ghost"
                    aria-label="Edit"
                    onClick={() => console.log("Edit:", cell.data)}
                >
                    <LuPencil style={{ fontSize: "18px" }} />
                </IconButton>
            );
        }
        if (cell.type === "input") {
            return (
                <InputAction
                    value={cell.value}
                    onChange={() =>
                        onChangeValueCellItemInput && onChangeValueCellItemInput(cell.data)
                    }
                    labelOrientation="vertical" // หรือ "horizontal"
                    size="2"
                    classNameInput="text-right"
                />
            );
        }
        return cell.value;
    };
    const renderInput = (input: ExtendedInputProps) => {
        if (input.inputType === "select") {
            const [errorMessage, setErrorMessage] = useState("");

            const handleSelectChange = (selectedOption: any) => {
                if (selectedOption) {
                    input.onChange(selectedOption.value);
                    console.log("Selected Option:", selectedOption);
                    setErrorMessage("");  // เคลียร์ข้อความ error เมื่อมีการเลือก
                } else {
                    input.onChange("");
                    setErrorMessage("กรุณาเลือกตัวเลือก");  // แสดงข้อความ error
                }
            }

            return (
                <MasterSelectComponent
                    fetchDataFromGetAPI={getRepairReciptSelect}
                    label={input.label || ""}
                    placeholder="กรุณาเลือก..."
                    className="p-[-24px]"
                    classNameSelect="w-4/12 min-w-[200px] "
                    valueKey="id"
                    labelKey="repair_receipt_doc"
                    // onChange={(option) => {
                    //     const value = option ? String(option.value) : null;
                    //     setSelectedOption(value);
                    // }}
                    onChange={handleSelectChange}
                    errorMessage={errorMessage}
                />
            );
        }
        if (input.type === "date") {
            return (
                <InputDatePicker
                    id={input.id}
                    labelName={input.label || ""}
                    onchange={(date) => input.onChange(date?.toISOString() || "")}
                    defaultDate={input.defaultValue ? new Date(input.defaultValue) : undefined}
                    disabled={input.disabled || false}
                />
            );
        }
        return (
            <InputAction
                id={input.id}
                placeholder={input.placeholder || ""}
                value={input.value}
                onChange={(e) => input.onChange(e.target.value)}
                label={input.label || ""}
                labelOrientation={input.labelOrientation || "horizontal"}
                size={input.size || "2"}
                defaultValue={input.defaultValue || ""}
                nextFields={input.nextFields || {}}
                onAction={input.onAction}
                classNameInput="w-full"
                disabled={input.disabled || false}
            // iconLeft={<MagnifyingGlassIcon height="16" width="16" />}
            />
        );
    };

    return (
        <>
            <Box
                className={`w-full mt-4 bg-white border-0 rounded-md relative overflow-visible p-6 ${classNameTable}`}
            >
                <Flex className="w-full" justify={"between"} gap="2" wrap="wrap">
                    <Grid
                        columns={{ initial: "1", sm: "2", md: "3", lg: "3", xl: "3" }}
                        gap="3"
                        rows="1"
                        width="auto"
                    >
                        {inputs.map((input, index) => (
                            <Box
                                key={index}
                                className={
                                    input.id === "status_select" ? "w-40" : "w-full"
                                }
                            >
                                {renderInput(input)}
                            </Box>
                        ))}
                    </Grid>
                </Flex>
                {!hideTitle && (
                    <Flex >
                        <Text size="4" className="text-center mt-3">
                            {title}
                        </Text>
                        {!hideTitleBtn && (
                            <Buttons
                                btnType="default"
                                variant="outline"
                                // onClick={onPopCreate}
                                className="min-w-32 align-middle m-2"
                            >
                                <HiPlus />
                                {titleBtnName}
                            </Buttons>
                        )}
                    </Flex>
                )}
                <Table.Root className="mt-3 bg-[#fefffe] rounded-md overflow-hidden">
                    <Table.Header className="sticky top-0 z-0 rounded-t-md">
                        <Table.Row className="text-center bg-main text-white sticky top-0 z-10">
                            {headers.map((header, index) => (
                                <Table.ColumnHeaderCell
                                    key={index}
                                    colSpan={header.colSpan}
                                    className={`${index === 0 ? "rounded-tl-md" : ""}${index === headers?.length - 1 ? "rounded-tr-md" : ""
                                        } h-7 ${header.className || ""}`}
                                >
                                    {header.label}
                                </Table.ColumnHeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {rowData.length > 0 ? (
                            rowData.map((row, rowIndex) => (
                                <Table.Row
                                    key={rowIndex}
                                    className={`hover:bg-gray-100 ${row.className || ""}`}
                                >
                                    {/* คอลัมน์แรกที่แสดงปุ่ม Edit */}
                                    {row.cells.map((cell, colIndex) => (
                                        <Table.Cell
                                            key={colIndex}
                                            className={`h-10 p-2 ${cell.className || ""}`}
                                        >
                                            <RowDataByType cell={cell} />
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell
                                    colSpan={headers.length + 2}
                                    className="text-center h-64 align-middle"
                                >
                                    No Data Found
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table.Root>
                {/* ปุ่ม */}
                {!buttonAllHidden && (
                    <Flex className="w-full mt-6" justify={"end"} gap="4" wrap="wrap">
                        {!buttonDeleteHidden && (
                            < Buttons btnType="delete" onClick={onDelete} className="w-[100px] max-sm:w-full mt-0">
                                ลบข้อมูล
                            </Buttons>
                        )}
                        <Buttons btnType="submit" onClick={onSubmit} className="w-[100px] max-sm:w-full mt-0">
                            บันทึกข้อมูล
                        </Buttons>
                    </Flex>)}
            </Box>
        </>
    )
}
export default SDNComponent