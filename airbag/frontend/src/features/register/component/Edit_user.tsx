
import { TextField, Text, Flex, Grid, Card, Button } from "@radix-ui/themes";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import ButtonAttactment from "@/features/quotation/components/ButtonAttactment";
import DialogAttachment from "@/features/quotation/components/DialogAttachment";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import { MS_USER_ALL } from "@/types/response/response.user";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { useLocation } from "react-router-dom";
import { resolve } from "path";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PayLoadRegister } from "@/types/requests/request.user";
import { usePositionSelect } from "@/hooks/useSelect";
import { PositionSelectItem } from "@/types/response/response.ms_position";

import {
  CreateUserSchema,
  UpdateUserSchema,
} from "@/features/register/component/Zmod_User";
import { getUserByID, updateUser, postRegister } from "@/services/user.service";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import Buttons from "@/components/customs/button/button.main.component";
import { deleteFile, postFile } from "@/services/file.service";
import { error } from "console";
import { getUserRoleAll } from "./getrole";
import { Eye, EyeOff } from "lucide-react";

export default function Create_eidit_user() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<MS_USER_ALL>();
  //const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const location = useLocation();
  const EmployeeID = location.state?.employee_id;

  const [isChangeFile, setIsChangeFile] = useState<boolean>(false);
  const [openDialogImages, setOpenDialogImages] = useState<boolean>(false);
  const [openDialogPassword, setOpenDialogPassword] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [searchPosition, setSearchPosition] = useState("");
  // สมมุติเป็นค่าที่รับมาจาก input
  const formattedRoleId =
    selectedOption && selectedOption.trim() !== "" ? selectedOption : "";
  // สมมุติเป็นค่าที่รับมาจาก input
  const [showPassword, setShowPassword] = useState(false); // state สำหรับสลับรหัสผ่าน
  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    register,
  } = useForm<PayLoadRegister>({
    defaultValues: {
      birthday: "", // หรือ undefined ถ้าคุณต้องการให้ไม่กรอก
      employee_image: [],
      
    },
    resolver: zodResolver(UpdateUserSchema),
  });
  const fetchUserById = () => {
    if (EmployeeID) {
      getUserByID(EmployeeID)
        .then((userData) => {
          if (userData.responseObject) {
            const users = userData.responseObject;
            setUserData(users);
            setValue("username", users.username ?? "");
            setValue("password", users.password ?? "");
            setValue("employee_code", users.employee_code ?? "");
            setValue("role_id", users.role_id ?? "");
            setValue("company_id", users.company_id ?? "");

            setValue("right", users.right ?? "");
            setValue("job_title", users.job_title ?? "");
            setValue("email", users.email ?? "");
            setValue("first_name", users.first_name ?? "");
            setValue("last_name", users.last_name ?? "");
            setValue("phone_number", users.phone_number ?? "");
            setValue("line_id", users.line_id ?? "");
            setValue("addr_number", users.addr_number ?? "");
            setValue("addr_alley", users.addr_alley ?? "");
            setValue("addr_street", users.addr_street ?? "");
            setValue("created_at", users.created_at ?? "");
            setValue(
              "birthday",
              users.birthday ?? dayjs().format("YYYY-MM-DD")
            );
            setValue("addr_subdistrict", users.addr_subdistrict ?? "");
            setValue("addr_district", users.addr_district ?? "");
            setValue("addr_province", users.addr_province ?? "");
            setValue("addr_postcode", users.addr_postcode ?? "");
            setValue("position", users.position ?? "");
            setValue("remark", users.remark ?? "");

            setSelectedOption(users.role_id);
          }
        })
        .catch((err) => {
          showToast("ไม่สามารถดึงข้อมูลพนักงานได้" + err.message, false);
        });
    } else {
      showToast("ไม่สามารถดึงข้อมูลพนักงานได้", false);
    }
  };
  useEffect(() => {
    fetchUserById();
  }, []);
  useEffect(() => {
  }, [userData]); // log หลังจาก userData ถูกอัปเดต

  const onSubmitHandler = async (payload: PayLoadRegister) => {
    //debugger
    try {
      if (!EmployeeID) {
        let filesURL = "";
        if (payload?.employee_image && payload.employee_image?.length > 0) {
          const formData = new FormData();
          Array.from(payload.employee_image).map((file) => {
            formData.append("files", file);
          });

          const resemployee_image = await postFile(formData);
          if (resemployee_image.responseObject.file_url) {
            filesURL = resemployee_image.responseObject.file_url;
          }
        }

        await postRegister({
          employee_code: payload.employee_code ?? "",
          username: payload.username ?? "",
          password:
            payload.password && payload.password.trim() !== ""
              ? payload.password
              : undefined,
          role_id: selectedOption ?? "",
          is_active: payload.is_active ?? true,
          job_title: payload.job_title ?? "",
          right: payload.right ?? "",
          email: payload.email ?? "",
          first_name: payload.first_name ?? "",
          last_name: payload.last_name ?? "",
          birthday: payload.birthday ?? "",
          phone_number: payload.phone_number ?? "",
          line_id: payload.line_id ?? "",
          addr_number: payload.addr_number ?? "",
          addr_alley: payload.addr_alley ?? "",
          addr_street: payload.addr_street ?? "",
          addr_subdistrict: payload.addr_subdistrict ?? "",
          addr_district: payload.addr_district ?? "",
          addr_province: payload.addr_province ?? "",
          addr_postcode: payload.addr_postcode ?? "",
          position: payload.position ?? "",
          remark: payload.remark ?? "",
          employee_image: filesURL,
        }).then(() => {
          showToast("เพิ่มข้อมูลเรียบร้อย", true);
          //fetchUserById();
          // navigate("/register");
        });

        return; // หยุดการทำงานของฟังก์ชันที่เหลือ
      }

      let filesURL = userData?.employee_image ?? "";
      if (isChangeFile) {
        if (userData?.employee_image) {
          filesURL = "";
          await deleteFile(userData.employee_image);
        }
        const formData = new FormData();
        if (payload?.employee_image && payload.employee_image?.length > 0) {
          Array.from(payload.employee_image).map((file) => {
            formData.append("files", file);
          });

          const resemployee_image = await postFile(formData);

          if (resemployee_image.responseObject.file_url) {
            filesURL = resemployee_image.responseObject.file_url;
          }
        }
      }

      updateUser(EmployeeID, {
        employee_code: payload.employee_code,
        username: payload.username ?? "",
        // password:
        //   payload.password && payload.password.trim() !== ""
        //     ? payload.password // ใช้ค่าใหม่หากมีการกรอก
        //     : undefined,

        is_active: payload.is_active ?? true,
        company_id: userData?.company_id ?? "",
        role_id: payload.role_id,
        job_title: payload.job_title ?? "",
        right: payload.right ?? "",
        email: payload.email ?? "",
        first_name: payload.first_name ?? "",
        last_name: payload.last_name ?? "",
        birthday: payload.birthday ?? "",
        phone_number: payload.phone_number ?? "",
        line_id: payload.line_id ?? "",
        addr_number: payload.addr_number ?? "",
        addr_alley: payload.addr_alley ?? "",
        addr_street: payload.addr_street ?? "",
        addr_subdistrict: payload.addr_subdistrict ?? "",
        addr_district: payload.addr_district ?? "",
        addr_province: payload.addr_province ?? "",
        addr_postcode: payload.addr_postcode ?? "",
        position: payload.position ?? "",
        remark: payload.remark ?? "",
        employee_image: filesURL,
      }).then(() => {
        showToast("บันทึกข้อมูลเรียบร้อย", true);
        fetchUserById();
        navigate("/register");
      });
    } catch (error) {
      console.error("Error saving customer data:", error);
    }
  };

  const handleCloseDialogImaage = () => {
    setOpenDialogImages(false);
  };

  useEffect(() => {
  }, [selectedOption]); // เมื่อ selectedOption เปลี่ยนค่า, จะ log ค่านี้

  const formattedDate = dayjs(watch("created_at")).toDate();

  const handleOpenDialogPassword = () => {
    setOpenDialogPassword(true);
  }

  const handleCloseDialogPassword = () =>{
    setOpenDialogPassword(false);
  }

  // const commitpassword = async () => {
  //   try {
  //     await updateUser(EmployeeID, {
  //       username: watch("username"),
  //       password: watch("password"),
  //       company_id:watch("company_id"),
  //     });
  
  //     showToast("บันทึกข้อมูลเรียบร้อย", true);
  //     setOpenDialogPassword(false); // ปิด Dialog หลังจากอัปเดตสำเร็จ
  //   } catch (error) {
  //     console.error("Error updating password:", error);
  //     showToast("เกิดข้อผิดพลาดในการบันทึก", false);
  //   }
  // };
  const commitpassword = async () => {
    const username = watch("username");
    const password = watch("password");
    const company_id = watch("company_id");
  
    // ✅ ตรวจสอบว่าทุกค่าไม่เป็นค่าว่างหรือ undefined
    if (!username || !password || !company_id) {
      showToast("กรุณาระบุpasswordใหม่ก่อนกดปุ่มยืนยัน", false);
      return;
    }
  
    try {
      await updateUser(EmployeeID, { username, password, company_id });
  
      showToast("บันทึกข้อมูลเรียบร้อย", true);
      setOpenDialogPassword(false); // ปิด Dialog หลังจากอัปเดตสำเร็จ
    } catch (error) {
      console.error("Error updating password:", error);
      showToast("เกิดข้อผิดพลาดในการบันทึก", false);
    }
  };



useEffect(() => {
  if (openDialogPassword) {
    setValue("password", ""); // เคลียร์ค่า password เฉพาะฟิลด์เดียว
  }
}, [openDialogPassword, setValue]);

const { data: dataPosition, refetch: refetchPosition } = usePositionSelect({
      searchText: searchPosition,
    });

  const fetchDataPositionDropdown = async () => {
    const positionList = dataPosition?.responseObject?.data ?? [];
    return {
      responseObject: positionList.map((item: PositionSelectItem) => ({
        position_id: item.position_id,
        position_name: item.position_name,
      })),
    };
  };

  const handlePositionSearch = (searchText: string) => {
    setSearchPosition(searchText);
    refetchPosition();
  };


  return (
    <>
      <Text size="6" weight="bold" className="p-6 text-xl sm:text-2xl">
        แก้ไขข้อมูลพนักงาน
      </Text>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-3 w-full mt-4 bg-white rounded-md p-6"
      >
        {/* บรรทัดที่1 */}
        <Flex
          direction={"column"}
          gap={"4"}
          className="w-full mt-4 bg-white rounded-md p-6"
        >
          <Grid
            columns={{ initial: "1", md: "2", sm: "2", lg: "2", xl: "2" }}
            gap="3"
            rows="repeat(2, auto)"
            width="auto"
          >
            <InputAction
              label="ชื่อผู้ใช้งาน"
              placeholder="ชื่อผู้ใช้งาน"
              defaultValue={watch("username") ? watch("username") : ""}
              // placeholder={watch("addr_district") === "" ? "อําเภอ/เขต" : watch("addr_district")}
              value={watch("username") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("username", e.target.value);
              }}
              errorMessage={errors.username?.message}
              size="2"
              disabled={!!EmployeeID}
            />

            <div></div>

            {/* บรรทัดที่2 */}
            <InputAction
              label="รหัสพนักงาน"
              placeholder="รหัสพนักงาน"
              defaultValue={
                watch("employee_code") ? watch("employee_code") : ""
              }
              // placeholder={watch("addr_district") === "" ? "อําเภอ/เขต" : watch("addr_district")}
              value={watch("employee_code") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("employee_code", e.target.value);
              }}
              size="2"
              disabled={!!EmployeeID}
              // require="true"
              // errorMessage={errors.employee_code?.message}
            />
            <InputDatePicker
              id="วันที่"
              labelName="วันที่"
              onchange={() => {}}
              defaultDate={formattedDate} // ส่ง Date ให้กับ defaultDate
              disabled
            />
          </Grid>
          {/* บรรทัดที่3 */}
          <Grid
            columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
            gap="3"
            rows="repeat(2, auto)"
            width="auto"
          >
            <InputAction
              id={"ชื่อ"}
              label="ชื่อ"
              // placeholder={watch("line_id") === "" ? "Line ID" : watch("line_id")}
              placeholder="ชื่อ"
              value={watch("first_name") ?? ""}
              defaultValue={watch("first_name") ? watch("first_name") : ""}
              classNameInput="w-full "
              onChange={(e) => {
                setValue("first_name", e.target.value);
              }}
              size="2"
            />
            <InputAction
              id={"นามสกุล"}
              label="นามสกุล"
              // placeholder={watch("line_id") === "" ? "Line ID" : watch("line_id")}
              placeholder="นามสกุล"
              value={watch("last_name") ?? ""}
              defaultValue={watch("last_name") ? watch("last_name") : ""}
              classNameInput="w-full "
              onChange={(e) => {
                setValue("last_name", e.target.value);
              }}
              size="2"
            />
            <MasterSelectComponent
            label="ตำแหน่งงาน"
            onChange={(option) => {
                const value = option ? String(option.value) : "";
                setValue("job_title", value);
                setValue("position", value);
            }}
            defaultValue={
                watch("position") ? { value: watch("position"), label: watch("position") } : null
            }
            valueKey="position_name"
            labelKey="position_name"
            placeholder="กรุณาเลือก..."
            className=" text-left w-full"
            fetchDataFromGetAPI={fetchDataPositionDropdown}
            onInputChange={handlePositionSearch}
            errorMessage={errors.position?.message || errors.job_title?.message}
        />
          </Grid>
          <Grid
            columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
            gap="3"
            rows="repeat(2, auto)"
            width="auto"
          >
            <InputDatePicker
              id="วันเกิด"
              labelName={"วันเกิด"}
              onchange={(date) => {
                if (date) {
                  setValue("birthday", dayjs(date).format("YYYY-MM-DD"));
                } else {
                  setValue("birthday", undefined); // ส่ง undefined เมื่อไม่กรอก
                }
              }}
              defaultDate={
                watch("birthday")
                  ? new Date(watch("birthday") as string)
                  : undefined
              }
            />

            <InputAction
              label="เบอร์โทรติดต่อ"
              defaultValue={watch("phone_number") ? watch("phone_number") : ""}
              placeholder="เบอร์โทรติดต่อ"
              value={watch("phone_number") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("phone_number", e.target.value);
              }}
              size="2"
              //require="true"
              type="tel"
              maxLength={10}
              //errorMessage={errors.phone_number?.message}
            />
          </Grid>
          <Grid
            columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
            gap="3"
            rows="repeat(2, auto)"
            width={"auto"}
          >
            <InputAction
              id={"Line ID"}
              label="ไอดีไลน์"
              // placeholder={watch("line_id") === "" ? "Line ID" : watch("line_id")}
              placeholder="ไอดีไลน์"
              value={watch("line_id") ?? ""}
              defaultValue={watch("line_id") ? watch("line_id") : ""}
              classNameInput="w-full "
              onChange={(e) => {
                setValue("line_id", e.target.value);
              }}
              size="2"
            />
            <InputAction
              id={"Email"}
              label="อีเมล"
              // placeholder={watch("email") === "" ? "Email" : watch("email")}
              placeholder="อีเมล"
              value={watch("email") ?? ""}
              defaultValue={watch("email") ? watch("email") : ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("email", e.target.value);
              }}
              size="2"
              type="email"
              require="true"
              errorMessage={errors.email?.message}
            />
          </Grid>
          <Grid
            columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
            gap="3"
            rows="repeat(2, auto)"
            width="auto"
          >
            <InputAction
              label="ที่อยู่ เลขที่"
              placeholder="เลขที่"
              defaultValue={watch("addr_number") ? watch("addr_number") : ""}
              value={watch("addr_number") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_number", e.target.value);
              }}
              size="2"
            />
            <InputAction
              label="ซอย"
              placeholder="ซอย"
              defaultValue={watch("addr_alley") ? watch("addr_alley") : ""}
              // placeholder={watch("addr_alley") === "" ? "ซอย" : watch("addr_alley")}
              value={watch("addr_alley") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_alley", e.target.value);
              }}
              size="2"
            />
            <InputAction
              label="ถนน"
              placeholder="ถนน"
              defaultValue={watch("addr_street") ? watch("addr_street") : ""}
              // placeholder={watch("addr_street") === "" ? "ถนน" : watch("addr_street")}
              value={watch("addr_street") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_street", e.target.value);
              }}
              size="2"
            />
            <InputAction
              label="ตําบล/แขวง"
              placeholder="ตําบล/แขวง"
              defaultValue={
                watch("addr_subdistrict") ? watch("addr_subdistrict") : ""
              }
              // placeholder={watch("addr_subdistrict") === "" ? "ตําบล/แขวง" : watch("addr_subdistrict")}
              value={watch("addr_subdistrict") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_subdistrict", e.target.value);
              }}
              size="2"
            />
          </Grid>
          <Grid
            columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
            gap="3"
            rows="repeat(2, auto)"
            width="auto"
          >
            <InputAction
              label="อําเภอ/เขต"
              placeholder="อําเภอ/เขต"
              defaultValue={
                watch("addr_district") ? watch("addr_district") : ""
              }
              // placeholder={watch("addr_district") === "" ? "อําเภอ/เขต" : watch("addr_district")}
              value={watch("addr_district") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_district", e.target.value);
              }}
              size="2"
            />
            <InputAction
              label="จังหวัด"
              placeholder="จังหวัด"
              defaultValue={
                watch("addr_province") ? watch("addr_province") : ""
              }
              // placeholder={watch("addr_province") === "" ? "จังหวัด" : watch("addr_province")}
              value={watch("addr_province") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_province", e.target.value);
              }}
              size="2"
            />
            <InputAction
              label="รหัสไปรษณีย์"
              placeholder="รหัสไปรษณีย์"
              defaultValue={
                watch("addr_postcode") ? watch("addr_postcode") : ""
              }
              // placeholder={watch("addr_postcode") === "" ? "รหัสไปรษณีย์" : watch("addr_postcode")}
              type="tel"
              value={watch("addr_postcode") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_postcode", e.target.value);
              }}
              size="2"
              maxLength={5}
              //errorMessage={errors.addr_postcode?.message}
            />
          </Grid>
          <Grid
            columns={{ initial: "1", md: "1", sm: "1", lg: "1", xl: "1" }}
            gap="3"
            rows="repeat(2, auto)"
            width={"auto"}
          >
            <MasterSelectComponent
              onChange={(option) => {
                setSelectedOption(option ? String(option.value) : null); // ตั้งค่าที่เลือก
                setValue("role_id", option ? String(option.value) : null); // อัปเดตค่าในฟอร์ม
              }}
              fetchDataFromGetAPI={getUserRoleAll}
              valueKey="role_id"
              labelKey="role_name"
              placeholder="กรุณาเลือก..."
              isClearable={true}
              label="สิทธ์"
              labelOrientation="horizontal"
              classNameLabel="w-20 min-w-20 flex justify-end"
              classNameSelect="w-full"
              // @ts-ignore
              defaultValue={
                watch("role_id")
                  ? { value: watch("role_id"), label: watch("role_id") }
                  : selectedOption
              }
            />

            <ButtonAttactment
              label={"รูปพนักงาน"}
              onClick={() => setOpenDialogImages(true)}
            />
          </Grid>
          <InputTextareaFormManage
            name={"ความคิดเห็นเพิ่มเติม"}
            placeholder="ความคิดเห็นเพิ่มเติม"
            register={{ ...register("remark") }}
            msgError={errors.remark?.message}
            showLabel
          />
        </Flex>
        <Flex
          gap={"4"}
          justify={"end"}
          className=" f"
          direction={{
            initial: "column",
            xs: "column",
            sm: "row",
            md: "row",
            lg: "row",
            xl: "row",
          }}
        >
          <Buttons
            type="reset"
            btnType="cancel"
            className=" w-[130px] max-sm:w-full"
            onClick={handleOpenDialogPassword}
          >
            รีเซ็ตรหัสผ่าน
          </Buttons>
          <Buttons
            type="submit"
            btnType="submit"
            className=" w-[100px] max-sm:w-full"
          >
            บันทึกข้อมูล
          </Buttons>
        </Flex>
        <DialogAttachment
          quotationData={userData}
          isOpen={openDialogImages}
          onClose={handleCloseDialogImaage}
          title={"ภาพพนักงาน"}
          defaultImage={watch("employee_image") ?? []}
          onChangeImage={(i) => {
            setIsChangeFile(true);
            setValue("employee_image", i);
          }}
          isChangeFile={isChangeFile}
          //disable={disableField} // Added disable prop
        />
         <DialogComponent
        isOpen={openDialogPassword}
        onClose={handleCloseDialogPassword}
        title="รีเซ็ตรหัสผ่าน"
        onConfirm={commitpassword}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
      >
       <div className="flex flex-col gap-3 items-left">
    <div className="relative w-full">
      <InputAction
        id="ResetPassword"
        placeholder="รีเซ็ตรหัสผ่าน"
        value={watch("password") ?? ""}
        onChange={(e) => setValue("password", e.target.value)}
        label="รหัสผ่านใหม่"
        labelOrientation="horizontal"
        onAction={commitpassword}
        classNameLabel=""
        classNameInput="w-auto pr-10" // เพิ่ม padding เผื่อปุ่มตา
        require="true"
        type={showPassword ? "text" : "password"} // สลับ type password/text
        errorMessage={errors.password?.message}
      />
      
      {/* ปุ่มรูปตา */}
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>
      </DialogComponent>
      </form>
    </>
  );
}
