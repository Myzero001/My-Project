import {useState} from "react";
import {postColor} from "@/services/color.service";

type DialogAddColorProps = {
    onAddColor: () => void
    onClose: () => void
    setToastOpen: (open: boolean) => void;
  setToastErrorOpen: (open: boolean) => void;
  setErrorMessage: (message: string) => void;
};

const DailodAdd = ({onAddColor, onClose, setToastOpen
  ,setToastErrorOpen, setErrorMessage}: DialogAddColorProps) => {
    const [postColorName , setPostColorName] = useState("");

    const handleAddColor = async () => {
      if (!postColorName.trim()) {
        setErrorMessage("กรุณาใส่ข้อมูล");
        setToastErrorOpen(true);
        return;
      }
      try {
        const response = await postColor({ color_name: postColorName.trim() });
    
        if (response.statusCode === 200) {
          setToastOpen(true); // Trigger success toast
          onAddColor();
          onClose();
        } else {
          console.log(`statusCode: ${response.statusCode}`);
          setErrorMessage("เกิดข้อผิดพลาดในการเพิ่มสี");
          setToastErrorOpen(true);
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        setToastErrorOpen(true);
      }
    };
    
    
  




return (
    <>
  <div className="h-[300px] w-[550px] flex flex-col border rounded-lg  shadow-lg bg-gray-100">{/* Main Container */}
    
    {/* Header */}
    <div className="bg-[#3B71CA] text-white p-4 flex justify-between items-center ">
      <h1 className="text-lg font-semibold">เพิ่มรายการสีรถ</h1>
      <button onClick={onClose} className="text-white hover:text-gray-300 text-xl">
        &times;
      </button>
    </div>

    {/* Content */}
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="flex items-center justify-center space-x-4">
        <label className="text-lg font-medium">สีรถ</label>
        <input
          type="text"
          value={postColorName}
          onChange={(e) => setPostColorName(e.target.value)}
          className="border rounded-lg p-2 w-[250px] h-[40px] focus:outline-none focus:border-blue-300"
        />
      </div>
    </div>

    {/* Footer Buttons */}
    <div className="flex justify-between items-center p-4 bg-gray-100 border-t border-gray-300 rounded-b-lg">
      <button
        onClick={onClose}
        className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-gray-200"
      >
        ยกเลิก
      </button>
      <button
        onClick={handleAddColor}
        className="px-4 py-2 text-white bg-[#198754] rounded-lg hover:bg-[#218838]"
      >
        บันทึกข้อมูล
      </button>
    </div>
  </div>
</>
)

}



export default DailodAdd