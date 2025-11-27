import { Get_QR_Code } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";


const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const getQRcode = async (phone: string, amount: string): Promise<string> => {
  try {
    const response = await mainApi.get(`${Get_QR_Code}/${phone}/${amount}`, {
      responseType: "blob",
    });

    const base64Data = await blobToBase64(response.data); // ✅ แปลงเป็น Base64
    return base64Data; // ✅ คืนค่า Base64
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};



