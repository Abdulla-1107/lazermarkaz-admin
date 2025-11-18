import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export const useCategory = (props?: any) => {
  const queryClient = useQueryClient();

  const getCategory = useQuery({
    queryKey: ["category", props],
    queryFn: () =>
      api.get("/category", { params: props }).then((res) => res.data),
  });

  const createCategory = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/category", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/category/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  return { getCategory, createCategory, deleteCategory };
};
