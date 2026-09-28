"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { getCurrentUserThunk } from '@/features/user/user.action';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { closeJob, createJob, listJobs } from '@/services/job.service';
import styles from './admin-dashboard.module.css';

const emptyForm = { title: '', department: '', location: '', employment_type: 'full-time', minimum_experience: 0, application_deadline: '', skills: '' };

export default function AdminDashboard() {
    const user = useAppSelector((state) => state.user.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [jobs, setJobs] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [filters, setFilters] = useState({ search: '', status: '', department: '', location: '', employment_type: '' });

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
    useEffect(() => { if (user && user.role !== 'admin') router.push('/dashboard'); }, [user, router]);
    useEffect(() => { if (user?.role === 'admin') void loadJobs(); }, [user, filters]);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await createJob({ ...form, application_deadline: form.application_deadline || undefined, minimum_experience: Number(form.minimum_experience), skills: form.skills.split(',').map((tag) => tag.trim()).filter(Boolean) });
        } catch (requestError: any) {
            setError(requestError?.response?.data?.message ?? 'Unable to create job');
            return;
        }
        setForm(emptyForm);
        await loadJobs();
    };

    return <Container maxWidth="lg" className={styles.page}>
        <Typography variant="h4">Job management</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Paper component="form" onSubmit={submit} className={styles.form} elevation={0}>
            <TextField label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <TextField label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            <TextField label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Select value={form.employment_type} onChange={(e) => setForm({ ...form, employment_type: e.target.value })}>
                {['full-time', 'part-time', 'contract', 'internship'].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
            </Select>
            <TextField label="Minimum experience" type="number" value={form.minimum_experience} onChange={(e) => setForm({ ...form, minimum_experience: Number(e.target.value) })} />
            <TextField label="Application deadline" type="date" slotProps={{ inputLabel: { shrink: true } }} value={form.application_deadline} onChange={(e) => setForm({ ...form, application_deadline: e.target.value })} />
            <TextField label="Skills, comma separated" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            <Button type="submit" variant="contained">Create job</Button>
        </Paper>
        <Box className={styles.toolbar}>
            <TextField label="Search title" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            <TextField label="Department" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} />
            <TextField label="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
            <Select displayEmpty value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><MenuItem value="">All statuses</MenuItem><MenuItem value="open">Open</MenuItem><MenuItem value="closed">Closed</MenuItem></Select>
        </Box>
        <Box className={styles.list}>{jobs.map((job) => <Paper key={job.id} className={styles.row} elevation={0}><Box><Typography variant="h6">{job.title}</Typography><Typography>{job.department || 'No department'} · {job.location || 'Remote'} · {job.employment_type}</Typography><Typography color="text.secondary">{job.status} · {job.tags?.map((tag: { name: string }) => tag.name).join(', ')}</Typography></Box><Box className={styles.actions}>{job.status === 'open' && <Button onClick={async () => { await closeJob(job.id); await loadJobs(); }} color="error">Close</Button>}</Box></Paper>)}</Box>
    </Container>;
}