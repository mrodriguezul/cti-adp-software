import { PrismaClient } from '@prisma/client';
import {
  IProductRepository,
  ProductListResult,
  PaginationParams
} from '../../domain/repositories/IProductRepository.js';
import { Product } from '../../domain/entities/Product.js';

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findActiveProducts(params: PaginationParams): Promise<ProductListResult> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    // Count total active products
    const totalCount = await this.prisma.stock.count({
      where: {
        status: 'A'
      }
    });

    // Fetch paginated products
    const stocks = await this.prisma.stock.findMany({
      where: {
        status: 'A'
      },
      select: {
        id: true,
        sku: true,
        name: true,
        description: true,
        price: true,
        onhand: true,
        imageUrl: true,
        status: true
      },
      skip,
      take: limit,
      orderBy: {
        id: 'asc'
      }
    });

    // Map to Product entities
    const products: Product[] = stocks.map(stock => 
      new Product(
        stock.id,
        stock.sku,
        stock.name,
        stock.description,
        Number(stock.price),
        stock.onhand,
        stock.imageUrl,
        stock.status
      )
    );

    // Calculate hasMore
    const hasMore = skip + stocks.length < totalCount;

    return {
      products,
      totalCount,
      hasMore
    };
  }

  async findById(id: number): Promise<Product | null> {
    const stock = await this.prisma.stock.findUnique({
      where: { id },
      select: {
        id: true,
        sku: true,
        name: true,
        description: true,
        price: true,
        onhand: true,
        imageUrl: true,
        status: true
      }
    });

    if (!stock || stock.status !== 'A') {
      return null;
    }

    return new Product(
      stock.id,
      stock.sku,
      stock.name,
      stock.description,
      Number(stock.price),
      stock.onhand,
      stock.imageUrl,
      stock.status
    );
  }
}