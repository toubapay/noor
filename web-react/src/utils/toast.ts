import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';

export function showApiError(error: unknown, fallback = 'Something went wrong') {
  const axiosError = error as AxiosError<{ message?: string; errors?: { message: string }[] }>;
  const message =
    axiosError.response?.data?.errors?.[0]?.message ||
    axiosError.response?.data?.message ||
    fallback;
  toast.error(message);
}

export { toast };
