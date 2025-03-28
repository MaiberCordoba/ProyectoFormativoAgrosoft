import { useQuery } from "@tanstack/react-query";
import { User } from "../types";
import { getUsers } from "../api/usersApi";


export const useGetUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"], 
    queryFn: getUsers, 
  });
};

