import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import { Flex } from "@radix-ui/themes";
import { GiMoneyStack, GiReceiveMoney } from "react-icons/gi";
import { FaMoneyBill } from "react-icons/fa6";
import { CiImageOn } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { getPaymentByRepairReceiptId } from "@/services/ms.payment.service";
import { PAYMENTTYPE } from "@/types/response/response.payment";
import dayjs from "dayjs";
import CardSummary from "../../components/cardSummary";
import { getRepairReceiptById } from "@/services/ms.repair.receipt";
import { repairReceipt } from "@/types/response/response.repair-receipt";
import DialogShowImages from "@/components/customs/dialog/dialog.show.images";
import { blobToFile } from "@/types/file";
import { fetchFileByURL, fetchImages } from "@/services/file.service";
import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import { TYPE_MONEY_TEXT } from "@/types/requests/request.payment";

type dataTableType = {
  className: string;
  cells: (
    | {
        value: string | undefined;
        className: string;
      }
    | {
        value: JSX.Element;
        className: string;
      }
  )[];
  data: PAYMENTTYPE;
}[];

export default function RepairReceiptPaymentSummaryCreate() {
  const [data, setData] = useState<dataTableType>([]);
  const [dataPayment, setDataPayment] = useState<PAYMENTTYPE[]>([]);
  const [dataRepairReceipt, setDataRepairReceipt] = useState<repairReceipt>();
  const [images, setImages] = useState<blobToFile[]>([]);
  const [isOpenFullImage, setIsOpenFullImage] = useState(false);
  const [isloadingData, setIsloadingData] = useState(false);
  const total_price_all = dataRepairReceipt?.total_price ?? 0;
  const total_price_receipted =
    dataPayment.reduce((sum, item) => sum + item.price, 0) ?? 0;

  const total_price_for_receipt = total_price_all - total_price_receipted;

  const { repairReceiptId } = useParams();

  const headers = [
    { label: "วันที่ชำระ", colSpan: 1, className: "w-[140px]" },
    { label: "จำนวนเงินรับชำระ", colSpan: 1, className: "w-[160px]" },
    { label: "เลขที่ใบการชำระเงิน", colSpan: 1, className: "w-[160px]" },
    { label: "ช่องทางการชำระ", colSpan: 1, className: "w-[160px]" },
    { label: "หมายเหตุ", colSpan: 1, className: "" },
    { label: "รูป", colSpan: 1, className: "w-[100px]" },
  ];

  useEffect(() => {
    if (repairReceiptId) {
      setIsloadingData(true);
      getRepairReceiptById(repairReceiptId).then((response) => {
        setDataRepairReceipt(response.responseObject);
      });
      getPaymentByRepairReceiptId(repairReceiptId).then(async (response) => {
        if (response.responseObject) {
          setDataPayment(response.responseObject);
          const formattedData = await Promise.all(
            response.responseObject?.map(async (item, index) => {
              const image =
                item.payment_image_url !== ""
                  ? item.payment_image_url?.split(",")
                  : [];
              const preData: {
                payment_image_url: blobToFile[];
              } = {
                payment_image_url: [],
              };
              const payment_image_url = image;
              if (payment_image_url && payment_image_url?.length > 0) {
                preData.payment_image_url = await Promise.all(
                  payment_image_url.map(async (res) => {
                    const response = await fetchFileByURL(res);
                    if (response.responseObject) {
                      const response_image_urls = await fetchImages(
                        response.responseObject
                      );
                      return response_image_urls[0];
                    }
                  })
                );
              }

              return {
                className: "",
                cells: [
                  {
                    value: dayjs(item?.created_at).format("DD/MM/YYYY"),
                    className: "text-center",
                  },
                  {
                    value: item?.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }),
                    className: "text-end",
                  },
                  {
                    value: item?.payment_doc,
                    className: "text-center",
                  },
                  {
                    value:
                      TYPE_MONEY_TEXT[
                        item?.type_money as keyof typeof TYPE_MONEY_TEXT
                      ] || "ไม่ระบุ",
                    className: "text-center",
                  },
                  {
                    value: item?.remark,
                    className: "text-start",
                  },
                  {
                    value: (
                      <div className=" flex justify-center">
                        <CiImageOn
                          className={`   ${
                            image && image?.length > 0
                              ? "text-[#00337d] cursor-pointer"
                              : "text-gray opacity-50"
                          }`}
                          size={"24px"}
                          onClick={() => {
                            if (image && image?.length > 0) {
                              setImages(preData.payment_image_url);
                              setIsOpenFullImage(true);
                            }
                          }}
                        />
                      </div>
                    ),
                    className: "text-center",
                  },
                ],
                data: item,
              };
            })
          );
          setIsloadingData(false);
          setData(formattedData);
        }
      });
    }
  }, [repairReceiptId]);

  return (
    <div className="container w-full m-auto">
      <Flex gap={"4"}>
        <CardSummary
          icon={<FaMoneyBill className="w-10 h-10 text-yellow-500" />}
          value={
            dataRepairReceipt?.total_price?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) ?? 0
          }
          description={"จำนวนเงินที่ต้องได้รับทั้งหมด"}
        />
        <CardSummary
          icon={<GiReceiveMoney className="w-10 h-10 text-green-500" />}
          value={dataPayment
            .reduce((sum, item) => sum + item.price, 0)
            .toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          description={"จำนวนเงินที่ได้รับแล้ว"}
        />
        <CardSummary
          icon={<GiMoneyStack className="w-10 h-10 text-green-500" />}
          value={total_price_for_receipt.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          description={"จำนวนเงินคงเหลือ"}
        />
      </Flex>
      <div className="flex flex-col  w-full h-full mt-4 bg-white rounded-md">
        {isloadingData ? (
          <BoxLoadingData height="500px" />
        ) : (
          <MasterTableFeature
            title="รายการรับซ่อม"
            hideTitleBtn
            inputs={[]}
            headers={headers}
            rowData={data}
            totalData={dataPayment.length}
            hideTitle
            classNameTable=" pt-0"
            hidePagination
          />
        )}
      </div>

      <DialogShowImages
        images={images.map((f) => f.imageURL)}
        onClose={() => setIsOpenFullImage(false)}
        isOpen={isOpenFullImage}
      />
    </div>
  );
}
