import {z} from"zod";

export type TypePayloadtool = {
    tool_id: string;
    tool: string;
    
}

export const CreatetoolSchema = z.object({
    body: z.object({
        tool: z.string().max(20),
    }),
});

export const GetCategorySchema = z.object({
    params: z.object({
        tool_id: z.string().uuid(),
        //tool: z.string()
        
    })
});

export const UpdateCategorySchema = z.object({
    params: z.object({
        tool_id: z.string().uuid(),
    }),
    body: z.object({
        tool: z.string()
    })
});

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})