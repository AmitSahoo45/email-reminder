import axiosInstance from "@/libs/axios/axiosInstance";

export const createReminder = async (reminderData: Reminder): Promise<string> => {
    try {
        const { data: { remid } } = await axiosInstance.post('/reminder/add', reminderData);
        return remid;
    } catch (error: unknown) {
        console.error('API call error: ', error);
        throw error;
    }
};

export const getAllReminder = async (): Promise<Reminder[]> => {
    try {
        const { data } = await axiosInstance.get('/reminder/read');
        return data;
    } catch (error: unknown) {
        console.error('API call error: ', error);
        throw error;
    }
}

export const deleteReminder = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/reminder/delete/${id}`);
    } catch (error: unknown) {
        console.error('API call error: ', error);
        throw error;
    }
}