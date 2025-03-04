import api from "@/shared/api/base";
import { User } from "./model";

export const userApi = {
  getUser: async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  getUsers: async (limit = 10, skip = 0) => {
    const response = await api.get<{
      users: User[];
      total: number;
      skip: number;
      limit: number;
    }>(`/users?limit=${limit}&skip=${skip}`);
    return response.data;
  },
};
