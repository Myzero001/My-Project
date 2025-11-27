import { blobToFile } from "@/types/file";
import { ReactNode } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";

type UpdateFileFieldProps = {
  id?: string;
  files: blobToFile[];
  isError: boolean;
  onCheckFileUpload: (acceptedFiles: File[]) => void;
  acceptOption?: Accept | undefined;
  acceptDescription?: string;
  onLoading: (loading: boolean) => void;
  multiple?: boolean;
  iconFileUpload?: ReactNode;
  disabled?: boolean;
};

export default function UpdateFileField(props: UpdateFileFieldProps) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop(acceptedFiles) {
      props.onLoading(false);
      props.onCheckFileUpload(acceptedFiles);
    },
    accept: props.acceptOption ?? {
      "image/png": [".png"],
      "image/jpeg": [".jpeg"],
    },
    multiple: props.multiple ?? true,
    disabled: props.disabled ?? false,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full ${
        props.isError ? "border-[#D92D20]" : "border-[#E4E7EC]"
      } ${!props.disabled && " cursor-pointer"}  `}
    >
      <div className="flex w-full items-center">
        <input id={props.id ?? "fileupload"} {...getInputProps()} />
        <MdOutlineFileUpload size={"24"} />
        <span className=" font-semibold text-16">
          เพิ่มรูปภาพหลักฐานการชำระเงิน
        </span>
      </div>
      <span className="text-[#98A2B3] text-xs">
        ประเภทไฟล์ PNG หรือ JPG, 5 Mb/ไฟล์
      </span>
    </div>
  );
}
