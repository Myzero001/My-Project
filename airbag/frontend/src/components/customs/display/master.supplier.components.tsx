import React, { useState } from "react";
import { Table, Flex, Box, Checkbox, Grid } from "@radix-ui/themes";
import InputAction from "@/components/customs/input/input.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import InputDatePicker from "@/components/customs/input/input.datePicker";

interface MasterTableFeatureProps {
    inputs: Array<{
        id: string;
        type?: "text" | "date" | "number";
        placeholder?: string;
        value: string;
        onChange: (value: string) => void;
        label?: string;
        labelOrientation?: "horizontal" | "vertical";
        size?: "1" | "2" | "3";
        defaultValue?: string;
        classNameInput?: string;
        classNameLabel?: string;
        nextFields?: Record<string, string>;
        onAction?: () => void;
        disabled?: boolean;
        maxLength?: number;
        hidden?: boolean;
    }>;

    headers: Array<{ label: string; colSpan?: number; className?: string }>;
    // rowData: Array<{
    //     className?: string;
    //     cells: Array<{
    //         value: any;
    //         className?: string;
    //         type?: "text" | "badge" | string;
    //     }>;
    //     data: any;
    //     isChecked?: boolean;
    // }>;
    rowData: Array<{
        className?: string; // Custom class for the row
        cells: Array<{
            value: any; // Cell content
            className?: string; // Custom class for the cell
            type?: "text" | "badge" | string;
            data?: any; //
            disable?: boolean; //
            disabled?: boolean; 
        }>;
        data: any;
    }>;
    totalData?: number;

    onDelete?: () => void;
    onSubmit?: () => void;
    onCheckBoxChange?: (args: { checked: boolean; rowData: any }) => void;
    checkboxColumnIndex?: number;
    checkboxLabel?: string;
    colInput?: number;

    inputHidden?: boolean;
    remarkBoxHidden?: boolean;
    tableHidden?: boolean;
    buttonDeleteHidden?: boolean;

    colSpanInput_InGrid?: number;
    showDeleteButton?: boolean;
    isSubmitting?: boolean;
}

const SupplierComponent: React.FC<MasterTableFeatureProps> = ({
    inputs,
    onSubmit,
    onDelete,
    headers,
    rowData: initialRowData,
    totalData,
    onCheckBoxChange,
    checkboxColumnIndex = -1,
    checkboxLabel,
    colInput,
    showDeleteButton = true,
    isSubmitting = false
}) => {
    const [rowData, setRowData] = useState(initialRowData || []);

    const getModifiedHeaders = (
        headers: any[],
        checkboxColumnIndex: number,
        checkboxLabel: string
    ) => {
        const modifiedHeaders = [...headers];
        if (checkboxColumnIndex >= 0) {
            modifiedHeaders.splice(checkboxColumnIndex, 0, {
                label: checkboxLabel || "สถานะ",
                className: "text-center",
            });
        }
        return modifiedHeaders;
    };

    const LabelCheckBox = checkboxLabel || "สถานะ";
    const modifiedHeaders = getModifiedHeaders(
        headers,
        checkboxColumnIndex,
        LabelCheckBox
    );

    return (
        <div className="container w-full m-auto">
            {/* Form Section */}
            <Box className="w-full  bg-white border-0 rounded-md relative overflow-visible p-6">
                {/* ช่องกรอกด้านบน */}
                <Grid
                    columns={{ initial: "1", sm: "2", md: "3", lg: "3", xl: "3" }}
                    gap="3"
                    rows="1"
                    width="auto"
                    className="mb-6"
                >
                    {inputs.map((input, index) => {
                        if (input.hidden) {
                            return <div key={`empty-${index}`} className="hidden sm:block" />;
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
                                key={index}
                                id={input.id}
                                placeholder={input.placeholder || ""}
                                value={input.value}
                                onChange={(e) => input.onChange(e.target.value)}
                                label={input.label || ""}
                                size={input.size || "2"}
                                defaultValue={input.defaultValue || ""}
                                nextFields={input.nextFields || {}}
                                onAction={input.onAction}
                                classNameInput="w-full"
                                disabled={input.disabled || false}
                                type={input.type}
                                maxLength={input.maxLength}
                            />
                        );
                    })}
                </Grid>

                {/* ตารางข้อมูล */}
                <Table.Root className="mt-3 bg-[#fefffe] rounded-md overflow-hidden">
                    {/* Table Header */}
                    <Table.Header className="sticky top-0 z-0 rounded-t-md">
                        <Table.Row className="text-center bg-main text-white sticky top-0 z-10">
                            {modifiedHeaders.map((header, index) => (
                                <Table.ColumnHeaderCell
                                    key={index}
                                    colSpan={header.colSpan}
                                    className={` whitespace-nowrap ${index === 0 ? "rounded-tl-md" : ""}${index === modifiedHeaders.length - 1 ? "rounded-tr-md" : ""} h-7 ${header.className || ""}`}
                                >
                                    {header.label}
                                </Table.ColumnHeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>

                    {/* Table Body */}
                    <Table.Body>
                        {rowData.length > 0 ? (
                            rowData.map((row, rowIndex) => (
                                <Table.Row key={rowIndex} className={`hover:bg-gray-100 ${row.className || ""}`}>
                                    {row.cells.map((cell, colIndex) => {

                                        //input ในตาราง
                                        if (colIndex === colInput) {
                                            return (
                                                <Table.Cell key={colIndex} className={`h-10 p-2 ${cell.className || ""}`}>
                                                    <InputAction
                                                        id={`input-${colIndex}`} // ตั้งชื่อ id ที่ไม่ซ้ำ
                                                        placeholder={cell.value || "-"} // แสดงค่าจาก cell
                                                        value={cell.value} // ใช้ค่า value ของ cell
                                                        onChange={(e) => {
                                                            const updatedRowData = [...rowData];
                                                            updatedRowData[rowIndex].cells[colIndex].value = e.target.value;
                                                            setRowData(updatedRowData);
                                                        }}
                                                        size="2" // ขนาดของ input
                                                        classNameInput="w-full text-right" // กำหนดขนาด input
                                                        disabled={false} // ปิดการใช้งาน input
                                                        type="number" // กำหนดประเภทเป็น text
                                                    />
                                                </Table.Cell>
                                            );
                                        }

                                        // checkbox ในตาราง
                                        if (colIndex === checkboxColumnIndex) {
                                            return (
                                                <Table.Cell key={colIndex} className="text-center w-1/12">
                                                    <Checkbox
                                                        aria-label={`Row ${rowIndex + 1} Status`}
                                                        checked={cell.value.isChecked || false}
                                                        disabled={cell.disabled} // เพิ่มการรับค่า disabled
                                                        onCheckedChange={(checked) => {
                                                            // ถ้า disabled ให้ไม่ทำงาน
                                                            if (cell.disabled) return;
                                                            
                                                            const updatedRowData = [...rowData];
                                                            updatedRowData[rowIndex].cells[colIndex].value.isChecked = !!checked;
                                                            setRowData(updatedRowData);
                                                            if (onCheckBoxChange) {
                                                                onCheckBoxChange({
                                                                    checked: !!checked,
                                                                    rowData: updatedRowData[rowIndex],
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </Table.Cell>
                                            );
                                        } else {
                                            return (
                                                <Table.Cell key={colIndex} className={`h-10 p-2 ${cell.className || ""}`}>
                                                    {cell.value}
                                                </Table.Cell>
                                            );
                                        }
                                    })}
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan={headers.length} className="text-center h-64 align-middle">
                                    No Data Found
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table.Root>

                {/* ปุ่ม */}
                <Flex className="w-full p-5" justify={"end"} gap="4" wrap="wrap">
                    {showDeleteButton && (
                        <Buttons btnType="delete" onClick={onDelete} className="w-[100px] max-sm:w-full">
                            ลบข้อมูล
                        </Buttons>
                    )}
                    <Buttons 
                    btnType="submit" 
                    onClick={onSubmit} 
                    disabled={isSubmitting}
                    className={`w-[100px] max-sm:w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    บันทึกข้อมูล
                </Buttons>
                </Flex>
            </Box>
        </div>
    );
};

export default SupplierComponent;
// import React, { useState } from "react";
// import { Table, Flex, Box, Checkbox, Grid, IconButton } from "@radix-ui/themes";
// import InputAction from "@/components/customs/input/input.main.component";
// import Buttons from "@/components/customs/button/button.main.component";
// import InputDatePicker from "@/components/customs/input/input.datePicker";
// import CheckboxMainComponent from "../checkboxs/checkbox.main.component";
// import BadgeStatus from "../badges/badgeStatus";
// import QuotationStatus from "../badges/quotationStatus";
// import { LuPencil } from "react-icons/lu";


// interface MasterTableFeatureProps {
//     inputs: Array<{
//         id?: string;
//         type?: "text" | "date" | "number";
//         placeholder?: string;
//         value: string;
//         onChange: (value: string) => void;
//         label?: string;
//         labelOrientation?: "horizontal" | "vertical";
//         size?: "1" | "2" | "3";
//         defaultValue?: string;
//         classNameInput?: string;
//         classNameLabel?: string;
//         nextFields?: Record<string, string>;
//         onAction?: () => void;
//         disabled?: boolean;
//         maxLength?: number;
//         hidden?: boolean;
//     }>;
//     headers?: Array<{ label: string; colSpan?: number; className?: string }>;
//     rowData?: Array<{
//         className?: string; // Custom class for the row
//         cells: Array<{
//             value: any; // Cell content
//             className?: string; // Custom class for the cell
//             type?: "text" | "badge" | string;
//             data?: any; //
//             disable?: boolean; //
//         }>;
//         data: any;
//     }>;
//     totalData?: number;

//     onEdit?: (data: any) => void;
//     onEditColIndex?: number;
//     onDelete?: () => void;
//     onSubmit?: () => void;
//     onCheckBoxChange?: (args: { checked: boolean; rowData: any }) => void;
//     checkboxColumnIndex?: number;
//     checkboxLabel?: string;
//     colInput?: number;
//     //
//     inputHidden?: boolean;
//     remarkBoxHidden?: Array<{
//         label?: string;
//         labelOrientation?: "horizontal" | "vertical";
//         size?: "1" | "2" | "3";
//         defaultValue?: string;
//         classNameInput?: string;
//         classNameLabel?: string;
//         placeholder?: string;
//         register?: string;
//         msgError?: string;
//     }>
//     tableHidden?: boolean;
//     buttonDeleteHidden?: boolean;
//     buttonAllHidden?: boolean;

//     colSpanInput_InGrid?: number;
//     onChangeValueCellItem?: (c: boolean, item: any) => void;
//     onEditLabel?: string;

// }

// const SupplierComponent: React.FC<MasterTableFeatureProps> = ({
//     inputs,
//     onSubmit,
//     onDelete,
//     headers,
//     rowData: initialRowData,
//     totalData,
//     onCheckBoxChange,
//     checkboxColumnIndex = -1,
//     checkboxLabel,
//     colInput,

//     onEditColIndex = -1,
//     onEditLabel,
//     remarkBoxHidden,
//     inputHidden,
//     tableHidden,
//     buttonDeleteHidden,
//     onChangeValueCellItem,
//     onEdit,
//     buttonAllHidden
// }) => {
//     const [rowData, setRowData] = useState(initialRowData || []);
//     const RowDataByType = ({
//         cell,
//     }: {
//         cell: {
//             value: any;
//             className?: string;
//             type?: "text" | "badge" | string;
//             data?: any;
//             disable?: boolean;
//         };
//     }) => {
//         if (cell.type === "badge-quotation-status") {
//             return <QuotationStatus value={cell.value} />;
//         }
//         if (cell.type === "badge-status") {
//             return <BadgeStatus value={cell.value} />;
//         }
//         if (cell.type === "checkbox") {
//             return (
//                 <Box className=" w-full flex justify-center">
//                     <CheckboxMainComponent
//                         defaultChecked={cell.value}
//                         onChange={(c) =>
//                             onChangeValueCellItem && onChangeValueCellItem(c, cell.data)
//                         }
//                         disabled={cell.disable}
//                     />
//                 </Box>
//             );
//         }

//         return cell.value;
//     };


//     const getModifiedHeaders = (
//         headers: any[] = [],
//         checkboxColumnIndex: number,
//         checkboxLabel: string,
//         onEditColIndex: number,
//         onEditLabel: string
//     ) => {
//         const modifiedHeaders = [...headers];

//         // เพิ่มคอลัมน์สำหรับ Checkbox
//         if (checkboxColumnIndex >= 0) {
//             modifiedHeaders.splice(checkboxColumnIndex, 0, {
//                 label: checkboxLabel || "สถานะ",
//                 className: "text-center",
//             });
//         }

//         // เพิ่มคอลัมน์สำหรับ Edit
//         if (onEditColIndex >= 0) {
//             modifiedHeaders.splice(onEditColIndex, 0, {
//                 label: onEditLabel || "แก้ไข",
//                 className: "text-center",
//             });
//         }

//         return modifiedHeaders;
//     };

//     const modifiedHeaders = getModifiedHeaders(
//         headers,
//         checkboxColumnIndex,
//         checkboxLabel || "สถานะ",
//         onEditColIndex,
//         onEditLabel || "แก้ไข"
//     );


//     return (
//         <div className="container w-full m-auto">
//             {/* Form Section */}
//             <Box className="w-full  bg-white border-0 rounded-md relative overflow-visible pt-6">
//                 {/* ช่องกรอกด้านบน */}
//                 <Grid
//                     columns={{ initial: "1", sm: "2", md: "3", lg: "3", xl: "3" }}
//                     gap="3"
//                     rows="1"
//                     width="auto"
//                     className="mb-9"
//                 >
//                     {!inputHidden && (
//                         <>
//                             {
//                                 inputs.map((input, index) => {
//                                     if (input.hidden) {
//                                         return <div key={`empty-${index}`} className="hidden sm:block" />;
//                                     }

//                                     if (input.type === "date") {
//                                         return (
//                                             <InputDatePicker
//                                                 id={input.id}
//                                                 labelName={input.label || ""}
//                                                 onchange={(date) => input.onChange(date?.toISOString() || "")}
//                                                 defaultDate={input.defaultValue ? new Date(input.defaultValue) : undefined}
//                                                 disabled={input.disabled || false}
//                                             />
//                                         );
//                                     }
//                                     return (
//                                         <InputAction
//                                             key={index}
//                                             id={input.id}
//                                             placeholder={input.placeholder || ""}
//                                             value={input.value}
//                                             onChange={(e) => input.onChange(e.target.value)}
//                                             label={input.label || ""}
//                                             size={input.size || "2"}
//                                             defaultValue={input.defaultValue || ""}
//                                             nextFields={input.nextFields || {}}
//                                             onAction={input.onAction}
//                                             classNameInput={input.classNameInput}
//                                             disabled={input.disabled || false}
//                                             type={input.type}
//                                             maxLength={input.maxLength}
//                                         />
//                                     );
//                                 })
//                             }
//                         </>
//                     )}
//                 </Grid>

//                 {/* ตารางข้อมูล */}
//                 {!tableHidden && (
//                     <Table.Root className="bg-[#fefffe] rounded-md overflow-hidden mt-[-40px]">
//                         {/* Table Header */}
//                         <Table.Header className="sticky top-0 z-0 rounded-t-md">
//                             <Table.Row className="text-center bg-main text-white sticky top-0 z-10">
//                                 {modifiedHeaders.map((header, index) => (
//                                     <Table.ColumnHeaderCell
//                                         key={index}
//                                         colSpan={header.colSpan}
//                                         className={`${index === 0 ? "rounded-tl-md" : ""}${index === modifiedHeaders.length - 1 ? "rounded-tr-md" : ""} h-7 ${header.className || ""}`}
//                                     >
//                                         {header.label}
//                                     </Table.ColumnHeaderCell>
//                                 ))}
//                             </Table.Row>
//                         </Table.Header>

//                         {/* Table Body */}
//                         <Table.Body>
//                             {rowData.length > 0 ? (
//                                 rowData.map((row, rowIndex) => (
//                                     <Table.Row key={rowIndex} className={`hover:bg-gray-100 ${row.className || ""}`}>
//                                         {row.cells.map((cell, colIndex) => {
//                                             // Input ในตาราง
//                                             if (colIndex === colInput) {
//                                                 return (
//                                                     <Table.Cell key={colIndex} className={`h-10 p-2 ${cell.className || ""}`}>
//                                                         <InputAction
//                                                             id={`input-${colIndex}`} // ตั้งชื่อ id ที่ไม่ซ้ำ
//                                                             placeholder={cell.value || "-"} // แสดงค่าจาก cell
//                                                             value={cell.value} // ใช้ค่า value ของ cell
//                                                             onChange={(e) => {
//                                                                 const updatedRowData = [...rowData];
//                                                                 updatedRowData[rowIndex].cells[colIndex].value = e.target.value;
//                                                                 setRowData(updatedRowData);
//                                                             }}
//                                                             size="2" // ขนาดของ input
//                                                             classNameInput="w-full text-right" // กำหนดขนาด input
//                                                             disabled={false} // ปิดการใช้งาน input
//                                                             type="number" // กำหนดประเภทเป็น number
//                                                         />
//                                                     </Table.Cell>
//                                                 );
//                                             }

//                                             // Checkbox ในตาราง
//                                             if (colIndex === checkboxColumnIndex) {
//                                                 return (
//                                                     <Table.Cell key={colIndex} className="text-center w-1/12">
//                                                         <Checkbox
//                                                             aria-label={`Row ${rowIndex + 1} Status`}
//                                                             checked={cell.value.isChecked || false}
//                                                             onCheckedChange={(checked) => {
//                                                                 const updatedRowData = [...rowData];
//                                                                 updatedRowData[rowIndex].cells[colIndex].value.isChecked = !!checked;
//                                                                 setRowData(updatedRowData);
//                                                                 if (onCheckBoxChange) {
//                                                                     onCheckBoxChange({
//                                                                         checked: !!checked,
//                                                                         rowData: updatedRowData[rowIndex],
//                                                                     });
//                                                                 }
//                                                             }}
//                                                         />
//                                                     </Table.Cell>
//                                                 );
//                                             }
//                                             if (colIndex === onEditColIndex && onEdit) {
//                                                 return (
//                                                     <Table.Cell key={colIndex} className="text-center w-16">
//                                                         <IconButton
//                                                             variant="ghost"
//                                                             aria-label="Edit"
//                                                             onClick={() => onEdit(row.data)}
//                                                         >
//                                                             <LuPencil style={{ fontSize: "18px" }} />
//                                                         </IconButton>
//                                                     </Table.Cell>
//                                                 );
//                                             }

//                                             // ค่า default สำหรับ cell
//                                             return (
//                                                 <Table.Cell key={colIndex} className={`h-10 p-2 ${cell.className || ""}`}>
//                                                     {cell.value}
//                                                 </Table.Cell>
//                                             );
//                                         })}

//                                     </Table.Row>
//                                 ))
//                             ) : (
//                                 <Table.Row>
//                                     <Table.Cell colSpan={headers?.length} className="text-center h-64 align-middle">
//                                         No Data Found
//                                     </Table.Cell>
//                                 </Table.Row>
//                             )}
//                         </Table.Body>

//                     </Table.Root>
//                 )}
//                 {/* ปุ่ม */}
//                 {!buttonAllHidden && (
//                     <Flex className="w-full mt-6" justify={"end"} gap="4" wrap="wrap">
//                         {!buttonDeleteHidden && (
//                             < Buttons btnType="delete" onClick={onDelete} className="w-[100px] max-sm:w-full mt-0">
//                                 ลบข้อมูล
//                             </Buttons>
//                         )}
//                         <Buttons btnType="submit" onClick={onSubmit} className="w-[100px] max-sm:w-full mt-0">
//                             บันทึกข้อมูล
//                         </Buttons>
//                     </Flex>)}
//             </Box>
//         </div >
//     );
// };

// export default SupplierComponent;
