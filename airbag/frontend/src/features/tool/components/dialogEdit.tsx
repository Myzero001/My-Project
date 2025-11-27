import { updateTool } from "@/services/tool.service";
import { useState } from "react";
import { useEffect } from "react";
type EditToolProps = {
  tool_id: string;
  toolName: string;
  onToolEdited: () => void;
  onClose: () => void;
  setToastEditOpen: (open: boolean) => void;
  setToastErrorOpen: (open: boolean) => void;
  setErrorMessage: (message: string) => void;
};

const EditTool = ({ toolName, tool_id, onToolEdited, onClose,setToastEditOpen,setToastErrorOpen 
  ,setErrorMessage
}: EditToolProps) => {
  const [postToolName, setPostToolName] = useState(toolName);
  const handleUpdateTool = async () => {
    const trimmedToolName = postToolName.trim(); // ตัดช่องว่างจาก input

    if (!trimmedToolName) {
      setErrorMessage("กรุณาใส่ข้อมูล");
      setToastErrorOpen(true);  
      return;
    }
    else if (trimmedToolName === toolName) {
      onClose();
      setToastEditOpen(true);
      return;
    }

    try {
      const response = await updateTool(tool_id, { tool: trimmedToolName });



      if (response.statusCode === 200) {
        setPostToolName("");
        onToolEdited();
        onClose();
        
        setToastEditOpen(true);
      } else {
        console.error("Failed Update: Status Code:", response.statusCode);
        alert("การอัปเดตล้มเหลว");
        console.log(toolName);
        console.log(tool_id);
        setToastErrorOpen(true);
      }
    } catch (error) {
      alert("Failed to update category");

      console.error("Error updating tool:", error);
      setErrorMessage("แก้ไขข้อมูลล้มเหลว");
      setToastErrorOpen(true);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleUpdateTool(); // Enter triggers save
      } else if (event.key === "Escape") {
        onClose(); // Escape triggers close
      }
    };

    // Attach the event listener to the document
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [postToolName]);

  return (
    <>
      <div className="h-[300px] w-[550px] flex flex-col border rounded-lg shadow-lg bg-gray-100">
        {/* Main Container */}

        {/* Header */}
        <div className="bg-[#3B71CA] text-white p-4 flex justify-between items-center rounded-t-lg">
          <h1 className="text-lg font-semibold">
            แก้ไขรายการเครื่องมือ</h1>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="flex items-center justify-center space-x-4">
        <label className="text-lg font-medium">เครื่องมือ</label>
        <input
          type="text"
          value={postToolName}
          onChange={(e) => setPostToolName(e.target.value)}
          autoFocus
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
        onClick={handleUpdateTool}
        className="px-4 py-2 text-white bg-[#198754] rounded-lg hover:bg-[#218838]"
      >
        บันทึกข้อมูล
      </button>
    </div>
  </div>
</>
  );
};

export default EditTool;
