"use client";

import styles from "./register.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { registerThunk } from "@/features/user/user.action";
import { clearError } from "@/features/user/user.slice";
import Divider from '@mui/material/Divider';

const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type SignupSchemaType = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const [showPassword, setShowPassword] = useState(false);
  const apiError = useAppSelector((state) => state.user.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit: SubmitHandler<SignupSchemaType> = async (user) => {
    try {
      await dispatch(registerThunk(user)).unwrap();
      router.push("/login");
    } catch (error) {
      // error handle by redux
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.card}>
        <Typography component="h1" className={styles.title}>
          Register Now
        </Typography>
        <Typography className={styles.formDescription}>
          Create your account to get started !
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          {apiError && (
            <Typography className={styles.errorMessage}>
              {apiError}
            </Typography>
          )}

          <Box>
            <FormControl
              className={styles.inputGroup}
              fullWidth
            >
              <FormLabel htmlFor="email" className={styles.label}>
                Email
              </FormLabel>

              <TextField
                id="email"
                type="text"
                {...register("email")}
                placeholder="Enter your email"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                variant="outlined"
              />
            </FormControl>

            <FormControl
              className={styles.inputGroup}
              fullWidth
            >
              <FormLabel htmlFor="password" className={styles.label}>
                Password
              </FormLabel>

              <TextField
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                variant="outlined"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          onClick={handleTogglePassword}
                          edge="end"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              className={styles.submitButton}
            >
              Agree & Join
            </Button>

            <Divider className={styles.divider}>or</Divider>

            <Typography className={styles.signinText}>
              Already A User?{" "}
              <Link
                href="/login"
                className={styles.link}
              >
                Log In
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Box>
  );
}