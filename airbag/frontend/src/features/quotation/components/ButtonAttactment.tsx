import { IoIosImages } from "react-icons/io";
import { KeyboardEvent } from "react"; // Import KeyboardEvent

type ButtonAttactmentProps = {
  label: string;
  className?: string;
  onClick: () => void;
  id?: string; // เพิ่ม id prop
  nextFields?: { left?: string; right?: string; up?: string; down?: string }; // เพิ่ม nextFields prop
};

const ButtonAttactment = (props: ButtonAttactmentProps) => {
  const { label, className, onClick, id, nextFields = {} } = props; // รับ props ใหม่และกำหนดค่า default

  // ฟังก์ชันสำหรับจัดการการกดปุ่มบนคีย์บอร์ด
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keycode = e.key;

    // หา ID ของฟิลด์ถัดไปตามปุ่มที่กด
    const nextFieldId =
      keycode === "ArrowUp"
        ? nextFields.up
        : keycode === "ArrowDown"
        ? nextFields.down
        : keycode === "ArrowLeft"
        ? nextFields.left
        : keycode === "ArrowRight"
        ? nextFields.right
        : null;

    // ถ้ามีฟิลด์ถัดไป ให้ย้าย focus
    if (nextFieldId) {
      e.preventDefault(); // ป้องกันการ scroll หน้าเว็บ
      const nextField = document.getElementById(nextFieldId);
      if (nextField instanceof HTMLElement) {
        nextField.focus();
      }
    }
  };

  return (
    <div
      className={className || ""}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {label && (
        <label
          htmlFor={id} // เชื่อม label กับ button ด้วย id
          style={{
            marginBottom: "0.5rem",
          }}
        >
          {label}
        </label>
      )}
      {/* เปลี่ยนจาก div เป็น button */}
      <button
        id={id} // กำหนด id ให้กับปุ่ม
        type="button" // ป้องกันการ submit form โดยไม่ตั้งใจ
        className="flex gap-2 justify-center items-center border border-blue-500 text-blue-500 rounded-md cursor-pointer w-24 h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={onClick}
        onKeyDown={handleKeyDown} // เพิ่ม event handler onKeyDown
      >
        <IoIosImages className="w-8 h-8" />
      </button>
    </div>
  );
};

export default ButtonAttactment;