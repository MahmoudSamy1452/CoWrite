const LoginForm = () => {
  return (
    <div>
      <form className="border border-white-300 rounded" action="">
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
            className="absolute left-6 px-2 -translate-y-3.5 text-gray-400 text-base bg-white peer-placeholder-shown:translate-y-2 peer-focus:-translate-y-3.5 duration-300 peer-focus:text-blue-500"
          >
            Username
          </label>
        </div>
        <div className="relative mb-6 mt-3">
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
        <div className="mb-2">
          <p className="text-gray-500 inline">Do not have an account? </p>
          <a href="/signup">Sign Up!</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
