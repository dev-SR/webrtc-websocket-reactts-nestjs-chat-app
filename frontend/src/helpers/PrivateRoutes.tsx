import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { useAuth } from '../context/AuthProvider';

const PrivateRoute: React.FC<RouteProps> = ({ ...routeProps }) => {
  const { isLogged } = useAuth();
  // console.log(user);
  if (!isLogged) return <Redirect to="/login" />;

  return <Route {...routeProps} />;
};

export default PrivateRoute;
