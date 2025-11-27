import { Flex, Button, Text } from "@radix-ui/themes";

type DialogPaginationIssuReasonProps = {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
};

const DialogPaginationIssuReason = ({
    totalItems,
    pageSize,
    currentPage,
    onPageChange,
}: DialogPaginationIssuReasonProps) => {
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

export default DialogPaginationIssuReason;

// import { Flex, Button, Text } from "@radix-ui/themes";

// type DialogPaginationIssuReasonProps = {
//     totalItems: number;
//     pageSize: number;
//     currentPage: number;
//     onPageChange: (page: number) => void;
// };

// const DialogPaginationIssuReason = ({
//     totalItems,
//     pageSize,
//     currentPage,
//     onPageChange,
// }: DialogPaginationIssuReasonProps) => {
//     const totalPages = Math.ceil(totalItems / pageSize);

//     const handleNext = () => {
//         if (currentPage < totalPages) {
//             onPageChange(currentPage + 1);
//         }
//     };

//     const handlePrevious = () => {
//         if (currentPage > 1) {
//             onPageChange(currentPage - 1);
//         }
//     };

//     const handlePageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const page = Number(event.target.value);
//         if (page >= 1 && page <= totalPages) {
//             onPageChange(page);
//         }
//     };

//     return (
//         <div className="container">
//             <Flex justify="center" gap="2" align="center">
//                 <Button className="pagination-button" onClick={handlePrevious} disabled={currentPage === 1}>
//                     ก่อนหน้า
//                 </Button>

//                 {/* ช่องเลือกหน้าปัจจุบัน */}
//                 <input
//                     type="number"
//                     value={currentPage}
//                     onChange={handlePageChange}
//                     min={1}
//                     max={totalPages}
//                     className="pagination-input text-end"
//                     aria-label="Page number"
//                 />

//                 <Text>จาก {totalPages} หน้า</Text>

//                 <Button className="pagination-button" onClick={handleNext} disabled={currentPage === totalPages}>
//                     ถัดไป
//                 </Button>
//             </Flex>
//         </div>
//     );
// };

// export default DialogPaginationIssuReason;
