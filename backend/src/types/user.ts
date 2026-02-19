export interface UserType {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthResponse {
    user: UserType;
    token: string;
}
