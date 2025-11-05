export interface User{
    id: number;
    email: string;
    full_name: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Task{
    id: number;
    title: string;
    description: string | null;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    due_date: string | null;
    owner_id: number;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

export interface TaskCreate {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: string | null;
}

export interface TaskUpdate {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: string | null;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user_id: number;
    email: string;
    full_name: string | null;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    full_name?: string;
}

export interface ApiError{
    detail: string;
}

export interface TaskStats{
    status: string;
    priority: string;
    count: number;
}