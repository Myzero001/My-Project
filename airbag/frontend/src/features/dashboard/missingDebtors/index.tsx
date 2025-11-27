import { useState, useEffect } from "react";
import { Text, Flex, Box, Select, Table, Button, Badge } from "@radix-ui/themes";
import { getInactiveCustomersFiltered } from "@/services/inactivecustomer.service";
import { TypeInactiveCustomer, TypeInactiveCustomerQueryParams } from "@/types/response/response.inactivecustomer";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

export default function DashboardMissingDebtorsFeature() {
    const [loading, setLoading] = useState<boolean>(true);
    const [customers, setCustomers] = useState<TypeInactiveCustomer[]>([]);
    const [prefixFilteredActive, setPrefixFilteredActive] = useState<number>(0);
    const [prefixFilteredInactive, setPrefixFilteredInactive] = useState<number>(0);
    const [prefixFilteredTotalDebt, setPrefixFilteredTotalDebt] = useState<number>(0);
    const [dateRange, setDateRange] = useState<string>("30days");
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'all' | 'active' | 'inactive'>('all');
    const [sortBy, setSortBy] = useState<string>("debt");
    const [sortOrder, setSortOrder] = useState<string>("desc");
    const [selectedPrefix, setSelectedPrefix] = useState<string>("all");

    useEffect(() => {
        fetchCustomers();
    }, [dateRange, view, sortBy, sortOrder, selectedPrefix]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError(null);
            const params: TypeInactiveCustomerQueryParams = {
                dateRange: dateRange as '15days' | '30days' | '1month' | '3months' | '6months' | '1year',
                sortBy: sortBy as 'debt' | 'lastActivity' | 'customerName' | undefined,
                sortOrder: sortOrder as 'asc' | 'desc' | undefined,
                ...(selectedPrefix !== "all" && { customerPrefix: selectedPrefix })
            };
            const response = await getInactiveCustomersFiltered(params);

            if (response.success && Array.isArray(response.responseObject)) {
                const allCustomersFromApi = response.responseObject || [];

                const customersInSelectedPrefix = selectedPrefix === 'all'
                    ? allCustomersFromApi
                    : allCustomersFromApi.filter(c => c.customer_prefix === selectedPrefix);

                const activeInPrefix = customersInSelectedPrefix.filter(c => c.isActive).length;
                const inactiveInPrefix = customersInSelectedPrefix.filter(c => !c.isActive).length;
                const debtInPrefix = customersInSelectedPrefix.reduce((sum, c) => sum + (c.totalDebt || 0), 0);

                setPrefixFilteredActive(activeInPrefix);
                setPrefixFilteredInactive(inactiveInPrefix);
                setPrefixFilteredTotalDebt(debtInPrefix);

                let customersToDisplay = customersInSelectedPrefix;
                if (view === 'active') {
                    customersToDisplay = customersInSelectedPrefix.filter(customer => customer.isActive);
                } else if (view === 'inactive') {
                    customersToDisplay = customersInSelectedPrefix.filter(customer => !customer.isActive);
                }
                
                setCustomers(customersToDisplay);
                
            } else {
                throw new Error(response.message || "โครงสร้างข้อมูลที่ได้รับไม่ถูกต้อง");
            }
        } catch (err) {
            console.error("Error fetching customers:", err);
            const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ";
            setError(errorMessage);
            resetStateOnError();
        } finally {
            setLoading(false);
        }
    };

    const resetStateOnError = () => {
        setCustomers([]);
        setPrefixFilteredActive(0);
        setPrefixFilteredInactive(0);
        setPrefixFilteredTotalDebt(0);
    };

    const handleDateRangeChange = (value: string) => setDateRange(value);
    const handleViewChange = (value: string) => setView(value as 'all' | 'active' | 'inactive');
    const handlePrefixChange = (value: string) => setSelectedPrefix(value);

    const prepareActivityPieChartData = () => {
        if (prefixFilteredActive === 0 && prefixFilteredInactive === 0) return [];
        return [
            { name: 'ใช้งานอยู่', value: prefixFilteredActive },
            { name: 'ไม่เคลื่อนไหว', value: prefixFilteredInactive }
        ];
    };

    const prepareDebtBarChartData = () => {
        if (!customers || customers.length === 0) return [];
        const activeDebt = customers.filter(c => c.isActive).reduce((sum, c) => sum + (c.totalDebt || 0), 0);
        const inactiveDebt = customers.filter(c => !c.isActive).reduce((sum, c) => sum + (c.totalDebt || 0), 0);
        if (activeDebt === 0 && inactiveDebt === 0) return [];
        return [
            { name: 'ใช้งานอยู่', value: activeDebt },
            { name: 'ไม่เคลื่อนไหว', value: inactiveDebt }
        ];
    };
    
    const prepareDebtByGroupChartData = () => {
        if (!customers || customers.length === 0) return [];

        if (selectedPrefix === 'all') {
            const debtByPrefix = customers.reduce((acc, customer) => {
                const prefix = customer.customer_prefix || 'ไม่ระบุ';
                const debt = customer.totalDebt || 0;
                if (!acc[prefix]) {
                    acc[prefix] = 0;
                }
                acc[prefix] += debt;
                return acc;
            }, {} as { [key: string]: number });

            return Object.entries(debtByPrefix)
                .map(([name, debt]) => ({ name, debt }))
                .sort((a, b) => b.debt - a.debt);

        } else {
            return customers
                .map(customer => ({
                    name: customer.contact_name,
                    debt: customer.totalDebt || 0,
                }))
                .sort((a, b) => b.debt - a.debt)
                .slice(0, 15);
        }
    };

    const PIE_COLORS = ['#22c55e', '#ef4444'];
    const BAR_COLORS = ['#22c55e', '#ef4444'];
    const GROUP_BAR_COLOR = "#6366f1";

    const getStatusBadge = (isActive: boolean) => isActive ? <Badge color="green">ใช้งานอยู่</Badge> : <Badge color="red">ไม่เคลื่อนไหว</Badge>;

    const getCardIcon = (type: 'active' | 'inactive' | 'amount') => {
        const iconClasses = "w-7 h-7 md:w-8 md:h-8";
        const iconMap = {
            active: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconClasses} text-green-600`}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>,
            inactive: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconClasses} text-red-600`}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="22" x2="16" y1="11" y2="17"></line><line x1="16" x2="22" y1="11" y2="17"></line></svg>,
            amount: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconClasses} text-indigo-600`}><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        };
        return iconMap[type];
    };
    
    const formatNumber = (num: number | null | undefined): string => num == null ? 'N/A' : num.toLocaleString();
    const formatCurrency = (num: number | null | undefined): string => num == null ? 'N/A' : num.toLocaleString('th-TH', { style: 'currency', currency: 'THB' }).replace('฿', '') + ' บาท';
    const formatCompactNumber = (num: number) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(num);

    return (
        <Flex direction="column" gap="6" className="p-1">
            {/* Header and Filters */}
            <Flex justify="between" align="center" direction={{ initial: 'column', sm: 'row' }} gap="4">
                <Text size="7" weight="bold" className="text-gray-800">สถานะลูกค้าและยอดค้างชำระ</Text>
                <Flex gap="3" direction={{ initial: 'column', sm: 'row' }} wrap="wrap" justify={{ initial: 'start', sm: 'end' }} className="w-full sm:w-auto">
                    {/* ================== ส่วนที่แก้ไข ================== */}
                    <Select.Root onValueChange={handlePrefixChange} value={selectedPrefix}>
                        <Select.Trigger className="w-full sm:w-auto" radius="large" placeholder="ประเภทลูกค้า" />
                        <Select.Content>
                            <Select.Item value="all">ทุกประเภท</Select.Item>
                            <Select.Item value="บจก.">บจก.</Select.Item>
                            <Select.Item value="หจก.">หจก.</Select.Item>
                            <Select.Item value="บมจ.">บมจ.</Select.Item>
                            <Select.Item value="ร้านค้า">ร้านค้า</Select.Item>
                            <Select.Item value="นามบุคคล">นามบุคคล</Select.Item>
                        </Select.Content>
                    </Select.Root>
                    {/* ================== สิ้นสุดส่วนที่แก้ไข ================== */}
                    <Select.Root onValueChange={handleDateRangeChange} value={dateRange}>
                        <Select.Trigger className="w-full sm:w-auto" radius="large" />
                        <Select.Content>
                            <Select.Item value="15days">15 วัน</Select.Item>
                            <Select.Item value="30days">30 วัน</Select.Item>
                            <Select.Item value="1month">1 เดือน</Select.Item>
                            <Select.Item value="3months">3 เดือน</Select.Item>
                            <Select.Item value="6months">6 เดือน</Select.Item>
                            <Select.Item value="1year">1 ปี</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Flex>
            </Flex>

            {/* Main Content Area */}
            <Box className="w-full">
                {loading ? (
                    <Flex justify="center" align="center" className="h-96"><Text>กำลังโหลดข้อมูล...</Text></Flex>
                ) : error ? (
                    <Flex justify="center" align="center" className="h-96 p-4 text-center rounded-2xl bg-red-50 border border-red-200"><Badge color="red" size="2">{error}</Badge></Flex>
                ) : (
                    <Flex direction="column" gap="6">
                        {/* Summary Cards */}
                        <Flex gap={{initial: '4', md: '6'}} direction={{ initial: 'column', md: 'row' }}>
                            <Box className="flex-1 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-md border border-green-200"><Flex align="center" justify="between">
                                <Box><Text as="div" size="2" className="text-green-700 font-medium mb-1">ใช้งานอยู่</Text><Text size="8" weight="bold" className="text-green-800">{formatNumber(prefixFilteredActive)}</Text><Text size="2" className="text-green-700"> ราย</Text></Box>
                                <Box className="p-4 bg-white rounded-full shadow-sm">{getCardIcon('active')}</Box>
                            </Flex></Box>
                            <Box className="flex-1 p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-md border border-red-200"><Flex align="center" justify="between">
                                <Box><Text as="div" size="2" className="text-red-700 font-medium mb-1">ไม่เคลื่อนไหว</Text><Text size="8" weight="bold" className="text-red-800">{formatNumber(prefixFilteredInactive)}</Text><Text size="2" className="text-red-700"> ราย</Text></Box>
                                <Box className="p-4 bg-white rounded-full shadow-sm">{getCardIcon('inactive')}</Box>
                            </Flex></Box>
                            <Box className="flex-1 p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-md border border-indigo-200"><Flex align="center" justify="between">
                                <Box><Text as="div" size="2" className="text-indigo-700 font-medium mb-1">ยอดค้างชำระรวม</Text><Text size="8" weight="bold" className="text-indigo-800">{formatNumber(prefixFilteredTotalDebt)}</Text><Text size="2" className="text-indigo-700"> บาท</Text></Box>
                                <Box className="p-4 bg-white rounded-full shadow-sm">{getCardIcon('amount')}</Box>
                            </Flex></Box>
                        </Flex>

                        {/* Chart Row 1 */}
                        <Flex gap="6" direction={{ initial: 'column', lg: 'row' }}>
                            <Box className="w-full lg:w-1/3 p-6 bg-white rounded-2xl shadow-md border border-gray-100"><Text as="div" size="5" weight="medium" className="mb-4 text-center text-gray-700">สัดส่วนสถานะ ({selectedPrefix === 'all' ? 'ทุกประเภท' : selectedPrefix})</Text><Box className="h-64">
                                {prepareActivityPieChartData().length > 0 ? (<ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={prepareActivityPieChartData()} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} outerRadius={90} fill="#8884d8" dataKey="value" stroke="#fff" strokeWidth={2}>{prepareActivityPieChartData().map((entry, index) => (<Cell key={`cell-pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}</Pie><Tooltip formatter={(value) => [`${formatNumber(value as number)} ราย`, '']} /><Legend iconSize={12} wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} /></PieChart></ResponsiveContainer>) : (<Flex justify="center" align="center" className="h-full text-gray-400"><Text>ไม่มีข้อมูล</Text></Flex>)}
                            </Box></Box>
                            <Box className="w-full lg:w-2/3 p-6 bg-white rounded-2xl shadow-md border border-gray-100"><Text as="div" size="5" weight="medium" className="mb-4 text-center text-gray-700">ยอดหนี้ตามสถานะ (ข้อมูลที่แสดงในตาราง)</Text><Box className="h-64">
                                {prepareDebtBarChartData().length > 0 ? (<ResponsiveContainer width="100%" height="100%"><BarChart data={prepareDebtBarChartData()} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={formatCompactNumber} width={60} /><Tooltip formatter={(value) => [formatCurrency(value as number), 'ยอดหนี้']} cursor={{fill: 'rgba(238, 242, 255, 0.6)'}}/><Bar dataKey="value" name="ยอดหนี้" radius={[8, 8, 0, 0]} >{prepareDebtBarChartData().map((entry, index) => (<Cell key={`cell-bar-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />))}</Bar></BarChart></ResponsiveContainer>) : (<Flex justify="center" align="center" className="h-full text-gray-400"><Text>ไม่มีข้อมูล</Text></Flex>)}
                            </Box></Box>
                        </Flex>
                        
                        {/* ** NEW CHART: DEBT BY CUSTOMER GROUP ** */}
                        <Box className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
                            <Text as="div" size="5" weight="medium" className="mb-4 text-center text-gray-700">
                                {
                                    selectedPrefix === 'all' 
                                    ? 'ยอดหนี้รวมตามประเภทลูกค้า (ข้อมูลที่แสดงในตาราง)' 
                                    : `ยอดหนี้ 15 อันดับแรก (ประเภท: ${selectedPrefix})`
                                }
                            </Text>
                            <Box className="h-80">
                                {prepareDebtByGroupChartData().length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart 
                                            data={prepareDebtByGroupChartData()} 
                                            margin={{ top: 5, right: 30, left: 20, bottom: selectedPrefix !== 'all' ? 70 : 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                tick={{ fontSize: 11 }} 
                                                interval={0}
                                                angle={selectedPrefix !== 'all' ? -45 : 0} 
                                                textAnchor={selectedPrefix !== 'all' ? 'end' : 'middle'} 
                                            />
                                            <YAxis tick={{ fontSize: 11 }} tickFormatter={formatCompactNumber} width={80}/>
                                            <Tooltip formatter={(value) => [formatCurrency(value as number), 'ยอดหนี้']} cursor={{ fill: 'rgba(238, 242, 255, 0.6)' }} />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                            <Bar dataKey="debt" name="ยอดหนี้" fill={GROUP_BAR_COLOR} radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Flex justify="center" align="center" className="h-full text-gray-400"><Text>ไม่มีข้อมูล</Text></Flex>
                                )}
                            </Box>
                        </Box>

                        {/* Customer Table */}
                        <Box className="overflow-x-auto bg-white p-2 rounded-2xl shadow-md border border-gray-100">
                            <Table.Root variant="surface" size="2" className="min-w-full">
                                <Table.Header><Table.Row>
                                    <Table.ColumnHeaderCell>รหัสลูกค้า</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>ชื่อลูกค้า</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>ประเภท</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>สถานะ</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell align="center">ยอดค้างชำระ</Table.ColumnHeaderCell>
                                </Table.Row></Table.Header>
                                <Table.Body>
                                    {customers.length === 0 ? (
                                        <Table.Row><Table.Cell colSpan={6} align="center" className="h-24"><Text color="gray">ไม่พบข้อมูลลูกค้าตามเงื่อนไขที่เลือก</Text></Table.Cell></Table.Row>
                                    ) : (
                                        customers.map((customer) => (
                                            <Table.Row key={customer.customer_id}>
                                                <Table.Cell className="font-mono text-xs">{customer.customer_code}</Table.Cell>
                                                <Table.Cell className="max-w-xs truncate"><Text weight="medium">{customer.contact_name}</Text></Table.Cell>
                                                <Table.Cell><Badge variant="soft" color="gray">{customer.customer_prefix || '-'}</Badge></Table.Cell>
                                                <Table.Cell>{getStatusBadge(customer.isActive)}</Table.Cell>
                                                <Table.Cell align="right" className="font-medium">{formatCurrency(customer.totalDebt)}</Table.Cell>
                                            </Table.Row>
                                        ))
                                    )}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
}