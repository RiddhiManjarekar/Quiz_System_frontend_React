import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login, register } from "../api/authApi";
import useAuthStore from "../store/authStore";

function useAuth() {
  const navigate = useNavigate();

  const loginStore = useAuthStore((state) => state.login);

  const logoutStore = useAuthStore((state) => state.logout);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /*
    -------------------------
    LOGIN
    -------------------------
    */

  const loginUser = async (formData) => {
    try {
      setLoading(true);

      setError("");

      const response = await login(formData);

      const user = response.data.data;

      loginStore(user);

      switch (user.role) {
        case "ADMIN":
          navigate("/admin/dashboard",{
            replace: true,
          });

          break;

        case "TEACHER":
          navigate("/teacher/dashboard", {
            replace: true,
          });

          break;

        case "STUDENT":
          navigate("/student/dashboard",{
            replace: true,
          });

          break;

        default:
          navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  /*
    -------------------------
    REGISTER
    -------------------------
    */

  const registerUser = async (formData) => {
    try {
      setLoading(true);

      setError("");

      setSuccess("");

      await register(formData);

      setSuccess("Registration successful.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  /*
    -------------------------
    LOGOUT
    -------------------------
    */

  const logoutUser = () => {
    logoutStore();

    navigate("/login");
  };

  return {
    loading,

    error,

    success,

    loginUser,

    registerUser,

    logoutUser,
  };
}

export default useAuth;
