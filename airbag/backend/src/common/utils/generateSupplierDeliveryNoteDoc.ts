import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

export const generateSupplierDeliveryNoteDoc = async (companyId: string) => {
  const prisma = new PrismaClient();
  
  const datePrefix = dayjs().format("YYYYMMDD"); 
  let supplierDeliveryNoteDoc = `SPS${datePrefix}`;

  const supplierDeliveryNote = await prisma.supplier_delivery_note.findMany({
    where: {
      company_id: companyId,
      supplier_delivery_note_doc: {
        startsWith: supplierDeliveryNoteDoc,
      },
    },
  });

  if (supplierDeliveryNote.length > 0) {
    const maxSequence = Math.max(
      ...supplierDeliveryNote.map((SDN) => {
        const match = SDN.supplier_delivery_note_doc.match(/SPS\d{8}(\d{3})/);
        return match ? parseInt(match[1], 10) : 0; 
      })
    );

    const newSequence = (maxSequence + 1).toString().padStart(3, "0"); 
    supplierDeliveryNoteDoc += newSequence;
  } else {
    supplierDeliveryNoteDoc += "001"; 
  }

  return supplierDeliveryNoteDoc;
};