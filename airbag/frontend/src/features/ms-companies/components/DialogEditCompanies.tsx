import React from 'react'
import { useState, useEffect } from "react";
import { updateMsCompanies } from "@/services/ms.companies";
import * as Dialog from "@radix-ui/react-dialog";
import { Button, Flex, TextField, Text, TextArea } from "@radix-ui/themes";
//Toast
import { useToast } from "@/components/customs/alert/ToastContext";

type DialogEditMasterocompaniesProps = {
    companies_id: string;
    currentCompaniesName: string;
    currentCompaniesAddress: string;
    onEditMasterCompanies: () => void;
    onClose: () => void;
};

const DialogEditCompanies = ({
    companies_id,
    currentCompaniesName,
    currentCompaniesAddress,
    onEditMasterCompanies,
    onClose,
}: DialogEditMasterocompaniesProps) => {
    const [companiesName, setCompaniesName] = useState<string>(currentCompaniesName || "");
    const [companiesAddress, setCompaniesAddress] = useState<string>(currentCompaniesAddress || "");
    const { showToast } = useToast();


    useEffect(() => {
        setCompaniesName(currentCompaniesName);
        setCompaniesAddress(currentCompaniesAddress);
    }, [currentCompaniesName]);


    const handleKeyDownOK = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleUpdate();
        }
    };



    const handleUpdate = async () => {
        if (!companiesName) {
            showToast("กรุณาระบุชื่อสาขา", false);
            return;
        }
        try {
            // @ts-ignore
            const response = await updateMsCompanies({
                company_id: companies_id,
                company_name: companiesName,
                company_address: companiesAddress ? companiesAddress : "",
                company_main: false,

            });
            if (response.statusCode === 200) {
                onEditMasterCompanies();
                showToast(`อัปเดตชื่อสาขาเป็น"${companiesName}" สําเร็จ`, true);
                onClose();
            } else {
                showToast(`ไม่สามารถอัปเดตชื่อสาขา "${companiesName}" ซ้ำได้!`, false);
            }
        } catch (error) {
            console.error(error);
            showToast(`ไม่สามารถอัปเดตชื่อสาขา "${companiesName}" ได้!`, false);
        }
    };
    return (
        <div>

            <Dialog.Root open={true} onOpenChange={onClose}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[500px] h-auto">
                        <Dialog.Title className="w-full bg-blue-600 text-white p-2 flex justify-between items-center rounded-t-lg">
                            <Text as="div" size="4" weight="bold" className="ml-3">
                                แก้ไขรายการสาขา
                            </Text>
                            <Dialog.Close asChild>
                                <Button className="text-white hover:text-gray-300 text-3xl" onClick={onClose}>
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
                                        value={companiesName}
                                        placeholder="ชื่อสาขา"
                                        className="p-2 ml-4 text-left w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => setCompaniesName(e.target.value)}
                                        onKeyDown={handleKeyDownOK}

                                    />
                                </div>
                                <div className='flex items-baseline w-full'>
                                    <Text as="div" size="2" weight="bold" className="mb-3 w-1/6">
                                        ที่อยู่
                                    </Text>
                                    <TextArea
                                        value={companiesAddress}
                                        placeholder="ที่อยู่สาขา"
                                        className="p-2  text-left w-full h-24 mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => setCompaniesAddress(e.target.value)}
                                        onKeyDown={handleKeyDownOK}

                                    />
                                </div>
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
                                onClick={handleUpdate}
                                className="px-4 py-2 text-white bg-[#198754] rounded-lg hover:bg-[#28a745]"
                            >
                                บันทึกข้อมูล
                            </Button>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}


export default DialogEditCompanies
