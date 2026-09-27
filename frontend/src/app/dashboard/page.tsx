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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon sx={{ color: '#1a73e8', fontSize: 32 }} />
          <Typography variant="h5" className={styles.title}>
            Projects - {user?.email}
          </Typography>
        </Box>
        <Box className={styles.headerActions} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>

          {user && (
          <Button variant="outlined" color="error" onClick={handleLogout} size="small" sx={{ textTransform: 'none' }}>
            Logout
          </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
