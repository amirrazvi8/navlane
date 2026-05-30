import axios, { AxiosError } from "axios";

export const handleApiError = (error: unknown, defaultMessage = "Something went wrong"): string => {
    if (axios.isAxiosError(error) && error.response) {
        return error.response.data?.message || error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};
