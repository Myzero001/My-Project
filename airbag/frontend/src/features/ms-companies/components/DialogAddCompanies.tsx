import React from 'react'

import { useState } from "react"; // นำเข้า useRef เพิ่มเติม
import * as Dialog from "@radix-ui/react-dialog"; // เปลี่ยนการนำเข้า Dialog
import { Button, Flex, TextField, Text ,TextArea} from "@radix-ui/themes";
import { postMsCompanies } from "@/services/ms.companies";

import { useToast } from "@/components/customs/alert/ToastContext";


type DialogAddMasterCompaniesProps = {
    getMasterCompaniesData: Function;
};


const DialogAddCompanies = ({ getMasterCompaniesData }: DialogAddMasterCompaniesProps) => {
    const [postMasterCompaniesName, setPostMasterCompaniesName] = useState("");
    const [postMasterCompaniesAddress, setPostMasterCompaniesAddress] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const { showToast } = useToast();


    const handleMasterCompanies = async () => {
        // ตรวจสอบว่ามีการกรอกชื่อตำแหน่งหรือไม่
        if (!postMasterCompaniesName) {
            showToast("กรุณาระบุชื่อสาขา", false);

            return;
        }
        try {
            const response = await postMsCompanies({ 
                company_name: postMasterCompaniesName,
                company_address: postMasterCompaniesAddress,
                company_main: false
                // @ts-ignore
            }, localStorage.getItem("token") as string);
            if (response.statusCode === 200) {
                getMasterCompaniesData();
                showToast(`สร้างสาขา "${postMasterCompaniesName}" เรียบร้อยแล้ว`, true);
                setPostMasterCompaniesName("");
                setPostMasterCompaniesAddress("");
                setOpenDialog(false);
            } else {
                showToast("ชื่อสาขานี้มีอยู่แล้ว", false);
            }
        } catch (error) {
            console.error("Error:", error);
            showToast("ได้เกิดข้อผิดพลาดในการสร้างรายการสาขา", false);
        } finally {
        }
    };

    const handleKeyDownOK = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            handleMasterCompanies();
        }
    };
    return (
        <>
            <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
                <Dialog.Trigger asChild>
                    <Button size="2" className="hover:bg-blue-500" onClick={() => setOpenDialog(true)}>

                        สร้างสาขาใหม่
                    </Button>
                </Dialog.Trigger>

                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[500px] h-auto">
                        <Dialog.Title className="w-full bg-blue-600 text-white p-2 flex justify-between items-center rounded-t-lg">
                            <Text as="div" size="4" weight="bold" className="ml-3">
                                สร้างรายการสาขา
                            </Text>
                            <Dialog.Close asChild>
                                <Button className="text-white hover:text-gray-300 text-3xl" onClick={() => setOpenDialog(false)}>
                                    &times;
                                </Button>
                            </Dialog.Close>
                        </Dialog.Title>
                        <Flex direction="column" gap="1" className="mt-8  ">
                            <Flex align="start" gap="3" className="ml-12 mb-3 flex-col mr-12 ">
                                <div className='flex items-center w-full'>
                                    <Text as="div" size="2" weight="bold" className="mb-3 w-1/6">
                                        ชื่อสาขา
                                    </Text>
                                    <TextField.Root
                                        type="text"
                                        autoFocus
                                        placeholder="ชื่อสาขา"
                                        className="p-2 ml-4 text-left w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(event) => setPostMasterCompaniesName(event.target.value)}
                                        // onKeyDown={handleKeyDownOK}

                                    />
                                </div>
                                <div className='flex items-baseline w-full'>
                                    <Text as="div" size="2" weight="bold" className="mb-3 w-1/6">
                                        ที่อยู่
                                    </Text>
                                    <TextArea
                                        placeholder="ที่อยู่สาขา"
                                        className="p-2  text-left w-full h-24 mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(event) => setPostMasterCompaniesAddress(event.target.value)}
                                        onKeyDown={handleKeyDownOK}

                                    />
                                </div>
                            </Flex>

                        </Flex>

                        <Flex
                            gap="3"
                            justify="between"
                            className="ml-5 mr-5 mb-5 border-t border-gray-200 pt-3 mt-5"
                        >
                            <Dialog.Close asChild>
                                <Button
                                    size="2"
                                    onClick={() => setOpenDialog(false)}
                                    className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-gray-200"
                                >
                                    ยกเลิก
                                </Button>
                            </Dialog.Close>
                            <Button
                                size="2"
                                onClick={handleMasterCompanies}
                                className="px-4 py-2 text-white bg-save rounded-lg hover:bg-[#28a745]"
                            >
                                บันทึกข้อมูล
                            </Button>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}

export default DialogAddCompanies
