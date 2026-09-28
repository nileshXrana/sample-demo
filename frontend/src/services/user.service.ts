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
    name: user.name,
    email: user.email,
    password: user.password,
    years_of_experience: user.years_of_experience,
    about: user.about,
    resume: user.resume,
    skills: user.skills,
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
