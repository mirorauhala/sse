import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";

type User = {
  username: string;
};

export type AuthContext = {
  me?: User;
  login: Dispatch<SetStateAction<User | undefined>>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContext>({
  me: undefined,
  login: function () {
    throw new Error("Function not implemented.");
  },
  logout: function () {
    throw new Error("Function not implemented.");
  },
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [me, setMe] = useState<User | undefined>(undefined);

  const logout = () => {
    setMe(undefined);
  };

  const authContext = { me, login: setMe, logout };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
