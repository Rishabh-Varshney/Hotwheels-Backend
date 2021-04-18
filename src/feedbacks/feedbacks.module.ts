import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/stores/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Feedback } from './entities/feedback.entity';
import { FeedbackResolver } from './feedbacks.resolver';
import { FeedbackService } from './feedbacks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback, Order, OrderItem, User, Product]),
  ],
  providers: [FeedbackResolver, FeedbackService],
})
export class FeedbacksModule {}
