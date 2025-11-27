
import { useState } from "react";
import { updateIssueReason } from "@/services/issueReason.service";
import * as Dialog from "@radix-ui/react-dialog";
import { Button, Flex, TextField, Text } from "@radix-ui/themes";

import { useToast } from "@/components/customs/alert/ToastContext";

//select
import MasterSelectComponent, { OptionType } from "@/components/customs/select/select";
import { getMsTypeGroupIssueReason } from "@/services/select_msTypeIssueReasonGroup";


type DialogEditIssueReasonProps = {
  issue_reason_id: string;
  issue_fixed_reason: string;
  issue_group: string;
  onEditIssueReason: () => void;
  onClose: () => void;
};

const EditIssueReason = ({
  issue_fixed_reason,
  issue_reason_id,
  issue_group,
  onEditIssueReason,
  onClose,
}: DialogEditIssueReasonProps) => {
  const [postIssueReasonName, setPostIssueReasonName] = useState(issue_fixed_reason);
  const [postIssueReasongroup, setPostIssueReasongroup] = useState(issue_group);
  // const [issueOptions, setIssueOptions] = useState<OptionType[]>([]); // เปลี่ยนให้เป็น OptionType
  // const [issueGroup, setIssueGroup] = useState("");
  const { showToast } = useToast();

  const handleEditIssueReason = async () => {
    if (!postIssueReasonName || !postIssueReasongroup) { // ตรวจสอบให้แน่ใจว่ามีค่าทั้งสอง
      showToast("กรุณาระบุประเภทสาเหตุและรายการสาเหตุให้ครบถ้วน", false);
      return;
    }
    try {
      const response = await updateIssueReason({
        // @ts-ignore
        issue_fixed_reason: postIssueReasonName,
        issue_group: postIssueReasongroup, // ส่งค่าที่อัปเดตแล้ว
        issue_reason_id: issue_reason_id,
      });
      if (response.statusCode === 200) {
        setPostIssueReasonName("");
        setPostIssueReasongroup(""); // เคลียร์ค่าหลังจากบันทึก
        onEditIssueReason();
        onClose();
        showToast(`อัปเดตรายการสาเหตุเป็น"${postIssueReasonName}" สําเร็จ`, true);

      } else {
        showToast(`ไม่สามารถอัปเดตรายการสาเหตุ  "${postIssueReasonName}" ซ้ำได้!`, false);
        // console.error(response.statusCode);
      }
    } catch (error) {
      showToast(`ไม่สามารถอัปเดตรายการสาเหตุ "${postIssueReasonName}" ได้!`, false);
      // console.error(error);
    }
  };

  //-----------------------------------ตัวเลือกประเภทสาเหตุ ใช้มาสเตอร์ select-----------------------------------------------------
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  const handleSelectChange = (option: OptionType | null) => {
    setSelectedOption(option);
    console.log('Selected Option:', option); // ตรวจสอบค่าที่เลือก
    setPostIssueReasongroup(selectedOption ? selectedOption.value : ""); // เก็บค่า value ของประเภทสาเหตุ

  };

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-5" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[500px] h-auto">
          {/* ส่วนหัวของ Dialog */}
          <Dialog.Title className="w-full bg-blue-600 text-white p-2 flex justify-between items-center rounded-t-lg">
            <Text as="div" size="4" weight="bold" className="ml-3">
              แก้ไขรายการสาเหตุใหม่
            </Text>
            <Dialog.Close asChild>
              <Button className="text-white hover:text-gray-300 text-3xl">
                &times;
              </Button>
            </Dialog.Close>
          </Dialog.Title>

          {/* Content */}
          <Flex direction="column" gap="1" className="mt-8 ml-6 ">
            {/* เลือกประเภทสาเหตุ */}
            <Flex align="center" gap="3" className="ml-3">
              <Text as="div" size="2" weight="bold" className="mb-3">
                ประเภทสาเหตุ
              </Text>

              <MasterSelectComponent
                onChange={handleSelectChange} // ฟังก์ชันเมื่อเปลี่ยนตัวเลือก
                valueKey="type_issue_group_name" // คีย์สำหรับ value
                labelKey="type_issue_group_name" // คีย์สำหรับ label
                fetchDataFromGetAPI={getMsTypeGroupIssueReason} // ฟังก์ชันดึงข้อมูล
                placeholder={postIssueReasongroup ? `${postIssueReasongroup}` : "กรุณาเลือกรายการ"} // ตรวจสอบเงื่อนไข
                showOptionsList={true} // เปิดการแสดงรายการตัวเลือก
                className="p-1 ml-4 text-left w-[310px] mb-3"
              />
            </Flex>

            {/* รายการสาเหตุ */}
            <Flex align="center" gap="3" className="ml-3 mt-2 mb-3">
              <Text as="div" size="2" weight="bold" className="mb-3">
                รายการสาเหตุ
              </Text>
              <TextField.Root
                type="text" // ระบุชนิดของฟิลด์ก่อน
                value={postIssueReasonName} // ค่าที่แสดงในฟิลด์
                onChange={(e) => setPostIssueReasonName(e.target.value)} // ฟังก์ชันที่ทำงานเมื่อมีการเปลี่ยนแปลงค่า
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEditIssueReason(); // ฟังก์ชันที่ทำงานเมื่อกด Enter
                  }
                }}
                placeholder="สาเหตุ" // ข้อความแสดงในช่องเมื่อไม่มีค่า
                autoFocus // ตั้งให้โฟกัสอัตโนมัติเมื่อโหลดหน้า
                className="p-2 ml-4 text-left w-8/12 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 active:ring-2 active:ring-blue-500"
                />

            </Flex>
          </Flex>

          {/* Footer Buttons */}
          <Flex
            gap="3"
            justify="between"
            className="ml-5 mr-5 mb-5 border-t border-gray-200 pt-3"
          >
            <Dialog.Close asChild>
              <Button
                size="2"
                onClick={onClose}
                className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-gray-200"
              >
                ยกเลิก
              </Button>
            </Dialog.Close>
            <Button
              size="2"
              onClick={handleEditIssueReason}
              className="px-4 py-2 text-white bg-[#198754] rounded-lg hover:bg-[#28a745]"
            >
              บันทึกข้อมูล
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditIssueReason;
