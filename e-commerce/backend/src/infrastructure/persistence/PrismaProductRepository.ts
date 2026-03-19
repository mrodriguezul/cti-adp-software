import { PrismaClient } from '@prisma/client';
import {
  IProductRepository,
  ProductListResult,
  PaginationParams,
  ProductData
} from '../../domain/repositories/IProductRepository.js';

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
        imageUrl: true
      },
      skip,
      take: limit,
      orderBy: {
        id: 'asc'
      }
    });

    // Map to ProductData
    const products: ProductData[] = stocks.map(stock => ({
      id: stock.id,
      sku: stock.sku,
      name: stock.name,
      description: stock.description,
      price: Number(stock.price),
      onhand: stock.onhand,
      imageUrl: stock.imageUrl
    }));

    // Calculate hasMore
    const hasMore = skip + stocks.length < totalCount;

    return {
      products,
      totalCount,
      hasMore
    };
  }
}