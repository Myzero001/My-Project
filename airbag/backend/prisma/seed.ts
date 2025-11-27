import { PrismaClient, roles } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from "bcrypt";
import { rolesData } from "../src/common/models/roleData";

async function main() {
  // ["Admin", "User-Box", "Owner", "Manager", "Technician", "Sale"];
  let roldAdmin: roles | null = null;
  let roldUserBox: roles | null = null;
  let roldOwner: roles | null = null;
  let roldManager: roles | null = null;
  let roldTechnician: roles | null = null;
  let roldSale: roles | null = null;
  let roldAccounting: roles | null = null;
  let roldRepair: roles | null = null;
  let roldDisassemble: roles | null = null;

  

  for (const role of rolesData) {
      const result = await prisma.roles.upsert({
          where: { role_name: role },
          update: {}, // No update needed for now
          create: {
              role_name: role,
          },
      });

      if (role === "Admin") {
        // Save the result for the Admin role
        roldAdmin = result;
      }else if(role === "User-Box") {
        roldUserBox = result;
      }else if(role === "Owner") {
        roldOwner = result;
      }else if(role === "Manager") {
        roldManager = result;
      }else if(role === "Technician") {
        roldTechnician = result;
      }else if(role === "Sale") {
        roldSale = result;
      }else if(role === "Account") {
        roldAccounting = result;
      }else if(role === "User-ซ่อม") {
        roldRepair = result;
      }else if(role === "User-ถอด/ประกอบ") {
        roldDisassemble = result;
      }

      
  }
  if (!roldAdmin) {
    throw new Error("Admin role was not found or created.");
  }
  
  // Create User T.Win
  const password = "HB.Kk@zrp[;iASc5VAwv";
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);  
  const hashPassword = await bcrypt.hash(password, salt);
  const userSanayu = await prisma.users.upsert({
      where: { username: 'sanayu.jin@bluepeak-innov.com' },
      update: {},
      create: {
        employee_code: 'A0001',
          username: 'sanayu.jin@bluepeak-innov.com',
          password: hashPassword, 
          email: 'sanayu.jin@bluepeak-innov.com',
          role_id: roldAdmin.role_id,
          first_name: 'sanayu',
          is_active: true
      },
  })

  const passwordKittisak = "B@seC0d3!Xy74Pz";
  const saltRoundsKittisak = 10;
  const saltKittisak = await bcrypt.genSalt(saltRoundsKittisak);  
  const hashPasswordKittisak = await bcrypt.hash(passwordKittisak, saltKittisak);
  const userKittisak = await prisma.users.upsert({
      where: { username: '66111349@dpu.ac.th' },
      update: {},
      create: {
        employee_code: 'A0002',
          username: '66111349@dpu.ac.th',
          password: hashPasswordKittisak, 
          email: '66111349@dpu.ac.th',
          role_id: roldAdmin.role_id,
          first_name: 'kittisak',
          is_active: true
      },
  })

  const passwordSupakitt = "JkKk@1kpd4^)";
  const saltRoundsSupakitt = 10;
  const saltSupakitt = await bcrypt.genSalt(saltRoundsSupakitt);  
  const hashPasswordSupakitt = await bcrypt.hash(passwordSupakitt, saltSupakitt);
  const userSupakitt = await prisma.users.upsert({
      where: { username: 'spk.supakitt.im@gmail.com' },
      update: {},
      create: {
        employee_code: 'A0003',
          username: 'spk.supakitt.im@gmail.com',
          password: hashPasswordSupakitt, 
          email: 'spk.supakitt.im@gmail.com',
          role_id: roldAdmin.role_id,
          first_name: 'supakitt',
          is_active: true
      },
  })

  const passwordmyzero = "qz)r%Y4Q!Stp(Yj!";
  const saltRoundsmyzero = 10;
  const saltmyzero = await bcrypt.genSalt(saltRoundsmyzero);  
  const hashPasswordmyzero = await bcrypt.hash(passwordmyzero, saltmyzero);
  const usermyzero = await prisma.users.upsert({
      where: { username: 'myzero0139@gmail.com' },
      update: {},
      create: {
        employee_code: 'A0004',
          username: 'myzero0139@gmail.com',
          password: hashPasswordmyzero, 
          email: 'myzero0139@gmail.com',
          role_id: roldAdmin.role_id,
          first_name: 'myzero',
          is_active: true
      },
  })

  // Create Main Office
  const companyMain = await prisma.companies.upsert({
    where: { company_name: 'Main Office' },
    update: {},
    create: {
      company_name: 'Main Office',
      company_code: 'C0001',
      created_by: userSanayu.employee_id, 
      updated_by: userSanayu.employee_id,
      company_main: true,
      tax_status: "true",
    },
  })

  await prisma.users.updateMany({
    data: {
      company_id: companyMain.company_id
    }
  });

  // Update Company admin  
  const setPayloadUpdateUserAdmin = {
    company_id: companyMain.company_id,
  };
  const updateUserAdmin = await prisma.users.update({
    where: { 
      employee_id: userSanayu.employee_id,
     },
    data:setPayloadUpdateUserAdmin
  })

  /*
  // Create User Kanyarat
  const saltKanyarat = await bcrypt.genSalt(saltRounds);  
  const hashPasswordKanyarat = await bcrypt.hash(password, saltKanyarat);
  const userKanyarat = await prisma.users.upsert({
    where: { username: 'kanyarat28042546@gmail.com' },
    update: {},
    create: {
      employee_code: 'K1003',
      username: 'kanyarat28042546@gmail.com',
      password: hashPasswordKanyarat, 
      email: 'kanyarat28042546@gmail.com',
      role_id: roldAdmin.role_id,
      first_name: 'kanyarat',
      is_active: true,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id
    },
  })

  // Create User Kittisak
  const saltKittisak = await bcrypt.genSalt(saltRounds);  
  const hashPasswordKittisak = await bcrypt.hash(password, saltKittisak);
  const userKittisak = await prisma.users.upsert({
    where: { username: 'Kittisak_m11@hotmail.com' },
    update: {},
    create: {
      employee_code: 'K1002',
      username: 'Kittisak_m11@hotmail.com',
      password: hashPasswordKittisak, 
      email: 'Kittisak_m11@hotmail.com',
      role_id: roldAdmin.role_id,
      first_name: 'kittisak',
      is_active: true,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id
    },
  })

  // Create User Noungn
  const saltNoungn = await bcrypt.genSalt(saltRounds);  
  const hashPasswordNoungn = await bcrypt.hash(password, saltNoungn);
  const userNoungn = await prisma.users.upsert({
    where: { username: 'noungn1123@gmail.com' },
    update: {},
    create: {
      employee_code: 'K1001',
      username: 'noungn1123@gmail.com',
      password: hashPasswordNoungn, 
      email: 'noungn1123@gmail.com',
      role_id: roldAdmin.role_id,
      first_name: 'noungn',
      is_active: true,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id
    },
  })  

  // Employee User Box
  const saltUserBox = await bcrypt.genSalt(saltRounds);  
  const hashPasswordUserBox = await bcrypt.hash(password, saltUserBox);
  const userUserBox = await prisma.users.upsert({
    where: { username: 'userbox@gmail.com' },
    update: {},
    create: {
      employee_code: 'U1002',
      username: 'userbox@gmail.com',
      password: hashPasswordUserBox, 
      email: 'userbox@gmail.com',
      role_id: roldUserBox!.role_id,
      first_name: 'userbox',
      is_active: true,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id
    },
  })   

  // Employee Owner
  const saltOwner = await bcrypt.genSalt(saltRounds);  
  const hashPasswordOwner = await bcrypt.hash(password, saltOwner);
  const userOwner = await prisma.users.upsert({
    where: { username: 'owner@gmail.com' },
    update: {},
    create: {
      employee_code: 'U1003',
      username: 'owner@gmail.com',
      password: hashPasswordOwner, 
      email: 'owner@gmail.com',
      role_id: roldOwner!.role_id,
      first_name: 'owner',
      is_active: true,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id
    },
  })

  // Employee Manager
  const saltManager = await bcrypt.genSalt(saltRounds);  
  const hashPasswordManager = await bcrypt.hash(password, saltManager);
  const userManager = await prisma.users.upsert({
    where: { username: 'manager@gmail.com' },
    update: {},
    create: {
      employee_code: 'U1004',
      username: 'manager@gmail.com',
      password: hashPasswordManager, 
      email: 'manager@gmail.com',
      role_id: roldManager!.role_id,
      first_name: 'manager',
      is_active: true,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id
    },
  })

  // Employee Technician
  const saltTechnician = await bcrypt.genSalt(saltRounds);  
  const hashPasswordTechnician = await bcrypt.hash(password, saltTechnician);
  const userTechnician = await prisma.users.upsert({
    where: { username: 'technician@gmail.com' },
    update: {},
    create: {
      employee_code: 'U1005',
      username: 'technician@gmail.com',
      password: hashPasswordTechnician, 
      email: 'technician@gmail.com',
      role_id: roldTechnician!.role_id,
      first_name: 'technician',
      is_active: true,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id
    },
  })

  // Employee Sale
  const saltSale = await bcrypt.genSalt(saltRounds);  
  const hashPasswordSale = await bcrypt.hash(password, saltSale);
  const userSale = await prisma.users.upsert({
    where: { username: 'sale@gmail.com' },
    update: {},
    create: {
      employee_code: 'U1006',
      username: 'sale@gmail.com',
      password: hashPasswordSale, 
      email: 'sale@gmail.com',
      role_id: roldSale!.role_id,
      first_name: 'sale',
      is_active: true,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id
    },
  })
    
  // Employee Accounting
  const saltAccounting = await bcrypt.genSalt(saltRounds);  
  const hashPasswordAccounting = await bcrypt.hash(password, saltAccounting);
  const userAccounting = await prisma.users.upsert({
    where: { username: 'accounting@gmail.com' },
    update: {},
    create: {
      employee_code: 'U1007',
      username: 'accounting@gmail.com',
      password: hashPasswordAccounting, 
      email: 'accounting@gmail.com',
      role_id: roldAccounting!.role_id,
      first_name: 'accounting',
      is_active: true,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id
    },
  })

  // Employee Repair
  const saltRepair = await bcrypt.genSalt(saltRounds);  
  const hashPasswordRepair = await bcrypt.hash(password, saltRepair);
  const userRepair = await prisma.users.upsert({
    where: { username: 'repair@gmail.com' },
    update: {},
    create: {
      employee_code: 'U1008',
      username: 'repair@gmail.com',
      password: hashPasswordRepair, 
      email: 'repair@gmail.com',
      role_id: roldRepair!.role_id,
      first_name: 'repair',
      is_active: true,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id
    },
  })

  // Employee Disassemble
  const saltDisassemble = await bcrypt.genSalt(saltRounds);  
  const hashPasswordDisassemble = await bcrypt.hash(password, saltDisassemble);
  const userDisassemble = await prisma.users.upsert({
    where: { username: 'disassemble@gmail.com' },
    update: {},
    create: {
      employee_code: 'U1009',
      username: 'disassemble@gmail.com',
      password: hashPasswordDisassemble, 
      email: 'disassemble@gmail.com',
      role_id: roldDisassemble!.role_id,
      first_name: 'disassemble',
      is_active: true,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id
    },
  })
  */

  // ms-type-issue-reason
  const typeIssueReasonBox = await prisma.master_type_issue_group.upsert({
    where: { company_id_type_issue_group_name: { 
        company_id: companyMain.company_id, 
        type_issue_group_name: "สาเหตุแก้ไขกล่อง" 
    } },
    update: {},
    create: {
      type_issue_group_name: "สาเหตุแก้ไขกล่อง",
      company_id: companyMain.company_id,
      created_by: userSanayu.employee_id,
      updated_by: userSanayu.employee_id,
    },
  });
  
  const typeIssueReasonAssemble = await prisma.master_type_issue_group.upsert({
    where: { company_id_type_issue_group_name: { 
        company_id: companyMain.company_id, 
        type_issue_group_name: "สาเหตุแก้ไขในการประกอบ" 
    } },
    update: {},
    create: {
      type_issue_group_name: "สาเหตุแก้ไขในการประกอบ",
      company_id: companyMain.company_id,
      created_by: userSanayu.employee_id,
      updated_by: userSanayu.employee_id,
    },
  });

  /*const brand = "BMW";
  const brandData = await prisma.master_brand.upsert({
    where: { 
      company_id_brand_name: {
        company_id: companyMain.company_id,
        brand_name: brand,
      }
    },
    update: {},
    create: {
      brand_name: brand,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id,
    },
  });
  
  const brandModel = "X1";
  const brandModelData = await prisma.master_brandmodel.upsert({
    where: {
      company_id_master_brand_id_brandmodel_name: {
        company_id: companyMain.company_id,
        master_brand_id: brandData.master_brand_id,
        brandmodel_name: brandModel,
      },
    },
    update: {},
    create: {
      master_brand_id: brandData.master_brand_id,
      brandmodel_name: brandModel,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id,
    },
  });

  const color = "Blue";

  const colorData = await prisma.master_color.upsert({
    where: {
      company_id_color_name: {
        company_id: companyMain.company_id,
        color_name: color,
      },
    },
    update: {},
    create: {
      color_name: color,
      company_id: companyMain.company_id,
      created_by: userAdmin.employee_id,
      updated_by: userAdmin.employee_id,
    },
  });
  */
  

}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })