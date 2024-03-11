const SignUpForm = () => {
  return (
    <div>
      <form className="border border-white-300 rounded" action="">
        <h3 className="text-blue-500 mt-5">Sign Up!</h3>
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
            className="absolute left-6 px-2 translate-y-2 text-gray-400 text-base bg-white peer-focus:-translate-y-2.5 duration-300 peer-focus:text-blue-500"
          >
            Username
          </label>
        </div>
        <div className="relative mt-3">
          <input
            type="password"
            id="password"
            placeholder=""
            required
            className="peer border text-gray-500 border-white-300 bg-transparent px-3 rounded text-lg mx-5 focus:border-blue-500 focus:outline-none w-80 h-10"
          ></input>
          <label
            htmlFor="password"
            className="absolute left-6 px-2 translate-y-2 text-gray-400 text-base bg-white peer-focus:-translate-y-2.5 duration-300 peer-focus:text-blue-500"
          >
            Password
          </label>
        </div>
        <div className="relative mb-6 mt-3">
          <input
            type="password"
            id="confirmPassword"
            placeholder=""
            required
            className="peer border text-gray-500 border-white-300 bg-transparent px-3 rounded text-lg mx-5 focus:border-blue-500 focus:outline-none w-80 h-10"
          ></input>
          <label
            htmlFor="confirmPassword"
            className="absolute left-6 px-2 translate-y-2 text-gray-400 text-base bg-white peer-focus:-translate-y-2.5 duration-300 peer-focus:text-blue-500"
          >
            Confirm Password
          </label>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
