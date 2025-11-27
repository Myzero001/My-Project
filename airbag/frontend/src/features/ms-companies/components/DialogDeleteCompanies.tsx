
import { deleteMsCompanies } from "@/services/ms.companies";
import * as Dialog from "@radix-ui/react-dialog";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useToast } from "@/components/customs/alert/ToastContext";

type DialogDeleteMasterCompaniesProps = {
    company_id: string;
    companies_name: string;
    onDeleteMasterCompanies: () => void;
    onClose: () => void;
};

const DialogDeleteCompanies = ({ company_id, companies_name, onDeleteMasterCompanies, onClose }: DialogDeleteMasterCompaniesProps) => {
    const { showToast } = useToast(); // Access the toast context

    const handleDelete = async () => {
        try {
            const response = await deleteMsCompanies(company_id);
            if (response.statusCode === 200) {
                onDeleteMasterCompanies();
                onClose();
                showToast(`ลบสาขา "${companies_name}" สําเร็จ`, true); // Success message

            } else {
                showToast(`ไม่สามารถลบสาขา "${companies_name}" ได้!`, false); // Error message

                // alert("ไม่สามารถลบรายการได้");
            }
        } catch (error) {
            console.error(error);
            showToast(`ไม่สามารถลบสาขา"${companies_name}" ได้!`, false); // Error message

            // alert("เกิดข้อผิดพลาดในการลบรายการ");
        }
    };
    return (
        <div>
            <Dialog.Root open onOpenChange={onClose}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[500px] h-auto" onKeyDown={(e) => e.key === "Enter" && handleDelete()}>
                        <Dialog.Title className="w-full bg-blue-600 text-white p-2 flex justify-between items-center rounded-t-lg">
                            <Text as="div" size="4" weight="bold" className="ml-3">
                                ยืนยันการลบ
                            </Text>
                            <Dialog.Close asChild>
                                <Button variant="ghost" size="2" className="text-white hover:text-gray-300 text-3xl">&times;</Button>
                            </Dialog.Close>
                        </Dialog.Title>


                        <Flex direction="column" gap="1" className="mt-8 flex-1 flex items-center justify-center p-4">
                            <Text as="div" className="mb-3 text text-xl ">คุณต้องการลบรายการ</Text>
                            <Text as="div" size="5" align="center" className="mb-3 text-lg">
                                ชื่อสาขา : <span className="text-red-500">{companies_name}&nbsp; </span>ใช่หรือไม่?
                            </Text>
                        </Flex>


                        {/* Footer Buttons */}
                        <Flex gap="3" justify="between" className="m-5 border-t border-gray-200 pt-3 rounded-lg">
                            <Dialog.Close asChild>
                                <Button size="2" onClick={onClose} className=" px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-gray-200">
                                    ยกเลิก
                                </Button>
                            </Dialog.Close>
                            <Button size="2" onClick={handleDelete} className="px-4 py-2 text-white  bg-[#198754] rounded-lg hover:bg-[#28a745]">ยืนยัน</Button>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>




        </div>
    )
}

export default DialogDeleteCompanies
