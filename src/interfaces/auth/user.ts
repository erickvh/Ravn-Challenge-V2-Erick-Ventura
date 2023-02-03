export interface IUserRequest {
    id?: string | number;
    email: string;
    password: string;
    name: string;
}

export interface IUserResponse {
    id?: string | number;
    email: string;
    name: string;
}
