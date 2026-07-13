import { z } from "zod";

export const quizSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters.")
      .max(100, "Title cannot exceed 100 characters."),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters.")
      .max(1000, "Description cannot exceed 1000 characters."),

    durationMinutes: z
      .coerce
      .number({
        invalid_type_error: "Duration is required.",
      })
      .int("Duration must be a whole number.")
      .positive("Duration must be greater than 0."),

    passingMarks: z
      .coerce
      .number({
        invalid_type_error: "Passing marks are required.",
      })
      .min(0, "Passing marks cannot be negative."),

    startTime: z
      .string()
      .min(1, "Start time is required."),

    endTime: z
      .string()
      .min(1, "End time is required."),
  })

  .refine(
    (data) => new Date(data.startTime) < new Date(data.endTime),
    {
      message: "End time must be after start time.",
      path: ["endTime"],
    }
  );