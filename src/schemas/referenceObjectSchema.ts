import z from "zod";

// Define a reusable reference object schema
export const referenceObjectSchema = z
  .object({
    id: z.string().optional(),
    codename: z.string().optional(),
    external_id: z.string().optional(),
  })
  .describe(
    "An object with an id, codename, or external_id property referencing another item. Using id is preferred for better performance.",
  );
