/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';

import { getCurrentUser } from '../api/user';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  is_active: string;
}

interface AuthContextType {
  user?: CurrentUser;
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);
const AuthProvider: React.FC = ({ children }) => {
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<CurrentUser>();
  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUser(user), setIsLogged(true);
      })
      .catch((e) => setIsLogged(false))
      .finally(() => setLoadingInitial(false));
    // Finally, just signal the component that the initial load
    // is over.
  }, [isLogged]);

  // We only want to render the underlying app after we
  // assert for the presence of a current user.
  return (
    <AuthContext.Provider
      value={{
        user,
        isLogged,
        setIsLogged,
      }}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};
export function useAuth() {
  return useContext(AuthContext);
}
export default AuthProvider;
