import { z } from "zod";

export const questionSchema = z.object({
  questionText: z
    .string()
    .trim()
    .min(1, "Question text is required.")
    .max(2000, "Question text cannot exceed 2000 characters."),

  questionType: z.enum(
    [
      "SINGLE_CHOICE",
      "MULTIPLE_CHOICE",
      "TRUE_FALSE",
      "DESCRIPTIVE",
    ],
    {
      errorMap: () => ({
        message: "Question type is required.",
      }),
    }
  ),

  marks: z.coerce
    .number({
      required_error: "Marks are required.",
      invalid_type_error: "Marks must be a number.",
    })
    .min(1, "Marks must be greater than 0."),

  negativeMarks: z.coerce
    .number({
      invalid_type_error: "Negative marks must be a number.",
    })
    .min(0, "Negative marks cannot be negative.")
    .default(0),

  displayOrder: z.coerce
    .number({
      required_error: "Display order is required.",
      invalid_type_error: "Display order must be a number.",
    })
    .int("Display order must be an integer.")
    .min(1, "Display order must be greater than 0."),
});