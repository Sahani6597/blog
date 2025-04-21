
import { createContext, useContext } from "react";
import { AuthContextType, AuthProviderProps } from "./types";
import { useAuthOperations } from "./useAuthOperations";
import { useAuthState } from "./useAuthState";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    user,
    setUser,
    session,
    setSession,
    isLoading,
    setIsLoading,
    login,
    signup,
    logout
  } = useAuthOperations();
  
  // Initialize and set up auth state listener
  useAuthState(setUser, setSession, setIsLoading);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
