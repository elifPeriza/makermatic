import { z } from "zod";


export const NewProjectInput = z.object({
  name: z.object({
    name: z.string().nonempty(),
    value: z
      .string()
      .nonempty({
        message: "Looks like you forgot to name your project.",
      })
      .min(3, {
        message: "Your project name needs to be at least 3 characters long.",
      })
      .max(50, {
        message: "Wow, that's a long name! Let's keep it under 50 characters.",
      }),
    id: z.string().nonempty(),
  }),
  description: z.object({
    name: z.string().nonempty(),
    id: z.string().nonempty(),
    value: z
      .string()
      .min(3, {
        message:
          "Please provide a more detailed description (at least 3 characters)",
      })
      .max(200, {
        message:
          "Your description is a bit too long. Let's keep it under 200 characters.",
      })
      .optional()
      .or(z.literal("")),
  }),
  notes: z.object({
    name: z.string().nonempty(),
    id: z.string().nonempty(),
    value: z
      .string()
      .max(500, {
        message:
          "Your notes are a bit too long. Let's keep them under 500 characters.",
      })
      .optional(),
  }),
});

export type NewProjectInputType = z.infer<typeof NewProjectInput>;

export const NewProjectInsert = z.object({
  userId: z.number().positive(),
  colorPaletteId: z.number().positive(),
  name: z
    .string()
    .nonempty({
      message: "Looks like you forgot to name your project.",
    })
    .min(3, {
      message: "Your project name needs to be at least 3 characters long.",
    })
    .max(50, {
      message: "Wow, that's a long name! Let's keep it under 50 characters.",
    }),
  description: z
    .string()
    .min(3, {
      message:
        "Please provide a more detailed description (at least 3 characters)",
    })
    .max(200, {
      message:
        "Your description is a bit too long. Let's keep it under 200 characters.",
    })
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, {
      message:
        "Your notes are a bit too long. Let's keep them under 500 characters.",
    })
    .optional(),
});
