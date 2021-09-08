/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useMutation, UseMutationResult } from 'react-query';
import { useHistory } from 'react-router-dom';

import { getCurrentUser, loginUser } from '../api/user';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  is_active: string;
}

interface LoginPost {
  email: string;
  password: string;
}

interface LoginMutation extends UseMutationResult<CurrentUser, Error, LoginPost> {}

interface AuthContextType {
  user?: CurrentUser;
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);
const AuthProvider: React.FC = ({ children }) => {
  const history = useHistory();
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

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.

  const memoedValue = useMemo(
    () => ({
      user,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  );

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
