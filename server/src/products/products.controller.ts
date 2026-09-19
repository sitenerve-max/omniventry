import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  async search(
    @Query('q') q?: string,
    @Query('mpn') mpn?: string,
    @Query('manufacturer') manufacturer?: string,
    @Query('category') category?: string,
    @Query('package') packageType?: string,
    @Query('location') location?: string,
    @Query('condition') condition?: string,
    @Query('dateCode') dateCode?: string,
    @Query('availability') availability?: 'in_stock' | 'any',
    @Query('quantity') quantity?: string,
    @Query('rohs') rohs?: string,
    @Query('reach') reach?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: 'relevance' | 'quantity' | 'manufacturer',
  ) {
    const data = await this.productsService.search({
      q,
      mpn,
      manufacturer,
      category,
      packageType,
      location,
      condition,
      dateCode,
      availability,
      quantity: quantity ? parseInt(quantity, 10) : undefined,
      rohs: rohs !== undefined ? rohs === 'true' : undefined,
      reach: reach !== undefined ? reach === 'true' : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      sort,
    });
    return { success: true, data };
  }
}
