import { Client, AuthUser } from "@/types";
import { mockClients } from "./mockData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const registeredClients: Client[] = [...mockClients];
const passwords: Record<string, string> = {
  "john.doe@email.com": "password123",
  "jane.smith@email.com": "password123",
};

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  await delay(500);
  const client = registeredClients.find((c) => c.email === email);
  if (!client || passwords[email] !== password) {
    throw new Error("Invalid email or password");
  }
  return { client, token: `mock-jwt-${client.id}-${Date.now()}` };
}

export async function registerUser(
  data: Omit<Client, "id"> & { password: string }
): Promise<AuthUser> {
  await delay(500);
  if (registeredClients.some((c) => c.email === data.email)) {
    throw new Error("Email already registered");
  }
  const newClient: Client = {
    id: registeredClients.length + 1,
    firstname: data.firstname,
    lastname: data.lastname,
    address: data.address,
    phone: data.phone,
    email: data.email,
  };
  registeredClients.push(newClient);
  passwords[data.email] = data.password;
  return { client: newClient, token: `mock-jwt-${newClient.id}-${Date.now()}` };
}

export async function updateProfile(
  clientId: number,
  data: Partial<Client>
): Promise<Client> {
  await delay(400);
  const index = registeredClients.findIndex((c) => c.id === clientId);
  if (index === -1) throw new Error("Client not found");
  registeredClients[index] = { ...registeredClients[index], ...data };
  return registeredClients[index];
}
