import { Dialog, Box, Spinner, Flex, Text } from "@radix-ui/themes";
import Buttons from "@/components/customs/button/button.main.component";
import { useEffect, useState } from "react";
import { blobToFile } from "@/types/file";
import UploadField from "@/components/customs/uploadFIle/uploadField";
import { ImageUploadCompression } from "@/utils/ImageUploadCompression";
import ListFileCardDragField from "@/components/customs/uploadFIle/listFileCardDragField";
import AlertDialogComponent from "@/components/customs/alertDialogs/alertDialog";
import { fetchFileByURL, fetchImages } from "@/services/file.service";
import { repairReceipt } from "@/types/response/response.repair-receipt";
import EmptyImage from "@/components/customs/emptyImage/emptyImage";

type DialogAttachmentRepairReceiptProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  defaultRepairImage: blobToFile[];
  defaultBoxImage: blobToFile[];
  onChangeImage: (images: blobToFile[], boxImage: blobToFile[]) => void;
  errorMessage?: string;
  data: repairReceipt | undefined;
  isChangeFile: boolean;
  disable?: boolean;
};

const DialogAttachmentRepairReceipt = ({
  isOpen,
  onClose,
  defaultRepairImage,
  defaultBoxImage,
  onChangeImage,
  errorMessage,
  data,
  isChangeFile,
  disable,
}: DialogAttachmentRepairReceiptProps) => {
  // state
  const LIMITFILE = 20;
  const maxSizeFile = 5; // 20Mb
  const [isLoadingUploadFile, setIsLoadingUploadFile] =
    useState<boolean>(false);
  const [openAlertFileSize, setOpenAlertFileSize] = useState<boolean>(false);

  const [activeUploadFileID, setActiveUploadFileID] = useState<string>("");
  const [fileDelete, setFileDelete] = useState<blobToFile[]>([]);

  const [repairImages, setRepairImages] =
    useState<blobToFile[]>(defaultRepairImage);
  const [boxImages, setBoxImages] = useState<blobToFile[]>(defaultBoxImage);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  const onCheckFileUpload = async (
    uploadFiles: File[],
    currentFile: blobToFile[]
  ) => {
    const mockFiles = [];
    let isErrorFileSize = false;
    setIsLoadingUploadFile(true);

    for (const file of uploadFiles) {
      const fileCompress = await ImageUploadCompression(file);
      const NewFile = new File([fileCompress], fileCompress.name, {
        type: fileCompress?.type,
      });

      const blobToFile: blobToFile = Object.assign(NewFile, {
        index: Math.random().toString(36).slice(2),
        id: Math.random().toString(36).slice(2),
        status: "new",
        imageURL: "",
        url: "",
        file_url: "",
        error: false,
      });

      if ([...currentFile, ...mockFiles]?.length >= LIMITFILE) {
        break;
      }

      if (file.size > maxSizeFile * 1024 * 1024) {
        isErrorFileSize = true;
        blobToFile.error = true;
        mockFiles.push(blobToFile);
      } else {
        blobToFile.imageURL = URL.createObjectURL(file);
        mockFiles.push(blobToFile);
      }
    }

    setIsLoadingUploadFile(false);

    if (isErrorFileSize) {
      setOpenAlertFileSize(true);
      return [];
    } else {
      return [...currentFile, ...mockFiles];
    }
  };

  const handleDeleteFile = (file: blobToFile) => {
    const oldFile: blobToFile[] = repairImages;
    const oldFileDelete = fileDelete;
    const newFile = oldFile.filter((f) => {
      if (f?.id !== file?.id) {
        return f?.id !== file?.id;
      } else if (file?.status !== "new") {
        setFileDelete([...oldFileDelete, f]);
      }
    });
    setRepairImages(newFile);
  };
  const handleDeleteFileBox = (file: blobToFile) => {
    const oldFile: blobToFile[] = boxImages;
    const oldFileDelete = fileDelete;
    const newFile = oldFile.filter((f) => {
      if (f?.id !== file?.id) {
        return f?.id !== file?.id;
      } else if (file?.status !== "new") {
        setFileDelete([...oldFileDelete, f]);
      }
    });
    setBoxImages(newFile);
  };

  const handleChangeImage = () => {
    onChangeImage(repairImages, boxImages);
    onClose();
  };

  const handleClose = () => {
    setRepairImages(defaultRepairImage);
    setBoxImages(defaultBoxImage);
    onClose();
  };

  const fetchFileData = async (data: repairReceipt) => {
    if (data.repair_receipt_image_url) {
      setIsLoadingData(true);
      const preData: {
        repair_receipt_image_url: blobToFile[];
      } = {
        repair_receipt_image_url: [],
      };
      const repair_receipt_image_url = data.repair_receipt_image_url.split(",");
      if (repair_receipt_image_url && repair_receipt_image_url.length > 0) {
        preData.repair_receipt_image_url = await Promise.all(
          repair_receipt_image_url.map(async (image) => {
            const response = await fetchFileByURL(image);
            const response_image_urls = await fetchImages(
              response.responseObject
            );
            return response_image_urls[0];
          })
        );
      }
      setRepairImages(preData.repair_receipt_image_url);
      setIsLoadingData(false);
    }
    if (data.repair_receipt_box_image_url) {
      setIsLoadingData(true);
      const preData: {
        repair_receipt_box_image_url: blobToFile[];
      } = {
        repair_receipt_box_image_url: [],
      };
      const repair_receipt_box_image_url =
        data.repair_receipt_box_image_url.split(",");
      if (
        repair_receipt_box_image_url &&
        repair_receipt_box_image_url.length > 0
      ) {
        preData.repair_receipt_box_image_url = await Promise.all(
          repair_receipt_box_image_url.map(async (image) => {
            const response = await fetchFileByURL(image);
            const response_image_urls = await fetchImages(
              response.responseObject
            );
            return response_image_urls[0];
          })
        );
      }
      setBoxImages(preData.repair_receipt_box_image_url);
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen && data) {
      if (!isChangeFile) {
        fetchFileData(data);
      }
    }

  }, [data, isOpen]);

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={undefined}>
        <Dialog.Content maxWidth="1024px" className=" relative">
          <Dialog.Title>ภาพกล่อง</Dialog.Title>
          <Flex
            direction="column"
            className="border-t py-4 border-b min-h-[220px] mb-12 justify-center"
          >
            <Box style={{ gap: 1, display: "flex", flexDirection: "column" }}>
              {isLoadingUploadFile || isLoadingData ? (
                <Box className=" w-full flex justify-center">
                  <Spinner size="3" />
                </Box>
              ) : (
                <>
                  <label
                    className=" flex gap-1 "
                    htmlFor={"name"}
                    style={{
                      fontWeight: "600",
                      fontSize: "16px",
                      lineHeight: "28px",
                    }}
                  >
                    อัปโหลด รูปภาพของซ่อม
                    {/* <div className=" text-red-500">*</div> */}
                  </label>
                  <Box
                    style={{
                      display: "flex",
                      gap: "8px",
                      overflowX: "auto",
                      marginTop: "-10px",
                    }}
                    className=" lg:max-w-[976px] md:max-w-[976px] sm:max-w-[976px]  max-w-[464px]"
                  >
                    {!disable && repairImages?.length < LIMITFILE && (
                      <Box
                        style={{
                          width: repairImages?.length > 0 ? "168px" : "100%",
                          minWidth: repairImages?.length > 0 ? "168px" : "auto",
                          marginTop: "10px",
                        }}
                      >
                        <UploadField
                          id="image_url_id"
                          isError={errorMessage !== undefined}
                          acceptDescription={".JPEG, .JPG, .PNG"}
                          files={repairImages}
                          onLoading={(loading) =>
                            setIsLoadingUploadFile(loading)
                          }
                          onCheckFileUpload={(f) => {
                            setActiveUploadFileID("image_url_id");
                            onCheckFileUpload(f, repairImages).then((file) => {
                              setRepairImages(file);
                            });
                          }}
                          acceptOption={{
                            "image/png": [".png"],
                            "image/jpeg": [".jpeg"],
                            "image/webp": [".webp"],
                          }}
                        />
                      </Box>
                    )}
                    {disable && repairImages && repairImages?.length <= 0 ? (
                      <EmptyImage />
                    ) : (
                      repairImages &&
                      repairImages?.length > 0 && (
                        <ListFileCardDragField
                          files={repairImages}
                          setFiles={(f) => setRepairImages(f)}
                          onClickDelete={(f) => handleDeleteFile(f)}
                          disable={disable}
                        />
                      )
                    )}
                  </Box>
                  <label
                    className=" flex gap-1 mt-4"
                    htmlFor={"name"}
                    style={{
                      fontWeight: "600",
                      fontSize: "16px",
                      lineHeight: "28px",
                    }}
                  >
                    อัปโหลด รูปภาพกล่อง
                    {/* <div className=" text-red-500">*</div> */}
                  </label>
                  <Box
                    style={{
                      display: "flex",
                      gap: "8px",
                      overflowX: "auto",
                      marginTop: "-10px",
                    }}
                    className=" lg:max-w-[976px] md:max-w-[976px] sm:max-w-[976px]  max-w-[464px]"
                  >
                    {!disable && boxImages?.length < LIMITFILE && (
                      <Box
                        style={{
                          width: boxImages?.length > 0 ? "168px" : "100%",
                          minWidth: boxImages?.length > 0 ? "168px" : "auto",
                          marginTop: "10px",
                        }}
                      >
                        <UploadField
                          id="image_url_id"
                          isError={errorMessage !== undefined}
                          acceptDescription={".JPEG, .JPG, .PNG"}
                          files={boxImages}
                          onLoading={(loading) =>
                            setIsLoadingUploadFile(loading)
                          }
                          onCheckFileUpload={(f) => {
                            setActiveUploadFileID("image_url_id");
                            onCheckFileUpload(f, boxImages).then((file) => {
                              setBoxImages(file);
                            });
                          }}
                          acceptOption={{
                            "image/png": [".png"],
                            "image/jpeg": [".jpeg"],
                            "image/webp": [".webp"],
                          }}
                        />
                      </Box>
                    )}
                    {disable && boxImages && boxImages?.length <= 0 ? (
                      <EmptyImage />
                    ) : (
                      boxImages &&
                      boxImages?.length > 0 && (
                        <ListFileCardDragField
                          files={boxImages}
                          setFiles={(f) => setBoxImages(f)}
                          onClickDelete={(f) => handleDeleteFileBox(f)}
                          disable={disable}
                        />
                      )
                    )}
                  </Box>
                  {/* {boxImages && boxImages?.length > 0 && (
                    <>
                      <label
                        className=" flex gap-1 "
                        htmlFor={"name"}
                        style={{
                          fontWeight: "600",
                          fontSize: "16px",
                          lineHeight: "28px",
                        }}
                      >
                        รูปภาพกล่อง
                      </label>
                      <Box
                        style={{
                          display: "flex",
                          gap: "8px",
                          overflowX: "auto",
                          marginTop: "-10px",
                        }}
                        className=" lg:max-w-[976px] md:max-w-[976px] sm:max-w-[976px]  max-w-[464px]"
                      >
                        <ListFileCardDragField
                          files={boxImages}
                          setFiles={() => {}}
                          onClickDelete={() => {}}
                             disable={disable}
                          disable={true}
                        />
                      </Box>
                    </>
                  )} */}
                </>
              )}
              {errorMessage && (
                <div className="text-require">{errorMessage}</div>
              )}
            </Box>
          </Flex>
          <Flex
            gap="3"
            justify="between"
            className="w-full px-6 pt-4 pb-6 left-0 bottom-0  absolute "
          >
            <Dialog.Close>
              <Buttons btnType="cancel" onClick={handleClose}>
                ยกเลิก
              </Buttons>
            </Dialog.Close>
            {!disable && (
              <Dialog.Close>
                <Buttons btnType="submit" onClick={handleChangeImage}>
                  บันทึกข้อมูล
                </Buttons>
              </Dialog.Close>
            )}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <AlertDialogComponent
        id={activeUploadFileID}
        className="  max-w-md"
        handleClose={() => {
          setOpenAlertFileSize(false);
        }}
        handleSubmit={() => {
          setOpenAlertFileSize(false);
        }}
        isOpen={openAlertFileSize}
        title={"ไฟล์ใหญ่เกินไป"}
        description={
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
              “ขนาดไฟล์เกินมาตรฐานที่กำหนด
            </Text>
            <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
              กรุณาเลือกไฟล์ใหม่และอัปโหลดอีกครั้ง
            </Text>
            <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
              [ขนาดไฟล์ใหญ่สุด: 5MB]”
            </Text>
          </Box>
        }
        btnSubmitName={"ลองอีกครั้ง"}
        btnCancelName={"ยกเลิก"}
      />
    </>
  );
};

export default DialogAttachmentRepairReceipt;
