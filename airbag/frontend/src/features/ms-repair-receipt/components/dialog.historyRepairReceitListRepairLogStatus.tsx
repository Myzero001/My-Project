import { Box, Dialog, Flex, Text } from "@radix-ui/themes";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getRepairReceiptListRepairLogStatusByRepairReceiptId } from "@/services/ms-repair.receipt.list.repair.log.status.service";
import { REPAIR_RECEIPT_LIST_REPAIR_LOG_STATUS } from "@/types/response/response.repair-receipt-list-repair-log-status";
import HistoryRepairReceiptListRepair from "@/components/customs/history/historyRepairReceiptListRepair";

type DialogHistoryRepairReceitListRepairLogStatusProps = {
  id: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

const DialogHistoryRepairReceitListRepairLogStatus = ({
  isOpen,
  onClose,
  title,
  id,
}: DialogHistoryRepairReceitListRepairLogStatusProps) => {
  const [dataLogStatus, setDataLogStatus] =
    useState<REPAIR_RECEIPT_LIST_REPAIR_LOG_STATUS[]>();

  useEffect(() => {
    if (id && isOpen) {
      getRepairReceiptListRepairLogStatusByRepairReceiptId(id).then(
        (response) => {
          setDataLogStatus(response.responseObject);
        }
      );
    }
  }, [id, isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content maxWidth="850px"  className=" relative">
        <Dialog.Title>
          <Text>{title}</Text>
          <Box className="absolute top-4 right-4 z-50 text-[#939393]">
            <IoClose className="cursor-pointer " onClick={onClose} />
          </Box>
        </Dialog.Title>
        <Flex
          direction="column"
          className="border-t pt-4 border-b min-h-[220px] max-h-[70vh] overflow-auto"
        >
          <HistoryRepairReceiptListRepair
            items={dataLogStatus}
            isFetchingHistoryEditPostById={false}
          />
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DialogHistoryRepairReceitListRepairLogStatus;
