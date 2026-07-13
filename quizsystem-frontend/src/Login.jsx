import { useState } from "react";
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", formData);

        console.log("Login Successful!", res.data);
    
    } catch (e) {
      console.error("Login failed");
      if(e.response){
        console.log(e.response.data);
        console.log(e.response.status);
      } else{
        console.log(e.message);
      }

    }
  };

  return (
    <>
      <div>Login Form</div>
      <div>
        <form onSubmit={handleSubmit}>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          ></input>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          ></input>
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}

export default Login;
