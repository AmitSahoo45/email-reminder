interface AuthResponse {
    userid: string;
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

interface Reminder {
    remid: string;
    title: string;
    message: string;
    datetime: string;
}

interface ReminderCardProps {
    reminder: Reminder;
    onDelete: (id: string) => void;
}