import { api, setAuthToken } from "../client";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<{ user: User; token: string }> {
    // Replace with real endpoint. Mocked for the foundation.
    await new Promise((r) => setTimeout(r, 400));
    if (!payload.email || !payload.password) throw new Error("Invalid credentials");
    const fake = {
      user: { id: "u_1", email: payload.email, name: payload.email.split("@")[0] },
      token: "demo." + btoa(payload.email),
    };
    setAuthToken(fake.token);
    return fake;
    // Real: return api.post<{ user: User; token: string }>("/auth/login", payload);
  },
  async me(): Promise<User> {
    return api.get<User>("/auth/me");
  },
  logout() {
    setAuthToken(null);
  },
};
