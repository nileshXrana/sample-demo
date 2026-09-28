"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getCurrentUserThunk, logoutThunk } from '@/features/user/user.action';
import { applyToJob, listJobs } from '@/services/job.service';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', department: '', location: '', employment_type: '' });
  const loadJobs = async () => {
    try {
      const response = await listJobs({ ...filters, page: 1, limit: 20 });
      setJobs(response.items ?? []);
      setError('');
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Unable to load jobs');
    }
  };

  useEffect(() => { dispatch(getCurrentUserThunk()); }, [dispatch]);
  useEffect(() => { if (user?.role === 'admin') router.push('/admin-dashboard'); }, [user, router]);
  useEffect(() => { if (user && user.role !== 'admin') void loadJobs(); }, [user, filters]);

  return (
    <Container maxWidth="lg" className={styles.page}>
      <Box className={styles.toolbar}><Typography variant="h5">{user?.email}</Typography><Button onClick={async () => { await dispatch(logoutThunk()); router.push('/login'); }}>Logout</Button></Box>
      <Typography variant="h4">Open jobs</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box className={styles.toolbar}>
        <TextField label="Search title" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <TextField label="Department" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} />
        <TextField label="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <Select displayEmpty value={filters.employment_type} onChange={(e) => setFilters({ ...filters, employment_type: e.target.value })}><MenuItem value="">All employment types</MenuItem>{['full-time', 'part-time', 'contract', 'internship'].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</Select>
      </Box>
      <Box className={styles.list}>{jobs.map((job) => <Paper key={job.id} className={styles.row} elevation={0}><Box><Typography variant="h6">{job.title}</Typography><Typography>{job.department || 'No department'} · {job.location || 'Remote'} · {job.employment_type}</Typography><Typography color="text.secondary">Minimum experience: {job.minimum_experience} years</Typography></Box><Button variant="contained" onClick={async () => { await applyToJob(job.id); }}>Apply</Button></Paper>)}</Box>
    </Container>
  )
}