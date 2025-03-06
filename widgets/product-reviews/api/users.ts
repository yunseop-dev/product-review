export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  // 필요한 추가 필드
}

export const fetchUserDetails = async (userId: number): Promise<User> => {
  const response = await fetch(`https://dummyjson.com/users/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
};
