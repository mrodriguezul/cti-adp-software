import { PrismaClient } from '@prisma/client';
import { IClientRepository } from '../../domain/repositories/IClientRepository.js';
import { Client } from '../../domain/entities/Client.js';

export class PrismaClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { email }
    });

    if (!client) {
      return null;
    }

    return new Client(
      client.id,
      client.firstname,
      client.lastname,
      client.email,
      client.password,
      client.status,
      client.phone,
      client.address
    );
  }

  async create(clientData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone?: string | null;
    address?: string | null;
  }): Promise<Client> {
    const client = await this.prisma.client.create({
      data: {
        firstname: clientData.firstname,
        lastname: clientData.lastname,
        email: clientData.email,
        password: clientData.password,
        phone: clientData.phone || null,
        address: clientData.address || null
      }
    });

    return new Client(
      client.id,
      client.firstname,
      client.lastname,
      client.email,
      client.password,
      client.status,
      client.phone,
      client.address
    );
  }
}
