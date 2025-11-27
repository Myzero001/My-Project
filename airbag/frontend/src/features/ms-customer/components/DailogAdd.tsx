import { Dialog, Box, Spinner, Flex, Text } from "@radix-ui/themes";
import Buttons from "@/components/customs/button/button.main.component";
import { useEffect, useState } from "react";
import { blobToFile } from "@/types/file";
import UploadField from "@/components/customs/uploadFIle/uploadField";
import { ImageUploadCompression } from "@/utils/ImageUploadCompression";
import ListFileCardDragField from "@/components/customs/uploadFIle/listFileCardDragField";
import AlertDialogComponent from "@/components/customs/alertDialogs/alertDialog";
import { fetchFileByURL, fetchImages } from "@/services/file.service";


import { MS_CUSTOMER_ALL } from "@/types/response/response.ms_customer";

type DialogAttachmentProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onConfirm?: () => void;
  defaultImage: blobToFile[];
  onChangeImage: (images: blobToFile[]) => void;
  errorMessage?: string;
  quotationData: MS_CUSTOMER_ALL | undefined;
  isChangeFile: boolean;
  disable?: boolean;
};

const DialogAttachment = ({
  isOpen,
  onClose,
  title,
  defaultImage,
  onChangeImage,
  errorMessage,
  quotationData,
  isChangeFile,
  disable,
}: DialogAttachmentProps) => {
  // state
  const LIMITFILE = 20;
  const maxSizeFile = 5; // 20Mb
  const [isLoadingUploadFile, setIsLoadingUploadFile] =
    useState<boolean>(false);
  const [openAlertFileSize, setOpenAlertFileSize] = useState<boolean>(false);

  const [activeUploadFileID, setActiveUploadFileID] = useState<string>("");
  const [fileDelete, setFileDelete] = useState<blobToFile[]>([]);

  const [images, setImages] = useState<blobToFile[]>(defaultImage);
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
    const oldFile: blobToFile[] = images;
    const oldFileDelete = fileDelete;
    const newFile = oldFile.filter((f) => {
      if (f?.id !== file?.id) {
        return f?.id !== file?.id;
      } else if (file?.status !== "new") {
        setFileDelete([...oldFileDelete, f]);
      }
    });
    setImages(newFile);
  };

  const handleChangeImage = () => {
    onChangeImage(images);
    onClose();
  };

  const handleClose = () => {
    setImages(defaultImage);
    onClose();
  };

  const fetchFileData = async (data: MS_CUSTOMER_ALL) => {
    if (data.image_url) {
      setIsLoadingData(true);

      const preData: {
        image_url: blobToFile[];
      } = {
        image_url: [],
      };

      const image_urls = data.image_url.split(",");

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
      setImages(preData.image_url);
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen && quotationData) {
      if (!isChangeFile) {
        fetchFileData(quotationData);
      }
    }

    console.log("defaultImage", defaultImage);
  }, [quotationData, isOpen]);

  return (
    <>
      <Dialog.Root
        open={isOpen}
        onOpenChange={disable ? handleClose : undefined}
      >
        <Dialog.Content maxWidth="1024px" className=" relative">
          <Dialog.Title>{title}</Dialog.Title>
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
                    อัปโหลด {title}
                    <div className=" text-red-500">*</div>
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
                    {!disable && images?.length < LIMITFILE && (
                      <Box
                        style={{
                          width: images?.length > 0 ? "168px" : "100%",
                          minWidth: images?.length > 0 ? "168px" : "auto",
                          marginTop: "10px",
                        }}
                      >
                        <UploadField
                          id="image_url_id"
                          isError={errorMessage !== undefined}
                          acceptDescription={".JPEG, .JPG, .PNG"}
                          files={images}
                          onLoading={(loading) =>
                            setIsLoadingUploadFile(loading)
                          }
                          onCheckFileUpload={(f) => {
                            setActiveUploadFileID("image_url_id");
                            onCheckFileUpload(f, images).then((file) => {
                              setImages(file);
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
                    {images && images?.length > 0 && (
                      <ListFileCardDragField
                        files={images}
                        setFiles={(f) => setImages(f)}
                        onClickDelete={(f) => handleDeleteFile(f)}
                        disable={disable}
                      />
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

export default DialogAttachment;
