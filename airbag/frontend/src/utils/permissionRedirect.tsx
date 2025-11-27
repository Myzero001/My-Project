import { useLocalProfileData } from "@/zustand/useProfile";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { permissionMap } from "./permissionMap";

const PermissionRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useLocalProfileData();

  React.useEffect(() => {
    if (profile && profile.role?.role_name) {
      // Create a mapping of URL paths to permissionMap keys
      const pathToPermissionMapKey: Record<string, string> = {
        "ms-group-repair": "กลุ่มซ่อม",
        "ms-repair": "รายการซ่อม",
        "ms-brand": "แบรนด์",
        "ms-brandmodel": "รุ่นรถ",
        "ms-color": "สี",
        "ms-tool": "เครื่องมือ",
        clearby: "clearby",
        "ms-issue-reason": "สาเหตุ",
        "ms-position": "ตำแหน่ง",
        "ms-tooling-reason": "เหตุผลการใช้เครื่องมือ",
        "ms-customer": "ลูกค้า",
        "visiting-customers": "เยี่ยมลูกค้า",
        "ms-supplier": "ร้านค้า",
        quotation: "ใบเสนอราคา",
        "approve-quotation": "การอนุมัติใบเสนอราคา",
        "ms-repair-receipt": "ใบรับซ่อม",
        "delivery-schedule": "บิลใบส่งมอบ",
        "ms-payment": "การชำระเงิน",
        "supplier-delivery-note": "ใบส่งซัพพลายเออร์",
        "ms-companies": "จัดการสาขา",
        "calendar-removal": "ปฏิทินนัดหมายถอด",
        "job": "งาน",
        "get-supplier": "ใบรับซ่อมซัพพลายเออร์",
        "send-for-a-claim": "ใบส่งเคลม",
        "receive-a-claim": "ใบรับเคลม",
        "calendar": "ปฏิทินกำหนดการส่งมอบ",
        "late-payment": "การชำระเงินล่าช้า",
        "responsible-person": "เปลี่ยนผู้รับผิดชอบ",
        "ms-approve-edit-payment": "การอนุมัติขอแก้ไขใบชำระเงิน",
        "search-register": "ค้นหาจากป้ายทะเบียน",
      };

      // Find the corresponding permissionMap key by matching the pathname
      // const matchedPath = Object.keys(pathToPermissionMapKey).find((path) =>
      //   location.pathname.includes(path)
      // );
      const matchedPath = Object.keys(pathToPermissionMapKey).find((path) =>
        location.pathname === `/${path}`
      );

      if (matchedPath) {
        const pathName = pathToPermissionMapKey[matchedPath];

        // const matchedPermission = Object.entries(permissionMap).find(([key]) =>
        //   pathName.includes(key)
        // );
        const matchedPermission = Object.entries(permissionMap).find(
          ([key]) => pathName === key
        );

        if (matchedPermission) {
          const [, permissions] = matchedPermission;
          // Check if the user has permission for this object
          const userPermission = permissions[profile.role?.role_name];
          if (userPermission === "N") {
            // Redirect to /home if the user has no permission ('N')
            navigate("/");
          }
        }
      }
    }
  }, [location, profile, navigate]);

  return null; // This component doesn't render anything, it's just used for logic
};

export default PermissionRedirect;
