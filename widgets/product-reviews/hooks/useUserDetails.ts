import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails, User } from "../api/users";

export function useUserDetails(userId: number | undefined, enabled: boolean) {
  return useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: () => fetchUserDetails(userId as number),
    enabled: !!userId && enabled,
  });
}
