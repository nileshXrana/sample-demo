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
import UploadButton from "@/components/UploadButton";
import Tags from "@/components/MultiValues";

const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),

  years_of_experience: z
    .string()
    .optional(),

  about: z
    .string()
    .optional()
    .or(z.literal("")),

  skills: z
    .array(z.string())
    .optional(),
});

type registerSchemaType = z.infer<typeof registerSchema>;

export default function RegisterPage() {

  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);

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
  } = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      years_of_experience: "",
      about: "",
      skills: [],
    },
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit: SubmitHandler<registerSchemaType> = async (user) => {
    try {
      const userData = {
        ...user,
        resume: resumeUrl,
        skills: skills,
      };
      console.log("userData", userData);
      await dispatch(registerThunk(userData)).unwrap();
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
              <FormLabel htmlFor="name" className={styles.label}>
                Name
              </FormLabel>

              <TextField
                id="name"
                type="text"
                {...register("name")}
                placeholder="Enter your name"
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                variant="outlined"
              />
            </FormControl>

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

            {/* profile details: */}
            <FormControl className={styles.inputGroup} fullWidth>
              <FormLabel htmlFor="email" className={styles.label}>
                Years of Experience
              </FormLabel>

              <TextField
                id="years_of_experience"
                type="number"
                placeholder="Enter your years of experience"
                {...register("years_of_experience")}
                error={!!errors.years_of_experience}
                helperText={errors.years_of_experience?.message}
                fullWidth
                variant="outlined"
              />
            </FormControl>

            <FormControl className={styles.inputGroup} fullWidth>
              <FormLabel htmlFor="email" className={styles.label}>
                About
              </FormLabel>

              <TextField
                id="about"
                type="text"
                multiline
                rows={4}
                placeholder="Enter your about"
                {...register("about")}
                error={!!errors.about}
                helperText={errors.about?.message}
                fullWidth
                variant="outlined"
              />
            </FormControl>

            <FormControl className={styles.inputGroup} fullWidth>
              <FormLabel htmlFor="email" className={styles.label}>
                Upload Resume
              </FormLabel>

              <UploadButton
                signatureEndpoint="/api/sign-cloudinary-params"
                className="seller-input"
                onSuccess={(result: { info: { secure_url: string } }) => {
                  setResumeUrl(result.info.secure_url);
                }}
              />
              {resumeUrl && (
                <Typography variant="body2" color="textSecondary">
                  Resume uploaded successfully.
                </Typography>
              )}
            </FormControl>

            <FormControl className={styles.inputGroup} fullWidth>
              <FormLabel htmlFor="email" className={styles.label}>
                Skills
              </FormLabel>

              <Tags skills={skills} setSkills={setSkills} />
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
      </Box >
    </Box >
  );
}