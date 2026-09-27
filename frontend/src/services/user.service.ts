import axios from "axios";
import { loginRequest, registerRequest } from "@/features/user/user.type";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

export const login = async (user: loginRequest) => {
  const response = await axios.post(
    `${BACKEND}/auth/login`,
    {
      email: user.email,
      password: user.password,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const register = async (user: registerRequest) => {
  const response = await axios.post(`${BACKEND}/auth/register`, {
    email: user.email,
    password: user.password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${BACKEND}/auth/logout`, null, {
    withCredentials: true,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get(`${BACKEND}/users/me`, {
    withCredentials: true,
  });
  return response.data;
};

export const googleLogin = async (idToken: string) => {
  const response = await axios.post(
    `${BACKEND}/auth/google`,
    { idToken },
    {
      withCredentials: true,
    },
  );
  return response.data;
};
