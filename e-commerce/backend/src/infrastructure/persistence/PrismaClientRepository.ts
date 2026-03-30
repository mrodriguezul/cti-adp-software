import { PrismaClient } from '@prisma/client';
import {
  IClientRepository,
  Client
} from '../../domain/repositories/IClientRepository.js';

export class PrismaClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { email }
    });

    if (!client) {
      return null;
    }

    return {
      id: client.id,
      firstname: client.firstname,
      lastname: client.lastname,
      email: client.email,
      phone: client.phone,
      address: client.address,
      password: client.password,
      status: client.status,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    };
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

    return {
      id: client.id,
      firstname: client.firstname,
      lastname: client.lastname,
      email: client.email,
      phone: client.phone,
      address: client.address,
      password: client.password,
      status: client.status,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    };
  }
}
