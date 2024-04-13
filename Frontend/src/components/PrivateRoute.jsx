import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const PrivateRoute = ({ children }) => {
  const { token } = useAuthContext();
  const authenticate = token ? true : false;
  console.log(authenticate)
  
  return authenticate ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;