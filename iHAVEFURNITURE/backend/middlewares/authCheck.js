const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');


exports.authCheck = async (req, res , next) => {
    try{
        const headersToken = req.headers.authorization;
        // ตรวจสอบว่ามี token หรือไม่
        if(!headersToken){
            return res.status(401).json({ message: 'No token, Authorization'});
        };
        
        // ตรวจสอบว่า token ถูกต้องหรือไม่ เป็นการดึง token ออกมาจาก headers และทำการ decode ด้วย jwt.verify
        const token = headersToken.split(" ")[1];
        const decode = jwt.verify(token, process.env.SECRET);

        // สร้าง req.user และเก็บข้อมูล decode ไว้
        req.user = decode;

        // ดึงข้อมูล user จาก prisma โดยใช้ email จาก req.user
        await prisma.user.findFirst({
            where:{
                email: req.user.email
            }
        });
        next();
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Token Invalid'});
    }
}

exports.adminCheck = async (req,res,next) => {
    try{
        const { email } = req.user;

        // ดึงข้อมูล user จาก prisma โดยใช้ email เป็นเงื่อนไข
        const adminUser = await prisma.user.findFirst({
            where:{
                email: email
            }
        });

        // ตรวจสอบว่า user มี role เป็น admin หรือไม่
        if(!adminUser || adminUser.role !== 'admin'){
            return res.status(403).json({ message: 'access denied: Admin only'});
        };

        next();

    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Admin access denied'});
    }
}