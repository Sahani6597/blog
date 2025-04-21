
import { ReactNode } from "react";

export type User = {
  id: string;
  email: string;
  username: string;
  role: "user" | "admin";
  avatar_url?: string;
};

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}
