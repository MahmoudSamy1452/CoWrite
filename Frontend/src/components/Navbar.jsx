import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="bg-blue-500 fixed top-0 left-0 right-0 z-50 h-11">
        <ul className="inner font-medium flex w-full px-4">
          <li className="inline py-2">
            <Link
              to="/signup"
              className="py-2 px-2 rounded text-white hover:text-gray-600 duration-300"
            >
              CoWrite
            </Link>
          </li>
          <li className="inline py-2 ml-auto">
            <Link
              to="/signup"
              className="py-2 px-2 rounded text-white hover:text-gray-600 duration-300"
            >
              Return
            </Link>
          </li>
          <li className="inline py-2">
            <Link
              to="/"
              className="py-2 px-2 rounded text-white hover:text-gray-600 duration-300"
            >
              Save
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
