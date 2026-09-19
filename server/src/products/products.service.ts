import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { normalizeMpn } from '../common/mpn';

export interface ProductSearchQuery {
  q?: string;
  mpn?: string;
  manufacturer?: string;
  category?: string;
  packageType?: string;
  location?: string;
  condition?: string;
  dateCode?: string;
  availability?: 'in_stock' | 'any';
  quantity?: number;
  rohs?: boolean;
  reach?: boolean;
  page?: number;
  limit?: number;
  sort?: 'relevance' | 'quantity' | 'manufacturer';
}

export type MatchType = 'Exact Match' | 'MPN Alias' | 'Manufacturer' | 'Description';

/** Public-safe search result row. No supplier cost, margin, target price, or private identity. */
export interface ProductSearchResult {
  id: string;
  mpn: string;
  manufacturer: string;
  description: string;
  category: string | null;
  packageType: string | null;
  lifecycle: string | null;
  rohsCompliant: boolean;
  reachCompliant: boolean;
  matchType: MatchType;
  totalAvailableQuantity: number;
  lots: {
    dateCode: string;
    packaging: string;
    condition: string;
    location: string | null;
    leadTime: string | null;
    availableQuantity: number;
    supplierLabel: string;
  }[];
}

const DEFAULT_PAGE_SIZE = 20;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: ProductSearchQuery): Promise<{ results: ProductSearchResult[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? DEFAULT_PAGE_SIZE));
    const searchTerm = query.mpn ?? query.q;
    const normalized = searchTerm ? normalizeMpn(searchTerm) : undefined;

    const where: Record<string, unknown> = {
      AND: [
        query.manufacturer ? { manufacturer: { name: { contains: query.manufacturer, mode: 'insensitive' } } } : {},
        query.category ? { category: { name: { contains: query.category, mode: 'insensitive' } } } : {},
        query.packageType ? { packageType: { contains: query.packageType, mode: 'insensitive' } } : {},
        query.rohs !== undefined ? { rohsCompliant: query.rohs } : {},
        query.reach !== undefined ? { reachCompliant: query.reach } : {},
        searchTerm
          ? {
              OR: [
                { normalizedMpn: normalized },
                { mpn: { contains: searchTerm, mode: 'insensitive' } },
                { aliases: { some: { normalizedAliasMpn: normalized } } },
                { manufacturer: { name: { contains: searchTerm, mode: 'insensitive' } } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    };

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: {
          manufacturer: true,
          category: true,
          inventory: {
            where: { status: 'ACTIVE' },
            include: { lots: true, supplier: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    const results = products
      .map((product) => this.toSearchResult(product, normalized, searchTerm))
      .filter((r) => (query.availability === 'in_stock' ? r.totalAvailableQuantity > 0 : true))
      .filter((r) => (query.quantity ? r.totalAvailableQuantity >= query.quantity : true))
      .filter((r) =>
        query.location ? r.lots.some((l) => l.location?.toLowerCase().includes(query.location!.toLowerCase())) : true,
      )
      .filter((r) =>
        query.condition ? r.lots.some((l) => l.condition.toLowerCase() === query.condition!.toLowerCase()) : true,
      )
      .filter((r) => (query.dateCode ? r.lots.some((l) => l.dateCode.includes(query.dateCode!)) : true));

    if (query.sort === 'quantity') {
      results.sort((a, b) => b.totalAvailableQuantity - a.totalAvailableQuantity);
    } else if (query.sort === 'manufacturer') {
      results.sort((a, b) => a.manufacturer.localeCompare(b.manufacturer));
    }

    return { results, total, page, limit };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toSearchResult(product: any, normalized: string | undefined, searchTerm: string | undefined): ProductSearchResult {
    const matchType: MatchType =
      normalized && product.normalizedMpn === normalized
        ? 'Exact Match'
        : searchTerm && product.manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase())
          ? 'Manufacturer'
          : searchTerm && product.description.toLowerCase().includes(searchTerm.toLowerCase())
            ? 'Description'
            : 'Exact Match';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lots = product.inventory.flatMap((inv: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inv.lots.map((lot: any) => ({
        dateCode: lot.dateCode,
        packaging: lot.packaging,
        condition: inv.condition,
        location: inv.location,
        leadTime: inv.leadTime,
        availableQuantity: lot.availableQuantity,
        supplierLabel: inv.supplier.isAnonymous ? 'Verified Anonymous Supplier' : inv.supplier.companyName,
      })),
    );

    return {
      id: product.id,
      mpn: product.mpn,
      manufacturer: product.manufacturer.name,
      description: product.description,
      category: product.category?.name ?? null,
      packageType: product.packageType,
      lifecycle: product.lifecycle,
      rohsCompliant: product.rohsCompliant,
      reachCompliant: product.reachCompliant,
      matchType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      totalAvailableQuantity: lots.reduce((sum: number, l: any) => sum + l.availableQuantity, 0),
      lots,
    };
  }
}
