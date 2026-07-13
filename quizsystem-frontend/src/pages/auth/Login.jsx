import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

import { loginSchema } from "../../utils/loginSchema";
import useAuth from "../../hooks/useAuth";

function Login() {
  const {
    loginUser,
    loading,
    error,
  } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const success = await loginUser(data);

    if (success) {
      reset();
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
      <h2 className="mb-8 text-center text-3xl font-bold">
        Welcome Back
      </h2>

      <p className="mb-6 text-center text-gray-500">
        Login to continue to Quiz System
      </p>

      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-100 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Email */}

        <div>
          <label className="mb-2 block font-medium">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className="w-full rounded-md border px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}

        <div>
          <label className="mb-2 block font-medium">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            className="w-full rounded-md border px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Login Button */}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        Don't have an account?

        <Link
          to="/register"
          className="ml-2 font-medium text-blue-600 hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;