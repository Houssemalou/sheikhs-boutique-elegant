import apiClient from "@/api/apiClient";
import { OrderData } from "@/models/types";

export const createOrder = async (order: OrderData): Promise<OrderData> => {
  try {
    console.log("Creating order:", order);
    const { data } = await apiClient.post<OrderData>("/orders", order);
    return data;
  } catch (error) {
    console.error("Error creating order:", error);}
};