import { useState } from "react";
import api from "./api";

interface UseUploadResult {
  upload: (file: File) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export const useUpload = (): UseUploadResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Axios-da javob data ichida bo‘ladi
      return res.data.compressed; // backend sizga URL qaytarishi kerak
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Unknown error");
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  return { upload, isLoading, error };
};
