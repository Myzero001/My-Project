import { Document, Page, Text, View, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DateShortTH } from "@/utils/formatDate"; ``

//supplier master_delivery_schedule  master_repair_receipt  repair_receipt_list_repair
import { getQuotationById } from '@/services/ms.quotation.service';
import { QUOTATION_ALL } from '@/types/response/response.quotation';
import { getQuotationRepairByQuotationId } from '@/services/ms.quotation.repair.service';

Font.register({
  family: 'THSarabunNew',
  src: '/fonts/THSarabunNew.ttf',
});
Font.register({
  family: 'THSarabunNewBold',
  src: '/fonts/THSarabunNewBold.ttf',
});


const MyPDFDocument: React.FC<{
    quotationData?: QUOTATION_ALL,
    repairItems?: string[];
    price?: number | string;
    priceTax?: number | string;
    tax?: number;
    total?: number | string;
}> = ({
    quotationData,
    repairItems = [],
    priceTax = 0,
    price = 0,
    tax = 0,
    total = 0
}) => {

        const itemsPerPage = 10;
        const pages = Math.ceil(repairItems.length / itemsPerPage);
        const numberToThaiText = (num: any) => {
            const thaiNumbers = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
            const thaiUnits = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
            if (num === 0) return "ศูนย์บาทถ้วน";
            let bahtText = "";
            let satangText = "";
            let [baht, satang] = num.toFixed(2).split(".");
            baht = parseInt(baht, 10);
            satang = parseInt(satang, 10);
            const convertToThai = (number: any) => {
                let result = "";
                let numStr = number.toString().split("").reverse();
                numStr.forEach((digit: any, index: any) => {
                    if (digit !== "0") {
                        if (index === 1 && digit === "1") {
                            result = "สิบ" + result;
                        } else if (index === 1 && digit === "2") {
                            result = "ยี่สิบ" + result;
                        } else if (index > 1 && digit === "1") {
                            result = "หนึ่ง" + thaiUnits[index] + result;
                        } else {
                            result = thaiNumbers[digit] + thaiUnits[index] + result;
                        }
                    }
                });
                return result;
            };
            if (baht > 0) {
                bahtText = convertToThai(baht) + "บาท";
            }
            if (satang > 0) {
                satangText = convertToThai(satang) + "สตางค์";
            } else {
                satangText += "ถ้วน";
            }
            return bahtText + satangText;
        };
        const status = quotationData?.quotation_status ?? "pending";
        let newStatus = "-";

        switch (status) {
            case "pending":
                newStatus = "ระหว่างดำเนินการ";
                break;
            case "waiting_for_approve":
                newStatus = "รออนุมัติ";
                break;
            case "approved":
                newStatus = "อนุมัติ";
                break;
            case "reject_approve":
                newStatus = "ไม่อนุมัติ";
                break;
            case "close_deal":
                newStatus = "ปิดดีล";
                break;
            case "cancel":
                newStatus = "ยกเลิก";
                break;
            default:
                newStatus = "-";
                break;
        }

        return (
            <Document>
                {/* สร้างหน้าแรก */}
                {Array.from({ length: pages }).map((_, pageIndex) => (
                    <Page size="A4" style={styles.page}>
                        {/* {pageIndex === 1 && ( */}
                        <View style={{ position: 'absolute', right: 30, top: 20 }}>
                            <Text style={styles.text}>หน้าที่ {pageIndex + 1} / {pages}</Text>
                        </View>
                        {/* )} */}
                        <Text style={[styles.header, { marginTop: 30 }]}>ใบเสนอราคา</Text>
                        <View>
                            <Text style={styles.text}>บริษัท {quotationData?.companies?.company_name ?? '-'}</Text>
                            {quotationData?.companies?.company_tin ? (
                                <Text style={styles.text}>เลขที่ผู้เสียภาษี {quotationData.companies.company_tin}</Text>
                            ) : null}
                            <Text style={styles.text}>ที่อยู่ {quotationData?.companies?.addr_number ?? '-'} หมู่ {quotationData?.companies?.addr_alley ?? '-'} ซอย{quotationData?.companies?.addr_district ?? '-'} ถนน{quotationData?.companies?.addr_street ?? '-'}</Text>
                            <Text style={styles.text}>{' '}{' '}{' '}{' '} ตําบล{quotationData?.companies?.addr_subdistrict ?? '-'} อําเภอ{quotationData?.companies?.addr_district ?? '-'} จังหวัด{quotationData?.companies?.addr_province ?? '-'} {' '}{quotationData?.companies?.addr_postcode ?? '-'}</Text>
                            <Text style={styles.text}>เบอร์โทรศัพท์ {quotationData?.companies?.tel_number ?? '-'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
                            <View style={{ margin: 10 }}>

                                <Text style={styles.text}>ชื่อกิจการ {quotationData?.master_customer?.customer_name ?? '-'}</Text>
                                {quotationData?.master_customer?.customer_tin ? (
                                    <Text style={styles.text}>เลขที่ผู้เสียภาษี {quotationData.master_customer.customer_tin}</Text>
                                ) : null}
                                <Text style={styles.text}>ที่อยู่ {quotationData?.addr_number ?? '-'} ซอย {quotationData?.addr_alley ?? '-'} ถนน {quotationData?.addr_street ?? '-'}</Text>
                                <Text style={styles.text}>{' '}{' '}{' '}{' '} ตําบล {quotationData?.addr_subdistrict ?? '-'} อําเภอ {quotationData?.addr_district ?? '-'} จังหวัด {quotationData?.addr_province ?? '-'} {' '}{quotationData?.addr_postcode ?? '-'}</Text>
                                <Text style={styles.text}>ชื่อผู้ติดต่อ {quotationData?.customer_name ?? '-'}  {' '} เบอร์โทรศัพท์ {quotationData?.contact_number ?? '-'}</Text>
                                <Text style={styles.text}>แบรนด์ {quotationData?.master_brand?.brand_name ?? '-'} {' '} รุ่น {quotationData?.master_brandmodel?.brandmodel_name ?? '-'} {' '} สี {quotationData?.master_color?.color_name ?? '-'}</Text>
                            </View>
                            <View style={{ margin: 10 }}>
                                <Text style={styles.text}>วันที่ {DateShortTH(new Date())}
                                </Text>
                                <Text style={styles.text}>เลขที่ใบเสนอราคา {quotationData?.quotation_doc}</Text>
                                <Text style={styles.text}>สถานะ {newStatus}</Text>
                                <Text> </Text>
                                <Text style={styles.text}>นัดหมายถอด วันที่ {quotationData?.appointment_date ? DateShortTH(new Date(quotationData?.appointment_date)) : 'ยังไม่มีการระบุ'}</Text>

                            </View>
                        </View>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell1, styles.headerCell]}>ลำดับ</Text>
                                <Text style={[styles.tableCell2, styles.headerCell]}>รายการซ่อม</Text>
                                {/* <Text style={[styles.tableCell3, styles.headerCell]}>ราคา</Text> */}
                            </View>
                            {/* แถวข้อมูล */}
                            {repairItems.length === 1 && repairItems[0] === "ยังไม่มีข้อมูล" ? (
                                <View style={styles.tableRow}>
                                    <Text style={styles.noDataText}>ไม่มีข้อมูลรายการซ่อม</Text>
                                </View>
                            ) : (
                                repairItems
                                    .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                                    .map((item: any, index: number) => (
                                        <View key={index} style={styles.tableRow}>
                                            <Text style={styles.tableCell1}>{pageIndex * itemsPerPage + index + 1}</Text>
                                            <Text style={styles.tableCell2}>{item}</Text>
                                        </View>
                                    ))
                            )}

                            {/* เติมแถวให้เต็มหน้า */}
                            {/* Array.from({ length: 12 }).map((_, index) => {
                                    const itemIndex = pageIndex * itemsPerPage + index;
                                    const item = repairItems[itemIndex] ?? ""; // ถ้าไม่มีข้อมูลให้เติม ""
                        
                                    return (
                                        <View key={index} style={styles.tableRow}>
                                            <Text style={styles.tableCell1}>{itemIndex + 1}</Text>
                                            <Text style={styles.tableCell2}>{item}</Text>
                                        </View>
                                    );
                                })
                            )} */}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
                            <View style={{ margin: 10 }}>
                                <Text style={styles.text}>หมายเหตุ</Text>
                                <View style={[
                                    styles.textArea,
                                    { height: (quotationData?.remark?.trim().length ?? 0) > 150 ? 120 : 55 }
                                ]}>
                                    <Text style={[styles.text, { flexWrap: "wrap", flexShrink: 1 }]}>
                                        {quotationData?.remark?.trim()
                                            ? quotationData.remark.replace(/\s+/g, ' ')
                                            : '-'}
                                    </Text>
                                </View>
                                <Text style={styles.centerText}>({numberToThaiText(price)})</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                                    <Text style={styles.text}>ราคา  </Text>
                                    <Text style={styles.text}>
                                        {pageIndex === pages - 1
                                            ? total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            : '-'} บาท
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.text}>ภาษี {tax}%  </Text>
                                    <Text style={styles.text}>
                                        {pageIndex === pages - 1
                                            ? priceTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            : '-'} บาท
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.text}>ราคารวมภาษี  </Text>
                                    <Text style={[styles.text, { fontFamily: 'THSarabunNewBold' }]}>
                                        {pageIndex === pages - 1
                                            ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            : '-'} <Text style={{ fontFamily: 'THSarabunNew' }}>บาท</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ position: 'absolute', bottom: 10, right: 30 }}>
                            <Text style={styles.text}>
                                พิมพ์เมื่อวันที่ {new Intl.DateTimeFormat('th-TH', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                }).format(new Date())}
                            </Text>
                        </View>
                    </Page>
                ))}
            </Document >
        );
    };



const styles = StyleSheet.create({
    page: {
        alignItems: 'center',
        height: '100%',
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        alignItems: 'center',
        fontFamily: 'THSarabunNewBold',
    },
    text: {
        fontSize: 14,
        fontFamily: 'THSarabunNew',
    },
    textArea: {
        borderWidth: 1,
        borderColor: 'lightgray',
        // height: 90,
        width: 320,
        padding: 4,
        marginTop: 5,
        fontSize: 14,
        fontFamily: 'THSarabunNew',
        borderRadius: 5,
        position: 'relative',
        flexWrap: "wrap",
        flexShrink: 1,
        textAlign: 'left',
        lineHeight: 1.5,
    },
    centerText: {
        fontSize: 14,
        fontFamily: 'THSarabunNew',
        position: 'absolute',
        bottom: -25, // จัดให้อยู่ที่กึ่งกลางในแนวตั้ง
        left: '50%',
        transform: 'translateX(-50%)',  // ทำให้ข้อความอยู่กึ่งกลางแนวนอน
    },
    table: {
        maxWidth: '100%',
        width: '80%',
        borderStyle: 'solid',
        borderWidth: 0.5,
    },
    tableRow: {
        flexDirection: 'row',
        width: "100%",
    },
    tableCell1: {
        flex: 0.25,
        padding: 4,
        height: 30,
        borderWidth: 0.5,
        textAlign: "center",
        fontSize: 14,
        fontFamily: "THSarabunNew",
        flexWrap: "wrap",
    },
    tableCell2: {
        flex: 4,
        padding: 4,
        height: 30,
        borderWidth: 0.5,
        textAlign: "left",
        fontSize: 14,
        fontFamily: "THSarabunNew",
        flexWrap: "wrap",
    },
    tableCell3: {
        flex: 1,
        padding: 4,
        height: 30,
        borderWidth: 0.5,
        textAlign: "right",
        fontSize: 14,
        fontFamily: "THSarabunNew",
        flexWrap: "wrap",
    },
    tableColumn: {
        flex: 1,
        padding: 8,
    },
    headerCell: {
        fontSize: 16,
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        fontFamily: 'THSarabunNewBold',
    },
    noDataText: {
        flex: 1,
        padding: 4,
        height: 30,
        borderWidth: 0.5,
        textAlign: "center",
        fontSize: 14,
        fontFamily: "THSarabunNew",
        flexWrap: "wrap",
    },
    section: {
        margin: 10,
        padding: 10,
        fontSize: 12,
        width: 200,
        wordWrap: 'break-word'
    }
});



const QuatationCreatePDFPage = () => {
    const [searchParams] = useSearchParams();
    const QuotationID = searchParams.get("id");
    const [quotationData, setQuotationData] = useState<QUOTATION_ALL>();
    const [repairNames, setRepairNames] = useState<string[]>([]);
    const [totalPricetax, settotalPricetax] = useState<number | string>(0);
    const [priceTax, setPriceTax] = useState<number | string>(0);
    const [tax, setTax] = useState<number>(0);
    const [total, setTotal] = useState<number | string>(0);

    const fetchQuotationData = async () => {
        try {
            if (!QuotationID) {
                console.error("QuotationID is not provided.");
                return;
            }

            const response = await getQuotationById(QuotationID);
            const quotationData = response.responseObject;

            const taxRate = Number(quotationData?.tax) || 0;
            const taxStatus = quotationData?.companies?.tax_status;
            const totalPrice = Number(quotationData?.total_price) || 0;

            let totalBeforeTax = 0;
            let taxAmount = 0;
            let totalWithTax = 0;

            if (taxStatus === "true") {
                totalBeforeTax = totalPrice;
                taxAmount = (totalBeforeTax * taxRate) / 100;
                totalWithTax = totalBeforeTax + taxAmount;
            } else {
                totalWithTax = totalPrice;
                totalBeforeTax = (totalWithTax * 100) / (100 + taxRate);
                taxAmount = totalWithTax - totalBeforeTax;
            }
            setTax(taxRate);
            setTotal(totalBeforeTax);
            setPriceTax(taxAmount);
            settotalPricetax(totalWithTax);
            setQuotationData(quotationData);

            if (!quotationData?.quotation_id) {
                console.error("quotation_id is undefined.");
                return;
            }

            const res = await getQuotationRepairByQuotationId(quotationData.quotation_id);
            const repairArray = Array.isArray(res.responseObject) ? res.responseObject : [];
            const repairName: string[] = repairArray
                .map((item: { master_repair?: { master_repair_name?: string } }) =>
                    item.master_repair?.master_repair_name
                )
                .filter(Boolean) as string[];
            
            repairName.sort((a, b) => a.localeCompare(b));
            setRepairNames(repairName.length > 0 ? repairName : ["ยังไม่มีข้อมูล"]);
        } catch (error) {
            console.error("Error fetching quotation data:", error);
        }
    };

    useEffect(() => {
        fetchQuotationData();
    }, []);

    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
    const loadFonts = async () => {
        Font.register({
        family: 'THSarabunNew',
        src: '/fonts/THSarabunNew.ttf',
        });
        Font.register({
        family: 'THSarabunNewBold',
        src: '/fonts/THSarabunNewBold.ttf',
        });

        // "Hack" โหลด font ให้แน่ใจว่า async เสร็จจริง
        Font.registerHyphenationCallback((word) => [word]);

        // รอเวลาสั้น ๆ ให้ระบบโหลด font
        setTimeout(() => setFontsLoaded(true), 300);
    };

    loadFonts();
    }, []);

    // return (
    //     <PDFViewer width="100%" height="800px">
    //         <MyPDFDocument
    //             quotationData={quotationData}
    //             repairItems={repairNames}
    //             price={totalPricetax}  //ราคารวมภาษี
    //             tax={tax}           //ภาษี
    //             priceTax={priceTax} //ราคาภาษี
    //             total={total}       //ราคา
    //         />
    //     </PDFViewer>
    // );
    return fontsLoaded ? (
        <PDFViewer width="100%" height="800px">
            <MyPDFDocument
            quotationData={quotationData}
            repairItems={repairNames}
            price={totalPricetax}
            tax={tax}
            priceTax={priceTax}
            total={total}
            />
        </PDFViewer>
        ) : (
        <div>Loading fonts...</div>
    );
};

export default QuatationCreatePDFPage;
