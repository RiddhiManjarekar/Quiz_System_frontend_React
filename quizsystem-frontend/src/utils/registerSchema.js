import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),

    email: z.string().email("Invalid email"),

    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    role: z.enum(["STUDENT", "TEACHER"]),

    education: z
      .enum(["SCHOOL", "HSC", "BE_BTECH", "OTHER"])
      .optional(),

    grade: z.string().optional(),

    customGrade: z.string().optional(),

    department: z.string().optional(),

    qualification: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "STUDENT") {
      if (!data.education) {
        ctx.addIssue({
          code: "custom",
          path: ["education"],
          message: "Education is required",
        });
      }

      if (data.education === "OTHER") {
        if (!data.customGrade?.trim()) {
          ctx.addIssue({
            code: "custom",
            path: ["customGrade"],
            message: "Custom Grade is required",
          });
        }
      } else {
        if (!data.grade) {
          ctx.addIssue({
            code: "custom",
            path: ["grade"],
            message: "Grade is required",
          });
        }
      }
    }

    if (data.role === "TEACHER") {
      if (!data.department?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["department"],
          message: "Department is required",
        });
      }

      if (!data.qualification?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["qualification"],
          message: "Qualification is required",
        });
      }
    }
  });