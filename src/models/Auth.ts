export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
};

export const initialState: AuthState = {
    isLoggedIn: false,
    token: null,
    user: null,
  };
  
 export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
  }
  
 export type Credentials = {
    email: string;
    password: string;
  };
  
 export type UseAuthHandlersReturn = {
    showLoginForm: boolean;
    credentials: Credentials;
    loading: boolean;
    error: string | null;
    toggleLoginForm: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLogin: (e: React.FormEvent) => Promise<void>;
    handleSignup: () => Promise<void>;
    handleLogout: () => Promise<void>;
  };