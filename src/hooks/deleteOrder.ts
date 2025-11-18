import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export const useDeleteOrder = () => {
  const queryClient = useQueryClient(); // ✅ hook ichida chaqiriladi

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/order/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] }); // order list qayta yuklanadi
    },
  });
};
