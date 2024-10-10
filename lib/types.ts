export type Theme = "light" | "dark";

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  principle: string;
  password: string;
}

export interface UserResponse {
  ID: number;
  Username: string;
  Email: string;
  Verified: boolean;
  TotalProducts: number;
  UpdatedAt: Date;
  CreatedAt: Date;
}

export interface Credentials {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface QueuedRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

export interface ApiError {
  subject: string;
  message: string;
}
