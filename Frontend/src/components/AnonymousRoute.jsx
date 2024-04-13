import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const PrivateRoute = ({ children }) => {
  const { token } = useAuthContext();
  const authenticate = token ? false : true;
    
  return authenticate ? (
    children
  ) : (
    <Navigate to="/home" />
  );
};

export default PrivateRoute;