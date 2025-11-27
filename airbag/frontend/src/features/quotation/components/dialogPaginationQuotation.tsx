import { Flex, Button, Text } from "@radix-ui/themes";

type DialogPaginationQuotationProps = {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
};

const DialogPaginationQuotation = ({
    totalItems,
    pageSize,
    currentPage,
    onPageChange,
}: DialogPaginationQuotationProps) => {
    const totalPages = Math.ceil(totalItems / pageSize);

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <div className="container">
            <Flex justify="center" gap="2">
                <Button className="pagination-button" onClick={handlePrevious} disabled={currentPage === 1}>
                    ก่อนหน้า
                </Button>
                <Text>
                    หน้าที่ {currentPage} จาก {totalPages}
                </Text>
                <Button className="pagination-button" onClick={handleNext} disabled={currentPage === totalPages}>
                    ถัดไป
                </Button>
            </Flex>
        </div>
    );
};

export default DialogPaginationQuotation;