export type Role = 'admin' | 'company' | 'consultancy' | 'candidate';

export interface User {
    id: number;
    email: string;
    role: Role;
    name?: string; // Optional
    token?: string;
}



export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export const ROLES = {
    ADMIN: 'admin' as Role,
    COMPANY: 'company' as Role,
    CONSULTANCY: 'consultancy' as Role,
    CANDIDATE: 'candidate' as Role,
};
