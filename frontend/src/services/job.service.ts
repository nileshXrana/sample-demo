import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

const config = {
  withCredentials: true,
};

export const listJobs = async (params: Record<string, string | number>) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined && value !== null),
  );
  const response = await axios.get(`${BACKEND}/jobs`, {
    ...config,
    params: filteredParams,
  });

  return response.data;
};

export const createJob = async (data: unknown) => {
  const response = await axios.post(`${BACKEND}/jobs`, data, config);
  
  return response.data;
};

export const updateJob = async (id: string, data: unknown) => {
  const response = await axios.patch(`${BACKEND}/jobs/${id}`, data, config);

  return response.data;
};

export const closeJob = async (id: string) => {
  const response = await axios.patch(`${BACKEND}/jobs/${id}/close`, {}, config);

  return response.data;
};

export const applyToJob = async (id: string) => {
  const response = await axios.post(
    `${BACKEND}/jobs/${id}/applications`,
    {},
    config,
  );

  return response.data;
};

export const listApplications = async (
  params: Record<string, string | number> = {},
) => {
  const response = await axios.get(`${BACKEND}/applications`, {
    ...config,
    params,
  });

  return response.data;
};

export const changeApplicationStatus = async (id: string, status: string) => {
  const response = await axios.post(
    `${BACKEND}/applications/${id}/status`,
    { status },
    config,
  );

  return response.data;
};
