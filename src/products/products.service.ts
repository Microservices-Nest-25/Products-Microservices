import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);
  
  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    })
  }

  async findAll(
    paginationDto: PaginationDto
  ) {
    const { page, limit } = paginationDto;

    const totalProducts = await this.product.count({
      where: { available: true },
    });

    return {
      data: await this.product.findMany({
        skip: (page! - 1) * limit!,
        take: limit,
        where: { available: true },
      }),
      meta: {
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit!),
        totalItems: totalProducts,
      }
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true },
    });

    if (!product) {
      // throw new NotFoundException(`Product with id ${id} not found`);
      throw new RpcException({
        message: `Product with id ${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;

    await this.findOne( id );

    return this.product.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    await this.findOne( id );

    return this.product.update({
      where: { id },
      data: { available: false },
    });
  }

  async validateProduct(ids: number[]) {
    ids = Array.from( new Set(ids) );

    const products = await this.product.findMany({
      where: {
        id: { in: ids },
      },
    });

    if ( ids.length !== products.length ) {
      throw new RpcException({
        message: `Some products not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products
  }

}
