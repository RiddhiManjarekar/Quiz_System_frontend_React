import { z } from "zod";

export const optionSchema = z.object({
  optionText: z
    .string()
    .trim()
    .min(1, "Option text is required.")
    .max(255, "Option text must not exceed 255 characters."),

  correctAnswer: z.boolean({
    required_error: "Please select whether this is the correct answer.",
  }),
});