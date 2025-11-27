import { useToast } from "@/components/customs/alert/toast.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import { approveQuotation } from "@/services/ms.quotation.service";
import { QUOTATION_ALL } from "@/types/response/response.quotation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";

type approveQuotationType = {
  remark?: string;
};
const ApproveQuatationSchema: ZodType<approveQuotationType> = z.object({
  remark: z.string().optional(),
});

type DialogApproveQuotationProps = {
  data: QUOTATION_ALL | undefined;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: approveQuotationType) => void;
};
const DialogApproveQuotation = (props: DialogApproveQuotationProps) => {
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
    if (data?.quotation_id) {
      approveQuotation(data?.quotation_id, payload.remark)
        .then((res) => {
          if (res.success) {
            showToast("อนุมัติใบเสนอราคาเรียบร้อยแล้ว", true);
            handleConfirm(payload);

            reset();
          } else {
            showToast("อนุมัติใบเสนอราคาไม่สำเร็จ", false);
            handleClose();
          }
        })
        .catch(() => {
          showToast("อนุมัติใบเสนอราคาไม่สำเร็จ", false);

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

export default DialogApproveQuotation;
