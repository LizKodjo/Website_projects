import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";
import type { LoginData, RegisterData, User } from "../types";
import { apiService } from "../services/api";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (date: RegisterData) => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context;
}

interface AuthProviderProps{
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        initializeAuth();
    }, [])

    const initializeAuth = async () => {
        const token = localStorage.getItem('access_token')
        if (token) {
            try {
                const userData = await apiService.getCurrentUser();
                setUser(userData)
            } catch (error) {
                console.error('Failed to get user data: ', error);
                localStorage.removeItem('access_token')
                
            }
        }
        setIsLoading(false)
    }

    const login = async (data: LoginData) => {
        try {
            const response = await apiService.login(data)
            localStorage.setItem('access_token', response.access_token)
            const userData = await apiService.getCurrentUser()
            setUser(userData)
        } catch (error) {
            console.error('Login failed: ', error);
            throw error;
            
        }
    }

    const register = async (data: RegisterData) => {
        try {
            const userData = await apiService.register(data)
            // Auto-login after registration
            await login({ username: data.email, password: data.password })
            
        } catch (error) {
            console.error('Registration failed: ', error);
            throw error;
            
        }
    }

    const logout = () => {
        localStorage.removeItem('access_token')
        setUser(null)
    }

    const updateUser = async (userData: Partial<User>) => {
        try {
            const updatedUser = await apiService.updateCurrentUser(userData)
            setUser(updatedUser)
        } catch (error) {
            console.error('Update user failed: ', error);
            throw error
            
        }
    }

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>


}