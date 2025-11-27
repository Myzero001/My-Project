import {deleteTool} from "@/services/tool.service";   
import {useEffect} from "react";
type DialogDeleteProps = {
    toolName: string;
    tool_id: string;
    onToolDeleted: () => void;
    onClose: () => void;
    setToastDeleteOpen: (open: boolean) => void;
    setToastErrorOpen: (open: boolean) => void;
    setErrorMessage: (message: string) => void;
};


const DialogDelete =({toolName,tool_id,onToolDeleted,onClose,setToastDeleteOpen,setToastErrorOpen,setErrorMessage
  
}:DialogDeleteProps)=>{

    const handleDeleteTool = async () => {
        
        try { 
            // เรียกใช้ฟังก์ชัน deleteTool เพื่อทำการลบข้อมูล
            await deleteTool(tool_id); 
            onToolDeleted(); // เรียก callback เมื่อการลบสำเร็จ
            onClose(); // ปิด dialog
            setToastDeleteOpen(true);
        } catch (error) {
            setErrorMessage(`การลบล้มเหลว: ${error}`);
            setToastErrorOpen(true);
            console.error("Error deleting tool:", error);
        }
           
    };
    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          handleDeleteTool(); // Enter triggers delete
        } else if (event.key === "Escape") {
          onClose(); // Escape triggers close
        }
      };
  
      document.addEventListener("keydown", handleKeyPress);
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }, [tool_id]);
    return(
        <>
      <div className="h-[300px] w-[550px] flex flex-col border rounded-lg shadow-lg bg-gray-100">
        {/* Main Container */}

        {/* Header */}
        <div className="bg-[#3B71CA] text-white p-4 flex justify-between items-center rounded-t-lg">
          <h1 className="text-lg font-semibold">แก้ไขรายการเครื่องมือ</h1>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl"
          >
            &times;
          </button>
        </div>

 {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="flex items-center justify-center space-x-4">
      <label className="text-lg">คุณต้องการลบรายการเครื่องมือ <span className="text-red-500">{toolName}</span> หรือไม่</label>
        
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
        onClick={handleDeleteTool}
        className="px-4 py-2 text-white bg-[#198754] rounded-lg hover:bg-[#218838]"
        
      >

        ยืนยัน
      </button>
    </div>
  </div>
</>
    )
}
export default DialogDelete