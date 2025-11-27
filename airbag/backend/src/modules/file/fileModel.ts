import { z } from "zod";

export type TypePayloadFile = {
  id?: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: string;
};

export const CreateFileSchema = z.object({
  body: z.object({
    file_url: z.string().min(1, { message: "File URL must be a valid URL" }),
    file_name: z.string().min(1, { message: "File name is required" }),
    file_type: z.string().min(1, { message: "File name is required" }),
    file_size: z.number(),
  }),
});

export const deleteFileSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    file_url: z.string().min(1, { message: "File URL must be a valid URL" }),
    file_name: z.string().optional(),
    file_type: z.string().optional(),
    file_size: z.number().optional(),
  }),
});
