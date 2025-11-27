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
import { TbFileImport } from "react-icons/tb";
import EmptyImage from "@/components/customs/emptyImage/emptyImage";

type DialogAttachmentRepairReceiptBoxProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  defaultImagesChip: blobToFile[];
  defaultFileCodeBefore: blobToFile[];
  defaultFileCodeAfter: blobToFile[];
  onChangeImage: (
    imagesChip: blobToFile[],
    fileCodeBefore: blobToFile[],
    fileCodeAfter: blobToFile[]
  ) => void;
  errorMessage?: string;
  data: repairReceipt | undefined;
  isChangeFile: boolean;
  disable?: boolean;
};

const DialogAttachmentRepairReceiptBox = ({
  isOpen,
  onClose,
  defaultImagesChip,
  defaultFileCodeBefore,
  defaultFileCodeAfter,
  onChangeImage,
  errorMessage,
  data,
  isChangeFile,
  disable,
}: DialogAttachmentRepairReceiptBoxProps) => {
  // state
  const LIMITFILE = 20;
  const maxSizeFile = 5; // 20Mb
  const [isLoadingUploadFile, setIsLoadingUploadFile] =
    useState<boolean>(false);
  const [openAlertFileSize, setOpenAlertFileSize] = useState<boolean>(false);

  const [activeUploadFileID, setActiveUploadFileID] = useState<string>("");
  const [fileDelete, setFileDelete] = useState<blobToFile[]>([]);

  const [imagesChip, setImagesChip] = useState<blobToFile[]>(defaultImagesChip);
  const [fileCodeBefore, setFileCodeBefore] = useState<blobToFile[]>(
    defaultFileCodeBefore
  );
  const [fileCodeAfter, setFileCodeAfter] =
    useState<blobToFile[]>(defaultFileCodeAfter);
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

  const handleDeleteFileChip = (file: blobToFile) => {
    const oldFile: blobToFile[] = imagesChip;
    const oldFileDelete = fileDelete;
    const newFile = oldFile.filter((f) => {
      if (f?.id !== file?.id) {
        return f?.id !== file?.id;
      } else if (file?.status !== "new") {
        setFileDelete([...oldFileDelete, f]);
      }
    });
    setImagesChip(newFile);
  };
  const handleDeleteFileCodeBefore = (file: blobToFile) => {
    const oldFile: blobToFile[] = fileCodeBefore;
    const oldFileDelete = fileDelete;
    const newFile = oldFile.filter((f) => {
      if (f?.id !== file?.id) {
        return f?.id !== file?.id;
      } else if (file?.status !== "new") {
        setFileDelete([...oldFileDelete, f]);
      }
    });
    setFileCodeBefore(newFile);
  };
  const handleDeleteFileCodeAfter = (file: blobToFile) => {
    const oldFile: blobToFile[] = fileCodeAfter;
    const oldFileDelete = fileDelete;
    const newFile = oldFile.filter((f) => {
      if (f?.id !== file?.id) {
        return f?.id !== file?.id;
      } else if (file?.status !== "new") {
        setFileDelete([...oldFileDelete, f]);
      }
    });
    setFileCodeAfter(newFile);
  };

  // const handleDeleteFileChip = (file: blobToFile) => {
  //   const oldFile: blobToFile[] = images;
  //   const oldFileDelete = fileDelete;
  //   const newFile = oldFile.filter((f) => {
  //     if (f?.id !== file?.id) {
  //       return f?.id !== file?.id;
  //     } else if (file?.status !== "new") {
  //       setFileDelete([...oldFileDelete, f]);
  //     }
  //   });
  //   setImages(newFile);
  // };

  const handleChangeImage = () => {
    onChangeImage(imagesChip, fileCodeBefore, fileCodeAfter);
    onClose();
  };

  const handleClose = () => {
    setFileCodeAfter(defaultFileCodeAfter);
    setFileCodeBefore(defaultFileCodeBefore);
    setImagesChip(defaultImagesChip);
    onClose();
  };

  const fetchFileData = async (data: repairReceipt) => {
    if (data.box_chip_image_url) {
      setIsLoadingData(true);

      const preData: {
        image_url: blobToFile[];
      } = {
        image_url: [],
      };

      const image_urls = data.box_chip_image_url.split(",");

      if (image_urls && image_urls.length > 0) {
        preData.image_url = await Promise.all(
          image_urls.map(async (image) => {
            const response = await fetchFileByURL(image);
            const responseFullbanner_image_urls = await fetchImages(
              response.responseObject
            );
            return responseFullbanner_image_urls[0];
          })
        );
      }
      setImagesChip(preData.image_url);
      setIsLoadingData(false);
    }
    if (data.box_before_file_url) {
      setIsLoadingData(true);

      const preData: {
        file_url: any[];
      } = {
        file_url: [],
      };

      const fileUrls = data.box_before_file_url.split(",");

      if (fileUrls && fileUrls.length > 0) {
        preData.file_url = await Promise.all(
          fileUrls.map(async (file) => {
            const response = await fetchFileByURL(file);
            const responseFullbanner_image_urls = await fetchImages(
              response.responseObject
            );
            return responseFullbanner_image_urls[0];
          })
        );
      }
      setFileCodeBefore(preData.file_url);
      setIsLoadingData(false);
    }
    if (data.box_after_file_url) {
      setIsLoadingData(true);

      const preData: {
        file_url: any[];
      } = {
        file_url: [],
      };

      const fileUrls = data.box_after_file_url.split(",");

      if (fileUrls && fileUrls.length > 0) {
        preData.file_url = await Promise.all(
          fileUrls.map(async (file) => {
            const response = await fetchFileByURL(file);
            const responseFullbanner_image_urls = await fetchImages(
              response.responseObject
            );
            return responseFullbanner_image_urls[0];
          })
        );
      }
      setFileCodeAfter(preData.file_url);
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
                    อัปโหลด รูปภาพ Chip
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
                    {!disable && imagesChip?.length < LIMITFILE && (
                      <Box
                        style={{
                          width: imagesChip?.length > 0 ? "168px" : "100%",
                          minWidth: imagesChip?.length > 0 ? "168px" : "auto",
                          marginTop: "10px",
                        }}
                      >
                        <UploadField
                          id="image_url_id"
                          isError={errorMessage !== undefined}
                          acceptDescription={".JPEG, .JPG, .PNG"}
                          files={imagesChip}
                          onLoading={(loading) =>
                            setIsLoadingUploadFile(loading)
                          }
                          onCheckFileUpload={(f) => {
                            setActiveUploadFileID("image_url_id");
                            onCheckFileUpload(f, imagesChip).then((file) => {
                              setImagesChip(file);
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
                    {disable && imagesChip && imagesChip?.length <= 0 ? (
                      <EmptyImage />
                    ) : (
                      imagesChip &&
                      imagesChip?.length > 0 && (
                        <ListFileCardDragField
                          files={imagesChip}
                          setFiles={(f) => setImagesChip(f)}
                          onClickDelete={(f) => handleDeleteFileChip(f)}
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
                    อัปโหลด ไฟล์โค้ด ก่อนซ่อม
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
                    {!disable && fileCodeBefore?.length < LIMITFILE && (
                      <Box
                        style={{
                          width: fileCodeBefore?.length > 0 ? "168px" : "100%",
                          minWidth:
                            fileCodeBefore?.length > 0 ? "168px" : "auto",
                          marginTop: "10px",
                        }}
                      >
                        <UploadField
                          id="image_url_id"
                          isError={errorMessage !== undefined}
                          acceptDescription={".bin, .enc"}
                          files={fileCodeBefore}
                          onLoading={(loading) =>
                            setIsLoadingUploadFile(loading)
                          }
                          onCheckFileUpload={(f) => {
                            setActiveUploadFileID("image_url_id");
                            onCheckFileUpload(f, fileCodeBefore).then(
                              (file) => {
                                setFileCodeBefore(file);
                              }
                            );
                          }}
                          acceptOption={{
                            "application/bin": [".bin"],
                            "application/enc": [".enc"],
                          }}
                          iconFileUpload={
                            <TbFileImport
                              style={{ width: "64px", height: "64px" }}
                              className="mb-4 self-center mt-[8px] touch-none pointer-events-none"
                            />
                          }
                        />
                      </Box>
                    )}
                    {disable &&
                    fileCodeBefore &&
                    fileCodeBefore?.length <= 0 ? (
                      <EmptyImage text="ไม่มีไฟล์" />
                    ) : (
                      fileCodeBefore &&
                      fileCodeBefore?.length > 0 && (
                        <ListFileCardDragField
                          files={fileCodeBefore}
                          setFiles={(f) => setFileCodeBefore(f)}
                          onClickDelete={(f) => handleDeleteFileCodeBefore(f)}
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
                    อัปโหลด ไฟล์โค้ด หลังซ่อม
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
                    {!disable && fileCodeAfter?.length < LIMITFILE && (
                      <Box
                        style={{
                          width: fileCodeAfter?.length > 0 ? "168px" : "100%",
                          minWidth:
                            fileCodeAfter?.length > 0 ? "168px" : "auto",
                          marginTop: "10px",
                        }}
                      >
                        <UploadField
                          id="image_url_id"
                          isError={errorMessage !== undefined}
                          acceptDescription={".bin, .enc"}
                          files={fileCodeAfter}
                          onLoading={(loading) =>
                            setIsLoadingUploadFile(loading)
                          }
                          onCheckFileUpload={(f) => {
                            setActiveUploadFileID("image_url_id");
                            onCheckFileUpload(f, fileCodeAfter).then((file) => {
                              setFileCodeAfter(file);
                            });
                          }}
                          acceptOption={{
                            "application/bin": [".bin"],
                            "application/enc": [".enc"],
                          }}
                          iconFileUpload={
                            <TbFileImport
                              style={{ width: "64px", height: "64px" }}
                              className="mb-4 self-center mt-[8px] touch-none pointer-events-none"
                            />
                          }
                        />
                      </Box>
                    )}
                    {disable && fileCodeAfter && fileCodeAfter?.length <= 0 ? (
                      <EmptyImage text="ไม่มีไฟล์" />
                    ) : (
                      fileCodeAfter &&
                      fileCodeAfter?.length > 0 && (
                        <ListFileCardDragField
                          files={fileCodeAfter}
                          setFiles={(f) => setFileCodeAfter(f)}
                          onClickDelete={(f) => handleDeleteFileCodeAfter(f)}
                        />
                      )
                    )}
                  </Box>
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

export default DialogAttachmentRepairReceiptBox;
