import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT'});
    navigate('/login');
  }

  return (
    <>
      <nav className="bg-blue-500 fixed top-0 left-0 right-0 z-50 h-11 mb-10">
        <ul className="inner font-medium flex w-full px-4">
          <li className="inline py-2">
            <Link
              to="/login"
              className="py-2 px-2 rounded text-white hover:text-gray-600 duration-300"
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
          <li className="inline py-2 ml-auto">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="py-2 px-2 rounded text-white hover:text-gray-600 duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="py-2 px-2 rounded text-white hover:text-gray-600 duration-300"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <span className="px-2 text-white hover:text-gray-600 duration-300">Logged in as {user}</span>
                <span
                  className="py-2 px-4 rounded text-white font-bold hover:cursor-pointer hover:text-gray-600 duration-300"
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
