import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/stores/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { FeedbackInput, FeedbackOutput } from './dtos/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async createFeedback(customer: User, FeedbackInput): Promise<FeedbackOutput> {
    try {
      const orders = await this.orders.find({ customer });
      // if () {
      //   return {
      //     ok: false,
      //     error: '',
      //   };
      // }
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Could not create feedback.',
      };
    }
  }
}
