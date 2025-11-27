import { useToast } from "@/components/customs/alert/toast.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import {
  cancelPaymentEdits,
  rejectPaymentEdits,
} from "@/services/ms.payment.service";
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

type DialogRejectEditPaymentProps = {
  data: PAYMENTTYPE | undefined;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: approveQuotationType) => void;
};
const DialogRejectEditPayment = (props: DialogRejectEditPaymentProps) => {
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
    console.log("payload", payload);
    if (data?.id) {
      rejectPaymentEdits(data?.id, payload.remark)
        .then(() => {
          showToast("ปฏิเสธการขอแก้ไขใบชำระเงินเรียบร้อยแล้ว", true);
          handleConfirm(payload);

          reset();
        })
        .catch(() => {
          showToast("ปฏิเสธแก้ไขใบชำระเงินไม่สำเร็จ", false);

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
      title="ไม่อนุมัติ"
      onConfirm={handleSubmit(onSubmitHandler)}
      confirmText="ตกลง"
      cancelText="ยกเลิก"
      classNameConfirmBtn="  bg-red-700 hover:bg-red-700"
      confirmBtnType="general"
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

export default DialogRejectEditPayment;
