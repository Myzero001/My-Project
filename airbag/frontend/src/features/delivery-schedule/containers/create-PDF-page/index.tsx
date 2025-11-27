// src/pages/CreatePDFPage.tsx
// (หรือตาม path จริงที่คุณใช้งาน เช่น src/features/delivery-schedule/containers/create-PDF-page.tsx)

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer, // ไม่ต้องใช้ PDFViewer ที่นี่
  Font,
  Image,
} from "@react-pdf/renderer";
import { useSearchParams } from "react-router-dom"; // ไม่ต้องใช้ useSearchParams
import { useEffect, useState } from "react"; // ไม่ต้องใช้ useEffect, useState
import { DateShortTH } from "@/utils/formatDate";
import QRCode from "qrcode"; // ไม่ต้องใช้ QRCode ที่นี่ เพราะถูกสร้างมาจากคอมโพเนนต์แม่แล้ว

// ไม่ต้อง import service functions ที่นี่แล้ว
import { getDeliveryScheduleById } from "@/services/ms.delivery.service";
// import { DeliverySchedule } from "@/types/response/response.delivery-schedule"; // แต่ type DeliverySchedule ยังคงจำเป็น
import { getRepairReceiptListRepairByRepairReceiptIdActive } from "@/services/repair.receipt.list.repair.service";
import { getQRcode } from "@/services/get_qrcode";

// Import Type ที่จำเป็นเท่านั้น
import { DeliverySchedule } from "@/types/response/response.delivery-schedule";

Font.register({ family: "THSarabunNew", src: "/fonts/THSarabunNew.ttf" });
Font.register({
  family: "THSarabunNewBold",
  src: "/fonts/THSarabunNewBold.ttf",
});
Font.registerHyphenationCallback((word) => [word]);

// นี่คือคอมโพเนนต์ PDF ที่จะถูก render โดย pdf().toBlob()
export const MyPDFDocument: React.FC<{
  deliveryData?: DeliverySchedule;
  repairItems?: string[];
  price?: number | string;
  priceTax?: number | string;
  tax?: number;
  total?: number | string;
  qrCodeBase64?: string | null;
  paymentLinkQrCodeBase64?: string | null; // This prop receives the generated QR code
}> = ({
  deliveryData,
  repairItems = [],
  priceTax = 0,
  price = 0,
  tax = 0,
  total = 0,
  qrCodeBase64 = "",
  paymentLinkQrCodeBase64 = "", // Use the prop directly
}) => {
  const itemsPerPage = 30;
  const pages = Math.max(1, Math.ceil(repairItems.length / itemsPerPage));

  const numberToThaiText = (num: number | string): string => {
    const numStr = String(Number(num).toFixed(2));
    const [bahtStr, satangStr] = numStr.split(".");

    if (Number(bahtStr) === 0 && Number(satangStr) === 0) {
      return "ศูนย์บาทถ้วน";
    }

    const thaiNumbers = [
      "",
      "หนึ่ง",
      "สอง",
      "สาม",
      "สี่",
      "ห้า",
      "หก",
      "เจ็ด",
      "แปด",
      "เก้า",
    ];
    const thaiUnits = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

    const convert = (nStr: string): string => {
      let output = "";
      const len = nStr.length;

      if (len > 7) {
        const millionsPart = nStr.substring(0, len - 6);
        const remainderPart = nStr.substring(len - 6);
        const remainderText = convert(remainderPart);
        return (
          convert(millionsPart) +
          "ล้าน" +
          (Number(remainderPart) > 0 ? remainderText : "")
        );
      }

      for (let i = 0; i < len; i++) {
        const digit = parseInt(nStr[i]);
        if (digit === 0) continue;
        const position = len - 1 - i;
        if (position === 1 && digit === 1) {
          output += "สิบ";
        } else if (position === 1 && digit === 2) {
          output += "ยี่สิบ";
        } else if (position === 0 && digit === 1 && len > 1) {
          output += "เอ็ด";
        } else {
          output += thaiNumbers[digit] + thaiUnits[position];
        }
      }
      return output;
    };

    let bahtText = "";
    if (Number(bahtStr) > 0) {
      bahtText = convert(bahtStr) + "บาท";
    }

    let satangText = "";
    if (Number(satangStr) > 0) {
      satangText = convert(satangStr) + "สตางค์";
    } else if (Number(bahtStr) > 0) {
      satangText = "ถ้วน";
    }

    return bahtText + satangText;
  };

  return (
    <Document>
      {Array.from({ length: pages }).map((_, pageIndex) => (
        <Page size="A4" style={styles.page} key={pageIndex}>
          {/* Use the prop for payment link QR code */}
          {paymentLinkQrCodeBase64 && (
            <View
              style={{
                position: "absolute",
                right: 30,
                top: 50,
                alignItems: "center",
              }}
            >
              <Text style={styles.text}>ไปยังหน้าชำระเงิน </Text>
              <Image src={paymentLinkQrCodeBase64} style={{ width: 100, height: 100 }} />
            </View>
          )}

          {qrCodeBase64 && (
            <View
              style={{
                position: "absolute",
                left: 30,
                top: 50,
                alignItems: "center",
              }}
            >
              <Text style={styles.text}>QR Code ชำระเงิน </Text>
              <Image src={qrCodeBase64} style={{ width: 100, height: 100 }} />
            </View>
          )}

          <View style={styles.footerPaging}>
            <Text style={styles.text}>
              หน้าที่ {pageIndex + 1} / {pages}
            </Text>
          </View>
          <Text style={[styles.header, { marginTop: 30 }]}>ใบส่งมอบ</Text>
          <View>
            <Text style={styles.text}>
              บริษัท {deliveryData?.companies?.company_name ?? "-"}
            </Text>
            {deliveryData?.companies?.company_tin && (
              <Text style={styles.text}>
                เลขที่ผู้เสียภาษี {deliveryData?.companies?.company_tin}
              </Text>
            )}
            <Text style={styles.text}>
              ที่อยู่ {deliveryData?.companies?.addr_number ?? "-"} หมู่{" "}
              {deliveryData?.companies?.addr_alley ?? "-"} ซอย
              {deliveryData?.companies?.addr_district ?? "-"} ถนน
              {deliveryData?.companies?.addr_street ?? "-"}
            </Text>
            <Text style={styles.text}>
              {" "}
              ตําบล{deliveryData?.companies?.addr_subdistrict ?? "-"} อําเภอ
              {deliveryData?.companies?.addr_district ?? "-"} จังหวัด
              {deliveryData?.companies?.addr_province ?? "-"}{" "}
              {deliveryData?.companies?.addr_postcode ?? "-"}
            </Text>
            <Text style={styles.text}>
              เบอร์โทรศัพท์ {deliveryData?.companies?.tel_number ?? "-"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "80%",
            }}
          >
            <View style={{ margin: 10 }}>
              <Text style={styles.text}>
                ชื่อกิจการ{" "}
                {deliveryData?.master_repair_receipt?.master_quotation
                  ?.master_customer?.customer_name ?? "-"}
              </Text>
              {deliveryData?.master_repair_receipt?.master_quotation
                ?.master_customer?.customer_tin && (
                <Text style={styles.text}>
                  เลขที่ผู้เสียภาษี{" "}
                  {deliveryData?.master_repair_receipt?.master_quotation
                    ?.master_customer?.customer_tin}
                </Text>
              )}
              <Text style={styles.text}>
                ที่อยู่ {deliveryData?.addr_number ?? "-"} ซอย{" "}
                {deliveryData?.addr_alley ?? "-"} ถนน{" "}
                {deliveryData?.addr_street ?? "-"}
              </Text>
              <Text style={styles.text}>
                {" "}
                ตําบล {deliveryData?.addr_subdistrict ?? "-"} อําเภอ{" "}
                {deliveryData?.addr_district ?? "-"} จังหวัด{" "}
                {deliveryData?.addr_province ?? "-"}{" "}
                {deliveryData?.addr_postcode ?? "-"}
              </Text>
              <Text style={styles.text}>
                ชื่อลูกค้า {deliveryData?.customer_name ?? "-"} เบอร์โทรศัพท์{" "}
                {deliveryData?.contact_number ?? "-"}
              </Text>
              <Text style={styles.text}>
                แบรนด์{" "}
                {deliveryData?.master_repair_receipt?.master_quotation
                  ?.master_brand?.brand_name ?? "-"}{" "}
                รุ่น{" "}
                {deliveryData?.master_repair_receipt?.master_quotation
                  ?.master_brandmodel?.brandmodel_name ?? "-"}{" "}
                สี{" "}
                {deliveryData?.master_repair_receipt?.master_quotation
                  ?.master_color?.color_name ?? "-"}
              </Text>
            </View>
            <View style={{ margin: 10 }}>
              <Text style={styles.text}>
                วันที่ส่งมอบ{" "}
                {deliveryData?.delivery_date
                  ? DateShortTH(new Date(deliveryData.delivery_date))
                  : "-"}
              </Text>
              <Text style={styles.text}>
                เลขที่ใบส่งมอบ {deliveryData?.delivery_schedule_doc}
              </Text>
              <Text style={styles.text}>
                เลขที่ใบรับซ่อม{" "}
                {deliveryData?.master_repair_receipt?.repair_receipt_doc}
              </Text>
            </View>
          </View>
          <View style={styles.table}>
            {repairItems.length === 0 ? (
              <>
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, styles.headerCell, { width: "100%" }]}
                  >
                    รายการซ่อม
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: "100%",
                        textAlign: "center",
                        height: 200,
                        paddingTop: 90,
                      },
                    ]}
                  >
                    - ไม่มีรายการซ่อม -
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.headerCell]}>รายการซ่อม</Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>รายการซ่อม</Text>
                  <Text style={[styles.tableCell, styles.headerCell]}>รายการซ่อม</Text>
                </View>
                {Array.from({ length: 10 }).map((_, rowIndex) => {
                  const rowData = repairItems.slice(
                    pageIndex * itemsPerPage + rowIndex * 3,
                    pageIndex * itemsPerPage + rowIndex * 3 + 3
                  );
                  while (rowData.length < 3) {
                    rowData.push("");
                  }
                  return (
                    <View style={styles.tableRow} key={rowIndex}>
                      {rowData.map((item, cellIndex) => (
                        <Text
                          style={[
                            styles.tableCell,
                            {
                              fontSize:
                                item.length > 45
                                  ? 10
                                  : item.length > 40
                                  ? 11
                                  : item.length > 35
                                  ? 12
                                  : 14,
                            },
                          ]}
                          key={cellIndex}
                        >
                          {item}
                        </Text>
                      ))}
                    </View>
                  );
                })}
              </>
            )}
          </View>
          <View style={styles.summaryContainer}>
            <View style={styles.leftColumn}>
              <Text style={styles.text}>หมายเหตุ</Text>
              <View style={styles.textArea}>
                <Text style={[styles.text, { flexWrap: "wrap", flexShrink: 1 }]}>
                  {deliveryData?.remark?.trim()
                    ? deliveryData.remark.replace(/\s+/g, " ")
                    : "-"}
                </Text>
              </View>
              <Text style={styles.thaiTotalText}>({numberToThaiText(price)})</Text>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.totalsRow}>
                <Text style={styles.text}>ราคา</Text>
                <Text style={styles.text}>
                  {pageIndex === pages - 1
                    ? Number(total).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "-"}
                  บาท
                </Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.text}>ภาษี {tax}%</Text>
                <Text style={styles.text}>
                  {pageIndex === pages - 1
                    ? Number(priceTax).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "-"}
                  บาท
                </Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.text}>ราคารวมภาษี</Text>
                <Text style={[styles.text, { fontFamily: "THSarabunNewBold" }]}>
                  {pageIndex === pages - 1
                    ? Number(price).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "-"}
                  <Text style={{ fontFamily: "THSarabunNew" }}> บาท</Text>
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.footerTimestamp}>
            <Text style={styles.text}>
              พิมพ์เมื่อวันที่{" "}
              {new Intl.DateTimeFormat("th-TH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).format(new Date())}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    alignItems: "center",
    flexDirection: "column",
    padding: 30,
    fontFamily: "THSarabunNew",
  },
  text: { fontSize: 14, fontFamily: "THSarabunNew" },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    alignItems: "center",
    fontFamily: "THSarabunNewBold",
  },
  table: {
    maxWidth: "100%",
    width: "80%",
    borderStyle: "solid",
    borderWidth: 0.5,
    marginTop: 10,
  },
  tableRow: { flexDirection: "row" },
  tableCell: {
    flex: 1,
    padding: 4,
    minHeight: 30,
    borderWidth: 0.5,
    textAlign: "left",
    fontSize: 14,
    fontFamily: "THSarabunNew",
    flexWrap: "wrap",
  },
  headerCell: {
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#f0f0f0",
    fontFamily: "THSarabunNewBold",
  },
  summaryContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    alignItems: "flex-start",
  },
  leftColumn: { flex: 3, flexDirection: "column" },
  rightColumn: { flex: 2, flexDirection: "column", paddingLeft: 10 },
  textArea: {
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 4,
    marginTop: 5,
    borderRadius: 5,
    minHeight: 55,
  },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 2 },
  thaiTotalText: {
    fontSize: 12,
    fontFamily: "THSarabunNew",
    textAlign: "left",
    marginTop: 8,
    paddingLeft: 4,
  },
  footerPaging: { position: "absolute", right: 30, top: 20 },
  footerTimestamp: { position: "absolute", bottom: 10, right: 30 },
});

const CreatePDFPage = () => {
  const [searchParams] = useSearchParams();
  const DeliverySchID = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(true);
  const [deliveryData, setDeliveryData] = useState<DeliverySchedule | null>(null);
  const [repairNames, setRepairNames] = useState<string[]>([]);
  const [totalPricetax, settotalPricetax] = useState<number | string>(0);
  const [priceTax, setPriceTax] = useState<number | string>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number | string>(0);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [paymentLinkQrCodeBase64, setPaymentLinkQrCodeBase64] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true); // Start loading

      if (!DeliverySchID) {
        console.warn("Delivery Schedule ID is missing. Cannot generate PDF.");
        setIsLoading(false);
        return;
      }

      console.log("Loading data for Delivery Schedule ID:", DeliverySchID); // Debugging start

      try {
        const deliveryResponse = await getDeliveryScheduleById(DeliverySchID);
        console.log("Delivery Response:", deliveryResponse); // Debugging response

        if (!deliveryResponse || !deliveryResponse.responseObject) {
          throw new Error("ไม่พบข้อมูล Delivery หรือ responseObject ว่างเปล่า");
        }
        const currentDelivery = deliveryResponse.responseObject;
        setDeliveryData(currentDelivery);
        console.log("Current Delivery Data:", currentDelivery); // Debugging delivery data

        const receiptId = currentDelivery.repair_receipt_id;
        if (!receiptId) {
          throw new Error("Delivery นี้ไม่มีข้อมูลใบเสร็จเชื่อมโยงอยู่");
        }

        const mainReceiptData = currentDelivery.master_repair_receipt;
        if (!mainReceiptData) {
          throw new Error("ไม่พบข้อมูล master_repair_receipt ใน object ที่ได้รับ");
        }

        const taxRate = Number(mainReceiptData.tax) || 0;
        const taxStatus = currentDelivery.companies?.tax_status;
        const totalPrice = Number(mainReceiptData.total_price) || 0;
        let finalPrice = 0;

        if (taxStatus === "true") {
          finalPrice = totalPrice + (totalPrice * taxRate) / 100;
        } else {
          finalPrice = totalPrice;
        }
        settotalPricetax(finalPrice);
        console.log("Calculated Final Price:", finalPrice); // Debugging final price

        const repairItemsResponse = await getRepairReceiptListRepairByRepairReceiptIdActive(
          receiptId
        );
        const names: string[] = (repairItemsResponse.responseObject ?? [])
          .map((item) => item.master_repair?.master_repair_name)
          .filter(Boolean) as string[];
        setRepairNames(names);
        console.log("Repair Names:", names); // Debugging repair items

        // --- Generate PromptPay QR Code ---
        if (currentDelivery.companies?.promtpay_id && finalPrice > 0) {
          console.log(
            `Attempting to generate PromptPay QR: ID=${currentDelivery.companies.promtpay_id}, Price=${finalPrice}`
          );
          try {
            const base64 = await getQRcode(
              `${currentDelivery.companies.promtpay_id}`,
              `${finalPrice}`
            );
            setQrCodeBase64(base64);
            console.log("PromptPay QR Code generated successfully.");
          } catch (qrErr) {
            console.error("Error generating PromptPay QR Code:", qrErr);
            setQrCodeBase64(null);
          }
        } else {
          setQrCodeBase64(null);
          console.warn(
            "PromptPay QR Code skipped: Missing promtpay_id or finalPrice is zero/negative."
          );
        }

        // --- Generate Payment Link QR Code ---
        if (currentDelivery && currentDelivery.id) {
          const paymentLink = `${
            import.meta.env.VITE_FRONTEND_URL
          }/ms-payment/${currentDelivery.id}?status=create`;
          console.log("Attempting to generate Payment Link QR for URL:", paymentLink); // VERY IMPORTANT DEBUGGING POINT
          try {
            const url = await QRCode.toDataURL(paymentLink);
            setPaymentLinkQrCodeBase64(url);
            console.log("Payment Link QR Code generated successfully.");
          } catch (linkQrErr) {
            console.error(
              "Error generating Payment Link QR Code. Check URL validity:",
              linkQrErr
            );
            setPaymentLinkQrCodeBase64(null);
          }
        } else {
          setPaymentLinkQrCodeBase64(null);
          console.warn("Payment Link QR Code skipped: deliveryData or ID is missing.");
        }
      } catch (error) {
        console.error("Failed to load all data for PDF. Critical error:", error);
        // Clear all relevant states on critical error
        setDeliveryData(null);
        setRepairNames([]);
        settotalPricetax(0);
        setPriceTax(0);
        setTax(0);
        setTotal(0);
        setQrCodeBase64(null);
        setPaymentLinkQrCodeBase64(null);
      } finally {
        setIsLoading(false); // End loading
        console.log("Finished data loading and QR generation attempts."); // Debugging end
      }
    };

    loadAllData();
  }, [DeliverySchID]); // Re-run when DeliverySchID changes

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        กำลังสร้างเอกสาร PDF กรุณารอสักครู่...
      </div>
    );
  }

  if (!deliveryData) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "50px", fontSize: "18px", color: "red" }}
      >
        ไม่พบข้อมูลสำหรับสร้างเอกสาร
      </div>
    );
  }

  return (
    <div>
      <PDFViewer width="100%" height="1280px">
        <MyPDFDocument
          deliveryData={deliveryData}
          repairItems={repairNames}
          price={totalPricetax}
          tax={tax}
          priceTax={priceTax}
          total={total}
          qrCodeBase64={qrCodeBase64}
          paymentLinkQrCodeBase64={paymentLinkQrCodeBase64}
        />
      </PDFViewer>
    </div>
  );
};

export default CreatePDFPage;