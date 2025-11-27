import { TextField, Text, Flex, Grid, Card, Button } from "@radix-ui/themes";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import ButtonAttactment from "@/features/quotation/components/ButtonAttactment";
import DialogAttachment from "@/features/quotation/components/DialogAttachment";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import { MS_USER_ALL } from "@/types/response/response.user";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { useLocation } from "react-router-dom";
import { resolve } from "path";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { PayLoadRegister } from "@/types/requests/request.user";
import { CreateUserSchema } from "@/features/register/component/Zmod_User";
import { getUserByID, updateUser, postRegister } from "@/services/user.service";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import Buttons from "@/components/customs/button/button.main.component";
import { deleteFile, postFile } from "@/services/file.service";
import { error } from "console";
import {getUserRoleAll} from "./getrole";
import { usePositionSelect } from "@/hooks/useSelect";
import { PositionSelectItem } from "@/types/response/response.ms_position";

export default function Create_eidit_user() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<MS_USER_ALL>();
  //const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const location = useLocation();
  const EmployeeID = location.state?.employee_id;

  const [isChangeFile, setIsChangeFile] = useState<boolean>(false);
  const [openDialogImages, setOpenDialogImages] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [searchPosition, setSearchPosition] = useState("");
  // สมมุติเป็นค่าที่รับมาจาก input
  const formattedRoleId = selectedOption && selectedOption.trim() !== "" ? selectedOption : "";



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
    resolver: zodResolver(CreateUserSchema),
  });
  const fetchUserById = () => {
    if (EmployeeID) {
      getUserByID(EmployeeID)
        .then((userData) => {
          if (userData.responseObject) {
            const users = userData.responseObject;
            setUserData(users);
            setValue("username", users.username ?? "");
            //setValue("password", users.password ?? "");
            setValue("employee_code", users.employee_code ?? "");

            setValue("company_id", users.company_id ?? "");
            setValue("role_id", users.role_id ?? "");

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
          }
        })
        .catch((err) => {
        showToast("ไม่สามารถดึงข้อมูลพนักงานได้" + err.message, false);
        });
    } else {
      //showToast("ไม่สามารถดึงข้อมูลพนักงานได้", false);
    }
  };
  useEffect(() => {
    fetchUserById();
  }, []);
  useEffect(() => {
  }, [userData]); // log หลังจาก userData ถูกอัปเดต

  const { data: dataPosition, refetch: refetchPosition } = usePositionSelect({
      searchText: searchPosition,
    });

  const fetchDataPositionDropdown = async () => {
    const PositionList = dataPosition?.responseObject?.data ?? [];
    return {
      responseObject: PositionList.map((item: PositionSelectItem) => ({
        position_id: item.position_id,
        position_name: item.position_name,
      })),
    };
  };

  const handlePositionSearch = (searchText: string) => {
    setSearchPosition(searchText);
    refetchPosition();
  };

  
  const onSubmitHandler = async (payload: PayLoadRegister) => {
    if (!formattedRoleId) {
      showToast("กรุณาระบุสิทธ์ผู้ใช้", false);
      return;
    }
    
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
          is_active: payload.is_active ?? true,
          role_id: formattedRoleId,
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
        password:
          payload.password && payload.password.trim() !== ""
            ? payload.password // ใช้ค่าใหม่หากมีการกรอก
            : undefined,
        is_active: payload.is_active ?? true,
        company_id: userData?.company_id ?? "",
        role_id: payload.role_id ?? "",
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
  const formattedDate = dayjs(watch("created_at")).toDate();
  return (
    <>
      <Text size="6" weight="bold" className="p-6 text-xl sm:text-2xl" >
        สร้างข้อมูลพนักงาน
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
              id="username"
              placeholder="ชื่อผู้ใช้งาน"
              defaultValue={watch("username") ? watch("username") : ""}
              // placeholder={watch("addr_district") === "" ? "อําเภอ/เขต" : watch("addr_district")}
              value={watch("username") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("username", e.target.value);
              }}
              require="true"
              errorMessage={errors.username?.message}
              size="2"
              disabled={!!EmployeeID}
              nextFields={{right: "password" }}
            />

            
               <InputAction
              id={"password"}
              label="รหัสผ่าน"
              // placeholder={watch("line_id") === "" ? "Line ID" : watch("line_id")}
              placeholder="รหัสผ่าน"
              value={watch("password") ?? ""}
              defaultValue={watch([]) ? watch("password") : ""}
              classNameInput="w-full "
              onChange={(e) => {
                setValue("password", e.target.value);
              }}
              
              size="2"
              require="true"
              errorMessage={errors.password?.message}
              // disabled={!!EmployeeID}
              nextFields={{left: "username", right: "employee_code"}}
            />
             
            
            

            {/* บรรทัดที่2 */}
            <InputAction
              label="หมายเลขพนักงาน"
              id="employee_code"
              placeholder="หมายเลขพนักงาน"
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
              require="true"
              errorMessage={errors.employee_code?.message}
              nextFields={{left: "password", right: "วันที่"}}
            />
            <InputDatePicker
              id="วันที่"
              labelName="วันที่"
              onchange={() => {}}
              defaultDate={formattedDate} // ส่ง Date ให้กับ defaultDate
              disabled
              nextFields={{ left: "employee_code" , right: "ชื่อ"}}
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
              nextFields={{ left: "วันที่" , right: "นามสกุล"}}
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
              nextFields={{ left: "ชื่อ" , right: "position"}}
            />
            <MasterSelectComponent
              label="ตำแหน่งงาน"
              id={"position"}
              onChange={(option) => {
                const value = option ? String(option.value) : undefined;
                setValue("job_title", value);
              }}
              defaultValue={{
                value: watch("job_title") ?? "", // ใช้ค่า default จาก watch หรือ "" หากไม่มีค่า
                label: watch("job_title") ?? "", // ให้ label ตรงกับค่า customer_prefix
              }}
              valueKey="position_id" // ใช้ value จาก responseObject
              labelKey="position_name" // ใช้ label จาก responseObject
              placeholder="กรุณาเลือก..."
              className=" text-left w-full"
              fetchDataFromGetAPI={fetchDataPositionDropdown}
              onInputChange={handlePositionSearch}
              errorMessage={errors.remark?.message}
              //isDisabled={disableField}
              //errorMessage={errors.car_year?.message}
              nextFields={{ left: "นามสกุล" , right: "วันเกิด"}}
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
              nextFields={{ left: "position" , right: "phone"}}
            />

            <InputAction
              label="เบอร์โทรติดต่อ"
              id="phone"
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
              nextFields={{ left: "วันเกิด" , right: "Line ID"}}
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
              nextFields={{ left: "phone" , right: "Email"}}
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
              nextFields={{ left: "Line ID" , right: "addr_number"}}
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
              id={"addr_number"}
              placeholder="เลขที่"
              defaultValue={watch("addr_number") ? watch("addr_number") : ""}
              value={watch("addr_number") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_number", e.target.value);
              }}
              size="2"
              nextFields={{ left: "Email" , right: "addr_alley"}}
            />
            <InputAction
              label="ซอย"
              id={"addr_alley"}
              placeholder="ซอย"
              defaultValue={watch("addr_alley") ? watch("addr_alley") : ""}
              // placeholder={watch("addr_alley") === "" ? "ซอย" : watch("addr_alley")}
              value={watch("addr_alley") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_alley", e.target.value);
              }}
              size="2"
              nextFields={{ left: "addr_number" , right: "street"}}
            />
            <InputAction
              label="ถนน"
              id="street"
              placeholder="ถนน"
              defaultValue={watch("addr_street") ? watch("addr_street") : ""}
              // placeholder={watch("addr_street") === "" ? "ถนน" : watch("addr_street")}
              value={watch("addr_street") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_street", e.target.value);
              }}
              size="2"
              nextFields={{ left: "addr_alley" , right: "subdistrict"}}
            />
            <InputAction
              label="ตําบล/แขวง"
              id="subdistrict"
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
              nextFields={{ left: "street" , right: "district"}}
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
              id="district"
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
              nextFields={{ left: "subdistrict" , right: "province"}}
            />
            <InputAction
              label="จังหวัด"
              id="province"
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
              nextFields={{ left: "district" , right: "postcode"}}
            />
            <InputAction
              label="รหัสไปรษณีย์"
              id="postcode"
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
              nextFields={{ left: "province" , right: "permission"}}
            />
          </Grid>
          <Grid
            columns={{ initial: "1", md: "1", sm: "1", lg: "1", xl: "1" }}
            gap="3"
            rows="repeat(2, auto)"
            width={"auto"}
          >
           
            <MasterSelectComponent
              id="permission"
              onChange={(option) => {
                const value = option ? String(option.value) : null;
                setValue("role_id", value);  // ใช้ setValue เพื่ออัปเดตค่าใน react-hook-form
                setSelectedOption(value);     // ถ้าคุณยังต้องการเก็บค่าไว้ใน state
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
              errorMessage={errors.role_id?.message}
              nextFields={{ left: "postcode" , right: "remark"}}
            />

            <ButtonAttactment
              
              label={"รูปพนักงาน"}
              onClick={() => setOpenDialogImages(true)}
            />
          </Grid>
          <InputTextareaFormManage
            id="remark"
            name={"ความคิดเห็นเพิ่มเติม"}
            placeholder="ความคิดเห็นเพิ่มเติม"
            register={{ ...register("remark") }}
            msgError={errors.remark?.message}
            showLabel
            nextFields={{ left: "permission" , right: "submit"}}
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
            id="submit"
            type="submit"
            btnType="submit"
            className=" w-[100px] max-sm:w-full"
            nextFields={{ left: "remark" }}
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
      </form>
    </>
  );
}
