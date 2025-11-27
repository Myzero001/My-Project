
import { deleteColor } from "@/services/color.service";

type DialogDeleteColorProps = {
    color_name: string,
    onDeleteColor: () => void
    onClose: () => void
    setToastDeleteOpen: (open: boolean) => void;
    setToastErrorOpen: (open: boolean) => void;
    setErrorMessage: (message: string) => void;
};

const DeleteColor = ({ color_name, onDeleteColor, onClose, setToastDeleteOpen, setToastErrorOpen, setErrorMessage }: DialogDeleteColorProps) => {
    const handleDeleteColor = async () => {
        try {
            await deleteColor(color_name);
            onDeleteColor();
            onClose();
            setToastDeleteOpen(true);
        } catch (error) {
          setErrorMessage(`การลบล้มเหลว: ${error}`);
          setToastErrorOpen(true);
          console.error("Error deleting tool:", error);
        }
    };

    return (
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
        <label className="text-lg">คุณต้องการลบรายการเครื่องมือ 
        <span className="text-red-500">{color_name}</span> หรือไม่</label>
          
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
          onClick={handleDeleteColor}
          className="px-4 py-2 text-white bg-[#198754] rounded-lg hover:bg-[#218838]"
        >
          ยืนยัน
        </button>
      </div>
    </div>
  </>
    );
};

export default DeleteColor;
