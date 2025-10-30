import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import type { ApiError, AuthResponse, LoginData, RegisterData, Task, TaskCreate, TaskStats, TaskUpdate, User } from "../types";

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost: 8000/api',
            timeout: 10000,
        });
        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor to add auth token
        this.client.interceptors.request.use(config => {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config;
        },
            error => Promise.reject(error)
        )

        // Response interceptor to handle errors
        this.client.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError<ApiError>) => {
                if (error.response?.status === 401) {
                    this.handleUnauthorized()
                }                
                return Promise.reject(error)
            }
        )
    }

    private handleUnauthorized(): void {
        localStorage.removeItem('access-token')
        localStorage.removeItem('user')
        window.location.href = '/login';
    }

    // Auth methods
    async login(loginData: LoginData): Promise<AuthResponse> {
        const formData = new FormData()
        formData.append('username', loginData.username)
        formData.append('password', loginData.password);

        const response = await this.client.post<AuthResponse>('/auth/login/', formData)
        return response.data;
    }

    async register(registerData: RegisterData): Promise<User> {
        const response = await this.client.post<User>('/auth/register', registerData)
        return response.data
    }

    async refreshToken(): Promise<AuthResponse>{
        const response = await this.client.post<AuthResponse>('/auth / refresh')
        return response.data;
    }

    // User methods
    async getCurrentUser(): Promise<User> {
        const response = await this.client.get<User>('/users/me')
        return response.data;
    }


    async updateCurrentUser(userData: Partial<User>): Promise<User> {
        const response = await this.client.put<User>('/users/me', userData)
        return response.data;
    }

    async deleteCurrentUser(): Promise<void> {
        await this.client.delete('/users/me')
    }

    // Task methods
    async getTasks(params?: {
        skip?: number;
        limit?: number;
        status?: string;
        priority?: string;

    }): Promise<Task[]> {
        const response = await this.client.get<Task[]>('/tasks', { params })
        return response.data
    }

    async getTask(taskId: number): Promise<Task> {
        const response = await this.client.get<Task>(`/tasks/${taskId}`)
        return response.data;
    }

    async createTask(taskData: TaskCreate): Promise<Task> {
        const response = await this.client.post<Task>('/tasks', taskData)
        return response.data;
    }

    async updateTask(taskId: number, taskData: TaskUpdate): Promise<Task>{
        const response = await this.client.put<Task>(`/tasks/${taskId}`, taskData)
        return response.data
    }

    async deleteTask(taskId: number): Promise<void>  {
        await this.client.delete(`/tasks/${taskId}`)
    }

    async getTaskStats(): Promise<{ stats: TaskStats[] }> {
        const response = await this.client.get<{ stats: TaskStats[] }>('/tasks/status/stats')
        return response.data
    }
}

export const apiService = new ApiService()