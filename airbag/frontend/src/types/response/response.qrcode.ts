export interface Qrcode_Response {
  qrcode: string; // URL หรือ Base64 ของ QR Code
  phone: string;  // เบอร์โทรที่ใช้สร้าง QR Code
  amount?: number; // จำนวนเงิน (อาจเป็น optional)
  createdAt: string; // เวลาที่สร้าง QR Code
}
