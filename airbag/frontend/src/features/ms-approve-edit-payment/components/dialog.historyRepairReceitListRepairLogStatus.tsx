import { Box, Dialog, Flex, Text } from "@radix-ui/themes";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getRepairReceiptListRepairLogStatusByRepairReceiptId } from "@/services/ms-repair.receipt.list.repair.log.status.service";
import { REPAIR_RECEIPT_LIST_REPAIR_LOG_STATUS } from "@/types/response/response.repair-receipt-list-repair-log-status";
import HistoryPaymentEdit from "@/components/customs/history/historyPaymentEdit";
import { getPaymentEditsLog } from "@/services/ms.payment.service";
import {
  PAYMENT_EDITS,
  PAYMENT_EDITS_LOG,
} from "@/types/response/response.payment-edits";

type DialogHistoryPaymentLogProps = {
  id: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

const DialogHistoryPaymentLog = ({
  isOpen,
  onClose,
  title,
  id,
}: DialogHistoryPaymentLogProps) => {
  const [dataLogStatus, setDataLogStatus] = useState<PAYMENT_EDITS_LOG[]>();

  useEffect(() => {
    if (id && isOpen) {
      getPaymentEditsLog(id).then((response) => {
        if (
          response.responseObject &&
          response.responseObject.length > 0 &&
          response.responseObject[0].payment_edits_log &&
          response.responseObject[0].payment_edits_log?.length > 0
        )
          setDataLogStatus(response.responseObject[0].payment_edits_log);
      });
    }
  }, [id, isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content maxWidth="850px" className=" relative">
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
          <HistoryPaymentEdit
            items={dataLogStatus}
            isFetchingHistoryEditPostById={false}
          />
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DialogHistoryPaymentLog;
