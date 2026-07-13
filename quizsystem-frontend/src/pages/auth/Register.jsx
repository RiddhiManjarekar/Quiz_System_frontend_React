import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

import { registerSchema } from "../../utils/registerSchema";
import useAuth from "../../hooks/useAuth";

function Register() {
  const {
    registerUser,
    loading,
    error,
    success,
  } = useAuth();

  const gradeOptions = {
    SCHOOL: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
    ],
    HSC: [
      "11",
      "12",
    ],
    BE_BTECH: [
      "FY",
      "SY",
      "TY",
      "FINAL_YEAR",
    ],
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "STUDENT",
      education: "",
      grade: "",
      customGrade: "",
      department: "",
      qualification: "",
    },
  });

  const role = watch("role");
  const education = watch("education");

  const onSubmit = async (data) => {
    const registered = await registerUser(data);

    if (registered) {
      reset({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "STUDENT",
        education: "",
        grade: "",
        customGrade: "",
        department: "",
        qualification: "",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
      <h2 className="mb-8 text-center text-3xl font-bold">
        Create Account
      </h2>

      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-100 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-md border border-green-200 bg-green-100 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Name */}

        <div>
          <input
            {...register("name")}
            placeholder="Full Name"
            className="w-full rounded-md border px-4 py-2 outline-none transition focus:border-blue-500"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}

        <div>
          <input
            type="email"
            {...register("email")}
            placeholder="Email Address"
            className="w-full rounded-md border px-4 py-2 outline-none transition focus:border-blue-500"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}

        <div>
          <input
            type="tel"
            {...register("phone")}
            placeholder="Phone Number"
            className="w-full rounded-md border px-4 py-2 outline-none transition focus:border-blue-500"
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Password */}

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full rounded-md border px-4 py-2 outline-none transition focus:border-blue-500"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Role */}

        <div>
          <select
            {...register("role")}
            className="w-full rounded-md border px-4 py-2"
            onChange={(e) => {
              setValue("role", e.target.value);

              setValue("education", "");
              setValue("grade", "");
              setValue("customGrade", "");
              setValue("department", "");
              setValue("qualification", "");
            }}
          >
            <option value="STUDENT">
              Student
            </option>

            <option value="TEACHER">
              Teacher
            </option>
          </select>

          {errors.role && (
            <p className="mt-1 text-sm text-red-500">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* STUDENT */}

        {role === "STUDENT" && (
          <>
            <div>
              <select
                {...register("education")}
                className="w-full rounded-md border px-4 py-2"
                onChange={(e) => {
                  setValue("education", e.target.value);
                  setValue("grade", "");
                  setValue("customGrade", "");
                }}
              >
                <option value="">
                  Select Education
                </option>

                <option value="SCHOOL">
                  School
                </option>

                <option value="HSC">
                  HSC
                </option>

                <option value="BE_BTECH">
                  BE / B.Tech
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>

              {errors.education && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            {education &&
              education !== "OTHER" && (
                <div>
                  <select
                    {...register("grade")}
                    className="w-full rounded-md border px-4 py-2"
                  >
                    <option value="">
                      Select Grade
                    </option>

                    {gradeOptions[education]?.map(
                      (grade) => (
                        <option
                          key={grade}
                          value={grade}
                        >
                          {grade === "FINAL_YEAR"
                            ? "Final Year"
                            : grade}
                        </option>
                      )
                    )}
                  </select>

                  {errors.grade && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.grade.message}
                    </p>
                  )}
                </div>
              )}

            {education === "OTHER" && (
              <div>
                <input
                  {...register("customGrade")}
                  placeholder="Enter Grade"
                  className="w-full rounded-md border px-4 py-2 outline-none transition focus:border-blue-500"
                />

                {errors.customGrade && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.customGrade.message}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* TEACHER */}

        {role === "TEACHER" && (
          <>
            <div>
              <input
                {...register("department")}
                placeholder="Department"
                className="w-full rounded-md border px-4 py-2 outline-none transition focus:border-blue-500"
              />

              {errors.department && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("qualification")}
                placeholder="Qualification"
                className="w-full rounded-md border px-4 py-2 outline-none transition focus:border-blue-500"
              />

              {errors.qualification && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.qualification.message}
                </p>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
        >
          {loading
            ? "Registering..."
            : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        Already have an account?

        <Link
          to="/login"
          className="ml-2 font-medium text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;