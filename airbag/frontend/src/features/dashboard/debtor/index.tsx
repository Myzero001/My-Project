import { useState, useEffect } from "react";
import { Text, Flex, Box, Select, Table, Button } from "@radix-ui/themes";
import { getDebtorsAll } from "@/services/debtor.service"; // กรุณาตรวจสอบว่า path ถูกต้อง
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

// Custom Hook สำหรับติดตามความกว้างหน้าจอ (หัวใจของการตอบสนองต่อ sidebar)
const useWindowWidth = () => {
    // ใช้ useState เพื่อเก็บค่าความกว้าง และทำให้ component re-render เมื่อค่าเปลี่ยน
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        // สร้างฟังก์ชันสำหรับอัปเดต state
        const handleResize = () => setWindowWidth(window.innerWidth);

        // เพิ่ม event listener เมื่อ component ถูก mount
        window.addEventListener("resize", handleResize);

        // Cleanup: ลบ event listener ออกเมื่อ component ถูก unmount เพื่อป้องกัน memory leak
        return () => window.removeEventListener("resize", handleResize);
    }, []); // dependency array ว่าง หมายถึง effect นี้จะทำงานครั้งเดียวตอน mount และ cleanup ตอน unmount

    return windowWidth;
};


export default function DashboardDebtorFeature() {
    const [loading, setLoading] = useState<boolean>(true);
    const [debtors, setDebtors] = useState<any[]>([]);
    const [totalDebt, setTotalDebt] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [dateRange, setDateRange] = useState<string>("30days");
    const [error, setError] = useState<string | null>(null);

    // เรียกใช้ Hook เพื่อรับค่าความกว้างหน้าจอแบบ Real-time
    const windowWidth = useWindowWidth();
    // สร้างตัวแปร boolean เพื่อเช็คขนาดหน้าจอได้ง่าย (breakpoint 768px สำหรับ iPad Mini แนวตั้ง)
    const isSmallScreen = windowWidth < 768;

    useEffect(() => {
        fetchDebtors();
    }, [dateRange]);

    const fetchDebtors = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getDebtorsAll(dateRange);

            if (response.success) {
                if (Array.isArray(response.responseObject)) {
                    const processedDebtors = response.responseObject.map((d: any) => ({
                        ...d,
                        totalDebt: Number(d.totalDebt) || 0,
                        created_at: d.created_at || new Date().toISOString(),
                        customer_code: d.customer_code || 'N/A',
                        contact_name: d.contact_name || 'Unknown',
                        customer_id: d.customer_id || `fallback-${Math.random()}`,
                        // เพิ่มข้อมูลสมมติสำหรับแสดงผลสถานะ
                        overdueStatus: ['critical', 'warning', 'normal'][Math.floor(Math.random() * 3)]
                    }));

                    setDebtors(processedDebtors);
                    const calculatedTotalDebt = processedDebtors.reduce(
                        (sum, debtor) => sum + debtor.totalDebt, 0
                    );
                    setTotalDebt(calculatedTotalDebt);
                    setTotalCount(processedDebtors.length);
                } else {
                    console.error("API Error: response.responseObject is not an array:", response);
                    setError("โครงสร้างข้อมูลที่ได้รับไม่ถูกต้อง (ไม่ใช่รายการ)");
                    setDebtors([]);
                    setTotalDebt(0);
                    setTotalCount(0);
                }
            } else {
                console.error("API Error:", response.message);
                setError(response.message || "ไม่สามารถโหลดข้อมูลลูกหนี้ได้");
                 setDebtors([]);
                 setTotalDebt(0);
                 setTotalCount(0);
            }
        } catch (error: any) {
            console.error("Error fetching debtors:", error);
            setError(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${error.message || 'ไม่ทราบสาเหตุ'}`);
             setDebtors([]);
             setTotalDebt(0);
             setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (value: string) => {
        setDateRange(value);
    };
    
    const getOverdueStatusText = (status?: string) => {
        switch (status) {
            case 'critical':
                return 'เกินกำหนดชำระ';
            case 'warning':
                return 'ใกล้ครบกำหนด';
            default:
                return 'ปกติ';
        }
    };

    const prepareAreaChartData = () => {
        if (!debtors || debtors.length === 0) return [];
        
        const sortedDebtors = [...debtors].sort((a, b) => {
             try {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
             } catch (e) {
                return 0;
             }
        });
        
        return sortedDebtors.map(debtor => ({
            name: debtor.customer_code,
            debt: debtor.totalDebt,
            date: new Date(debtor.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
        }));
    };

    const preparePieChartData = () => {
        if (!debtors || debtors.length === 0) return [];

        const debtorsWithPositiveDebt = debtors.filter(debtor => debtor.totalDebt > 0);
        if (debtorsWithPositiveDebt.length === 0) return [];

        const totalPositiveDebt = debtorsWithPositiveDebt.reduce((sum, debtor) => sum + debtor.totalDebt, 0);
        if (totalPositiveDebt === 0) return [];

        const debtorsWithPercent = debtorsWithPositiveDebt.map(debtor => ({
            name: debtor.customer_code,
            value: debtor.totalDebt,
            percent: (debtor.totalDebt / totalPositiveDebt) * 100
        }));

        debtorsWithPercent.sort((a, b) => b.value - a.value);

        const top4 = debtorsWithPercent.slice(0, 4); // แสดง Top 4 และอื่นๆ
        const others = debtorsWithPercent.slice(4);

        const pieData = top4.map(d => ({
            name: `${d.name} (${d.percent.toFixed(0)}%)`,
            originalName: d.name,
            value: d.value
        }));

        if (others.length > 0) {
            const othersValue = others.reduce((sum, d) => sum + d.value, 0);
            const othersPercent = (othersValue / totalPositiveDebt) * 100;
            pieData.push({
                name: `อื่น ๆ (${othersPercent.toFixed(0)}%)`,
                originalName: "อื่น ๆ",
                value: othersValue
            });
        }
        return pieData;
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    const getCardIcon = (type: 'debtors' | 'amount') => {
        if (type === 'debtors') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 md:w-8 md:h-8">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            );
        } else {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 md:w-8 md:h-8">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line><circle cx="12" cy="15" r="2"></circle>
                </svg>
            );
        }
    };

    return (
        <Flex direction="column" gap="6" className="p-2 md:p-4 lg:p-6">
            <Flex 
                justify="between" 
                align="center" 
                direction={{ initial: 'column', sm: 'row' }} 
                gap="3"
                className="w-full"
            >
                <Text size="6" weight="bold" className="self-start sm:self-center">
                    ภาพรวมลูกหนี้
                </Text>
                <Select.Root defaultValue="30days" onValueChange={handleDateRangeChange} value={dateRange}>
                    <Select.Trigger className="w-full sm:w-auto" />
                    <Select.Content>
                        <Select.Item value="7days">7 วันล่าสุด</Select.Item>
                        <Select.Item value="15days">15 วันล่าสุด</Select.Item>
                        <Select.Item value="30days">30 วันล่าสุด</Select.Item>
                        <Select.Item value="3months">3 เดือนล่าสุด</Select.Item>
                        <Select.Item value="1year">1 ปีล่าสุด</Select.Item>
                    </Select.Content>
                </Select.Root>
            </Flex>
            
            <Box className="w-full bg-white border border-gray-200 rounded-lg relative p-4 md:p-6 shadow-sm">
                {loading ? (
                    <Flex justify="center" align="center" className="h-96">
                        <Text>กำลังโหลดข้อมูล...</Text>
                    </Flex>
                ) : error ? (
                     <Flex justify="center" align="center" className="h-96 bg-red-50 p-4 rounded">
                        <Text color="red" align="center">
                            <span className="font-semibold">เกิดข้อผิดพลาด:</span> {error} <br/>
                            <Button size="1" variant="soft" color="red" onClick={fetchDebtors} mt="2">
                                ลองโหลดใหม่
                            </Button>
                        </Text>
                     </Flex>
                ) : (
                    <Flex direction="column" gap="6">
                        <Flex 
                            gap="4" 
                            direction={{ initial: 'column', md: 'row' }}
                        >
                             <Box className="w-full md:w-1/2 p-4 md:p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200">
                                <Flex align="center" justify="between">
                                    <Box>
                                        <Text size="2" className="text-blue-600 mb-1 block">จำนวนลูกหนี้</Text>
                                        <Text size={{ initial: '7', md: '8' }} weight="bold" className="text-blue-800">
                                            {totalCount}
                                        </Text>
                                        <Text size="2" className="text-blue-600"> ราย</Text>
                                    </Box>
                                    <Box className="p-3 md:p-4 bg-white rounded-full shadow-sm">
                                        {getCardIcon('debtors')}
                                    </Box>
                                </Flex>
                            </Box>
                            
                             <Box className="w-full md:w-1/2 p-4 md:p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200">
                                <Flex align="center" justify="between">
                                    <Box>
                                        <Text size="2" className="text-green-600 mb-1 block">ยอดค้างชำระรวม</Text>
                                        <Text size={{ initial: '7', md: '8' }} weight="bold" className="text-green-800">
                                            {totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Text>
                                        <Text size="2" className="text-green-600"> บาท</Text>
                                    </Box>
                                    <Box className="p-3 md:p-4 bg-white rounded-full shadow-sm">
                                        {getCardIcon('amount')}
                                    </Box>
                                </Flex>
                            </Box>
                        </Flex>
                        
                        <Flex direction={{ initial: 'column', lg: 'row' }} gap="6">
                            <Box className="w-full lg:w-1/2">
                                <Text size="5" weight="medium" className="mb-4 block text-gray-700">
                                    ยอดหนี้ตามลูกค้า
                                </Text>
                                <Box className="h-80">
                                     {!debtors || debtors.length === 0 ? (
                                        <Flex align="center" justify="center" className="h-full bg-gray-50 rounded"><Text size="2" color="gray">ไม่มีข้อมูลสำหรับสร้างกราฟ</Text></Flex>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={prepareAreaChartData()} margin={{ top: 10, right: 20, left: 0, bottom: isSmallScreen ? 45 : 20 }}>
                                                <defs>
                                                    <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis 
                                                    dataKey="name" 
                                                    tick={{ fontSize: 10 }} 
                                                    interval={isSmallScreen ? 'preserveStartEnd' : 'preserveStart'} 
                                                    angle={isSmallScreen ? -45 : 0} 
                                                    textAnchor={isSmallScreen ? 'end' : 'middle'}
                                                    dy={isSmallScreen ? 10 : 0}
                                                />
                                                <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)} />
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                                <Tooltip formatter={(value: number) => [`${value.toLocaleString()} บาท`, 'ยอดหนี้']} />
                                                <Area type="monotone" dataKey="debt" stroke="#8884d8" strokeWidth={2} fillOpacity={1} fill="url(#colorDebt)" name="ยอดหนี้" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    )}
                                </Box>
                            </Box>

                            <Box className="w-full lg:w-1/2">
                                <Text size="5" weight="medium" className="mb-4 block text-gray-700">
                                    สัดส่วนหนี้
                                </Text>
                                <Box className="h-80">
                                    {!debtors || debtors.filter(d => d.totalDebt > 0).length === 0 ? (
                                        <Flex align="center" justify="center" className="h-full bg-gray-50 rounded"><Text size="2" color="gray">ไม่มีข้อมูลสำหรับสร้างกราฟวงกลม</Text></Flex>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={preparePieChartData()}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={false} 
                                                    outerRadius="80%"
                                                    innerRadius="40%"
                                                    fill="#8884d8"
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {preparePieChartData().map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={1} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value: number, name: string, entry: any) => [
                                                    `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`,
                                                    entry.payload.payload.originalName
                                                ]} />
                                                <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </Box>
                            </Box>
                        </Flex>
                        
                        <Box className="mt-6">
                             <Text size="5" weight="medium" className="mb-4 block text-gray-700">
                                ลูกหนี้ Top 10 (เรียงตามยอดค้างชำระ)
                            </Text>
                            <Box className="overflow-x-auto border border-gray-200 rounded-lg">
                                <Table.Root variant="surface" style={{ minWidth: 650 }}>
                                    <Table.Header>
                                        <Table.Row className="bg-gray-50">
                                            <Table.ColumnHeaderCell className="p-3 text-left text-xs font-medium text-gray-500 uppercase">รหัสลูกค้า</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell className="p-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อลูกค้า</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell className="p-3 text-center text-xs font-medium text-gray-500 uppercase">ยอดค้างชำระ (บาท)</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell className="p-3 text-center text-xs font-medium text-gray-500 uppercase">สถานะ</Table.ColumnHeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                    {(() => {
                                        const topDebtors = [...debtors]
                                            .sort((a, b) => b.totalDebt - a.totalDebt)
                                            .slice(0, 10);

                                        if (topDebtors.length === 0) {
                                            return (
                                                <Table.Row>
                                                    <Table.Cell colSpan={5} className="p-4 text-center text-sm text-gray-500">
                                                        ไม่พบข้อมูลลูกหนี้ในช่วงเวลาที่เลือก
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        }

                                        return topDebtors.map((debtor) => (
                                            <Table.Row key={debtor.customer_id} className="hover:bg-gray-50">
                                                <Table.Cell className="p-3 whitespace-nowrap text-sm text-gray-800">{debtor.customer_code}</Table.Cell>
                                                <Table.Cell className="p-3 max-w-xs truncate text-sm text-gray-800" title={debtor.contact_name}>{debtor.contact_name}</Table.Cell>
                                                <Table.Cell className="p-3 whitespace-nowrap text-sm text-gray-800 text-right font-medium">{debtor.totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Table.Cell>
                                                <Table.Cell className="p-3 whitespace-nowrap text-sm flex items-center justify-center">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            debtor.overdueStatus === 'critical'
                                                                ? 'bg-red-100 text-red-800'
                                                                : debtor.overdueStatus === 'warning'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}
                                                    >
                                                        {getOverdueStatusText(debtor.overdueStatus)}
                                                    </span>
                                                </Table.Cell>
                                            </Table.Row>
                                        ));
                                    })()} 
                                </Table.Body>
                                </Table.Root>
                            </Box>
                        </Box>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
}