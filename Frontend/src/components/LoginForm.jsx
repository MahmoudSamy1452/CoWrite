import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { VITE_BACKEND_URL } from "../../config.js";
import { toast } from 'sonner';

const LoginForm = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    axios.post(`${VITE_BACKEND_URL}/auth/login`, {
      username: e.target.username.value,
      password: e.target.password.value,
    })
    .then((res) => {
      if (res.status === 200) {
        console.log(res)
        toast.success("Logged in successfully");
        dispatch({ type: 'LOGIN', user: e.target.username.value, token: res.data.accessToken });
        navigate('/home');
      }
    })
    .catch((error) => {
      console.log(error);
      toast.error("Invalid username or password");
    });
  }

  return (
    <form className="m-auto border border-white-300 rounded shadow-lg" onSubmit={handleSubmit}>
      <p className="text-blue-500 text-3xl mt-5">Log In!</p>
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
          className="absolute left-6 px-2 -translate-y-3.5 text-gray-400 text-base bg-slate-100 peer-placeholder-shown:translate-y-2 peer-focus:-translate-y-3.5 duration-300 peer-focus:text-blue-500"
        >
          Username
        </label>
      </div>
      <div className="relative mb-3 mt-4">
        <input
          type="password"
          id="password"
          placeholder=""
          required
          className="peer border text-gray-500 border-white-300 bg-transparent px-3 rounded text-lg mx-5 focus:border-blue-500 focus:outline-none w-80 h-10"
        ></input>
        <label
          htmlFor="password"
          className="absolute left-6 px-2 -translate-y-3.5 text-gray-400 text-base bg-slate-100 peer-placeholder-shown:translate-y-2 peer-focus:-translate-y-3.5 duration-300 peer-focus:text-blue-500"
        >
          Password
        </label>
      </div>
      <button type="submit" className="text-white bg-blue-500">
        Log In
      </button>
      <div className="mt-1 mb-2">
        <p className="text-gray-500 inline">Do not have an account? </p>
        <a href="/signup" className="hover:text-blue-500 duration-300">Sign Up!</a>
      </div>
    </form>
  );
};

export default LoginForm;
