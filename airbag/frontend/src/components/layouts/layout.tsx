import { Outlet } from "react-router-dom";
import NavbarMain from "./navbars/navbar.main";
import { useEffect } from "react";
import { getAuthStatus, getLogout } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { IoIosLogOut } from "react-icons/io";
import { DataSideBar, SidebarComponent } from "./sidebars/sidebar";
import { FaWpforms, FaCalendarDays, FaHandshake, FaUsersGear, FaTruckFast, FaToolbox, FaMoneyBillTransfer, FaScrewdriverWrench, FaCubes, FaCartShopping } from "react-icons/fa6";
import { getUserProfie } from "@/services/user.service";
import { useLocalProfileData } from "@/zustand/useProfile";
import { permissionMap } from "@/utils/permissionMap";
import PermissionRedirect from "@/utils/permissionRedirect";

const MainLayout = () => {
  const navigate = useNavigate();
  const { setLocalProfileData, profile } = useLocalProfileData();

  const handleLogout = async () => {
    getLogout()
      .then((response) => {
        if (response.statusCode === 200) {
          navigate("/login");
        } else {
          alert(`Unexpected error: ${response.message}`);
        }
      })
      .catch((error) => {
        console.error(
          "Error creating category:",
          error.response?.data || error.message
        );
        alert("Failed to create category. Please try again.");
      });
  };

  useEffect(() => {
    getAuthStatus()
      .then((response) => {
        if (response.statusCode === 200) {
          if (response.message == "Authentication required") {
            navigate("/login");
          }
        }
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error.message);
      });



    getUserProfie().then((res) => {
      if (res.responseObject) {
        setLocalProfileData(res.responseObject);
        // console.log("response", res);
      }
    });
  }, []);

  const eiditprofile = () => {
    // console.log("profile", profile.company_id);
    //navigate('/eidit/companies', { state: { customer_id: profile.company_id} });
    navigate('/eidit/companies', { state: { customer_id: profile.company_id } });
  }

  const rawSidebarItems = [
    {
      title: "แดชบอร์ด",
      url: "",
      icon: FaCartShopping,
      disable: true,
      items: [
        {
          title: "สถานะเสนอราคา",
          url: `/dashboardQuotationCustomer`,
        },
        {
          title: "ลูกหนี้", 
          url: `/dashboardDebtor`,
        },
        {
          title: "สถานะลูกค้า",
          url: `/dashboardMissingDebtor`,
        },
        {
          title: "ค้นหาจากป้ายทะเบียน",
          url: `/search-register`,
        }
      ],
    },
    {
      title: "ปฏิทิน และกำหนดการ",
      url: "",
      icon: FaCalendarDays,
      disable: true,
      items: [
        {
          title: "ปฏิทินนัดหมายถอด",
          url: `/calendar-removal`,
        },
        {
          title: "ปฏิทินกำหนดการส่งมอบ",
          url: `/calendar`,
        },
      ],
    },
    {
      title: "การขาย",
      url: "",
      icon: FaCartShopping,
      disable: true,
      items: [
        {
          title: "ใบเสนอราคา",
          url: `/quotation`,
        },
        {
          title: "การอนุมัติใบเสนอราคา",
          url: `/approve-quotation`,
        },
      ],
    },
    {
      title: "ลูกค้า และการให้บริการ",
      url: "",
      icon: FaHandshake,
      disable: true,
      items: [
        {
          title: "ลูกค้า",
          url: `/ms-customer`,
        },
        {
          title: "เยี่ยมลูกค้า",
          url: `/visiting-customers`,
        },
      ],
    },
    {
      title: "งานซ่อม",
      url: "",
      icon: FaScrewdriverWrench,
      disable: true,
      items: [
        {
          title: "ใบรับซ่อม",
          url: `/ms-repair-receipt`,
        },
        {
          title: "งาน",
          url: `/job`,
        },
        {
          title: "กลุ่มซ่อม",
          url: `/ms-group-repair`,
        },
        {
          title: "รายการซ่อม",
          url: `/ms-repair`,
        },
      ],
    },
    {
      title: "การเงิน และการชำระเงิน",
      url: "",
      icon: FaMoneyBillTransfer,
      disable: true,
      items: [
        {
          title: "บิลใบส่งมอบ",
          url: `/delivery-schedule`,
        },
        {
          title: "การชำระเงิน",
          url: `/ms-payment`,
        },
        {
          title: "การชำระเงินล่าช้า",
          url: `/late-payment`,
        },
        {
          title: "การอนุมัติขอแก้ไขใบชำระเงิน",
          url: `/ms-approve-edit-payment`,
        },
      ],
    },
    {
      title: "ซัพพลายเออร์",
      url: "",
      icon: FaCubes,
      disable: true,
      items: [
        {
          title: "ร้านค้า",
          url: `/ms-supplier`,
        },
        {
          title: "ใบส่งซัพพลายเออร์",
          url: `/supplier-delivery-note`,
        },
        {
          title: "ใบรับซ่อมซัพพลายเออร์",
          url: `/get-supplier`,
        },
        {
          title: "ใบส่งเคลม",
          url: `/send-for-a-claim`,
        },
        {
          title: "ใบรับเคลม",
          url: `/receive-a-claim`,
        },
      ],
    },
    {
      title: "เครื่องมือ และสาเหตุการใช้",
      url: "",
      icon: FaToolbox,
      disable: true,
      items: [
        {
          title: "เครื่องมือ",
          url: `/ms-tool`,
        },
        {
          title: "clearby",
          url: `/clearby`,
          icon: FaWpforms,
        },
        {
          title: "สาเหตุ",
          url: `/ms-issue-reason`,
          icon: FaWpforms,
        },
        {
          title: "เหตุผลการใช้เครื่องมือ",
          url: `/ms-tooling-reason`,
          icon: FaWpforms,
        },
      ],
    },
    {
      title: "ข้อมูลรถยนต์",
      url: "",
      icon: FaTruckFast,
      disable: true,
      items: [
        {
          title: "แบรนด์",
          url: `/ms-brand`,
        },
        {
          title: "รุ่นรถ",
          url: `/ms-brandmodel`,
        },
        {
          title: "สี",
          url: `/ms-color`,
        },
      ],
    },
    {
      title: "สาขาและพนักงาน",
      url: "",
      icon: FaUsersGear,
      disable: true,
      items: [
        {
          title: "จัดการสาขา",
          url: `/ms-companies`,
        },
        {
          title: "พนักงาน",
          url: `/register`,
          icon: FaWpforms,
        },
        {
          title: "ตำแหน่ง",
          url: `/ms-position`,
          icon: FaWpforms,
        },
        {
          title: "เปลี่ยนผู้รับผิดชอบ",
          url: `/responsible-person`,
          icon: FaWpforms,
        },
        {
          title: "แก้ไขโปรไฟล์",
          icon: <FaWpforms />,
          url: `/eidit/companies/${profile.company_id}`,
        },

      ],
    },

  ];

  // ฟังก์ชันกรองเฉพาะเมนูที่ role ของ user มีสิทธิ์ (A หรือ R)
  const filteredSidebarItems = rawSidebarItems
    .map((item) => {
      if (item.items) {
        // ตรวจสอบ permission ของ items ย่อย
        const filteredSubItems = item.items.filter((subItem) => {
          const permission =
            permissionMap[subItem.title]?.[
            profile?.role?.role_name ?? "Admin"
            ] || "N";
          return permission !== "N";
        });

        // ถ้ามี items ที่ผ่านการกรอง ให้สร้าง object ใหม่
        if (filteredSubItems.length > 0) {
          return { ...item, items: filteredSubItems };
        }
      }

      // ตรวจสอบ permission ของเมนูหลัก
      const permission =
        permissionMap[item.title]?.[profile?.role?.role_name ?? "Admin"] || "N";
      if (permission !== "N") {
        return item; // คืนค่าเมนูหลักที่มี permission
      }

      return null; // กรณีที่ไม่มี permission จะคืนค่าเป็น null
    })
    .filter((item) => item !== null); // กรอง null ออกจากอาร์เรย์

  const dataSidebar: DataSideBar = {
    sidebarItems: [
      {
        name: "",
        items: filteredSidebarItems,
      },
    ],
    sidebarFooter: {
      profile: {
        name: (profile?.first_name ?? "") + " " + (profile?.last_name ?? ""),
        // @ts-ignore
        avatar: profile?.image_url ?? "/images/avatar2.png",
      },
      items: [
        {
          icon: <IoIosLogOut className="text-theme-yellow" />,
          name: "ออกจากระบบ",
          onClick: () => {
            // console.log("logout");
            handleLogout();
          },

        },

      ],
    },
  };

  return (
    <div className=" relative w-screen h-screen">
      <PermissionRedirect />

      <SidebarProvider
        style={{
          height: "100%",
          width: "100%",
          paddingTop: "70px",
          overflow: "hidden",
          boxShadow: "4px 2px 12px 0px #0A0A100F",
        }}
      >
        <NavbarMain />
        <SidebarComponent data={dataSidebar} />
        <SidebarInset className="m-0 p-0 bg-[#F6F7F9] w-full max-w-full">
          {/* <header className="clas flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 p-4">
              <SidebarTriggerCustom />
            </div>
          </header> */}
          <div className="sm:px-4 sm:py-4 overflow-auto max-h-[calc(100%-70px)]">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
