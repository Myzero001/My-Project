import { useToast } from "@/components/customs/alert/toast.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import { cancelQuotation } from "@/services/ms.quotation.service";
import { QUOTATION_ALL } from "@/types/response/response.quotation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";

type cancelQuotationType = {
  remark: string;
};
const cancelQuatationSchema = z.object({
  remark: z.string(),
});

type DialogCancelProps = {
  data: QUOTATION_ALL | undefined;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: cancelQuotationType) => void;
};
const DialogCancel = (props: DialogCancelProps) => {
  const { isOpen, onClose, onConfirm, data } = props;

  const { showToast } = useToast();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    register,
  } = useForm<cancelQuotationType>({
    resolver: zodResolver(cancelQuatationSchema),
  });

  const onSubmitHandler = async (payload: cancelQuotationType) => {
    console.log("handleRequestEditForm1111222");
    if (data?.quotation_id) {
      cancelQuotation(data?.quotation_id, payload.remark)
        .then((response) => {
          if (response.success) {
            showToast("ยกเลิกใบเสนอราคาสำเร็จ", true);
            handleConfirm(payload);

            reset();
          } else {
            showToast("ยกเลิกใบเสนอราคาไม่สำเร็จ", false);
            handleClose();
          }
        })
        .catch(() => {
          showToast("ยกเลิกใบเสนอราคาไม่สำเร็จ", false);

          handleClose();
        });
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setValue("remark", "");
  };

  const handleConfirm = (payload: cancelQuotationType) => {
    onConfirm(payload);
    reset();
    setValue("remark", "");
  };
  return (
    <DialogComponent
      isOpen={isOpen}
      onClose={handleClose}
      title="ยืนยันการยกเลิก"
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

export default DialogCancel;
