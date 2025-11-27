import { blobToFile } from "@/types/file";

export type quatationCreateType = {
  date: string;
  //   quotationNumber: number;
  //   customerId: string;
  //   businessTitle: string;
  //   businessName: string;
  //   houseNumber: number;
  alley: string;
  street: string;
  subDistrict: string;
  district: string;
  province: string;
  postcode: number;
  fullName: string;
  position: string;
  phoneNumber: string;
  lineId: string;
  images: blobToFile[];

  typeRepairs: string;
  carModel: string;
  model: string;
  carYear: string;
  color: string;
  totalPrice: number;
  tax: number;
  period: number;
  appointDate: string;
  note: string;
};

export enum QUATATION_STATUS {
  pending = "ระหว่างดำเนินการ",
  waiting_for_approve = "รออนุมัติ",
  approved = "อนุมัติ",
  reject_approve = "ไม่อนุมัติ",
  close_deal = "ปิดดีล",
  cancel = "ยกเลิก",
}
