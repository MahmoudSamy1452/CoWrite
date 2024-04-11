const SignUpForm = () => {
  return (
    <form className="m-auto border border-white-300 rounded" action="">
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
