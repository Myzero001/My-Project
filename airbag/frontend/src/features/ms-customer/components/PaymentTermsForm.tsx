import React, { useState, useEffect } from "react";

const PaymentTermsForm = ({
  paymentTerms,
  paymentDays,
  createdAt,
  onTermsChange,
  onDaysChange,
  defaultPaymentTerms, // เพิ่ม prop สำหรับค่าเริ่มต้น
  defaultPaymentDays, // เพิ่ม prop สำหรับค่าเริ่มต้น
  disabled,
}: {
  paymentTerms: string;
  paymentDays: number;
  createdAt: string;
  onTermsChange: (value: string) => void;
  onDaysChange: (value: number) => void;
  defaultPaymentTerms: string;
  defaultPaymentDays: number;
  disabled?: boolean;
}) => {
  const [dueDate, setDueDate] = useState(new Date(createdAt));

  // เพิ่ม useEffect สำหรับตั้งค่าเริ่มต้น
  useEffect(() => {
    if (defaultPaymentTerms) {
      onTermsChange(defaultPaymentTerms);
    }
    if (defaultPaymentDays) {
      onDaysChange(defaultPaymentDays);
    }
  }, [defaultPaymentTerms, defaultPaymentDays]);

  const formatDate = (date: string | number | Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const createDate = new Date(createdAt);
    const newDueDate = new Date(createDate);

    if (paymentTerms === "เครดิต" && paymentDays > 0) {
      newDueDate.setDate(createDate.getDate() + paymentDays);
    } else {
      newDueDate.setDate(createDate.getDate());
    }

    setDueDate(newDueDate);
  }, [paymentTerms, paymentDays, createdAt]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
        <label className="text-sm font-medium text-gray-700 min-w-[120px]">
          เงื่อนไขการชำระเงิน
        </label>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="cash"
              value="เงินสด"
              checked={paymentTerms === "เงินสด"}
              onChange={(e) => {
                onTermsChange(e.target.value);
                onDaysChange(0);
              }}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="cash" className="text-sm text-gray-700">
              เงินสด
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="credit"
              value="เครดิต"
              checked={paymentTerms === "เครดิต"}
              onChange={(e) => {
                onTermsChange(e.target.value);
                if (!paymentDays) onDaysChange(1);
              }}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="credit" className="text-sm text-gray-700">
              เครดิต
            </label>

            <input
              type="number"
              min="0"
              max="365"
              value={paymentTerms === "เงินสด" ? "" : paymentDays}
              onChange={(e) => {
                const value = Math.min(
                  365,
                  Math.max(0, parseInt(e.target.value) || 0)
                );
                onDaysChange(value);
              }}
              disabled={paymentTerms === "เงินสด"}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
              placeholder="จำนวนวัน"
            />
            <span className="text-sm text-gray-700">วัน</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
        <label className="text-sm font-medium text-gray-700 min-w-[120px]">
          วันที่ครบกำหนด
        </label>
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
          <span className="text-sm text-gray-700">{formatDate(dueDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentTermsForm;
