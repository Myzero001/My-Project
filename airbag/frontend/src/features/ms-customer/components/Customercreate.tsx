import { TextField, Text, Flex, Button, Card } from "@radix-ui/themes";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Select from "react-select";
import { useLocation } from "react-router-dom";
import {
  updateCustomer,
  deleteCustomer,
  searchCustomer,
} from "@/services/ms.customer";
import { PayLoadCreateCustomer } from "@/types/requests/request.ms-customer";
import { ToastProvider } from "@/components/customs/alert/ToastContext";
import InputAction from "@/components/customs/input/input.main.component";
import { useToast } from "@/components/customs/alert/toast.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
export default function Create() {
  const [paymentType, setPaymentType] = useState("1"); // ค่าเริ่มต้น: เงินสด
  const [creditDays, setCreditDays] = useState(0); // จำนวนวันที่เพิ่มสำหรับ "เครดิต"
  const [images, setImages] = useState([]);
  const imageInputRef = useRef(null); // สร้าง ref สำหรับ input file
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation();
  const { customer_code, created_at, customer_id } = location.state || {};
  const { showToast } = useToast();
  const [customer_prefix, setCustomer_prefix] = useState<string | undefined>();
  const [customer_name, setCustomer_name] = useState("");
  const [contact_name, setContact_name] = useState("");
  const [customer_tel, setCustomer_tel] = useState("");
  const [customer_position, setCustomer_position] = useState("");
  const [customer_line, setCustomer_line] = useState("");
  const [payment_terms_day, setPayment_terms_day] = useState("");
  const [customer_comment, setCustomer_comment] = useState("");
  const [agent_comment, setAgent_comment] = useState("");
  const [addr_number, setAddr_number] = useState("");
  const [addr_alley, setAddr_alley] = useState("");
  const [addr_street, setAddr_street] = useState("");
  const [addr_subdistrict, setAddr_subdistrict] = useState("");
  const [addr_district, setAddr_district] = useState("");
  const [addr_province, setAddr_province] = useState("");
  const [addr_postcode, setAddr_postcode] = useState("");
  const [tax, setTax] = useState("");
  const [textalert, setTextalert] = useState([]);

  const date = new Date(created_at);

  const formattedDate = date.toISOString().split("T")[0];
  const formattedDateForInput = date.toISOString().split("T")[0]; // รูปแบบที่ใช้ใน input type="date"
  const formattedDateForDisplay = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`; // รูปแบบที่แสดง

  const options = [
    { value: "บจก.", label: "บจก." },
    { value: "บมจ.", label: "บมจ." },
  ];

  const handlePaymentChange = (e) => {
    setPaymentType(e.target.value);
  };
  const handleCreditDaysChange = (e) => {
    let days = parseInt(e.target.value) || 0;

    // ตรวจสอบค่าที่เกิน 365 หรือ น้อยกว่า 1
    if (days > 365) days = 365;
    if (days < 1) days = 1;

    setCreditDays(days);
  };

  // คำนวณวันที่ตามจำนวนวัน
  const calculatedDate = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + creditDays);
    return currentDate.toISOString().split("T")[0];
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files); // แปลงไฟล์จากรูปแบบ FileList เป็น Array
    const newImages = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve({
            file,
            preview: reader.result, // Base64 ของภาพ
          });
        };
        // @ts-ignore
        reader.readAsDataURL(file);
      });
    });

    // เมื่อทุกภาพถูกโหลดแล้ว, เพิ่มภาพลงใน state
    Promise.all(newImages).then((loadedImages) => {
      setImages((prevImages) => [...prevImages, ...loadedImages]);
    });
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));

    // รีเซ็ต input file เพื่อให้สามารถเลือกไฟล์เดิมได้อีกครั้ง
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    // Validate credit days for credit payment
    if (paymentType === "2" && !creditDays) {
      alert("กรุณาระบุจำนวนวันเครดิต");
      return;
    }

    if (customer_tel) {
      // เช็คว่ามีการกรอกข้อมูล
      if (customer_tel.length !== 10) {
        // ถ้าความยาวไม่เท่ากับ 10
        showToast("กรุณาระบุเบอร์โทรศัพท์ 10 หลัก", false);
        //alert("กรุณาระบุเบอร์โทรศัพท์ 10 หลัก");
        return;
      }
      if (customer_tel[0] !== "0") {
        // ถ้าตัวแรกไม่ใช่เลข 0
        showToast("เบอร์โทรตัวแรกต้องเป็นเลข 0", false);
        //alert("เบอร์โทรตัวแรกต้องเป็นเลข 0");
        return;
      }
    }
    // ถ้าไม่มีข้อมูลใน customer_tel จะไม่ทำอะไร

    const payload: PayLoadCreateCustomer = {
      customer_prefix: customer_prefix || undefined,
      customer_name: customer_name || undefined,
      contact_name: contact_name || undefined, // ต้องรวม contact_name
      customer_position:
        customer_position !== "" ? customer_position : undefined,
      contact_number: customer_tel || undefined,
      line_id: customer_line || undefined,
      addr_number: addr_number || undefined,
      addr_alley: addr_alley || undefined,
      addr_street: addr_street || undefined,
      addr_subdistrict: addr_subdistrict || undefined,
      addr_district: addr_district || undefined,
      addr_province: addr_province || undefined,
      addr_postcode: addr_postcode || undefined,
      payment_terms: paymentType === "2" ? "Credit" : "Cash",
      payment_terms_day: paymentType === "2" ? Number(creditDays) : undefined,
      comment_customer: customer_comment || undefined,
      comment_sale: agent_comment || undefined,
      competitor: images.length > 0 ? "Yes" : "No",
      created_by: "userId", // ใส่ userId จริงที่นี่
      updated_by: "userId", // ใส่ userId จริงที่นี่
    };
    try {
      // @ts-ignore
      const response = await updateCustomer(customer_id, payload);
      if (response) {
        //alert("บันทึกข้อมูลสำเร็จ");
        showToast("บันทึกข้อมูลสำเร็จ", true);
        //console.log("Payload:", payload);
        navigate("/ms-customer");
        // redirect หรือ reset form ตามต้องการ
      }
    } catch (error) {
      console.error("Error saving customer data:", error);
      //console.log("Payload:", payload);
      showToast("บันทึกข้อมูลไม่สำเร็จ", false);
      //alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (customer_id) {
        try {
          const response = await searchCustomer(customer_id);
          const customerData = response.responseObject;
          //console.log(`customerData: ${JSON.stringify(customerData)}`);
          // Pre-fill form fields
          setCustomer_prefix(customerData.customer_prefix);
          setCustomer_name(customerData.customer_name || "");
          setContact_name(customerData.contact_name || "");
          setCustomer_tel(customerData.contact_number || "");
          setCustomer_position(customerData.customer_position || "");
          setCustomer_line(customerData.line_id || "");

          // Address fields
          setAddr_number(customerData.addr_number || "");
          setAddr_alley(customerData.addr_alley || "");
          setAddr_street(customerData.addr_street || "");
          setAddr_subdistrict(customerData.addr_subdistrict || "");
          setAddr_district(customerData.addr_district || "");
          setAddr_province(customerData.addr_province || "");
          setAddr_postcode(customerData.addr_postcode || "");

          // Payment terms
          if (customerData.payment_terms === "Credit") {
            setPaymentType("2");
            setCreditDays(customerData.payment_terms_day || 0);
          } else {
            setPaymentType("1");
          }

          // Comments
          setCustomer_comment(customerData.comment_customer || "");
          setAgent_comment(customerData.comment_sale || "");
        } catch (error) {
          console.error("Error fetching customer data:", error);
          alert("เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า");
        }
      }
    };

    fetchCustomerData();
  }, [customer_code]);

  const handledelete = async () => {
    try {
      const response = await deleteCustomer(customer_id);
      if (response) {
        //alert("ลบข้อมูลสําเร็จ");
        showToast("ลบข้อมูลสําเร็จ", true);
        navigate("/ms-customer");
        // redirect หรือ reset form ตามต้องการ
      }
    } catch (error) {
      console.error("Error saving customer data:", error);
      showToast("ลบข้อมูลไม่สําเร็จ", false);
      //alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <>
      <ToastProvider>
        <div className="container w-full m-auto">
          <Text size="6" weight="bold" className="text-center">
            ข้อมูลลูกค้า
          </Text>
          <Card
            variant="surface"
            className="w-full mt-2 rounded-none bg-white relative overflow-visible px-6 space-y-4"
          >
            {/* บรรทัดที่ 1 */}
            <div className=" flex    ">
              <div className="flex items-center   space-x-4 w-2/4">
                {/* <Text className="">รหัสลูกค้า</Text>
                <TextField.Root
                  size="2"
                  disabled
                  value={customer_code}
                  placeholder="รหัสลูกค้า"
                  className="w-2/4"
                /> */}
                <InputAction
                  label="รหัสลูกค้า"
                  labelOrientation="horizontal"
                  value={customer_code}
                  placeholder={customer_code}
                  className="rounded   min-w-[60px]"
                  size="2"
                  disabled={true}
                />
              </div>

              <div className="flex items-center space-x-4">
                {/* <Text className="">วันที่</Text>
                <input
                  type="date"
                  className="w-3/4 border rounded px-2 py-1"
                  value={formattedDateForInput}
                  readOnly
                /> */}
                <InputAction
                  label="วันที่"
                  labelOrientation="horizontal"
                  value={formattedDateForInput}
                  placeholder={formattedDateForInput}
                  className="rounded   min-w-[60px]"
                  size="2"
                  disabled={true}
                />
              </div>
            </div>
            {/* คำนำหน้ากิจการ และชื่อ */}

            <div className="flex items-center mt-4  space-x-4">
              <h1 className="">คำนำหน้ากิจการ</h1>
              <Select
                options={options} // ตัวเลือกที่มีให้เลือกใน dropdown
                onChange={(option) => setCustomer_prefix(option?.value)} // อัปเดตค่า customer_prefix เมื่อมีการเลือก
                value={options.find(
                  (option) => option.value === customer_prefix // กำหนดค่าเริ่มต้นใน Select
                )}
                className="w-1/4" // ตั้งค่า className เพื่อกำหนดความกว้าง
              />
              


              {/* <MasterSelectComponent
                onChange={(option) => setCustomer_prefix(option?.value)}
                value={options.find((option) => option.value === customer_prefix)}
                labelKey="customer_name"
                placeholder="เลือกชื่อกิจการ"
                valueKey="customer_name"
                label="ชื่อกิจการ"
                labelOrientation="horizontal"
              /> */}

              {/* <Text className="">ชื่อกิจการ</Text>
              <TextField.Root
                size="2"
                placeholder=""
                value={customer_name}
                onChange={(e) => setCustomer_name(e.target.value)}
                className="w-2/6"
              /> */}
              <InputAction
                label="ชื่อกิจการ"
                //defaultValue={contact_name ? contact_name : "ไม่มีข้อมูล"}
                //placeholder={customer_name ? customer_name : "ไม่มีข้อมูล"}
                labelOrientation="horizontal"
                value={contact_name}
                className="rounded   min-w-[60px]"
                onChange={(e) => setContact_name(e.target.value)}
                size="2"
              />
            </div>

            {/* ชื่อ ตำแหน่ง */}
            <div className="flex mt-4 ">
              <div className="flex items-center w-5/6 space-x-4">
                {/* <h1 className="mr-4">ชื่อ</h1>
                <TextField.Root
                  size="2"
                  placeholder=""
                  className="w-4/5"
                  value={contact_name}
                  onChange={(e) => setContact_name(e.target.value)}
                />

                <Text className="mr-4">ตำแหน่ง</Text>
                <TextField.Root
                  size="2"
                  placeholder=""
                  className="w-2/3"
                  onChange={(e) => setCustomer_position(e.target.value)}
                  value={customer_position}
                /> */}
                <InputAction
                  label="ชื่อ"
                  labelOrientation="horizontal"
                  value={customer_name}
                  className="rounded  w-7/12"
                  classNameInput="w-7/12"
                  onChange={(e) => setCustomer_name(e.target.value)}
                  defaultValue={customer_name}
                  size="2"
                />
                <InputAction
                  label="ตำแหน่ง"
                  labelOrientation="horizontal"
                  value={customer_position}
                  className="rounded  w-7/12"
                  classNameInput="w-7/12"
                  onChange={(e) => setCustomer_position(e.target.value)}
                  defaultValue={customer_position}
                  size="2"
                />
              </div>
            </div>

            {/* ชื่อ ตำแหน่ง */}
            <div className="flex mt-4">
              <div className="flex items-center w-2/4 space-x-4">
                {/* <Text className="mr-2">เบอร์โทร</Text>
                <TextField.Root
                  size="2"
                  placeholder="0812345678"
                  className="w-1/4"
                  value={customer_tel}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // เอาเฉพาะตัวเลข
                    if (value.length <= 10) {
                      setCustomer_tel(value);
                    }
                  }}
                />
                <Text className="mr-2">LineID</Text>
                <TextField.Root
                  size="2"
                  placeholder=""
                  className="w-1/4"
                  value={customer_line}
                  onChange={(e) => setCustomer_line(e.target.value)}
                /> */}
                <InputAction
                  label="เบอร์โทร"
                  value={customer_tel || ""} // หากไม่มีข้อมูลจะเป็นค่าว่าง
                  labelOrientation="horizontal"
                  className="rounded w-7/12"
                  classNameInput="w-7/12"
                  placeholder="กรอกเบอร์โทร"
                  onChange={(e) => setCustomer_tel(e.target.value)} // ให้ผู้ใช้กรอกได้ตามปกติ
                  size="2"
                />

                <InputAction
                  label="LineID"
                  labelOrientation="horizontal"
                  value={customer_line || ""}
                  className="rounded  w-7/12"
                  classNameInput="w-7/12"
                  onChange={(e) => setCustomer_line(e.target.value)}
                  size="2"
                />
              </div>
            </div>
            {/* ที่อยู่  */}
            <div className="flex mt-4 space-x-4">
              {/* <Text className="mr-4">ที่อยู่</Text>
                <Text>เลขที่</Text>
                <TextField.Root onChange={(e) => setAddr_number(e.target.value)} value={addr_number} />
                <Text>ซอย</Text>
                <TextField.Root onChange={(e) => setAddr_alley(e.target.value)} value={addr_alley} />
                <Text>ถนน</Text>
                <TextField.Root onChange={(e) => setAddr_street(e.target.value)} value={addr_street} />
                <Text>ตำบล/แขวง</Text>
                <TextField.Root
                  onChange={(e) => setAddr_subdistrict(e.target.value) }
                  value={addr_subdistrict}
                /> */}
              <InputAction
                label="ที่อยู่ เลขที่"
                labelOrientation="horizontal"
                value={addr_number}
                className="rounded   min-w-[40px]"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    setAddr_number(value);
                  }
                }}
                size="2"
              />
              <InputAction
                label="ซอย"
                labelOrientation="horizontal"
                value={addr_alley}
                className="rounded  min-w-[50px]"
                onChange={(e) => setAddr_alley(e.target.value)}
                size="2"
              />
              <InputAction
                label="ถนน"
                labelOrientation="horizontal"
                value={addr_street}
                className="rounded  min-w-[50px]"
                onChange={(e) => setAddr_street(e.target.value)}
                size="2"
              />
              <InputAction
                label="ตําบล/แขวง"
                labelOrientation="horizontal"
                value={addr_subdistrict}
                className="rounded  min-w-[50px]"
                onChange={(e) => setAddr_subdistrict(e.target.value)}
                size="2"
              />
            </div>
            {/* ked */}
            <div className="flex mt-4 space-x-4">
              {/* <Text className="ml-7">เขต/อำเภอ</Text>
              <TextField.Root
                onChange={(e) => setAddr_district(e.target.value)}
                value={addr_district} />
              <Text>จังหวัด</Text>
              <TextField.Root onChange={(e) => setAddr_province(e.target.value)}
                value={addr_province} />
              <Text>รหัสไปรษณีย์</Text>
              <TextField.Root onChange={(e) => setAddr_postcode(e.target.value)}
                value={addr_postcode} /> */}

              <InputAction
                label="อําเภอ/เขต"
                labelOrientation="horizontal"
                value={addr_district}
                className="rounded   min-w-[60px]"
                onChange={(e) => setAddr_district(e.target.value)}
                size="2"
              />
              <InputAction
                label="จังหวัด"
                labelOrientation="horizontal"
                value={addr_province}
                className="rounded  min-w-[60px]"
                onChange={(e) => setAddr_province(e.target.value)}
                size="2"
              />
              <InputAction
                label="รหัสไปรษณีย์"
                labelOrientation="horizontal"
                value={addr_postcode}
                className="rounded min-w-[60px]"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 5) {
                    setAddr_postcode(value); // อัพเดตค่า
                  }
                }}
                size="2"
              />
            </div>
            {/* payment */}
            <div className="flex items-center mt-4 space-x-4">
              {/* ส่วนของเงื่อนไขการชำระเงิน */}
              <div className="flex items-center space-x-4 w-3/4">
                <span className="text-base">เงื่อนไขการชำระเงิน</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="payment"
                      value="1"
                      checked={paymentType === "1"}
                      onChange={handlePaymentChange}
                    />
                    <span>เงินสด</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="payment"
                      value="2"
                      checked={paymentType === "2"}
                      onChange={handlePaymentChange}
                    />
                    <Text>เครดิต</Text>
                  </label>
                  {paymentType === "2" && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-16"
                        placeholder="วัน"
                        value={creditDays}
                        onChange={handleCreditDaysChange}
                        min={1}
                        max={365}
                      />
                      <span>วัน</span>
                    </div>
                  )}
                </div>
              </div>

              {/* แสดงวันที่ */}
              <div className="flex items-center space-x-4 w-2/4">
                <Text className="w-1/4">วันครบกำหนด</Text>
                <input
                  type="date"
                  className="w-2/4 border rounded px-2 py-1"
                  onChange={(e) => setPayment_terms_day(e.target.value)}
                  value={
                    paymentType === "2"
                      ? calculatedDate() // แสดงวันที่ที่คำนวณได้สำหรับเครดิต
                      : formattedDateForInput // วันที่ปัจจุบันสำหรับเงินสด
                  }
                  readOnly // ป้องกันการแก้ไข
                />
              </div>
            </div>

            {/* comment */}
            <Text className="text-2xl font-bold mb-4 mt-4">ความคิดเห็น</Text>
            <div className="flex  gap-4 mt-4">
              {/* ความคิดเห็นจากลูกค้า */}
              <div className="w-full sm:w-1/2">
                <Text className="block mb-2 font-medium">
                  ความคิดเห็นจากลูกค้า
                </Text>
                <textarea
                  value={customer_comment}
                  className="w-full border rounded px-3 py-2 resize-none min-h-[150px]"
                  placeholder="ความคิดเห็นจากลูกค้า"
                  onChange={(e) => setCustomer_comment(e.target.value)}
                />
              </div>

              {/* ความคิดเห็นจากตัวแทนขาย */}
              <div className="w-full sm:w-1/2">
                <Text className="block mb-2 font-medium">
                  ความคิดเห็นจากตัวแทนขาย
                </Text>
                <textarea
                  value={agent_comment}
                  className="w-full border rounded px-3 py-2 resize-none min-h-[150px]"
                  placeholder="ความคิดเห็นจากตัวแทนขาย"
                  onChange={(e) => setAgent_comment(e.target.value)}
                />
              </div>
            </div>

            {/* image */}
            <div className="mt-4 flex items-center space-x-4  h-full">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded "
              >
                เลือกรูปภาพ
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                multiple
                ref={imageInputRef} // ผูก ref เข้ากับ input
                onChange={handleFileUpload}
              />
              <span>คู่แข่งขัน</span>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[200px] w-3/4">
                {/* กรณีไม่มีรูปภาพ */}

                {images.length === 0 && (
                  <div className="col-span-2 sm:col-span-3 lg:col-span-4 flex justify-center items-center h-[200px] w-full bg-gray-100 border border-gray-300 rounded">
                    <span className="text-gray-500 text-lg">
                      ยังไม่มีรูปภาพ
                    </span>
                  </div>
                )}
                {/* แสดงรูปภาพ */}
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-full h-[200px] overflow-hidden border border-gray-200 rounded shadow-md"
                  >
                    <img
                      src={image.preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded"
                    />
                    {/* ปุ่มลบ */}
                    <button
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                      onClick={() => handleDeleteImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Flex gap="3" justify="end" className="ml-5 mr-5 mb-5 pt-3 mt-5">
              <Button
                size="2"
                className="px-4 py-4 text-white bg-red-700 hover:bg-red-600 rounded-lg"
                onClick={handledelete}
              >
                ลบข้อมูล
              </Button>
              <Button
                size="2"
                className="px-4 py-4 text-white bg-save rounded-lg hover:bg-[#28a745]"
                onClick={handleSubmit}
              >
                บันทึกข้อมูล
              </Button>
            </Flex>
          </Card>
        </div>
      </ToastProvider>
    </>
  );
}
