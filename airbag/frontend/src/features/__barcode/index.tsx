import { Box, Flex, Text, Button } from "@radix-ui/themes";
import { useState } from "react";
import JsBarcode from "jsbarcode";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { jsPDF } from "jspdf"; // นำเข้า jsPDF

export default function BarcodeFeature() {
    const [inputValue, setInputValue] = useState<string>(""); // เริ่มต้นเป็นค่าว่าง
    const [barcodes, setBarcodes] = useState<string[]>([]); // เก็บรายการบาร์โค้ด

    const { showToast } = useToast();
    const handleGenerateAndShowPDF = () => {
        if (!/^[A-Za-z0-9]+$/.test(inputValue.trim())) {
            showToast("กรุณาระบุเฉพาะตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น", false);
            return;
        }

        const updatedBarcodes = [...barcodes, inputValue.trim()];
        setBarcodes(updatedBarcodes);

        const doc = new jsPDF({
            unit: "mm",
            format: [50, 20],
            orientation: "landscape", // เปลี่ยนเป็น "landscape" ได้หากต้องการกระดาษแนวนอน
        });

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
                    // เพิ่มหน้าใหม่ใน PDF หลังจากหน้าแรก
                    doc.addPage();
                }
                const colIndex = index % numBarcodesHorizontal;
                const rowIndex = Math.floor(index / numBarcodesHorizontal);

                // const xPos = margin + colIndex * (barcodeWidth * 2 + 10);
                // const yPos = margin + rowIndex * (barcodeHeight + 20);
                const xPos = (pageWidth - barcodeWidth) / 2;
                const yPos = (pageHeight - barcodeHeight) / 2;

                const canvas = document.createElement("canvas");
                JsBarcode(canvas, code, {
                    format: "CODE128",
                    width: 1,
                    height: barcodeHeight,
                    displayValue: false,
                });

                const imageData = canvas.toDataURL("image/png");

                const frameWidth = barcodeWidth * 2;
                const frameHeight = barcodeHeight;

                doc.setLineWidth(0.5);
                doc.rect(0, 0, pageWidth, pageHeight); // วาดกรอบเต็มกระดาษ

                doc.addImage(
                    imageData,
                    "PNG",
                    xPos,
                    yPos,
                    barcodeWidth,
                    barcodeHeight
                );

                doc.setFontSize(6);
                doc.text(
                    code,
                    pageWidth / 2,
                    yPos + barcodeHeight -2,
                    { align: "center" }
                );

                doc.setFontSize(6);
                doc.text(
                    `RP2024091200${index + 1}`,
                    xPos - 2,
                    yPos,
                    { align: "left" }
                );

                const currentDate = new Date().toLocaleDateString("th-TH");
                doc.setFontSize(6);
                doc.text(
                    currentDate,
                    xPos + 36,
                    yPos,
                    { align: "left" }
                );

                doc.setFontSize(6);
                doc.text(
                    ` name ${index + 1}`,
                    pageWidth / 2,
                    yPos +3,
                    { align: "center" }
                );

                doc.setFontSize(8);
                doc.text("Benz/CLS", xPos - 2, yPos + barcodeHeight + 1);
            });

            const pdfData = doc.output("bloburl");
            const pdfWindow = window.open(pdfData, "_blank");
            if (!pdfWindow) {
                showToast("ไม่สามารถเปิดหน้าต่าง PDF ได้", false);
            }
        }, 0);

        setInputValue("");
    };


    return (
        <div>
            <Flex justify={"between"}>
                <Text size="6" weight="bold" className="text-center">
                    Barcode Page
                </Text>
            </Flex>

            <div className="container w-full m-auto">
                <Box className="w-full mt-4 bg-white border-0 rounded-md relative overflow-visible p-6">
                    <Flex direction="column" align="start" gap="4">
                        {/* ช่องกรอกข้อมูล */}
                        <div className="w-full p-2 border rounded-md">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)} // ป้อนตัวอักษรและตัวเลขได้
                                placeholder="กรอกตัวเลขหรืออักษร..."
                                className="w-full p-2 border-0 outline-none"
                                onKeyDown={(e) => e.key === "Enter" && handleGenerateAndShowPDF()}
                            />
                        </div>
                        <Button onClick={handleGenerateAndShowPDF}>สร้างบาร์โค้ดและแสดง PDF</Button>
                    </Flex>
                </Box>
            </div>
        </div>
    );
}
