"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DescriptionIcon from '@mui/icons-material/Description';
import styles from "./dashboard.module.css";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logoutThunk } from "@/features/user/user.action";
import { getCurrentUserThunk } from "@/features/user/user.action";

export default function Dashboard() {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUserThunk());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.push('/login');
  };

  return (
    <Container className={styles.container} maxWidth="lg">
      <Box className={styles.header}>
        <Box className={styles.headerContent}>
          <DescriptionIcon className={styles.icon} />
          <Typography variant="h5" className={styles.title}>
            Projects - {user?.email}
          </Typography>
        </Box>
        <Box className={styles.headerActions}>
          {user && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              size="small"
              className={styles.logoutButton}
            >
              Logout
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
