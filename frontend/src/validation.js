import { z } from "zod";

/**
 * Zod validation schema for patient form data.
 * Mirrors the backend Pydantic validation exactly.
 */
export const patientSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters")
    .regex(/^[A-Za-z\s]+$/, "Name must contain letters and spaces only"),

  age: z.coerce
    .number({ invalid_type_error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(0, "Age must be at least 0")
    .max(120, "Age must be at most 120"),

  gender: z.string().min(1, "Gender is required"),

  ward: z.string().min(1, "Ward is required"),

  department: z.string().min(1, "Department is required"),

  doctor: z.string().min(1, "Doctor is required"),

  admissionDate: z
    .string()
    .min(1, "Admission date is required")
    .refine((val) => {
      const d = new Date(val);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return d <= today;
    }, "Admission date cannot be a future date"),

  status: z.string().optional().default("Admitted"),
});

/**
 * Validate patient data and return { success, data?, errors? }
 */
export function validatePatient(data) {
  const result = patientSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  // Convert Zod errors to a field→message map
  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}

