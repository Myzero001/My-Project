import { Reorder, AnimatePresence, motion } from "framer-motion";
import { Box } from "@radix-ui/themes";
import { IoIosClose, IoMdDownload } from "react-icons/io";
import { blobToFile } from "@/types/file";
import { FaFile } from "react-icons/fa6";
import { formatFileSize } from "@/utils/formatFileSize";
import { downloadFIle } from "@/utils/downloadfile";
import { useState } from "react";
import ErrorField from "@/components/customs/uploadFIle/errorField";
import DialogShowImages from "@/components/customs/dialog/dialog.show.images";

type ListFileCardFieldProps = {
  files: blobToFile[];
  setFiles: (files: blobToFile[]) => void;
  onClickDelete: (file: blobToFile) => void;
  disable?: boolean;
};
const ListFileCardField = (props: ListFileCardFieldProps) => {
  const { files, setFiles, onClickDelete, disable } = props;

  const [isOpenFullImage, setIsOpenFullImage] = useState(false);

  return (
    <Box className=" flex flex-wrap gap-[2px]">
      {files?.map((file) => (
        <div key={file?.id}>
          <Box
            key={file?.id}
            style={{
              position: "relative",
              borderRadius: "8px",
              padding: "0px",
              width: "126px",
              height: "126px",
              maxHeight: "126px",
              overflow: "hidden",
            }}
            className="block"
          >
            {file?.error ? (
              <ErrorField />
            ) : (
              <CardImage
                imageURL={file?.imageURL}
                onClickImage={() => setIsOpenFullImage(true)}
              />
            )}
            {!disable && (
              <Box
                onClick={() => {
                  onClickDelete(file);
                }}
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: 32,
                  height: 32,
                  backgroundColor: "white",
                  borderRadius: "50%",
                  padding: "8px",
                  cursor: "pointer",
                  boxShadow: "0px 3.6px 12px 0px rgba(132, 147, 198, 0.12)",
                }}
              >
                <IoIosClose
                  style={{
                    width: "16px",
                    height: "16px",
                    minWidth: "16px",
                  }}
                />
              </Box>
            )}
          </Box>

          {/* <Reorder.Item
                value={file}
                key={file?.id}
                id={file?.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: 1,
                  backgroundColor: "#fff",
                  y: 0,
                  transition: { duration: 0.15 },
                }}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
                whileDrag={{
                  backgroundColor: "transparent",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  borderRadius: "8px",
                }}
                style={{
                  position: "relative",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                }}
                className=" sm:block hidden"
              >
                <motion.span
                  layout="position"
                  style={{
                    cursor: "pointer",
                    borderRadius: "8px",
                    padding: "0px",
                    width: "126px",
                    height: "126px",
                    maxHeight: "126px",
                  }}
                >
                  {file?.error ? <ErrorField /> : <CardImage imageURL={file?.imageURL} />}
                  <Box
                    onClick={() => onClickDelete(file)}
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 32,
                      height: 32,
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: "8px",
                      cursor: "pointer",
                      boxShadow: "0px 3.6px 12px 0px rgba(132, 147, 198, 0.12)",
                    }}
                  >
                    <IoIosClose
                      style={{
                        width: "16px",
                        height: "16px",
                        minWidth: "16px",
                      }}
                    />
                  </Box>
                </motion.span>
              </Reorder.Item> */}
        </div>
      ))}

      <DialogShowImages
        images={files?.map((f) => f.imageURL)}
        onClose={() => setIsOpenFullImage(false)}
        isOpen={isOpenFullImage}
      />
    </Box>
  );
};

export default ListFileCardField;

const CardImage = ({
  imageURL,
  onClickImage,
}: {
  imageURL: string;
  onClickImage: () => void;
}) => {
  return (
    <Box
      style={{
        borderRadius: "8px",
        padding: "0px",
        width: "126px",
        height: "126px",
        maxHeight: "126px",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={onClickImage}
    >
      <div
        style={{
          backgroundImage: `url(${imageURL})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          touchAction: "none",
          pointerEvents: "none",
          borderRadius: "8px",
          overflow: "hidden",
        }}
        className=" h-[126px] rounded-8 min-w-[126px] max-h-[126px]"
      />
    </Box>
  );
};
