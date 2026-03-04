import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio: string;
  skills: string[];
  interests: string[];
  profilePicture: string;
  connections: string[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const sessionUser = localStorage.getItem("currentUser");
    if (sessionUser) {
      const userData = JSON.parse(sessionUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const register = async (email: string, password: string, username: string, fullName: string): Promise<boolean> => {
    try {
      // Get existing users
      const usersData = localStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : [];

      // Check if user already exists
      if (users.some((u: User) => u.email === email)) {
        alert("User with this email already exists");
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        fullName,
        bio: "",
        skills: [],
        interests: [],
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        connections: [],
        createdAt: new Date().toISOString(),
      };

      // Save password separately (in real app, this would be hashed)
      const passwordsData = localStorage.getItem("passwords");
      const passwords = passwordsData ? JSON.parse(passwordsData) : {};
      passwords[email] = password;
      localStorage.setItem("passwords", JSON.stringify(passwords));

      // Save user
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get users
      const usersData = localStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : [];

      // Find user
      const foundUser = users.find((u: User) => u.email === email);
      if (!foundUser) {
        alert("User not found");
        return false;
      }

      // Check password
      const passwordsData = localStorage.getItem("passwords");
      const passwords = passwordsData ? JSON.parse(passwordsData) : {};
      if (passwords[email] !== password) {
        alert("Incorrect password");
        return false;
      }

      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      setUser(foundUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    
    // Update in users array
    const usersData = localStorage.getItem("users");
    const users = usersData ? JSON.parse(usersData) : [];
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }

    // Update current user
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
