import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { GrUserManager } from "react-icons/gr";
import { FaUserEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import Popover from "@mui/material/Popover";
import { useState } from "react";

const Navbar = ({ title, setTitle, userRole, usernames }) => {
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <nav className="bg-white text-black fixed top-0 left-0 right-0 z-50 mb-10">
        <ul className="inner font-medium flex w-full px-4">
          <li className="flex py-2 justify-center align-middle">
            <Link to="/home">
              <img
                src="./cowrite-logo.svg"
                className="w-14"
                alt="CoWrite Logo"
                onClick={() => {setTitle("CoWrite")}}
              />
            </Link>
            <Link
              to="/home"
              className="text-blue-800 hover:text-transparent bg-clip-text transition-all hover:bg-gradient-to-r from-yellow-400 via-green-500 to-blue-600 m-auto"
              onClick={() => {setTitle("CoWrite")}}
            >
              {title}
            </Link>
          </li>
          <li className="py-2 ml-3">
            {userRole && (
              <div className="py-2 mr-7 group">
                <div className="w-6 h-6 pl-1 py-1 bg-gray-400 rounded-full absolute">
                  {(userRole === "o" && <GrUserManager />) ||
                    (userRole === "e" && <FaUserEdit />) ||
                    (userRole === "v" && <FaEye />) || <></>}
                </div>
                <span className="opacity-0 group-hover:opacity-100 transform transition group-hover:translate-x-7 bg-gray-300 rounded-lg duration-300 absolute px-1">
                  {userRole === "o"
                    ? "Owner"
                    : userRole === "e"
                    ? "Editor"
                    : "Viewer"}
                </span>
              </div>
            )}
          </li>
          <li className="flex py-2 ml-auto">
            {usernames.length > 0 && (
              <div>
                <button
                  aria-describedby={id}
                  onClick={handleClick}
                  className="bg-blue-500 mr-2 hover:bg-blue-800 text-white px-4 py-2 rounded-3xl shadow-md"
                >
                  {usernames.length} {usernames.length > 1 ? "users" : "user"}{" "}
                  online
                </button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <div className="flex flex-col p-4">
                    {usernames.map((user, index) => {
                      return (
                        <p
                          key={index}
                          className='text-[#5f6368] font-["Product_sans"] text-lg font-bold'
                        >
                          {user}
                        </p>
                      );
                    })}
                  </div>
                </Popover>
              </div>
            )}
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
                <span className="py-2 px-2 hover:text-gray-600 duration-300">
                  Logged in as {user}
                </span>
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
