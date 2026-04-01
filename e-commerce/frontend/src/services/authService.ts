const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

import { Client, AuthUser } from "@/types";

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}

export async function registerUser(
  data: Omit<Client, "id"> & { password: string }
): Promise<void> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Registration failed");
  }
}

export async function updateProfile(
  clientId: number,
  data: Partial<Client>
): Promise<Client> {
  const response = await fetch(`${API_URL}/clients/${clientId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Update failed");
  }

  return response.json();
}
