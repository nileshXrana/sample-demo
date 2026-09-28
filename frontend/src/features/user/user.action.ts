import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  getCurrentUser,
} from "@/services/user.service";
import { loginRequest, registerRequest } from "./user.type";
import axios from "axios";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (user: loginRequest, { rejectWithValue }) => {
    try {
      return await login(user);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message ?? "Login failed");
      }

      return rejectWithValue("Something went wrong");
    }
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (user: registerRequest, { rejectWithValue }) => {
    try {
      return await register(user);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? "Registration failed",
        );
      }

      return rejectWithValue("Something went wrong");
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      return await logout();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? "Logout failed",
        );
      }

      return rejectWithValue("Something went wrong");
    }
  },
);

export const getCurrentUserThunk = createAsyncThunk(
  "users/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUser();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? "Failed to get current user",
        );
      }

      return rejectWithValue("Something went wrong");
    }
  },
);
