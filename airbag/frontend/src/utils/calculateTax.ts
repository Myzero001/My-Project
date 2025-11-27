export const calculateTax = (priceData: number, taxRate: number = 7, tax_status: string = "false", type: string = "default") => {
  let taxAmount = 0;
  let price = priceData;
  let totalPrice = 0;
  
  if(tax_status === "true"){
    // true คือ ราคายังไม่รวมภาษี
    taxAmount = (priceData * taxRate) / 100; // คำนวณภาษี
    totalPrice = priceData + taxAmount; // ราคารวมภาษี
  }else {
    // false คือ รราคาวมภาษี
    if(type != 'edit'){
      taxAmount = priceData - (priceData * 100) / (100 + taxRate);
      price = priceData - taxAmount;
      totalPrice = priceData; // ราคารวมภาษี

    }else {
      taxAmount = (priceData * taxRate) / 100; // คำนวณภาษี
      totalPrice = priceData + taxAmount; // ราคารวมภาษี
    }
  }
  // ปัดเป็นทศนิยม 2 ตำแหน่ง
  taxAmount = Math.round(taxAmount * 100) / 100;
  price = Math.round(price * 100) / 100;
  totalPrice = Math.round(totalPrice * 100) / 100;

  // console.log("price before", price);
  // console.log("tax amount", taxAmount);
  // console.log("total price", totalPrice);
  // console.log("status", tax_status);
  
  return { taxAmount, totalPrice, price };
};
