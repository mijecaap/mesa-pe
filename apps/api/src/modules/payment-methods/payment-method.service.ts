import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from './payment-method.dto';

@Injectable()
export class PaymentMethodService {
  constructor(private readonly prisma: PrismaService) {}

  async create(businessId: string, dto: CreatePaymentMethodDto) {
    return this.prisma.paymentMethod.create({
      data: { ...dto, businessId },
    });
  }

  async findByBusiness(businessId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { businessId },
      orderBy: { id: 'asc' },
    });
  }

  async update(id: string, dto: UpdatePaymentMethodDto) {
    return this.prisma.paymentMethod.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.paymentMethod.delete({
      where: { id },
    });
  }
}
