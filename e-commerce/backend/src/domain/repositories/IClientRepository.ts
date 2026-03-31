import { Client } from '../entities/Client.js';

export interface IClientRepository {
  findByEmail(email: string): Promise<Client | null>;
  create(clientData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone?: string | null;
    address?: string | null;
  }): Promise<Client>;
}
