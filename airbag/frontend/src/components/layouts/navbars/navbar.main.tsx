import { Avatar, Box, Flex, Link, Text } from "@radix-ui/themes";
import { useLocalProfileData } from "@/zustand/useProfile";
import SidebarTriggerCustom from "@/components/customs/button/sidebarTriggerCustom";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

const NavbarProfileInfo = () => {
  const { profile } = useLocalProfileData();
  return (
    // <HoverCard.Root>
    //   <HoverCard.Trigger>
    //     <Flex className=" text-main mr-8" align={"center"} gap={"4"}>
    //       <Box className=" relative">
    //         <Box className=" w-3 h-3 rounded-full bg-green-600 absolute border-white border-2 bottom-0 right-0"></Box>
    //         <Avatar
    //           src="/images/avatar2.png"
    //           fallback={"/images/avatar2.png"}
    //           size={"2"}
    //         />
    //       </Box>
    //       <Text className=" text-sm">Admin</Text>
    //       <FaCaretDown />
    //     </Flex>
    //   </HoverCard.Trigger>
    //   <HoverCard.Content maxWidth="300px">
    //     <Flex gap={"2"} direction={"column"} width={"140px"}>
    //       <ListMenuNavbarProfile title={"ออกจากระบบ"} />
    //     </Flex>
    //   </HoverCard.Content>
    // </HoverCard.Root>
    <Flex className=" text-main " align={"center"} gap={"4"}>
      <Box className=" relative">
        <Box className=" w-3 h-3 rounded-full bg-green-600 absolute border-white border-2 bottom-0 right-0"></Box>
        <Avatar
          src="/images/avatar2.png"
          fallback={"/images/avatar2.png"}
          size={"2"}
        />
      </Box>
      {/* <Text className=" text-sm">{profile?.role?.role_name ?? "Admin"}</Text> */}
    </Flex>
  );
};

const NavbarMain = () => {
  const { profile } = useLocalProfileData();
  const { redirectToRoleHomePage } = useRoleRedirect();

  const handleLogoClick = () => {
    redirectToRoleHomePage(profile?.role?.role_name);
  };

  return (
    <Flex
      className="fixed w-screen top-0 h-[70px] shadow-navbar bg-white z-20"
      justify={"center"}
      align={"center"}
    >
      <Flex
        className="w-full"
        justify={"between"}
        style={{
          boxShadow: "0 2px 4px rgba(0,0,0,.108)",
          padding: "15px 30px",
        }}
      >
        <div className=" flex gap-4 items-center">
          <SidebarTriggerCustom />

          {/* 4. เปลี่ยนจาก <Link> มาเป็น <Box> ที่มี onClick */}
          <Box onClick={handleLogoClick}>
            {/* <img
              src="/images/Logo-airbag.png"
              alt="logo-main-website"
              className="hover:cursor-pointer hover:opacity-60 opacity-100 transition ease-in-out duration-300  sm:h-[40px] h-[32px]"
            /> */}
            <Text className="font-bold text-xl md:text-2xl text-main cursor-pointer">
              พรสวรรค์อะไหล่ยนต์
            </Text>
          </Box>
        </div>
        <NavbarProfileInfo />
      </Flex>
    </Flex>
  );
};

export default NavbarMain;