import axiosInstance from "@/libs/axios/axiosInstance";

export const authenticateUser = async (authData: AuthRequest, isSignUp: boolean): Promise<AuthResponse> => {
    try {
        const endpoint = isSignUp ? '/auth/register' : '/auth/login';
        const { data } = await axiosInstance.post<AuthResponse>(endpoint, authData);
        return data;
    } catch (error: unknown) {
        console.error('API call error: ', error);
        throw error;
    }
};

export const logoutUser = async (): Promise<void> => {
    try {
        await axiosInstance.post('/auth/logout');
    } catch (error) {
        console.error('API call error: ', error);
        throw error;
    }
};

export const verifyOTP = async (otpData: OTPRequest): Promise<void> => {
    try {
        await axiosInstance.post('/auth/otp/verify', otpData);
    } catch (error: unknown) {
        console.error('API call error: ', error);
        throw error;
    }
}

// --------------------------------------------------------- //
// For testing purposes only 
export const testRoute = async (): Promise<void> => {
    try {
        await axiosInstance.get('/auth');
    } catch (error) {
        console.error('API call error: ', error);
        throw error;
    }
}