"use strict";
// import exprss, { Request, Response } from "express";
// import axios from "axios";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetQrcode = void 0;
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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
exports.GetQrcode = (() => {
    const router = express_1.default.Router();
    router.get("/qr/:phone/:amount", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone } = req.params;
        const { amount } = req.params;
        try {
            //https://promptpay.io/0918168125
            const url = `https://promptpay.io/${phone}/${amount}`;
            const response = yield axios_1.default.get(url, { responseType: "arraybuffer" });
            res.setHeader("Content-Type", "image/png");
            res.send(response.data); // ส่ง QR Code กลับเป็นรูปภาพ
        }
        catch (error) {
            res.status(500).json({ error: "Failed to generate QR Code" });
        }
    }));
    return router;
})();
