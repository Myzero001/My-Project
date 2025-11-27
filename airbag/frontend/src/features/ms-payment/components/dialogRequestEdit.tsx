import { useToast } from "@/components/customs/alert/toast.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import {
  postRequestEditPayment,
  updateRequestEditPayment,
} from "@/services/ms.payment.service";
import { PAYMENTTYPE } from "@/types/response/response.payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";

type requestEditPaymentType = {
  remark?: string;
};
const RequestEditPaymentSchema: ZodType<requestEditPaymentType> = z.object({
  remark: z.string().optional(),
});

type DialogRequestEditPaymentProps = {
  statusPayment: string | null;
  data: PAYMENTTYPE | undefined;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: requestEditPaymentType) => void;
  changedValues:
    | {
        old_data: any;
        new_data: any;
      }
    | undefined;
};
const DialogRequestEditPayment = (props: DialogRequestEditPaymentProps) => {
  const { isOpen, onClose, onConfirm, data, changedValues, statusPayment } =
    props;

  const { showToast } = useToast();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    register,
  } = useForm<requestEditPaymentType>({
    resolver: zodResolver(RequestEditPaymentSchema),
  });

  const onSubmitHandler = async (payload: requestEditPaymentType) => {
 
    if (data?.id) {
      if (statusPayment === "create") {
        postRequestEditPayment(
          data?.id,
          payload.remark,
          JSON.stringify(changedValues?.old_data),
          JSON.stringify(changedValues?.new_data)
        )
          .then((response) => {
            if (response.success) {
              showToast("ขอแก้ไขใบชำระเงินสำเร็จ", true);
              handleConfirm(payload);

              reset();
            } else {
              showToast("ขอแก้ไขใบชำระเงินไม่สำเร็จ", false);
              handleClose();
            }
          })
          .catch(() => {
            showToast("ขอแก้ไขใบชำระเงินไม่สำเร็จ", false);

            handleClose();
          });
      } else {
        updateRequestEditPayment(
          data?.id,
          payload.remark,
          JSON.stringify(changedValues?.old_data),
          JSON.stringify(changedValues?.new_data)
        )
          .then((response) => {
            if (response.success) {
              showToast("ขอแก้ไขใบชำระเงินสำเร็จ", true);
              handleConfirm(payload);

              reset();
            } else {
              showToast("ขอแก้ไขใบชำระเงินไม่สำเร็จ", false);
              handleClose();
            }
          })
          .catch(() => {
            showToast("ขอแก้ไขใบชำระเงินไม่สำเร็จ", false);

            handleClose();
          });
      }
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setValue("remark", "");
  };

  const handleConfirm = (payload: requestEditPaymentType) => {
    onConfirm(payload);
    reset();
    setValue("remark", "");
  };
  return (
    <DialogComponent
      isOpen={isOpen}
      onClose={handleClose}
      title="ยืนยันการขอแก้ไข"
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

export default DialogRequestEditPayment;
