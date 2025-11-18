import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export const useProduct = (props?: any) => {
  const queryClient = useQueryClient();

  const getProduct = useQuery({
    queryKey: ["product", props],
    queryFn: () =>
      api.get("/products", { params: props }).then((res) => res.data),
  });

  const createProduct = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/products", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/products/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  return { getProduct, createProduct, deleteProduct };
};
