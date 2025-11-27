import { useEffect, useState } from "react";
import { Text, Flex, Box, Select, Badge, Grid, Card } from "@radix-ui/themes";
import { getCustomerTopTen, getQuotationStatus, getPriceAllDashboard, getEmployeeTopTen, getQuotationSummary } from "@/services/dashboardCustomerQuotation.service";
import { TypeQuotationStatusAll, TypePriceAll, TypeTopTenEmployeeResponse, QuotationSummaryResponse, TypeTopTenCustomerResponse, SaleInfo, QuotationSummaryData } from "@/types/response/response.dashboardCQ";
import { BarChart, Bar, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, PieChart, Pie } from "recharts";

const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowWidth;
};

const formatCurrency = (value: number | undefined | null) => {
    if (typeof value !== 'number') return '0.00';
    return value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function DashboardQuotationCustomerFeature() {
    const [cusData, setCusData] = useState<TypeTopTenCustomerResponse | null>(null);
    const [countQuotationData, setCountQuotationData] = useState<TypeQuotationStatusAll[]>([]);
    const [priceData, setPriceData] = useState<TypePriceAll | null>(null);
    const [salesData, setSalesData] = useState<SaleInfo[]>([]);
    const [dateRange, setDateRange] = useState<string>("1month");
    const [dateRangeQuotation, setDateRangeQuotation] = useState<string>("7days");
    const [quotationSummary, setQuotationSummary] = useState<QuotationSummaryResponse | null>(null);
    
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 768;

    const fetchTopTenCustomerData = async () => {
        try {
            const res = await getCustomerTopTen();
            setCusData(res.responseObject);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchQuotationStatus = async (dateRange: string) => {
        try {
            const res = await getQuotationStatus(dateRange);
            setCountQuotationData(res.responseObject);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchPriceData = async () => {
        try {
            const res = await getPriceAllDashboard();
            setPriceData(res.responseObject);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchSalesData = async () => {
        try {
            const res = await getEmployeeTopTen();
            if (res?.responseObject && Array.isArray(res.responseObject)) {
                setSalesData(res.responseObject);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchQuotationSummaryData = async (dateRangeQuotation: string) => {
        try {
            const res = await getQuotationSummary(dateRangeQuotation);
            if (res?.responseObject) {
                setQuotationSummary(res.responseObject);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchTopTenCustomerData();
        fetchPriceData();
        fetchSalesData();
    }, []);

    useEffect(() => {
        fetchQuotationStatus(dateRange);
    }, [dateRange]);

    useEffect(() => {
        fetchQuotationSummaryData(dateRangeQuotation);
    }, [dateRangeQuotation]);


    const data01 = salesData.map(item => ({
        name: item.responsible_info.username,
        emp_name: item.responsible_info.first_name,
        value: item.total_price,
    }));

    const dataQuotation = quotationSummary?.data.map((dataItem: QuotationSummaryData) => {
        const startDate = dataItem.label.split(" - ")[0];
        return {
            name: startDate,
            value: dataItem.total_price,
        };
    });

    const handleToQuotationClick = (tabName: string) => {
        let statusLabel = tabName;
        switch (tabName) {
            case "ระหว่างดำเนินการ": statusLabel = "pending"; break;
            case "รออนุมัติ": statusLabel = "waiting_for_approve"; break;
            case "อนุมัติ": statusLabel = "approved"; break;
            case "ปฏิเสธอนุมัติ": statusLabel = "reject_approve"; break;
            case "ปิดดีล": statusLabel = "close_deal"; break;
            case "ยกเลิก": statusLabel = "cancel"; break;
            default: break;
        }
        window.location.href = `/quotation?tab=${statusLabel}`;
    };

    const barColors = ["#8B00FF", "#4B0082", "#0000FF", "#00FF00", "#FFFF00", "#FFA500", "#FF0000", "#FF4500", "#DC143C", "#B22222"];
    const formattedData = countQuotationData.map((status) => ({ ...status, total_quotations: Number(status.total_quotations) }));
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF00FF", "#FF0000", "#FF4500", "#DC143C", "#B22222", "#800000"];
    const StatusQuotatons = ['ระหว่างดำเนินการ', 'รออนุมัติ', 'อนุมัติ', 'ปฏิเสธอนุมัติ', 'ปิดดีล', 'ยกเลิก'];

    const handleDateRangeChange = (value: string) => setDateRange(value);
    const handleDateRangeQuotationChange = (value: string) => setDateRangeQuotation(value);
    
    const formatRangeLabel = (range: string) => {
        switch (range) {
            case "7days": return "7 วัน";
            case "15days": return "15 วัน";
            case "1month": return "1 เดือน";
            case "3months": return "3 เดือน";
            case "6months": return "6 เดือน";
            case "1year": return "1 ปี";
            case "3years": return "3 ปี";
            case "all": return "ทั้งหมด";
            default: return "1 เดือน";
        }
    };

    const getOuterRadius = () => {
        if (windowWidth < 480) return 60;
        if (windowWidth < 768) return 80;
        if (windowWidth < 1024) return 100;
        return 120;
    };

    const renderPieLabel = (props: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, emp_name, value } = props;
        if (isMobile) return null;

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                {`${emp_name}: ${formatCurrency(value)}`}
            </text>
        );
    };

    return (
        <>
            <Flex
                justify="between"
                align="center"
                direction={{ initial: 'column', sm: 'row' }}
                gap={{ initial: '3', sm: '2' }}
                className="px-4 md:px-0 mb-4"
            >
                <Text size={{initial: '5', md: '6'}} weight="bold">
                    ภาพรวมระบบ
                </Text>
                <Flex align="center" gap="2" width={{ initial: '100%', sm: 'auto' }}>
                    <Text size="2" className="flex-shrink-0">
                        สถานะใบเสนอราคา:
                    </Text>
                    <Select.Root value={dateRange} onValueChange={handleDateRangeChange}>
                        <Select.Trigger className="" />
                        <Select.Content>
                            <Select.Item value="15days">15 วัน</Select.Item>
                            <Select.Item value="1month">1 เดือน</Select.Item>
                            <Select.Item value="3months">3 เดือน</Select.Item>
                            <Select.Item value="6months">6 เดือน</Select.Item>
                            <Select.Item value="1year">1 ปี</Select.Item>
                            <Select.Item value="all">ทั้งหมด</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Flex>
            </Flex>
            
            <Box className="w-full bg-white border-0 rounded-md p-2 md:p-6 space-y-8">
                <Box>
                    <Text size={{initial: '3', md: '4'}} className="mt-4">
                        จำนวนใบเสนอราคาใน {formatRangeLabel(dateRange)} มี <Text weight="bold">{countQuotationData.reduce((total, item) => total + item.total_quotations, 0)}</Text> ใบ
                    </Text>
                    <Grid
                    columns={{ initial: "2", sm: "3", lg: "6" }}
                    gap={{ initial: '3', md: '4' }}
                    className="p-2 md:p-4 mt-2"
                >
                    {StatusQuotatons.map((status, index) => {
                        let statusLabel = '';
                        switch (status) {
                            case "ระหว่างดำเนินการ": statusLabel = "pending"; break;
                            case "รออนุมัติ": statusLabel = "waiting_for_approve"; break;
                            case "อนุมัติ": statusLabel = "approved"; break;
                            case "ปฏิเสธอนุมัติ": statusLabel = "reject_approve"; break;
                            case "ปิดดีล": statusLabel = "close_deal"; break;
                            case "ยกเลิก": statusLabel = "cancel"; break;
                            default: break;
                        }

                        const item = formattedData.find((data) => data.quotation_status === statusLabel);
                        const totalQuotations = item ? item.total_quotations : 0;
                        const canClick = totalQuotations > 0;
                        return (
                            <Box
                                key={index}
                                className={`${canClick ? "bg-main cursor-pointer hover:opacity-90" : "bg-gray-400 cursor-not-allowed"} text-white p-2 md:p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center`}
                                onClick={() => canClick && handleToQuotationClick(status)}
                            >
                                <Text size={{initial: '2', md: '4'}} className="mb-1">{status}</Text>
                                <Text size={{initial: '5', md: '6'}} weight="bold">{totalQuotations}</Text>
                                <Text size="1">รายการ</Text>
                            </Box>
                        );
                    })}
                </Grid>
                </Box>

                <Box>
                    <Text size="5" weight="bold" className="text-center bg-main text-black bg-opacity-10 py-2 block">
                        รายงานการขาย
                    </Text>
                    <div className="mt-4 w-full">
                        <div className="hidden md:flex font-bold text-base border-b py-2 bg-main text-white">
                            <div className="w-[45%] pl-4">รายการ</div>
                            <div className="w-[25%] text-right">มูลค่ารวม</div>
                            <div className="w-[30%] text-right pr-4">ยอดค้างชำระคงเหลือ</div>
                        </div>

                        {[
                            { label: "ยอดรวมใบเสนอราคา", value: priceData?.quotation.total_price_all },
                            { label: "ยอดรวมใบรับซ่อม", value: priceData?.repair_receipt.total_price },
                            { label: "ยอดรวมการชำระเงินที่ลูกค้าต้องชำระ", value: priceData?.payment.total_payment_price_to_be_received_all },
                            { label: "ยอดรวมการชําระเงินทั้งหมดที่ลูกค้าชําระแล้ว", value: priceData?.payment.total_payment_price_customer_pay, bold: true },
                            { label: "คงเหลือยอดค้างชำระเงิน", outstanding: (priceData?.payment.total_payment_price_to_be_received_all ?? 0) - (priceData?.payment.total_payment_price_customer_pay ?? 0), isSummary: true },
                            { label: "มูลค่ารวมใบรับซ่อม", value: priceData?.repair_receipt.total_price, bold: true },
                            { label: "คงเหลือยอดค้างชำระเงินเมื่อเทียบใบรับซ่อม", outstanding: priceData?.repair_receipt.outstanding_balance_on_repair_receipt },
                            { label: "เปอร์เซ็นต์ที่ลูกค้าชำระเงินเมื่อเทียบใบรับซ่อม", percentage: priceData?.repair_receipt.total_amount_paid_repair_receipt_percentage },
                            { label: "มูลค่าการส่งมอบ", value: priceData?.delivery_schedule.total_price, bold: true },
                            { label: "คงเหลือยอดค้างชำระเงินเมื่อเทียบการส่งมอบ", outstanding: priceData?.delivery_schedule.outstanding_balance_on_delivery_schedule },
                            { label: "เปอร์เซ็นต์ที่ลูกค้าชำระเงินเมื่อเทียบการส่งมอบ", percentage: priceData?.delivery_schedule.total_amount_paid_delivery_schedule_percentage },
                        ].map((item, index) => (
                            <div key={index}>
                                <div className={`hidden md:flex py-2 border-b px-4 hover:bg-gray-50 ${item.isSummary ? 'border-b-2 border-gray-300' : ''}`}>
                                    <div className={`w-[45%] text-left ${item.bold ? 'font-bold' : ''}`}>{item.label}</div>
                                    <div className={`w-[25%] text-right ${item.bold ? 'font-bold' : ''}`}>
                                        {item.value != null ? formatCurrency(item.value) : item.percentage != null ? 
                                            <Badge variant="soft" color={item.percentage < 30 ? "red" : item.percentage < 75 ? "yellow" : "green"} size="2">{item.percentage}%</Badge> : ''}
                                    </div>
                                    <div className={`w-[30%] text-right ${item.outstanding != null ? 'text-red-700 font-bold' : ''}`}>
                                        {item.outstanding != null ? formatCurrency(item.outstanding) : ''}
                                    </div>
                                </div>
                                <Card className="block md:hidden my-2">
                                    <Flex direction="column" gap="1">
                                        <Text size="2" weight={item.bold ? "bold" : "regular"}>{item.label}</Text>
                                        {item.value != null && <Text size="3" weight="bold">{formatCurrency(item.value)} บาท</Text>}
                                        {item.outstanding != null && <Text size="3" weight="bold" color="red">ค้างชำระ: {formatCurrency(item.outstanding)} บาท</Text>}
                                        {item.percentage != null && <div><Badge variant="soft" color={item.percentage < 30 ? "red" : item.percentage < 75 ? "yellow" : "green"} size="2">{item.percentage}% ที่ชำระแล้ว</Badge></div>}
                                    </Flex>
                                </Card>
                            </div>
                        ))}
                    </div>
                </Box>
                
                <Box>
                    <Text size="5" weight="bold" className="text-center bg-main text-black bg-opacity-10 py-2 block">
                        ภาพรวมใบเสนอราคา
                    </Text>
                     <Flex
                        direction={{ initial: 'column', sm: 'row' }}
                        justify="between"
                        align="center"
                        gap="2"
                        className="mt-4 px-2"
                     >
                        <Text size={{initial: '2', md: '3'}} className="text-center">
                            แสดงข้อมูลในรอบ <span className="underline font-semibold">{formatRangeLabel(dateRangeQuotation)}</span> ที่ผ่านมา
                        </Text>
                        <Flex align="center" gap="2" width={{ initial: '100%', sm: 'auto' }}>
                             <Select.Root value={dateRangeQuotation} onValueChange={handleDateRangeQuotationChange}>
                                <Select.Trigger className="w-full" />
                                <Select.Content>
                                    <Select.Item value="7days">7 วัน</Select.Item>
                                    <Select.Item value="15days">15 วัน</Select.Item>
                                    <Select.Item value="1month">1 เดือน</Select.Item>
                                    <Select.Item value="3months">3 เดือน</Select.Item>
                                    <Select.Item value="6months">6 เดือน</Select.Item>
                                    <Select.Item value="1year">1 ปี</Select.Item>
                                    <Select.Item value="3years">3 ปี</Select.Item>
                                    <Select.Item value="all">ทั้งหมด(ปี)</Select.Item>
                                </Select.Content>
                            </Select.Root>
                        </Flex>
                    </Flex>
                    
                    {/* START: โค้ดที่แก้ไข */}
                    <div style={{ width: '100%', height: 300 }} className="mt-4">
                        <ResponsiveContainer>
                            <BarChart data={dataQuotation} margin={{ top: 20, right: isMobile ? 15 : 30, left: isMobile ? -10 : 0, bottom: isMobile ? 80 : 70 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={isMobile ? 290 : 0} dy={isMobile ? 35 : 10} interval={'preserveStartEnd'} tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => formatCurrency(val)} />
                                <Tooltip formatter={(value: number) => [formatCurrency(value), "มูลค่า"]} />
                                <Bar dataKey="value" fill="#00337d">
                                    <LabelList 
                                        dataKey="value" 
                                        position="top" 
                                        fill="#333" 
                                        fontSize={9}
                                        formatter={(value: number) => {
                                            if (value > 1000) {
                                                return `${(value / 1000).toFixed(1)}k`;
                                            }
                                            return formatCurrency(value);
                                        }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* END: โค้ดที่แก้ไข */}

                     <Grid columns="1" gap="2" className="p-4 bg-gray-50 rounded-md mt-4">
                        <Text size="3" weight="bold">สรุปยอดในรอบ {formatRangeLabel(dateRangeQuotation)}</Text>
                        <Text className="pl-4">จํานวนใบเสนอราคาทั้งหมด: <span className="font-bold">{quotationSummary?.summary.total_quotation_count}</span> ใบ</Text>
                        <Text className="pl-4">มูลค่ารวมทั้งหมด: <span className="font-bold">{formatCurrency(quotationSummary?.summary.total_price_all)}</span> บาท</Text>
                        <hr className="my-2"/>
                         {quotationSummary && quotationSummary.data.length > 0 && (
                             <Text size="2">
                                ยอด<span className="underline">น้อยที่สุด</span>: <span className="font-bold text-red-600">{formatCurrency(Math.min(...quotationSummary.data.map(d => d.total_price)))}</span> บาท<br/>
                                ยอด<span className="underline">มากที่สุด</span>: <span className="font-bold text-green-600">{formatCurrency(Math.max(...quotationSummary.data.map(d => d.total_price)))}</span> บาท
                            </Text>
                         )}
                    </Grid>
                </Box>
                
                <Box>
                     <Text size="5" weight="bold" className="text-center bg-main text-black bg-opacity-10 py-2 block">
                        ลูกค้า Top 10 ({cusData?.top_customers.length ?? 0} / {cusData?.total_customers ?? 0})
                    </Text>
                    {cusData && cusData.top_customers.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={isMobile ? 300 : 450} className="mt-4">
                                <BarChart data={cusData.top_customers} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="customer_name" type="category" width={isMobile ? 80 : 100} tick={{ fontSize: 10 }} />
                                    <Tooltip formatter={(value: number) => [`${formatCurrency(value)} บาท`, "มูลค่ารวม"]} />
                                    <Bar dataKey="total_money" barSize={isMobile ? 20 : 30}>
                                        <LabelList dataKey="total_money" position="right" fill="#000" fontSize={isMobile ? 10 : 12} formatter={(value: number) => formatCurrency(value)} />
                                        {cusData.top_customers.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="mt-4 w-full">
                                <div className="hidden md:flex font-bold text-base border-b py-2 bg-slate-100">
                                    <div className="w-1/4 pl-4">รหัสลูกค้า</div>
                                    <div className="w-1/4">ชื่อลูกค้า</div>
                                    <div className="w-1/4 text-center">เบอร์โทร</div>
                                    <div className="w-1/4 text-right pr-4">มูลค่ารวม</div>
                                </div>
                                {cusData.top_customers.map((customer, index) => (
                                   <div key={index}>
                                        <div className="hidden md:flex py-2 border-b px-4 hover:bg-gray-50 items-center">
                                            <div className="w-1/4">{index === 0 ? "🥇 " : index === 1 ? "🥈 " : index === 2 ? "🥉 " : ""}{customer.customer_code || "-"}</div>
                                            <div className="w-1/4">{customer.customer_name || "ไม่มีชื่อ"}</div>
                                            <div className="w-1/4 text-center">{customer.contact_number || "-"}</div>
                                            <div className="w-1/4 text-right font-semibold">{formatCurrency(parseFloat(customer.total_money))}</div>
                                        </div>
                                        <Card className="block md:hidden my-2">
                                            <Flex justify="between">
                                                <Text size="3" weight="bold">{index + 1}. {customer.customer_name || "ไม่มีชื่อ"}</Text>
                                                <Text size="3" weight="bold">{formatCurrency(parseFloat(customer.total_money))}</Text>
                                            </Flex>
                                            <Text size="2" color="gray">รหัส: {customer.customer_code || "-"}</Text>
                                            <br/>
                                            <Text size="2" color="gray">โทร: {customer.contact_number || "-"}</Text>
                                        </Card>
                                   </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <Text size="4" className="mt-4 text-center w-full block">ไม่มีข้อมูลลูกค้า</Text>
                    )}
                </Box>

                <Box>
                    <Text size="5" weight="bold" className="text-center bg-main text-black bg-opacity-10 py-2 block">
                        พนักงานยอดขาย Top 10
                    </Text>
                    {salesData?.length > 0 ? (
                        <>
                             <ResponsiveContainer width="100%" height={isMobile ? 250 : 350} className="mt-4">
                                <PieChart>
                                    <Pie data={data01} dataKey="value" nameKey="emp_name" cx="50%" cy="50%" outerRadius={getOuterRadius()} labelLine={!isMobile} label={renderPieLabel}>
                                        {data01.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                    </Pie>
                                    <Tooltip formatter={(value: number, name) => [ `${formatCurrency(value)} บาท`, name ]} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 w-full">
                                <div className="hidden md:grid md:grid-cols-5 font-bold text-base border-b py-2 bg-slate-100 text-center">
                                    <div className="text-left pl-4 col-span-2">ชื่อผู้ใช้ / ชื่อพนักงาน</div>
                                    <div>ตำแหน่ง</div>
                                    <div>เบอร์โทร</div>
                                    <div className="text-right pr-4">มูลค่ารวม (จำนวน)</div>
                                </div>
                                {salesData.map((data, index) => (
                                    <div key={index}>
                                        <div className="hidden md:grid md:grid-cols-5 py-2 border-b px-4 hover:bg-gray-50 items-center">
                                            <div className="col-span-2">
                                                <div className="font-semibold">{index === 0 ? "🥇 " : index === 1 ? "🥈 " : index === 2 ? "🥉 " : ""}{data.responsible_info.first_name} {data.responsible_info.last_name}</div>
                                                <div className="text-sm text-gray-600">{data.responsible_info.username}</div>
                                            </div>
                                            <div className="text-center">{data.responsible_info.position || "-"}</div>
                                            <div className="text-center">{data.responsible_info.phone_number || "-"}</div>
                                            <div className="text-right font-semibold">{formatCurrency(data.total_price)} ({data.total_quotation})</div>
                                        </div>
                                        <Card className="block md:hidden my-2">
                                            <Flex justify="between" align="start">
                                                <div>
                                                    <Text size="3" weight="bold">{index + 1}. {data.responsible_info.first_name}</Text>
                                                    <Text size="2" color="gray" as="div">ตำแหน่ง: {data.responsible_info.position || "-"}</Text>
                                                </div>
                                                <Text size="3" weight="bold" className="flex-shrink-0 ml-2">{formatCurrency(data.total_price)}</Text>
                                            </Flex>
                                            <Text size="2" color="gray">จำนวน: {data.total_quotation} ใบ</Text>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <Text size="4" className="mt-4 text-center w-full block">ไม่มีข้อมูลพนักงาน</Text>
                    )}
                </Box>
            </Box>
        </>
    );
}