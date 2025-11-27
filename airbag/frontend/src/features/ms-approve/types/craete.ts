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
