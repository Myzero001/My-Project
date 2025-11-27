import React, { ReactNode, useEffect } from "react";
import {
  Table,
  Flex,
  Box,
  Text,
  IconButton,
  Badge,
  Select,
  Tabs,
} from "@radix-ui/themes";

import { LuPencil } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import InputAction from "@/components/customs/input/input.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useSearchParams } from "react-router-dom";
import { HiPlus } from "react-icons/hi";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import QuotationStatus from "../badges/quotationStatus";
import { TbFileDescription } from "react-icons/tb";
import CheckboxMainComponent from "../checkboxs/checkbox.main.component";
import BadgeStatus from "../badges/badgeStatus";
import PaymentStatus from "../badges/paymentStatus";

interface ExtendedInputProps {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  labelOrientation?: "horizontal" | "vertical";
  size?: "1" | "2" | "3";
  defaultValue?: string;
  nextFields?: Record<string, string>;
  onAction?: () => void;
  inputType?: "text" | "select";
  options?: Array<{ value: string; label: string }>;
}

interface MasterTableFeatureProps {
  title: string; // Title of the feature
  titleBtnName?: string; // title button name of the feature
  inputs: Array<{
    id: string; // Unique input ID
    placeholder?: string; // Input placeholder
    value: string; // Controlled value
    onChange: (value: string) => void; // Change handler
    label?: string; // Input label
    labelOrientation?: "horizontal" | "vertical"; // Orientation
    size?: "1" | "2" | "3"; // Size of the input
    defaultValue?: string; // Default value
    nextFields?: Record<string, string>; // Navigation fields
    onAction?: () => void; // Action when pressing Enter
    inputType?: "text" | "select"; // Add this new property
    options?: Array<{ value: string; label: string }>; // Add this for select options
    className?: string;
    headersTop?: ReactNode;
  }>;

  headers: Array<{ label: string; colSpan?: number; className?: string }>; // Table header configuration (supports nested headers and custom classes)
  rowData: Array<{
    className?: string; // Custom class for the row
    cells: Array<{
      value: any; // Cell content
      className?: string; // Custom class for the cell
      type?: "text" | "badge" | string;
      data?: any; //
      disable?: boolean; //
    }>;
    data: any;
  }>; // Row data with cell-level customization
  totalData?: number;
  onSearch?: () => void; // General action handler (e.g., submit or search)
  onView?: (data: any) => void; // Edit button handler
  onEdit?: (data: any) => void; // Edit button handler
  onDelete?: (data: any) => void; // Delete button handler
  onPopCreate?: (data: any) => void; // Pop Create button handler
  hideTitleBtn?: boolean;
  hideTitle?: boolean;
  hidePagination?: boolean;
  classNameTable?: string;
  onChangeValueCellItem?: (c: boolean, item: any) => void;
  headersContent?: ReactNode;
  tabs?: {
    label: string;
    value: string;
  }[];
  defaultValueTab?: string;
  onTabsValueChange?: (value: string) => void;
  classNameTableContent?: string;
}

const MasterTableFeature: React.FC<MasterTableFeatureProps> = ({
  title,
  titleBtnName,
  inputs,
  onSearch,
  headers,
  rowData,
  onView,
  onEdit,
  onDelete,
  onPopCreate,
  totalData,
  hideTitleBtn,
  hideTitle,
  classNameTable,
  hidePagination,
  onChangeValueCellItem,
  headersContent,
  tabs,
  defaultValueTab,
  onTabsValueChange,
  classNameTableContent,
}) => {
  // pagination
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";

  const RowDataByType = ({
    cell,
  }: {
    cell: {
      value: any;
      className?: string;
      type?: "text" | "badge" | string;
      data?: any;
      disable?: boolean;
    };
  }) => {
    if (cell.type === "badge-quotation-status") {
      return <QuotationStatus value={cell.value} />;
    }
    if (cell.type === "badge-payment-status") {
      return <PaymentStatus value={cell.value} />;
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

    return cell.value;
  };

  // useEffect(() => {
  //   const newSearchParams = new URLSearchParams(searchParams.toString());
  //   // const page = searchParams.get("page");
  //   const pageSize = searchParams.get("pageSize");
  //   newSearchParams.set("page", "1");

  //   // if (!page) {
  //   //   newSearchParams.set("page", "1");
  //   // }
  //   if (!pageSize) {
  //     newSearchParams.set("pageSize", "25");
  //   }
  //   setSearchParams(newSearchParams);
  // }, []);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // ตรวจสอบและตั้งค่า page, pageSize
    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    if (!page) {
      newSearchParams.set("page", "1");
    }
    if (!pageSize) {
      newSearchParams.set("pageSize", "25");
    }

    if (newSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(newSearchParams); // อัปเดต URL ใหม่
    }
  }, [searchParams, setSearchParams]); // ทำงานทุกครั้งที่ searchParams เปลี่ยนแปลง

  const renderInput = (input: ExtendedInputProps) => {
    if (input.inputType === "select") {
      return (
        <Select.Root value={input.value} onValueChange={input.onChange}>
          <Select.Trigger
            className="w-full h-[34px] px-[12px] text-[14px] bg-white border border-[#E2E8F0] rounded-[4px]"
            placeholder={input.placeholder}
          />
          <Select.Content>
            {input.options?.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="text-[14px] cursor-pointer hover:bg-[#F7F9FC] hover:text-black"
              >
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
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
        classNameInput="w-full text-[12px] xs:text-sm sm:text-[13px] text-wrap"
        iconLeft={<MagnifyingGlassIcon height="16" width="16" />}
      />
    );
  };

  return (
    <div className="container w-full m-auto">
      {!hideTitle && (
        <Flex justify={"between"} className="p-2">
          <Text size="6" weight="bold" className="text-center text-sm sm:text-2xl">
            {title}
          </Text>
          {!hideTitleBtn && (
            <Buttons
              btnType="default"
              variant="outline"
              onClick={onPopCreate}
              className=" align-middle text-sm sm:text-base"
            >
              <HiPlus />
              {titleBtnName}
            </Buttons>
          )}
        </Flex>
      )}

      <Box
        className={`w-full mt-4 bg-white border-0 rounded-md relative p-2 ${classNameTable}`}
      >
        {headersContent}
        <Flex className="w-full flex-col md:flex-row gap-2">
          {/* Input Area */}
          <Flex className="w-full md:w-[50%] 2xl:w-[40%] flex-initial flex-wrap md:flex-nowrap gap-2">
            {inputs.map((input, index) => (
              <Box
                key={index}
                className={`
                  ${input.id === "status_select" ? "w-full md:w-40" : "w-full md:max-w-[600px]"}
                `}
              >
                {renderInput(input)}
              </Box>
            ))}
          </Flex>

          {/* Search Button */}
          {onSearch && (
            <Box className="w-full md:w-28 ">
              <Buttons
                btnType="default"
                variant="outline"
                onClick={onSearch}
                className="w-full"
              >
                ค้นหา
              </Buttons>
            </Box>
          )}
        </Flex>
        {tabs && tabs?.length > 0 && (
          <Tabs.Root
            defaultValue={defaultValueTab ?? tabs[0].value}
            onValueChange={onTabsValueChange}
            className=" mb-4 mt-2"

          >
            <Tabs.List>
              {tabs?.map((tab) => (
                <Tabs.Trigger key={tab.value} value={tab.value}>
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        )}
        <div className={`flex w-full overflow-auto ${classNameTableContent}`}>
          <Table.Root className={`mt-3 bg-[#fefffe] rounded-md w-full `}>
            <Table.Header className="sticky top-0 z-0 rounded-t-md ">
              <Table.Row className="text-center bg-main text-white sticky top-0 z-10">
                {headers.map((header, index) => (
                  <Table.ColumnHeaderCell
                    key={index}
                    colSpan={header.colSpan}
                    className={`${index === 0 ? "rounded-tl-md" : ""}
                  ${index === headers?.length - 1 ? "rounded-tr-md" : ""}
                  h-7 ${header.className || ""} whitespace-nowrap`}
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
                    className={`hover:bg-gray-100  ${row.className || ""}`}
                  >
                    {row.cells.map((cell, colIndex) => (
                      <Table.Cell
                        key={colIndex}
                        className={`h-10 p-2 ${cell.className || ""}`}
                      >
                        <RowDataByType cell={cell} />
                      </Table.Cell>
                    ))}
                    {onView && (
                      <Table.Cell className="text-center w-16">
                        <IconButton
                          variant="ghost"
                          aria-label="View"
                          onClick={() => onView(row.data)}
                        >
                          <TbFileDescription style={{ fontSize: "18px" }} />
                        </IconButton>
                      </Table.Cell>
                    )}
                    {onEdit && (
                      <Table.Cell className="text-center w-16">
                        <IconButton
                          variant="ghost"
                          aria-label="Edit"
                          onClick={() => onEdit(row.data)}
                        >
                          <LuPencil style={{ fontSize: "18px" }} />
                        </IconButton>
                      </Table.Cell>
                    )}
                    {onDelete && (
                      <Table.Cell className="text-center w-16">
                        <IconButton
                          variant="ghost"
                          aria-label="Delete"
                          onClick={() => onDelete(row.data)}
                        >
                          <RiDeleteBin6Line
                            style={{ color: "red", fontSize: "18px" }}
                          />
                        </IconButton>
                      </Table.Cell>
                    )}
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
        </div>
        {!hidePagination && (
          <Box className="w-full mt-2">
            <PaginationWithLinks
              page={parseInt(page)}
              pageSize={parseInt(pageSize)}
              totalCount={totalData ?? 0}
              pageSizeSelectOptions={{
                pageSizeOptions: [15, 25, 35, 50],
              }}
            />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default MasterTableFeature;
