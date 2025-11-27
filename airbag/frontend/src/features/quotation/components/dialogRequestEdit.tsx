import { useToast } from "@/components/customs/alert/toast.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import { requestEditQuotation } from "@/services/ms.quotation.service";
import { QUOTATION_ALL } from "@/types/response/response.quotation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";

type requestEditQuotationType = {
  remark: string;
};
const RequestEditQuatationSchema = z.object({
  remark: z.string(),
});

type DialogRequestEditProps = {
  data: QUOTATION_ALL | undefined;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: requestEditQuotationType) => void;
};
const DialogRequestEdit = (props: DialogRequestEditProps) => {
  const { isOpen, onClose, onConfirm, data } = props;

  const { showToast } = useToast();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    register,
  } = useForm<requestEditQuotationType>({
    resolver: zodResolver(RequestEditQuatationSchema),
  });

  const onSubmitHandler = async (payload: requestEditQuotationType) => {
    if (data?.quotation_id) {
      requestEditQuotation(data?.quotation_id, payload.remark)
        .then((response) => {
          if (response.success) {
            showToast("ขอแก้ไขใบเสนอราคาสำเร็จ", true);
            handleConfirm(payload);

            reset();
          } else {
            showToast("ขอแก้ไขใบเสนอราคาไม่สำเร็จ", false);
            handleClose();
          }
        })
        .catch(() => {
          showToast("ขอแก้ไขใบเสนอราคาไม่สำเร็จ", false);

          handleClose();
        });
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setValue("remark", "");
  };

  const handleConfirm = (payload: requestEditQuotationType) => {
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

export default DialogRequestEdit;
