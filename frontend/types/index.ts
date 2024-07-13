interface AuthResponse {
    id: string;
    name: string;
    ecode?: string;
}

interface AuthRequest {
    name?: string;
    email: string;
    password: string;
}

interface ClientOnlyProps {
    children: React.ReactNode
}

interface User {
    userid: string | null;
    name: string | null;
    isVerified: boolean;
}

interface UserContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    clearUser: () => void;
}

interface OTPRequest {
    otp: string;
}