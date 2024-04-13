import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { VITE_BACKEND_URL } from "../../config.js";

const SignUpForm = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (e.target.username.value === "" || e.target.password.value === "" || e.target.confirmPassword.value === "") {
      setError("Please fill out all fields");
      return;
    }

    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

    if (!regex.test(e.target.password.value)) {
      setError("Password must be between 8-16 characters and contain at least one number, one uppercase letter, one lowercase letter, and one special character");
      return;
    }
    
    if (e.target.password.value !== e.target.confirmPassword.value) {
      setError("Passwords do not match");
      return;
    }

    axios.defaults.withCredentials = true;

    axios.post(`${VITE_BACKEND_URL}/auth/register`, {
      username: e.target.username.value,
      password: e.target.password.value,
    })
    .then((res) => {
      if (res.status === 201) {
        dispatch({ type: 'LOGIN', user: e.target.username.value, token: res.accessToken });
        navigate('/home');
      }
    })
    .catch((error) => {
      console.log(error);
      console.log("Cannot signup");
      setError("Username already exists");
    });
  }

  return (
    <form className="m-auto border border-white-300 rounded max-w-96" onSubmit={handleSubmit}>
      {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <br />
            <span className="block sm:inline"> {error}</span>
          </div>
      )}
      <p className="text-blue-500 text-3xl mt-5">Sign Up!</p>
      <div className="relative mt-6">
        <input
          type="text"
          id="username"
          placeholder=""
          required
          className="peer border text-gray-500 border-white-300 bg-transparent px-3 rounded text-lg mx-5 focus:border-blue-500 focus:outline-none w-80 h-10"
        ></input>
        <label
          htmlFor="username"
          className="absolute left-6 px-2 -translate-y-3.5 text-gray-400 text-base bg-white peer-placeholder-shown:translate-y-2 peer-focus:-translate-y-3.5 duration-300 peer-focus:text-blue-500"
        >
          Username
        </label>
      </div>
      <div className="relative mt-4">
        <input
          type="password"
          id="password"
          placeholder=""
          required
          className="peer border text-gray-500 border-white-300 bg-transparent px-3 rounded text-lg mx-5 focus:border-blue-500 focus:outline-none w-80 h-10"
        ></input>
        <label
          htmlFor="password"
          className="absolute left-6 px-2 -translate-y-3.5 text-gray-400 text-base bg-white peer-placeholder-shown:translate-y-2 peer-focus:-translate-y-3.5 duration-300 peer-focus:text-blue-500"
        >
          Password
        </label>
      </div>
      <div className="relative mb-3 mt-4">
        <input
          type="password"
          id="confirmPassword"
          placeholder=""
          required
          className="peer border text-gray-500 border-white-300 bg-transparent px-3 rounded text-lg mx-5 focus:border-blue-500 focus:outline-none w-80 h-10"
        ></input>
        <label
          htmlFor="confirmPassword"
          className="absolute left-6 px-2 -translate-y-3.5 text-gray-400 text-base bg-white peer-placeholder-shown:translate-y-2 peer-focus:-translate-y-3.5 duration-300 peer-focus:text-blue-500"
        >
          Confirm Password
        </label>
      </div>
      <button type="submit" className="text-white bg-blue-500">Sign Up</button>
      <div className="mt-1 mb-2">
        <p className="text-gray-500 inline">Already have an account? </p>
        <a href="/login">Log in!</a>
      </div>
    </form>
  );
};

export default SignUpForm;
