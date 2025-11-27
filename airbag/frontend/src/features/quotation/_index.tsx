import { useState, useEffect } from "react";
import { Table, Button } from "@radix-ui/themes";
import * as Dialog from "@radix-ui/react-dialog";
import { getQuotationData } from "@/services/ms.quotation.service.ts";
import { MdInsertPhoto, MdEdit } from "react-icons/md";
// @ts-ignore
import DailogAdd from "./components/DailogAdd.tsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import * as Toast from "@radix-ui/react-toast";
export default function QuotationFeature() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [allQuotation, setAllQuotation] = useState<any[]>([]);
  const [quotation, setQuotation] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const quotationPerPage = 10;
  const [customer_name, setCustomer_name] = useState<any[]>([]);
  const [selectedQuotationCode, setSelectedQuotationCode] = useState<
    string | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate


  const [toastOpen, setToastOpen] = useState(false); // State สำหรับ Toast
  const [toastErrorOpen, setToastErrorOpen] = useState(false);
  const [toastEditOpen, setToastEditOpen] = useState(false); 
  const [errorMessage, setErrorMessage] = useState("");

  const getQuotation = async () => {
    try {
      const res = await getQuotationData("1", "1000");
      console.log("API Response:", res); // Log the entire response
      if (Array.isArray(res.responseObject?.data)) {
        setAllQuotation(res.responseObject?.data);
        setQuotation(res.responseObject?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //navigate("/ms-customer/create", {
  //  state: { customer_code: customer.customer_code, created_date: customer.create_date },
  //});

  const handleEdit = (quotation:any) => {
    console.log('Editing customer:', quotation);
    
    // ส่ง customer_code และ create_date ไปยังหน้าสร้างหรือแก้ไขลูกค้า
    navigate("/quotation/create", {
      state: {
        customer_code: quotation.customer_code,
        created_at: quotation.created_at
      }
    });
    setSelectedDate(quotation.created_at);  // เก็บ create_date เพื่อส่งไปให้ DialogAdd
    setOpenDialogEdit(true);  // เปิด DialogEdit
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSearchText(value);
  };
  const handleSearch = () => {
    if (searchText.trim() === "") {
      setQuotation(allQuotation); // Reset to show all data
    } else {
      const filtered = allQuotation.filter((quotation) =>
        quotation.customer_name?.toLowerCase().includes(searchText.toLowerCase())
      );
      setQuotation(filtered); // Update with the filtered data
    }
    setCurrentPage(1); // Reset back to the first page
  };

  useEffect(() => {
    getQuotation();
  }, []);

  const indexOfLastColor_name = currentPage * quotationPerPage;
  const indexOfFirstCustomer_name = indexOfLastColor_name - quotationPerPage;
  const currentQuotation = quotation.slice(
    indexOfFirstCustomer_name,
    indexOfLastColor_name
  );

  const Toastdemo = ({ open, setOpen, message, error = false }) => (
    <Toast.Provider>
      <Toast.Root
        className={`${
          error ? "bg-red-600" : "bg-green-600"
        } text-white p-4 rounded-md`}
        open={open}
        onOpenChange={setOpen}
        duration={1000}
      >
        <Toast.Title className="text-sm font-semibold">{message}</Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-4 right-4 w-80 z-50" />
    </Toast.Provider>
  
  );
  return (
    <>
      <h1 className="text-4xl text-left p-1 font-bold"> ใบเสนอราคา</h1>
      <div className="h-screen p-4 bg-[#FFFFFF]">
      <Toastdemo open={toastOpen} setOpen={setToastOpen} message="เพิ่มข้อมูลสำเร็จ" />
      <Toastdemo open={toastEditOpen} setOpen={setToastEditOpen} message="แก้ไขข้อมูลสำเร็จ" />
      <Toastdemo open={toastErrorOpen} setOpen={setToastErrorOpen} message={errorMessage} error={true} />
        <div className="flex items-center">
          <input
            className="h-8 w-1/4 p-2 border border-gray-300 rounded transition duration-500 ease-in-out focus:border-2 focus:border-[#8DA4EF] focus:shadow-lg focus:shadow-[#8DA4EF]/20 focus:outline-none"
            id="search"
            type="text"
            placeholder="รหัส หรือ ชื่อลูกค้า"
            onChange={handleInputChange}
          />
          <Button
            className="px-4 py-2 text-black bg-[#0dcaf0] rounded-lg ml-2 hover:bg-cyan-500"
            onClick={handleSearch}
          >
            ค้นหา
          </Button>
          <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
            <Dialog.Trigger asChild>
              <Button className="px-4 py-2 text-black bg-blue-500 rounded-lg ml-2 hover:bg-blue-600">
                สร้างใบเสนอราคา
              </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-lg">
                <DailogAdd
                  onAddCustomer={getQuotation}
                  onClose={() => setOpenDialog(false)}
                  setToastOpen={setToastOpen}
                  setToastErrorOpen={setToastErrorOpen}
                  setErrorMessage={setErrorMessage}
                />
                {/* <DailodAdd
                      onToolAdded={getToolData}
                      onClose={() => setOpenDialog(false)}
                      setToastOpen={setToastOpen} // เพิ่ม setToastOpen เพื่อเรียก Toast
                      setToastErrorOpen={setToastErrorOpen}
                      setErrorMessage={setErrorMessage}
                    /> */}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        {/* ส่วนที่แสดง Toast */}
        {/* <Toastdemo open={toastOpen} setOpen={setToastOpen} message="เพิ่มข้อมูลสำเร็จ" />
            <Toastdemo open={toastEditOpen} setOpen={setToastEditOpen} message="แก้ไขข้อมูลสำเร็จ" />
            <Toastdemo open={toastDeleteOpen} setOpen={setToastDeleteOpen} message="ลบข้อมูลสำเร็จ" />
            <Toastdemo open={toastErrorOpen} setOpen={setToastErrorOpen} message={errorMessage} error={true} /> */}

        {/* ส่วนอื่นๆ */}
        <div className="mt-4 ">
          <Table.Root className="border-2 border-white-900 w-full ">
            <Table.Header className="border-2 border-white-900 bg-[#00337e] ">
              <Table.Row>
                <Table.ColumnHeaderCell className="border-2 border-white-900 w-2/16 text-center text-white">
                  รหัสลูกค้า
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="border-2 border-white-900 w-4/16 text-center text-white">
                  ชื่อลูกค้า
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="border-2 border-white-900 w-4/16 text-center text-white">
                  ชื่อกิจการ
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="border-2 border-white-900 w-2/16 text-center text-white">
                  วันที่
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="border-2 border-white-900 w-2/16 text-center text-white">
                  เบอร์โทร
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="border-2 border-white-900 w-1/16 text-center text-white">
                  แก้ไข
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="border-2 border-white-900 w-1/16 text-center text-white">
                  ภาพอู่
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body className="border-2 border-white-900">
              {currentQuotation.map((quotation, index) => (
                <Table.Row
                  key={`${quotation.customer_code}-${index}`} // รวมรหัสลูกค้าและ index
                  className="hover:bg-gray-100 border-b border-gray-300"
                >
                  <Table.RowHeaderCell className="border-2 border-white-900 text-center">
                    {quotation.customer_code}
                  </Table.RowHeaderCell>
                  <Table.Cell className="border-2 border-white-900 text-center">
                    {quotation.customer_name}
                  </Table.Cell>
                  <Table.Cell className="border-2 border-white-900 text-center">
                    {quotation.contact_name}
                  </Table.Cell>
                  <Table.Cell className="border-2 border-white-900 text-center">
                    {new Date(quotation.created_at).toLocaleString("th-TH", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </Table.Cell>
                  <Table.Cell className="border-2 border-white-900 text-center">
                    {quotation.contact_number}
                  </Table.Cell>
                  <Table.Cell className="border-2 border-white-900 text-center">
                    {/* edit */}
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(quotation)} // ส่งข้อมูลทั้ง customer ไปในฟังก์ชัน
                    >
                      <MdEdit className="text-2xl " />
                    </button>
                  </Table.Cell>
                  <Table.Cell className="border-2 border-white-900 text-center">
                    <button className=" hover:bg-gray-200">
                      <MdInsertPhoto className="text-2xl" />
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
        {/* การแสดงลิงก์เปลี่ยนหน้า (pagination) */}

        <div>
          <ul className="flex justify-center mt-4">
            {Array.from(
              { length: Math.ceil(quotation.length / quotationPerPage) },
              (_, index) => (
                <li key={index + 1}>
                  <button
                    className={`px-3 py-1 mx-1 text-sm ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </>
  );
}