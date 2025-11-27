import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button, Flex, TextField, Text } from "@radix-ui/themes";

import { postIssueReason } from "@/services/issueReason.service";
import { getMsTypeGroupIssueReason } from "@/services/select_msTypeIssueReasonGroup"; // เพิ่มการนำเข้า
// import * as Toast from "@radix-ui/react-toast";
import MasterSelectComponent, { OptionType } from "@/components/customs/select/select";

import { useToast } from "@/components/customs/alert/ToastContext";

type DialogAddIssueReasonProps = {
  getIssueReasonsData: Function;
};

const DialogAdd = ({ getIssueReasonsData }: DialogAddIssueReasonProps) => {
  const [postIssueReasonName, setPostIssueReasonName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [issueOptions, setIssueOptions] = useState<OptionType[]>([]); // เปลี่ยนให้เป็น OptionType
  const [issueGroup, setIssueGroup] = useState(""); // กำหนดค่าเริ่มต้นของประเภทสาเหตุ


  const { showToast } = useToast();

  // ฟังก์ชันเพื่อดึงข้อมูลประเภทสาเหตุ
  const getSelect = async () => {
    try {
      const res = await getMsTypeGroupIssueReason();
      setIssueOptions(res.responseObject); // เก็บตัวเลือกประเภทสาเหตุ
     
      
    } catch (error) {
      console.error("Failed to fetch issue types:", error);
    }
  };

  useEffect(() => {
    getSelect(); // ดึงข้อมูลเมื่อ component โหลด
  }, []);

  const handleCreateIssueReason = async () => {
    if (!postIssueReasonName || !issueGroup) {
      showToast("กรุณาระบุประเภทสาเหตุและรายการสาเหตุให้ครบถ้วน", false);
      return;
    }
    try {
      const response = await postIssueReason({
        // @ts-ignore
        issue_fixed_reason: postIssueReasonName,
        issue_group: issueGroup,
      });

      if (response.statusCode === 200) {
        setPostIssueReasonName("");
        setIssueGroup("");
        getIssueReasonsData(); // เรียกฟังก์ชันเพื่อดึงข้อมูลใหม่
        setOpenDialog(false); // ปิด Dialog หลังจากเพิ่มข้อมูลสำเร็จ
        showToast("สร้างรายการสาเหตุเรียบร้อยแล้ว" , true);

      } else {
        showToast("รายการสาเหตุนี้มีอยู่แล้ว" , false);

      }
    } catch {
      showToast("ไม่สามารถสร้างรายการสาเหตุได้" , false);
      
    }
  };

  //-----------------------------------ตัวเลือกประเภทสาเหตุ ใช้มาสเตอร์ select-----------------------------------------------------
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  const handleSelectChange = (option: OptionType | null) => {
    setSelectedOption(option);
    console.log('Selected Option:', option); // ตรวจสอบค่าที่เลือก
    setIssueGroup(selectedOption ? selectedOption.value : ""); // เก็บค่า value ของประเภทสาเหตุ

  };

  return (
    <>
      <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
        <Dialog.Trigger asChild>
          <Button size="2" className="hover:bg-blue-500">
            สร้างรายการสาเหตุใหม่
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[500px] h-auto">
            <Dialog.Title className="w-full bg-blue-600 text-white p-2 flex justify-between items-center rounded-t-lg">
              <Text as="div" size="4" weight="bold" className="ml-3">
                สร้างรายการสาเหตุใหม่
              </Text>
              <Dialog.Close asChild>
                <Button className="text-white hover:text-gray-300 text-3xl">
                  &times;
                </Button>
              </Dialog.Close>
            </Dialog.Title>

            <Flex direction="column" gap="1" className="mt-8 ml-6">
              {/* เลือกประเภทสาเหตุ */}
              <Flex align="center" gap="3" className="ml-3">
                <Text as="div" size="2" weight="bold" className="mb-3">
                  ประเภทสาเหตุ
                </Text>

                <MasterSelectComponent
                  onChange={handleSelectChange} // ฟังก์ชันเมื่อเปลี่ยนตัวเลือก
                  valueKey="type_issue_group_id" // คีย์สำหรับ value
                  labelKey="type_issue_group_name" // คีย์สำหรับ label
                  fetchDataFromGetAPI={getMsTypeGroupIssueReason} // ฟังก์ชันดึงข้อมูล
                  placeholder="กรุณาเลือก..."
                  showOptionsList={true} // เปิดการแสดงรายการตัวเลือก
                  className="p-1 ml-4 text-left w-[310px] mb-3"
                />
              </Flex>

              {/* รายการสาเหตุ */}
              <Flex align="center" gap="3" className="ml-3 mt-2 mb-3">
                <Text as="div" size="2" weight="bold" className="mb-3 ">
                  รายการสาเหตุ
                </Text>
                <TextField.Root
                  type="text"
                  autoFocus
                  value={postIssueReasonName} // ใช้ value แทน defaultValue
                  placeholder="ระบุรายการสาเหตุ"
                  className="p-2 ml-4 text-left w-8/12 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(event) => setPostIssueReasonName(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { handleCreateIssueReason(); }
                  }}
                />
              </Flex>
            </Flex>

            <Flex
              gap="3"
              justify="between"
              className="ml-5 mr-5 mb-5 border-t border-gray-200 pt-3"
            >
              <Dialog.Close asChild>
                <Button
                  size="2"
                  onClick={() => setOpenDialog(false)}
                  className=" px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-gray-200"
                >
                  ยกเลิก
                </Button>
              </Dialog.Close>
              <Button
                size="2"
                onClick={handleCreateIssueReason}
                className="px-4 py-2 text-white bg-save rounded-lg hover:bg-[#28a745]"
              >
                บันทึกข้อมูล
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </>
  );
};

export default DialogAdd;
