// import { users, roles } from "@prisma/client";
// import prisma from "@src/db";

// import { TypePayloadUser } from "@modules/users/userModel";
// import bcrypt from "bcrypt";

// import { rolesData } from "@common/models/roleData";

// async function main() {
//   let roldAdmin: roles | null = null;

//   for (const role of rolesData) {
//     const result = await prisma.roles.upsert({
//       where: { role_name: role },
//       update: {},
//       create: {
//         role_name: role,
//       },
//     });

//     // Save the result for the Admin role
//     if (role === "Admin") {
//       roldAdmin = result;
//     }
//   }

//   if (!roldAdmin) {
//     throw new Error("Admin role was not found or created.");
//   }
//   const roleId = roldAdmin.role_id;
// }

// export const Keys = [
//   "employee_id",
//   "employee_code",
//   "username",
//   "password",
//   "is_active",
//   "role_id",
//   "email",
//   "first_name",
//   "last_name",
//   "birthday",
//   "phone_number",
//   "line_id",
//   "addr_number",
//   "addr_alley",
//   "addr_street",
//   "addr_subdistrict",
//   "addr_district",
//   "addr_province",
//   "addr_postcode",
//   "position",
//   "remark",
//   "created_at",
//   "updated_at",
//   "image_url",
//   "right",
//   "job_title",
//   "company_id",
// ];

// export const KeysFindUsername = [
//   "employee_id",
//   "company_id",
//   "username",
//   "password",
//   "role_id",
// ];

// export const userRepository = {
//   findByUsername: async <Key extends keyof users>(
//     username: string,
//     keys = KeysFindUsername as Key[]
//   ) => {
//     return prisma.users.findUnique({
//       where: { username: username },
//       select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
//     }) as Promise<Pick<users, Key> | null>;
//   },
//   findById: async <Key extends keyof users>(
//     uuid: string,

//     keys = KeysFindUsername as Key[]
//   ) => {
//     return prisma.users.findUnique({
//       where: { employee_id: uuid },
//       select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
//     }) as Promise<Pick<users, Key> | null>;
//   },

//   create: async (
//     companyId: string,
//     userId: string,
//     payload: TypePayloadUser
//   ) => {
//     // Payload
//     const usernameTrim = payload.username.trim();
//     const passwordTrim = payload.password.trim();
//     const emailTrim = payload.email.trim();

//     const firstName = payload.first_name.trim();
//     const is_active = true;

//     const roldAdmin = await prisma.roles.findUnique({
//       where: { role_name: "Admin" }, // หาบทบาทที่ชื่อว่า "Admin"
//     });

//     // ตรวจสอบว่า roldAdmin ไม่เป็น null
//     if (!roldAdmin) {
//       throw new Error("Admin role not found");
//     }

//     //const role_id = roldAdmin.role_id;

//     // Hash Password using bcrypt
//     const saltRounds = 10;
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hashPassword = await bcrypt.hash(passwordTrim, salt);

//     // setPayload
//     const setPayload: any = {
//       employee_code: payload.employee_code?.trim(),
//       company_id: companyId,
//       username: usernameTrim,
//       password: hashPassword,
//       role_id: payload.role_id?.trim(),
//       job_title: payload.job_title?.trim(),
//       right: payload.right?.trim(),
//       email: payload.email?.trim(),
//       first_name: payload.first_name?.trim(),
//       last_name: payload.last_name?.trim(),
//       birthday: payload.birthday,
//       phone_number: payload.phone_number?.trim(),
//       line_id: payload.line_id?.trim(),
//       addr_number: payload.addr_number?.trim(),
//       addr_alley: payload.addr_alley?.trim(),
//       addr_street: payload.addr_street?.trim(),
//       addr_subdistrict: payload.addr_subdistrict?.trim(),
//       addr_district: payload.addr_district?.trim(),
//       addr_province: payload.addr_province?.trim(),
//       addr_postcode: payload.addr_postcode?.trim(),
//       position: payload.position?.trim(),
//       remark: payload.remark?.trim(),
//       image_url: payload.image_url?.trim(),
//       created_by: userId,
//       updated_by: userId,

//       is_active: is_active,
//       //employee_code: payload.employee_code?.trim(),
//     };
//     return await prisma.users.create({
//       data: setPayload,
//     });
//   },
//   count: async (companyId: string, searchText?: string) => {
//     return await prisma.users.count({
//       where: {
//         company_id: companyId, // เพิ่มเงื่อนไข companyId
//         ...(searchText
//           ? {
//               OR: [
//                 {
//                   username: {
//                     contains: searchText,
//                     mode: "insensitive",
//                   },
//                 },
//               ],
//             }
//           : {}),
//       },
//     });
//   },

//   findAll: async (
//     companyId: string,
//     skip: number,
//     take: number,
//     searchText: string
//   ) => {
//     return await prisma.users.findMany({
//       where: searchText
//         ? {
//             OR: [
//               {
//                 username: {
//                   contains: searchText,
//                   mode: "insensitive",
//                 },
//               },
//             ],
//           }
//         : {}, // ถ้าไม่มี searchText ก็ไม่ต้องใช้เงื่อนไขพิเศษ
//       skip,
//       take,
//       orderBy: { created_at: "asc" },
//     });
//   },

//   findByName: async (companyId: string, username: string) => {
//     return prisma.users.findFirst({
//       where: { company_id: companyId, username: username },
//     });
//   },

//   update: async (
//     companyId: string,
//     userId: string,
//     customer_id: string,
//     payload: TypePayloadUser
//   ) => {
//     let hashPassword: string | undefined;
//     if (payload.password) {
//       const saltRounds = 10;
//       const salt = await bcrypt.genSalt(saltRounds);
//       hashPassword = await bcrypt.hash(payload.password.trim(), salt);
//     }

//     const setPayload = {
//       employee_id: payload.employee_id,
//       employee_code: payload.employee_code,
//       company_id: payload.company_id ?? null, // ถ้าเป็น undefined ให้ใช้ null
//       username: payload.username,
//       password: hashPassword || undefined,
//       is_active: payload.is_active ?? true, // ใช้ true ถ้าไม่ได้ระบุ
//       // role: payload.role ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       role_id: payload.role_id,
//       job_title: payload.job_title ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       right: payload.right ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       email: payload.email,
//       first_name: payload.first_name,
//       last_name: payload.last_name ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       birthday: payload.birthday ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       phone_number: payload.phone_number ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       line_id: payload.line_id ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       addr_number: payload.addr_number ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       addr_alley: payload.addr_alley ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       addr_street: payload.addr_street ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       addr_subdistrict: payload.addr_subdistrict ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       addr_district: payload.addr_district ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       addr_province: payload.addr_province ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       addr_postcode: payload.addr_postcode ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       position: payload.position ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       remark: payload.remark ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       image_url: payload.image_url ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//       updated_at: payload.updated_at || new Date(),
//       updated_by: payload.updated_by ?? null, // ใช้ null ถ้าไม่ได้ระบุ
//     };
//     return await prisma.users.update({
//       where: { company_id: companyId, employee_id: userId },
//       data: setPayload,
//     });
//   },
//   findById2: async (companyId: string, employee_id: string) => {
//     return prisma.users.findFirst({
//       where: {
//         company_id: companyId,
//         employee_id: employee_id,
//       },
//       select: Keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}), // Use Keys array
//     });
//   },
//   findById3: async (companyId: string, username: string) => {
//     return prisma.users.findFirst({
//       where: {
//         company_id: companyId,
//         username: username,
//       },
//       include: {
//         role: true,
//       },
//     });
//   },
//   findById4: async (companyId: string, employee_id: string) => {
//     return prisma.users.findFirst({
//       where: {
//         company_id: companyId,
//         employee_id: employee_id,
//       },
//       include: {
//         role: true,
//       },
//     });
//   },
//   findAllUsernames: async () => {
//     return prisma.users.findMany({
//       select: {
//         username: true,
//       },
//     });
//   },
// };
import { users,roles } from "@prisma/client";
import prisma from "@src/db";

import { TypePayloadUser } from "@modules/users/userModel";
import bcrypt from "bcrypt";

import { rolesData } from "@common/models/roleData";

async function main() {
  let roldAdmin: roles | null = null;

  for (const role of rolesData) {
      const result = await prisma.roles.upsert({
          where: { role_name: role },
          update: {},
          create: {
              role_name: role,
          },
      });

      // Save the result for the Admin role
      if (role === "Admin") {
          roldAdmin = result;
      }
  }

  if (!roldAdmin) {
    throw new Error("Admin role was not found or created.");
  }
  const roleId = roldAdmin.role_id;
}

  

export const Keys = [
  "employee_id",
  "employee_code",
  "username",
  "password",
  "is_active",
  "role_id",
  "email",
  "first_name",
  "last_name",
  "birthday",
  "phone_number",
  "line_id",
  "addr_number",
  "addr_alley",
  "addr_street",
  "addr_subdistrict",
  "addr_district",
  "addr_province",
  "addr_postcode",
  "position",
  "remark",
  "created_at",
  "updated_at",
  "employee_image",
  //"right",
  "job_title",
  "company_id",
];

export const KeyProfile = [
  "employee_id",
  "first_name",
];

export const KeysFindUsername = [
  "employee_id",
  "company_id",
  "username",
  "password",
  "role_id",
];

export const userRepository = {

  findByUsername: async <Key extends keyof users>(
    username: string,
    keys = KeysFindUsername as Key[]
  ) => {
    return prisma.users.findUnique({
      where: { username: username },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<users, Key> | null>;
  },
  findById: async <Key extends keyof users>(
    uuid: string,

    keys = KeysFindUsername as Key[]
  ) => {
    return prisma.users.findUnique({
      where: { employee_id: uuid },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<users, Key> | null>;
  },

  create: async (companyId: string,userId: string,payload: TypePayloadUser,) => {
    // Payload
    const usernameTrim = payload.username.trim();
    const passwordTrim = payload.password.trim();
    const emailTrim = payload.email.trim();
    
    const firstName = payload.first_name.trim();
    const is_active = true;
   
    const roldAdmin = await prisma.roles.findUnique({
      where: { role_name: "Admin" },  // หาบทบาทที่ชื่อว่า "Admin"
  });

  // ตรวจสอบว่า roldAdmin ไม่เป็น null
  if (!roldAdmin) {
    throw new Error("Admin role not found");
  }

  //const role_id = roldAdmin.role_id;
    

    // Hash Password using bcrypt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(passwordTrim, salt);

    // setPayload
    const setPayload: any = {
      employee_code: payload.employee_code?.trim(),
      company_id: companyId,
      username: usernameTrim,
      password: hashPassword,
      role_id: payload.role_id?.trim(),
      job_title: payload.job_title?.trim(),
      //right: payload.right?.trim(),
      email: payload.email?.trim(),
      first_name: payload.first_name?.trim(),
      last_name: payload.last_name?.trim(),
      birthday: payload.birthday,
      phone_number: payload.phone_number?.trim(),
      line_id: payload.line_id?.trim(),
      addr_number: payload.addr_number?.trim(),
      addr_alley: payload.addr_alley?.trim(),
      addr_street: payload.addr_street?.trim(),
      addr_subdistrict: payload.addr_subdistrict?.trim(),
      addr_district: payload.addr_district?.trim(),
      addr_province: payload.addr_province?.trim(),
      addr_postcode: payload.addr_postcode?.trim(),
      position: payload.position?.trim(),
      remark: payload.remark?.trim(),
      employee_image: payload.employee_image?.trim(),
      created_by: userId,
      updated_by: userId,


      is_active: is_active,
      //employee_code: payload.employee_code?.trim(), 

    };
    return await prisma.users.create({
      data: setPayload
    });
  },
  count: async (companyId: string, searchText?: string) => {
    return await prisma.users.count({
      where: {
        company_id: companyId, // เพิ่มเงื่อนไข companyId
        ...(searchText
          ? {
              OR: [
              {
                first_name: {
                  contains: searchText,
                  mode: "insensitive",
                },
              },
              {
                last_name: {
                  contains: searchText,
                  mode: "insensitive",
                },
              },
              {
                employee_code: {
                  contains: searchText,
                  mode: "insensitive"
                }
              }
            ],
            }
          : {}),
      },
    });
  },

  findAll: async (
    companyId: string,
    skip: number,
    take: number,
    searchText: string
  ) => {
    return await prisma.users.findMany({
      where: searchText
        ? {
            OR: [
              {
                first_name: {
                  contains: searchText,
                  mode: "insensitive",
                },
              },
              {
                last_name: {
                  contains: searchText,
                  mode: "insensitive",
                },
              },
              {
                employee_code: {
                  contains: searchText,
                  mode: "insensitive"
                }
              }
            ],
          }
        : {}, // ถ้าไม่มี searchText ก็ไม่ต้องใช้เงื่อนไขพิเศษ
      skip,
      take,
      select: {
        employee_id: true,
        employee_code: true,
        first_name: true,
        last_name: true,
        position: true,
        phone_number: true,
      },
      orderBy: { created_at: "asc" },
    });
  },

  findByName: async (companyId: string, username: string) => {
    return prisma.users.findFirst({
      where: { company_id: companyId, username: username },
    });
  },

  update: async (
    companyId: string,
    userId: string,     
    employee_id: string,
    payload: TypePayloadUser
) => {
    
    let hashPassword: string | undefined;
    if (payload.password) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        hashPassword = await bcrypt.hash(payload.password.trim(), salt);
    }

    const setPayload = {
        employee_id: payload.employee_id,
        employee_code: payload.employee_code,
        company_id: payload.company_id ?? null,
        username: payload.username,
        password: hashPassword || undefined,
        is_active: payload.is_active ?? true,
        role_id: payload.role_id,
        job_title: payload.job_title ?? null,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name ?? null,
        birthday: payload.birthday ?? null,
        phone_number: payload.phone_number ?? null,
        line_id: payload.line_id ?? null,
        addr_number: payload.addr_number ?? null,
        addr_alley: payload.addr_alley ?? null,
        addr_street: payload.addr_street ?? null,
        addr_subdistrict: payload.addr_subdistrict ?? null,
        addr_district: payload.addr_district ?? null,
        addr_province: payload.addr_province ?? null,
        addr_postcode: payload.addr_postcode ?? null,
        position: payload.position ?? null,
        remark: payload.remark ?? null,
        employee_image: payload.employee_image ?? null,
        updated_at: new Date(),        
        updated_by: userId,  
    };
    
    return await prisma.users.update({
        where: { company_id: companyId, employee_id: employee_id },
        data: setPayload,
    });
},

  
  findById2: async (companyId: string, employee_id: string,) => {
    return prisma.users.findFirst({
      where: {
        company_id: companyId,
        employee_id: employee_id,
      },
      select: Keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}), // Use Keys array
    });
  },
  findById3: async (companyId: string,username:string) => {
    return prisma.users.findFirst({
      where: {
        company_id: companyId,
        username: username
      },
      select: Keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}), // Use Keys array
    });
  },
  findAllUsernames: async () => {
    return prisma.users.findMany({
      select: {
        username: true,
      },
    });
  },
  findById4: async (companyId: string, employee_id: string) => {
    const select = KeyProfile
      .filter((key) => key !== "password") 
      .reduce((obj, key) => {
        obj[key] = true;
        return obj;
      }, {} as Record<string, true>);
  
    return prisma.users.findFirst({
      where: {
        company_id: companyId,
        employee_id: employee_id,
      },
      select: {
        ...select,
        company_id: true,
        role: {
          select: {
            role_name: true,
          }
        }, 
      },
    });
  },
  

    findAllUsernamesAndIds: async () => { // <--- ชื่อฟังก์ชันใหม่
      return prisma.users.findMany({
        select: {
          employee_id: true, // <--- เพิ่ม employee_id
          username: true,
        },
        orderBy: { // (Optional but good practice) เรียงตาม username
          username: 'asc',
        }
      });
    },
      
};
