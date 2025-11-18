import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export const getOrder = () => {
  return useQuery({
    queryKey: ["order"],
    queryFn: () => api.get("/order").then((res) => res.data),
  });
};

