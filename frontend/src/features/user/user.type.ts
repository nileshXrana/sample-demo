export interface loginRequest {
  email: string;
  password: string;
}

export interface registerRequest {
  name: string;
  email: string;
  password: string;
  years_of_experience?: string;
  about?: string;
  resume?: string | null;
  skills: string[];
}

export interface user {
  uuid: string;
  name: string;
  email: string;
  role: string;
  years_of_experience?: number;
  about?: string;
  resume?: string | null;
  skills: string[];
}

export interface userState {
  user: user | null;
  loading: boolean;
  error: any | null;
}
