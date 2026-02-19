import { Request } from 'express';

export interface UserPayload {
    id: string;
    email?: string;
    username?: string;
}

export interface AuthRequest extends Request {
    user?: UserPayload;
}

export interface ApiResponse<T = any> {
    status: 'success' | 'fail' | 'error';
    message?: string;
    data?: T;
    errors?: any[];
}

export * from './task';
export * from './user';
