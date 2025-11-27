import { deleteIssueReason } from "@/services/issueReason.service";
import * as Dialog from "@radix-ui/react-dialog";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useToast } from "@/components/customs/alert/ToastContext";

type DialogDeleteIssueReasonProps = {
    issue_reason_id: string;
    issue_fixed_reason: string;
    issue_group: string;
    onDeleteIssueReason: () => void;
    onClose: () => void;
    currentPage: number; // หน้าปัจจุบัน
    goToPage: (page: number) => void; // ฟังก์ชันเปลี่ยนหน้า
    currentItemsCount: number; // จำนวนข้อมูลในหน้าปัจจุบัน
};

const DeleteIssueReasonDialog = ({ issue_reason_id, issue_fixed_reason, issue_group, onDeleteIssueReason, onClose, currentPage, goToPage, currentItemsCount }: DialogDeleteIssueReasonProps) => {
    const { showToast } = useToast(); // Access the toast context

    const handleDeleteIssueReason = async () => {
        try {
            const response = await deleteIssueReason(issue_reason_id);
            if (response.statusCode === 200) {
                onDeleteIssueReason();
                onClose();
                showToast("ลบรายการสาเหตุสําเร็จ", true);
                // ตรวจสอบข้อมูลในหน้าปัจจุบัน
                if (currentItemsCount - 1 === 0 && currentPage > 1) {
                    // ถ้าข้อมูลหมด และไม่ใช่หน้าแรก ให้เปลี่ยนไปหน้าก่อน
                    showToast("ไม่มีข้อมูลในหน้านี้ กำลังกลับไปหน้าก่อนหน้า", true);
                    goToPage(currentPage - 1);
                }

                onClose();
            } else {
                showToast("ลบรายการสาเหตุไม่สําเร็จ", true); // Error message
            }
            // await deleteIssueReason(issue_reason_id);
            // onDeleteIssueReason();
            // onClose();
        } catch (error) {
            alert("ลบรายการสาเหตุไม่สําเร็จ");
            console.error(error);
        }
    };

    return (
        <Dialog.Root open onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-5" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[500px] h-auto" onKeyDown={(e) => e.key === 'Enter' && handleDeleteIssueReason()}>
                    {/* ส่วนหัวของ Dialog */}
                    <Dialog.Title className="w-full bg-blue-600 text-white p-2 flex justify-between items-center rounded-t-lg">
                        <Text as="div" size="4" weight="bold" className="ml-3">
                            ลบรายการสาเหตุ
                        </Text>
                        <Dialog.Close asChild>
                            <Button className="text-white hover:text-gray-300 text-3xl">&times;</Button>
                        </Dialog.Close>
                    </Dialog.Title>

                    {/* Content */}
                    <Flex direction="column" gap="1" className="mt-8 flex-1 flex items-center justify-center p-4">
                        <Text as="div" className="mb-3 text text-xl ">คุณต้องการลบรายการ</Text>
                        <Text as="div" size="2" weight="bold" className="mb-3 text-lg">
                            ประเภทสาเหตุ : <span className="text-red-500">{issue_group}</span><br />
                            สาเหตุ : <span className="text-red-500">{issue_fixed_reason}</span>&nbsp;&nbsp;หรือไม่?
                        </Text>
                    </Flex>



                    {/* Footer Buttons */}
                    <Flex gap="3" justify="between" className="m-5 border-t border-gray-200 pt-3 rounded-lg">
                        <Dialog.Close asChild>
                            <Button size="2" onClick={onClose} className=" px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-gray-200">
                                ยกเลิก
                            </Button>
                        </Dialog.Close>
                        <Button size="2" onClick={handleDeleteIssueReason} className="px-4 py-2 text-white  bg-[#198754] rounded-lg hover:bg-[#28a745]">ยืนยัน</Button>
                    </Flex>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default DeleteIssueReasonDialog;
