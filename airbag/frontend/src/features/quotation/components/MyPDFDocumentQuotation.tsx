// src/features/quotation/components/MyPDFDocumentQuotation.tsx

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { DateShortTH } from "@/utils/formatDate";
import { QUOTATION_ALL } from '@/types/response/response.quotation';

// ... (ส่วนลงทะเบียน Font และ Interface ไม่เปลี่ยนแปลง) ...
Font.register({
  family: 'THSarabunNew',
  src: '/fonts/THSarabunNew.ttf',
});
Font.register({
  family: 'THSarabunNewBold',
  src: '/fonts/THSarabunNewBold.ttf',
});

interface MyPDFDocumentQuotationProps {
    quotationData?: QUOTATION_ALL;
    repairItems?: string[];
    price?: number | string;
    priceTax?: number | string;
    tax?: number;
    total?: number | string;
}

const MyPDFDocumentQuotation: React.FC<MyPDFDocumentQuotationProps> = ({
    quotationData,
    repairItems = [],
    priceTax = 0,
    price = 0,
    tax = 0,
    total = 0
}) => {
    // ... (ส่วน logic, numberToThaiText, status ไม่เปลี่ยนแปลง) ...
    const itemsPerPage = 10;
    const pages = Math.max(1, Math.ceil(repairItems.length / itemsPerPage));

    const numberToThaiText = (num: number | string): string => {
        const numStr = String(Number(num).toFixed(2));
        const [bahtStr, satangStr] = numStr.split('.');
    
        if (Number(bahtStr) === 0 && Number(satangStr) === 0) {
            return "ศูนย์บาทถ้วน";
        }

        const thaiNumbers = ["", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
        const thaiUnits = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

        const convert = (nStr: string): string => {
            let output = "";
            const len = nStr.length;

            if (len > 7) {
                const millionsPart = nStr.substring(0, len - 6);
                const remainderPart = nStr.substring(len - 6);
                const remainderText = convert(remainderPart);
                return convert(millionsPart) + "ล้าน" + (Number(remainderPart) > 0 ? remainderText : "");
            }

            for (let i = 0; i < len; i++) {
                const digit = parseInt(nStr[i]);
                if (digit === 0) continue;
                const position = len - 1 - i;
                if (position === 1 && digit === 1) { output += "สิบ"; } 
                else if (position === 1 && digit === 2) { output += "ยี่สิบ"; } 
                else if (position === 0 && digit === 1 && len > 1) { output += "เอ็ด"; } 
                else { output += thaiNumbers[digit] + thaiUnits[position]; }
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

        return (bahtText + satangText);
    };

    const status = quotationData?.quotation_status ?? "pending";
    let newStatus = "-";
    switch (status) {
        case "pending": newStatus = "ระหว่างดำเนินการ"; break;
        case "waiting_for_approve": newStatus = "รออนุมัติ"; break;
        case "approved": newStatus = "อนุมัติ"; break;
        case "reject_approve": newStatus = "ไม่อนุมัติ"; break;
        case "close_deal": newStatus = "ปิดดีล"; break;
        case "cancel": newStatus = "ยกเลิก"; break;
        default: newStatus = "-"; break;
    }

    return (
        <Document>
            {Array.from({ length: pages }).map((_, pageIndex) => (
                <Page size="A4" style={styles.page} key={pageIndex}>
                    {/* ... (ส่วน Header, Paging, Customer Info ไม่เปลี่ยนแปลง) ... */}
                    <View style={styles.footerPaging}>
                        <Text style={styles.text}>หน้าที่ {pageIndex + 1} / {pages}</Text>
                    </View>
                    <Text style={[styles.header, { marginTop: 30 }]}>ใบเสนอราคา</Text>
                    <View>
                        <Text style={styles.text}>บริษัท {quotationData?.companies?.company_name ?? '-'}</Text>
                        {quotationData?.companies?.company_tin && (
                            <Text style={styles.text}>เลขที่ผู้เสียภาษี {quotationData.companies.company_tin}</Text>
                        )}
                        <Text style={styles.text}>ที่อยู่ {quotationData?.companies?.addr_number ?? '-'} หมู่ {quotationData?.companies?.addr_alley ?? '-'} ซอย{quotationData?.companies?.addr_district ?? '-'} ถนน{quotationData?.companies?.addr_street ?? '-'}</Text>
                        <Text style={styles.text}>{' '}ตําบล{quotationData?.companies?.addr_subdistrict ?? '-'} อําเภอ{quotationData?.companies?.addr_district ?? '-'} จังหวัด{quotationData?.companies?.addr_province ?? '-'} {quotationData?.companies?.addr_postcode ?? '-'}</Text>
                        <Text style={styles.text}>เบอร์โทรศัพท์ {quotationData?.companies?.tel_number ?? '-'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
                        <View style={{ margin: 10 }}>
                            <Text style={styles.text}>ชื่อกิจการ {quotationData?.master_customer?.customer_name ?? '-'}</Text>
                            {quotationData?.master_customer?.customer_tin && (
                                <Text style={styles.text}>เลขที่ผู้เสียภาษี {quotationData.master_customer.customer_tin}</Text>
                            )}
                            <Text style={styles.text}>ที่อยู่ {quotationData?.addr_number ?? '-'} ซอย {quotationData?.addr_alley ?? '-'} ถนน {quotationData?.addr_street ?? '-'}</Text>
                            <Text style={styles.text}>{' '}ตําบล {quotationData?.addr_subdistrict ?? '-'} อําเภอ {quotationData?.addr_district ?? '-'} จังหวัด {quotationData?.addr_province ?? '-'} {quotationData?.addr_postcode ?? '-'}</Text>
                            <Text style={styles.text}>ชื่อผู้ติดต่อ {quotationData?.master_customer?.contact_name ?? '-'}  {' '} เบอร์โทรศัพท์ {quotationData?.contact_number ?? '-'}</Text>
                            <Text style={styles.text}>แบรนด์ {quotationData?.master_brand?.brand_name ?? '-'} {' '} รุ่น {quotationData?.master_brandmodel?.brandmodel_name ?? '-'} {' '} สี {quotationData?.master_color?.color_name ?? '-'}</Text>
                        </View>
                        <View style={{ margin: 10 }}>
                            <Text style={styles.text}>วันที่ {DateShortTH(new Date())}</Text>
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
                        </View>
                        {repairItems.length === 1 && repairItems[0] === "ยังไม่มีข้อมูล" ? (
                            <View style={styles.tableRow}>
                                <Text style={styles.noDataText}>- ไม่มีข้อมูลรายการซ่อม -</Text>
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
                    </View>
                    
                    {/* ================= START: MODIFIED SECTION ================= */}
                    <View style={styles.summaryContainer}>
                        <View style={styles.leftColumn}>
                            <Text style={styles.text}>หมายเหตุ</Text>
                            <View style={styles.textArea}>
                                <Text style={[styles.text, { flexWrap: "wrap", flexShrink: 1 }]}>
                                    {quotationData?.remark?.trim() ? quotationData.remark.replace(/\s+/g, ' ') : '-'}
                                </Text>
                            </View>
                            {/* ข้อความราคาตัวอักษรกลับมาอยู่ใน leftColumn */}
                            <Text style={styles.thaiTotalText}> 
                                ({numberToThaiText(total)})
                            </Text>
                        </View>
                        <View style={styles.rightColumn}>
                            <View style={styles.totalsRow}>
                                <Text style={styles.text}>ราคา</Text>
                                <Text style={styles.text}>
                                    {pageIndex === pages - 1 ? Number(total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'} บาท
                                </Text>
                            </View>
                            <View style={styles.totalsRow}>
                                <Text style={styles.text}>ภาษี {tax}%</Text>
                                <Text style={styles.text}>
                                    {pageIndex === pages - 1 ? Number(priceTax).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'} บาท
                                </Text>
                            </View>
                            <View style={styles.totalsRow}>
                                <Text style={styles.text}>ราคารวมภาษี</Text>
                                <Text style={[styles.text, { fontFamily: 'THSarabunNewBold' }]}>
                                    {pageIndex === pages - 1 ? Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'} <Text style={{ fontFamily: 'THSarabunNew' }}>บาท</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/* ================== END: MODIFIED SECTION ================== */}

                    <View style={styles.footerTimestamp}>
                        <Text style={styles.text}>
                            พิมพ์เมื่อวันที่ {new Intl.DateTimeFormat('th-TH', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                            }).format(new Date())}
                        </Text>
                    </View>
                </Page>
            ))}
        </Document>
    );
};

// ================= START: MODIFIED STYLES =================
const styles = StyleSheet.create({
    page: { alignItems: 'center', height: '100%', padding: 30, fontFamily: 'THSarabunNew' },
    header: { fontSize: 32, fontWeight: 'bold', alignItems: 'center', fontFamily: 'THSarabunNewBold' },
    text: { fontSize: 14 },
    table: { maxWidth: '100%', width: '80%', borderStyle: 'solid', borderWidth: 0.5, borderColor: 'black' },
    tableRow: { flexDirection: 'row', width: "100%" },
    tableCell1: { flex: 0.25, padding: 4, minHeight: 30, borderWidth: 0.5, borderColor: 'black', textAlign: "center", fontSize: 14, flexWrap: "wrap" },
    tableCell2: { flex: 4, padding: 4, minHeight: 30, borderWidth: 0.5, borderColor: 'black', textAlign: "left", fontSize: 14, flexWrap: "wrap" },
    headerCell: { fontSize: 16, textAlign: 'center', backgroundColor: '#f0f0f0', fontFamily: 'THSarabunNewBold' },
    noDataText: { flex: 1, padding: 8, height: 40, borderWidth: 0.5, borderColor: 'black', textAlign: "center", fontSize: 14, flexWrap: "wrap" },

    // --- NEW AND MODIFIED STYLES FOR SUMMARY SECTION ---
    summaryContainer: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        alignItems: 'flex-start',
    },
    leftColumn: {
        flex: 3,
        flexDirection: 'column',
    },
    rightColumn: {
        flex: 2,
        flexDirection: 'column',
        paddingLeft: 10,
        marginTop: 24,
    },
    textArea: {
        borderWidth: 1,
        borderColor: 'lightgray',
        padding: 4,
        marginTop: 5,
        borderRadius: 5,
        minHeight: 55,
    },
    totalsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    // *** FIX: ปรับสไตล์ของราคาตัวอักษร ***
    thaiTotalText: {
        fontSize: 12, // ลดขนาดฟอนต์ลง
        fontFamily: 'THSarabunNew',
        textAlign: 'left', // เปลี่ยนเป็นชิดซ้าย
        marginTop: 8,
        paddingLeft: 4, // เพิ่ม padding ซ้ายเล็กน้อยให้ตรงกับข้อความในกล่อง
    },

    // --- FOOTER STYLES ---
    footerPaging: {
        position: 'absolute',
        right: 30,
        top: 20,
    },
    footerTimestamp: {
        position: 'absolute',
        bottom: 10,
        right: 30,
    }
});
// ================== END: MODIFIED STYLES =================

export default MyPDFDocumentQuotation;