import { Box, Flex, Text, Button } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import JsBarcode from "jsbarcode";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { jsPDF } from "jspdf"; // นำเข้า jsPDF
import THSarabunNew from "@/../font/THSarabunNew.ttf";
import { m } from "framer-motion";

interface BarcodeFeatureProps {
  brand_name: string;
  brand_model: string;
  customer: string;
  code: string;
  formattedDateString: string;
  doc: string;
  master_repair_name: string;
  carregister: string;
  barcode: string;
}

export default function BarcodeFeature({
  brand_name,
  brand_model,
  customer,
  code,
  formattedDateString,
  doc,
  master_repair_name,carregister,
  barcode,
}: BarcodeFeatureProps) {
  const [inputValue, setInputValue] = useState<string>(doc); // เริ่มต้นเป็นค่าว่าง
  const [barcodes, setBarcodes] = useState<string[]>([]); // เก็บรายการบาร์โค้ด
  const [carname, setCarname] = useState<string>(brand_model);
  const [brandName, setBrandName] = useState<string>(brand_name);
  const [customerName, setCustomerName] = useState<string>(customer);
  const [codeName, setCodeName] = useState<string>(code);
  const [formattedDate, setFormattedDate] =
    useState<string>(formattedDateString);
  const { showToast } = useToast();

  useEffect(() => {
    setInputValue(doc);
    //console.log(`ชื่ออะไรส่งมา`, master_repair_name);
    // อัปเดตค่า inputValue เมื่อ brand_name เปลี่ยน
  }, [brand_name]);
  const handleGenerateAndShowPDF = () => {
    // if (!/^[A-Za-z0-9]+$/.test(inputValue.trim())) {
    //     showToast("กรุณาระบุเฉพาะตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น", false);
    //     return;
    // }

    const updatedBarcodes = [...barcodes, inputValue.trim()];
    setBarcodes(updatedBarcodes);

    const doc = new jsPDF({
      unit: "mm",
      format: [50, 20],
      orientation: "landscape", // เปลี่ยนเป็น "landscape" ได้หากต้องการกระดาษแนวนอน
    });
    doc.addFont(THSarabunNew, "THSarabunNew", "normal");
    doc.setFont("THSarabunNew");

    const pageWidth = 50;
    const pageHeight = 20;
    const margin = 0;
    const barcodeWidth = 43;
    const barcodeHeight = 15;
    // const framePadding = 0;
    const paddingTop = 0;

    const numBarcodesHorizontal = 3;

    setTimeout(() => {
      updatedBarcodes.forEach((code, index) => {
        if (index > 0) {
          doc.addPage();
        }
        const colIndex = index % numBarcodesHorizontal;
        const rowIndex = Math.floor(index / numBarcodesHorizontal);

        const xPos = (pageWidth - barcodeWidth) / 2;
        const yPos = (pageHeight - barcodeHeight) / 2;

        const canvas = document.createElement("canvas");
        JsBarcode(canvas, barcode, {
          format: "CODE128",
          width: 1,
          height: barcodeHeight,
          displayValue: false,
        });

        const imageData = canvas.toDataURL("image/png");

        const frameWidth = barcodeWidth * 2;
        const frameHeight = barcodeHeight;

        doc.setLineWidth(0.5);
        doc.rect(0, 0, pageWidth, pageHeight);

        doc.addImage(imageData, "PNG", xPos, yPos, barcodeWidth, barcodeHeight);

        doc.setFontSize(6);
        doc.text(barcode, pageWidth / 2, yPos + barcodeHeight - 2, {
          align: "center",
        });

        doc.setFontSize(6);
        doc.text(`${codeName}`, xPos - 2, yPos, { align: "left" });

        doc.setFontSize(6);
        doc.text(` ${formattedDate}`, xPos + 37, yPos, { align: "left" });

        doc.setFontSize(6);
        doc.text(
          `${master_repair_name}`,
          pageWidth / 2,
          yPos + 3,
          {
            align: "center",
          }
        );

        doc.setFontSize(8);
        doc.text(`${brandName}/${carname}`, xPos - 2, yPos + barcodeHeight + 1);

        doc.setFontSize(6);
        doc.text(`หมายเลขทะเบียน ${carregister}`, xPos + 30, yPos + barcodeHeight + 1, { align: "left" });
      });

      const pdfData = doc.output("bloburl");
      const pdfWindow = window.open(pdfData, "_blank");
      if (!pdfWindow) {
      }
    }, 0);

    setInputValue("");
  };

  useEffect(() => {
    handleGenerateAndShowPDF();
  }, []);

  return null;
}
