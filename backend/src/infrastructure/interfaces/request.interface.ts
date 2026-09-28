import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    years_of_experience?: number;
    about?: string;
    resume?: string | null;
    skills: string[];
  };
}
