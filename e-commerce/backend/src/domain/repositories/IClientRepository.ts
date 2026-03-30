export interface Client {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  address: string | null;
  password: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

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
