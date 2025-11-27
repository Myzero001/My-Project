import { useToast } from "@/components/customs/alert/toast.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import { approvePaymentEdits } from "@/services/ms.payment.service";
import { PAYMENTTYPE } from "@/types/response/response.payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";

type approveQuotationType = {
  remark?: string;
};
const ApproveQuatationSchema: ZodType<approveQuotationType> = z.object({
  remark: z.string().optional(),
});

type DialogApproveEditPaymentProps = {
  data: PAYMENTTYPE | undefined;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: approveQuotationType) => void;
};
const DialogApproveEditPayment = (props: DialogApproveEditPaymentProps) => {
  const { isOpen, onClose, onConfirm, data } = props;

  const { showToast } = useToast();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    register,
  } = useForm<approveQuotationType>({
    resolver: zodResolver(ApproveQuatationSchema),
  });

  const onSubmitHandler = async (payload: approveQuotationType) => {
    if (data?.id) {
      approvePaymentEdits(data?.id, payload.remark)
        .then(() => {
          showToast("อนุมัติการขอแก้ไขใบชำระเงินเรียบร้อยแล้ว", true);
          handleConfirm(payload);

          reset();
        })
        .catch(() => {
          showToast("อนุมัติการขอแก้ไขใบชำระเงินไม่สำเร็จ", false);

          handleClose();
        });
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setValue("remark", "");
  };

  const handleConfirm = (payload: approveQuotationType) => {
    onConfirm(payload);
    reset();
    setValue("remark", "");
  };
  return (
    <DialogComponent
      isOpen={isOpen}
      onClose={handleClose}
      title="อนุมัติ"
      onConfirm={handleSubmit(onSubmitHandler)}
      confirmText="ยืนยัน"
      cancelText="ยกเลิก"
    >
      <InputTextareaFormManage
        name={"หมายเหตุ"}
        placeholder="หมายเหตุ"
        register={{ ...register("remark") }}
        msgError={errors.remark?.message}
        showLabel
      />
    </DialogComponent>
  );
};

export default DialogApproveEditPayment;
