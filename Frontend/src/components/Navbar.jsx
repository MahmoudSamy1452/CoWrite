import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT'});
    navigate('/');
  }

  return (
    <>
      <nav className="bg-white text-black fixed top-0 left-0 right-0 z-50 mb-10">
        <ul className="inner font-medium flex w-full px-4">
          <li className="flex py-2 justify-center align-middle">
            <img src="./cowrite-logo.svg" className="w-14" alt="CoWrite Logo" />
            <Link
              to="/home"
              className="text-blue-800 hover:text-transparent bg-clip-text transition-all hover:bg-gradient-to-r from-yellow-400 via-green-500 to-blue-600 m-auto"
            >
              CoWrite
            </Link>
          </li>
          {/* <li className="inline py-2 ml-auto">
            <Link
              to="/home"
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
          </li> */}
          <li className="flex py-2 ml-auto">
            {!user ? (
              <>
                <Link
                  to="/"
                  className="py-2 px-2 rounded hover:text-gray-600 duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="py-2 px-2 rounded hover:text-gray-600 duration-300"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <span className="py-2 px-2 hover:text-gray-600 duration-300">Logged in as {user}</span>
                <span
                  className="py-2 px-4 rounded font-bold hover:cursor-pointer hover:text-gray-600 duration-300"
                  onClick={handleLogout}
                >
                  Logout
                </span>
              </>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
