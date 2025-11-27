import { TextField, Text, Flex, Button, Card } from "@radix-ui/themes";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { getMsCompaniesByID, updateMsCompanies } from "@/services/ms.companies";
import RadioMainComponent from "@/features/ms-companies/components/radiocompenent";
import InputAction from "@/components/customs/input/input.main.component";
import { useToast } from "@/components/customs/alert/toast.main.component";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import Buttons from "@/components/customs/button/button.main.component";
import { Grid } from "@radix-ui/themes";

import CheckboxMainComponent from "@/components/customs/checkboxs/checbox.editprofile";
import { PayLoadeditMsCompanies } from "@/types/requests/request.ms-companies";

import { Type_MS_Companies } from "@/types/response/response.ms-companies";
import { UpdateCompaniesSchema } from "@/types/requests/request.ms-companies";

export default function Create() {
  const [companiesData, setCompaniesData] = useState<Type_MS_Companies>();
  const { showToast } = useToast();

  const { company_id } = useParams(); // ดึงค่า company_id จาก URL

  useEffect(() => {
  }, [company_id]);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<PayLoadeditMsCompanies>({
    defaultValues: {},
    resolver: zodResolver(UpdateCompaniesSchema),
  });

  const fetchCustomerById = () => {
    if (company_id) {
      getMsCompaniesByID(company_id)
        .then((companies) => {
          if (companies.responseObject) {
            const company = companies.responseObject;
            setCompaniesData(company);
            setValue("company_tin", company.company_tin ?? "");
            setValue("company_name", company.company_name ?? "");
            setValue("addr_number", company.addr_number ?? "");
            setValue("addr_alley", company.addr_alley ?? "");
            setValue("addr_street", company.addr_street ?? "");
            setValue("addr_subdistrict", company.addr_subdistrict ?? "");
            setValue("addr_district", company.addr_district ?? "");
            setValue("addr_province", company.addr_province ?? "");
            setValue("addr_postcode", company.addr_postcode ?? "");
            setValue("tax_status", String(company.tax_status)); // ✅ แปลงเป็น string
            setValue("tel_number", company.tel_number ?? "");
            setValue("company_code", company.company_code ?? "");
            setValue("promtpay_id", company.promtpay_id ?? "");
          }
        })
        .catch((err) => {
          showToast("Error fetching customer: " + err.message, false);
        });
    }
  };

  useEffect(() => {
    fetchCustomerById();
  }, [company_id]);

  const onSubmitHandler = (data: PayLoadeditMsCompanies) => {
    if (!company_id) {
      showToast("บันทึกข้อมูลลูกค้าไม่สำเร็จ: ไม่มีรหัสลูกค้า", false);
      return;
    }

    // ตรวจสอบว่าข้อมูลที่จำเป็นทั้งหมดมีค่าหรือไม่
    if (!data.company_name || !data.company_code) {
      showToast("กรุณาระบุข้อมูลให้ครบถ้วน", false);
      return;
    }

    const payload: PayLoadeditMsCompanies = {
      company_code: data.company_code,
      company_name: data.company_name,
      company_tin: data.company_tin,
      addr_number: data.addr_number,
      addr_alley: data.addr_alley,
      addr_street: data.addr_street,
      addr_subdistrict: data.addr_subdistrict,
      addr_district: data.addr_district,
      addr_province: data.addr_province,
      addr_postcode: data.addr_postcode,
      promtpay_id: data.promtpay_id,
      tax_status: data.tax_status, // ใช้ data.tax_status ที่ได้จากฟอร์ม
      tel_number: data.tel_number,
      
    };

    updateMsCompanies(company_id, payload)
      .then(() => {
        showToast("แก้ไขโปรไฟล์บริษัทเรียบร้อยแล้ว", true);
      })
      .catch((err) => {
        showToast("แก้ไขโปรไฟล์บริษัทไม่สำเร็จ", false);
      });
  };

  return (
    <>
      <Text size="6" weight="bold" className="p-2 text-lg sm:text-2xl">
        แก้ไขโปรไฟล์บริษัท
      </Text>
      <div className="flex justify-center items-center ">
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="flex flex-col gap-3 w-full sm:w-96 md:w-[600px] mt-4 bg-white rounded-md p-6 shadow-lg"
        >
          <Grid
            columns={{ initial: "1", md: "1", sm: "1", lg: "1", xl: "1" }}
            gap="2"
            rows="repeat(2,auto)"
          >
            <InputAction
              label="รหัสบริษัท"
              id="company_id"
              placeholder="รหัสบริษัท"
              defaultValue={companiesData?.company_code}
              value={watch("company_code") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("company_code", e.target.value);
              }}
              size="2"
              nextFields={{down: "tax_id" }}
            />
            <InputAction
              label="เลขประจําตัวผู้เสียภาษี"
              id="tax_id"
              placeholder="เลขประจําตัวผู้เสียภาษี"
              defaultValue={companiesData?.company_tin}
              value={watch("company_tin") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("company_tin", e.target.value);
              }}
              size="2"
              maxLength={13}
              nextFields={{up: "company_id" , down: "company_name" }}
            />

            <InputAction
              label="ชื่อบริษัท"
              id="company_name"
              placeholder="ชื่อบริษัท"
              defaultValue={companiesData?.company_name}
              value={watch("company_name") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("company_name", e.target.value);
              }}
              size="2"
              nextFields={{up: "tax_id" , down: "address" }}
            />
            <InputAction
              label="ที่อยู่บริษัท"
              id="address"
              placeholder="ที่อยู่บริษัท"
              defaultValue={companiesData?.addr_number}
              value={watch("addr_number") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_number", e.target.value);
              }}
              size="2"
              nextFields={{up: "company_name" , down: "alley" }}
            />
            <InputAction
              label="ซอย"
              id="alley"
              placeholder="ซอย"
              defaultValue={companiesData?.addr_alley}
              value={watch("addr_alley") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_alley", e.target.value);
              }}
              size="2"
              nextFields={{up: "address" , down: "street" }}
            />
            <InputAction
              label="ถนน"
              id="street"
              placeholder="ถนน"
              defaultValue={companiesData?.addr_street}
              value={watch("addr_street") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_street", e.target.value);
              }}
              size="2"
              nextFields={{up: "alley" , down: "subdistrict" }}
            />
            <InputAction
              label="ตำบล"
              id="subdistrict"
              placeholder="ตำบล"
              defaultValue={companiesData?.addr_subdistrict}
              value={watch("addr_subdistrict") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_subdistrict", e.target.value);
              }}
              size="2"
              nextFields={{up: "street" , down: "district" }}
            />
            <InputAction
              label="อำเภอ"
              id="district"
              placeholder="อำเภอ"
              defaultValue={companiesData?.addr_district}
              value={watch("addr_district") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_district", e.target.value);
              }}
              size="2"
              nextFields={{up: "subdistrict" , down: "province" }}
            />
            <InputAction
              label="จังหวัด"
              id="province"
              placeholder="จังหวัด"
              defaultValue={companiesData?.addr_province}
              value={watch("addr_province") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_province", e.target.value);
              }}
              size="2"
              nextFields={{up: "subdistrict" , down: "postcode" }}
            />
            <InputAction
              label="รหัสไปรษณีย์"
              id="postcode"
              placeholder="รหัสไปรษณีย์"
              defaultValue={companiesData?.addr_postcode}
              value={watch("addr_postcode") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {
                setValue("addr_postcode", e.target.value.replace(/\D/g, ""));
              }}
              size="2"
              maxLength={5}
              nextFields={{up: "province" , down: "tel" }}
            />

            <InputAction
              label="เบอร์โทร"
              id="tel"
              placeholder="เบอร์โทร"
              defaultValue={companiesData?.tel_number}
              value={watch("tel_number") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {

                setValue("tel_number", e.target.value.replace(/\D/g, ""));
              }}
              size="2"
              maxLength={10}
              nextFields={{up: "postcode" , down: "promptpay" }}
            />
             <InputAction
              label="พร้อมเพย์"
              id="promptpay"
              placeholder="พร้อมเพย์"
              defaultValue={companiesData?.promtpay_id}
              value={watch("promtpay_id") ?? ""}
              classNameInput="w-full"
              onChange={(e) => {

                setValue("promtpay_id", e.target.value.replace(/\D/g, ""));
              }}
              size="2"
              maxLength={13}
              nextFields={{up: "tel" , down: "price_tax" }}
            />

            {/* <CheckboxMainComponent
              labelName="ราคารวมภาษี"
              checked={watch("tax_status") ?? false} // ใช้ watch เพื่อดึงค่า tax_status จาก react-hook-form
              onCheckedChange={(checked) => {
                setTaxStatus(checked); // ตั้งค่า tax_status ใน state
                setValue("tax_status", checked); // ตั้งค่า tax_status ใน react-hook-form
              }}
            /> */}

            <Controller
              control={control}
              name="tax_status"
              render={({ field }) => (
                <>
                  <RadioMainComponent
                    labelName="เงินรวมภาษี"
                    id="price_tax"
                    value="false"
                    selectedValue={field.value ?? "false"} // ✅ ป้องกัน undefined
                    onSelectedChange={(value) => field.onChange(value)}
                    name="tax-option"
                    nextFields={{up: "promptpay" , down: "price" }}
                  />
                  <RadioMainComponent
                    labelName="เงินยังไม่รวมภาษี"
                    id="price"
                    value="true"
                    selectedValue={field.value ?? "false"} // ✅ ป้องกัน undefined
                    onSelectedChange={(value) => field.onChange(value)}
                    name="tax-option"
                    nextFields={{up: "price_tax" , down: "submit" }}
                  />
                </>
              )}
            />

            <Buttons
              type="submit"
              id="submit"
              btnType="submit"
              className="w-[100px] max-sm:w-full self-center"
              nextFields={{up: "price" }}
            >
              บันทึกข้อมูล
            </Buttons>
          </Grid>
        </form>
      </div>
    </>
  );
}
