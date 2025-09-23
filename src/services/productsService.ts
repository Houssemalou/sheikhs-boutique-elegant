import apiClient from "@/api/apiClient";
import { CategoryResDTO } from "@/models/types";




export const getCategories = async (): Promise<CategoryResDTO[]> => {
  const res = await apiClient.get<CategoryResDTO[]>("/categories");
  return res.data;
};

