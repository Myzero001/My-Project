// import exprss, { Request, Response } from "express";
// import axios from "axios";

// export const GetQrcode = (() => {

//   const router = exprss.Router();
//   router.get("/qr/:phone/:amount", async (req, res) => {
//     const { phone } = req.params;
//     const {amount } = req.params;
//     try {
//         //https://promptpay.io/0918168125
//       const url = `https://promptpay.io/${phone}/${amount}`;
//       const response = await axios.get(url, { responseType: "arraybuffer" });
  
//       res.setHeader("Content-Type", "image/png");
//       res.send(response.data); // ส่ง QR Code กลับเป็นรูปภาพ
//     } catch (error) {
//       res.status(500).json({ error: "Failed to generate QR Code" });
//     }
//   });
//   return router;

// })();
import exprss, { Request, Response } from "express";
import axios from "axios";

export const GetQrcode = (() => {

  const router = exprss.Router();
  router.get("/qr/:phone/:amount", async (req, res) => {
    const { phone } = req.params;
    const {amount } = req.params;
    try {
        //https://promptpay.io/0918168125
      const url = `https://promptpay.io/${phone}/${amount}`;
      const response = await axios.get(url, { responseType: "arraybuffer" });
  
      res.setHeader("Content-Type", "image/png");
      res.send(response.data); // ส่ง QR Code กลับเป็นรูปภาพ
    } catch (error) {
      res.status(500).json({ error: "Failed to generate QR Code" });
    }
  });
  return router;

})();